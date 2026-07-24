/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sites as registry, type SiteRegistryEntry } from "@affiliate/sites";
import {
  fetchExternalSeries,
  externalConfigured,
  type ProviderEnv,
  type DailyMetric,
} from "./providers";

type Bindings = ProviderEnv & {
  ASSETS: Fetcher;
};

// The admin owns no data: the site list is the shared @affiliate/sites registry
// and every metric is read live from GA4/GSC/Adtraction (edge-cached 24h). We
// give each registry entry a stable numeric id (1-based index) so the frontend
// keeps a simple primary key without us persisting anything.
interface Site extends SiteRegistryEntry {
  id: number;
}
const SITES: Site[] = registry.map((s, i) => ({ ...s, id: i + 1 }));

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

const formatDate = (d: Date) => d.toISOString().split("T")[0];

function getPeriodDates(period: string) {
  const now = new Date();
  let startDate: Date;
  let prevStartDate: Date;
  let prevEndDate: Date;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      prevStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      prevEndDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      prevStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      prevEndDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "lm":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 0);
      break;
    case "ytd":
      startDate = new Date(now.getFullYear(), 0, 1);
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
      prevEndDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case "mtd":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
  }

  const yearAgoStartDate = new Date(startDate);
  yearAgoStartDate.setFullYear(yearAgoStartDate.getFullYear() - 1);
  const yearAgoEndDate = new Date(now);
  yearAgoEndDate.setFullYear(yearAgoEndDate.getFullYear() - 1);

  return { now, startDate, prevStartDate, prevEndDate, yearAgoStartDate, yearAgoEndDate };
}

type PeriodDates = ReturnType<typeof getPeriodDates>;

// ---------------------------------------------------------------------------
// Data source: live read-through (cached 24h). No persistence — when no
// credentials are configured a site simply reports an empty series (zeros),
// which is honest. Durable history, if ever needed, belongs in an append-only
// cron store (R2/KV), not here.
// ---------------------------------------------------------------------------

/** External read-through wrapped in a 24h Cloudflare edge cache. */
// Bumped by POST /api/cache/clear. Appended to every cache key so a bump makes
// all previously-cached entries unreachable (the Workers Cache API has no
// bulk-delete; versioning the key is the idiomatic invalidation). Resets to 0 on
// worker eviction, which is fine — eviction already drops the in-memory token
// cache and the edge cache entries age out at 24h regardless.
let cacheVersion = 0;

async function cachedExternalSeries(
  env: Bindings,
  ctx: ExecutionContext,
  site: Site,
  from: string,
  to: string
): Promise<DailyMetric[] | null> {
  if (!externalConfigured(env)) return null;

  // `caches.default` is a Workers global; cast past the DOM CacheStorage type.
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(`https://metrics.internal/v${cacheVersion}/site/${site.id}?from=${from}&to=${to}`);
  const hit = await cache.match(key);
  if (hit) return (await hit.json()) as DailyMetric[];

  const series = await fetchExternalSeries(env, site, from, to);
  if (series) {
    const res = new Response(JSON.stringify(series), {
      headers: { "Content-Type": "application/json", "Cache-Control": "max-age=86400" },
    });
    ctx.waitUntil(cache.put(key, res.clone()));
  }
  return series;
}

async function loadSeries(
  c: { env: Bindings; executionCtx: ExecutionContext },
  site: Site,
  from: string,
  to: string
): Promise<DailyMetric[]> {
  const external = await cachedExternalSeries(c.env, c.executionCtx, site, from, to);
  return external ?? [];
}

// ---------------------------------------------------------------------------
// Metric math (computed in-memory so it works for any source uniformly).
// ---------------------------------------------------------------------------

function sumRange(series: DailyMetric[], from: Date, to: Date) {
  const fromS = formatDate(from);
  const toS = formatDate(to);
  const acc = series.reduce(
    (acc, d) => {
      if (d.date < fromS || d.date > toS) return acc;
      acc.clicks += d.clicks;
      acc.impressions += d.impressions;
      acc.revenue += d.revenue;
      acc.revenuePending += d.revenuePending;
      acc.organicClicks += d.organicClicks;
      acc.sessions += d.sessions;
      acc.engagedSessions += d.engagedSessions;
      acc.engagementDuration += d.engagementDuration;
      acc.activations += d.activations;
      // Weight each day's position by that day's impressions so the period
      // average reflects where users actually saw us, not a flat day-average.
      acc.positionWeighted += d.position * d.impressions;
      return acc;
    },
    {
      clicks: 0,
      impressions: 0,
      revenue: 0,
      revenuePending: 0,
      organicClicks: 0,
      sessions: 0,
      engagedSessions: 0,
      engagementDuration: 0,
      activations: 0,
      positionWeighted: 0,
    }
  );
  return {
    ...acc,
    position: acc.impressions > 0 ? acc.positionWeighted / acc.impressions : 0,
  };
}

const pctChange = (curr: number, base: number) => (base ? ((curr - base) / base) * 100 : 0);

function computeMetrics(series: DailyMetric[], dates: PeriodDates, costMonthly: number) {
  const current = sumRange(series, dates.startDate, dates.now);
  const prev = sumRange(series, dates.prevStartDate, dates.prevEndDate);
  const yearAgo = sumRange(series, dates.yearAgoStartDate, dates.yearAgoEndDate);

  const sparklineStart = formatDate(new Date(dates.now.getTime() - 30 * 24 * 60 * 60 * 1000));
  const sparkRows = series.filter((d) => d.date >= sparklineStart);
  // Plot clicks (the money signal). On brand-new/zero-click sites the click
  // series is all-zero and draws a useless flat line, so fall back to the only
  // signal those sites have yet — impressions — and tell the UI which it is.
  const clickSpark = sparkRows.map((d) => d.clicks);
  const usesClicks = clickSpark.some((v) => v > 0);
  const sparkline = usesClicks ? clickSpark : sparkRows.map((d) => d.impressions);
  const sparklineMetric: "clicks" | "impressions" = usesClicks ? "clicks" : "impressions";

  const { clicks, impressions, revenue } = current;
  return {
    clicks,
    impressions,
    revenue,
    pendingRevenue: current.revenuePending,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    rpc: clicks > 0 ? revenue / clicks : 0,
    profit: revenue - costMonthly,
    // ── Mid-funnel (GA4 + GSC) ──────────────────────────────────────────────
    organicClicks: current.organicClicks,
    sessions: current.sessions,
    activations: current.activations,
    // Organic SERP CTR (impressions → site). Distinct from `ctr` above, which
    // is affiliate clicks ÷ impressions; this one is "did the SERP earn a click".
    organicCtr: current.impressions > 0 ? (current.organicClicks / current.impressions) * 100 : 0,
    // Engagement: derived sum/sum, never average-of-averages.
    engagementRate: current.sessions > 0 ? (current.engagedSessions / current.sessions) * 100 : 0,
    avgSessionDuration: current.sessions > 0 ? current.engagementDuration / current.sessions : 0,
    // The two ratios that split the funnel's failure modes:
    //   activationRate — does the tool hook landed visitors? (hero/UX bet)
    //   actionRate     — do hooked visitors click out to a partner? (CTA/offer bet)
    activationRate: current.sessions > 0 ? (current.activations / current.sessions) * 100 : 0,
    actionRate: current.activations > 0 ? (clicks / current.activations) * 100 : 0,
    // Avg Google position (lower = better). 0 means "no impressions / unknown".
    position: current.position,
    positionChange: {
      // Negative delta = rank improved (moved closer to #1).
      mom: current.position && prev.position ? current.position - prev.position : 0,
      yoy: current.position && yearAgo.position ? current.position - yearAgo.position : 0,
    },
    sparkline,
    sparklineMetric,
    changes: {
      mom: {
        clicks: clicks - prev.clicks,
        impressions: impressions - prev.impressions,
        revenue: revenue - prev.revenue,
        clicksPercent: pctChange(clicks, prev.clicks),
        impressionsPercent: pctChange(impressions, prev.impressions),
        revenuePercent: pctChange(revenue, prev.revenue),
      },
      yoy: {
        clicks: clicks - yearAgo.clicks,
        impressions: impressions - yearAgo.impressions,
        revenue: revenue - yearAgo.revenue,
        clicksPercent: pctChange(clicks, yearAgo.clicks),
        impressionsPercent: pctChange(impressions, yearAgo.impressions),
        revenuePercent: pctChange(revenue, yearAgo.revenue),
      },
    },
  };
}

/** Earliest date any period in `dates` needs, so we fetch the series once. */
function windowStart(dates: PeriodDates): string {
  const sparkline = new Date(dates.now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const earliest = Math.min(
    dates.yearAgoStartDate.getTime(),
    dates.prevStartDate.getTime(),
    sparkline.getTime()
  );
  return formatDate(new Date(earliest));
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get("/api/sites", async (c) => {
  const period = c.req.query("period") || "mtd";
  const dates = getPeriodDates(period);
  const from = windowStart(dates);
  const to = formatDate(dates.now);

  const allSites = [...SITES].sort((a, b) => a.name.localeCompare(b.name));

  const sitesWithMetrics = await Promise.all(
    allSites.map(async (site) => {
      const series = await loadSeries(c, site, from, to);
      return { ...site, metrics: computeMetrics(series, dates, site.costMonthly) };
    })
  );

  const totals = sitesWithMetrics.reduce(
    (acc, s) => {
      const m = s.metrics;
      acc.clicks += m.clicks;
      acc.impressions += m.impressions;
      acc.revenue += m.revenue;
      acc.pendingRevenue += m.pendingRevenue;
      acc.positionWeighted += m.position * m.impressions;
      acc.prevClicks += m.clicks - m.changes.mom.clicks;
      acc.prevImpressions += m.impressions - m.changes.mom.impressions;
      acc.prevRevenue += m.revenue - m.changes.mom.revenue;
      acc.yearAgoClicks += m.clicks - m.changes.yoy.clicks;
      acc.yearAgoImpressions += m.impressions - m.changes.yoy.impressions;
      acc.yearAgoRevenue += m.revenue - m.changes.yoy.revenue;
      return acc;
    },
    {
      clicks: 0,
      impressions: 0,
      revenue: 0,
      pendingRevenue: 0,
      positionWeighted: 0,
      prevClicks: 0,
      prevImpressions: 0,
      prevRevenue: 0,
      yearAgoClicks: 0,
      yearAgoImpressions: 0,
      yearAgoRevenue: 0,
    }
  );

  return c.json({
    sites: sitesWithMetrics,
    totals: {
      clicks: totals.clicks,
      impressions: totals.impressions,
      revenue: totals.revenue,
      pendingRevenue: totals.pendingRevenue,
      avgRpc: totals.clicks > 0 ? totals.revenue / totals.clicks : 0,
      avgPosition: totals.impressions > 0 ? totals.positionWeighted / totals.impressions : 0,
      changes: {
        mom: {
          clicks: totals.clicks - totals.prevClicks,
          impressions: totals.impressions - totals.prevImpressions,
          revenue: totals.revenue - totals.prevRevenue,
          clicksPercent: pctChange(totals.clicks, totals.prevClicks),
          impressionsPercent: pctChange(totals.impressions, totals.prevImpressions),
          revenuePercent: pctChange(totals.revenue, totals.prevRevenue),
        },
        yoy: {
          clicks: totals.clicks - totals.yearAgoClicks,
          impressions: totals.impressions - totals.yearAgoImpressions,
          revenue: totals.revenue - totals.yearAgoRevenue,
          clicksPercent: pctChange(totals.clicks, totals.yearAgoClicks),
          impressionsPercent: pctChange(totals.impressions, totals.yearAgoImpressions),
          revenuePercent: pctChange(totals.revenue, totals.yearAgoRevenue),
        },
      },
    },
    period: { start: formatDate(dates.startDate), end: to },
  });
});

// Per-site metrics for a period. Matches the frontend `fetchSiteMetrics` call.
app.get("/api/sites/:id", async (c) => {
  const siteId = parseInt(c.req.param("id"));
  const period = c.req.query("period") || "mtd";
  const dates = getPeriodDates(period);

  const site = SITES.find((s) => s.id === siteId);
  if (!site) return c.json({ error: "Site not found" }, 404);

  const series = await loadSeries(c, site, windowStart(dates), formatDate(dates.now));
  return c.json({ metrics: computeMetrics(series, dates, site.costMonthly) });
});

// Daily series for the per-site sparkline view.
app.get("/api/sites/:id/metrics", async (c) => {
  const siteId = parseInt(c.req.param("id"));
  const days = parseInt(c.req.query("days") || "30");

  const site = SITES.find((s) => s.id === siteId);
  if (!site) return c.json({ error: "Site not found" }, 404);

  const now = new Date();
  const from = formatDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000));
  const series = await loadSeries(c, site, from, formatDate(now));

  return c.json({
    siteId,
    days,
    metrics: series.map((d) => ({ date: d.date, clicks: d.clicks, impressions: d.impressions, revenue: d.revenue })),
  });
});

// Invalidate the read-through metrics cache. The dashboard calls this when you
// want to force a fresh pull from GA4/GSC/Adtraction instead of waiting out the
// 24h TTL (e.g. right after wiring new credentials or properties).
app.post("/api/cache/clear", (c) => {
  cacheVersion++;
  return c.json({ ok: true, cacheVersion });
});

const api = app;

export default {
  fetch(request: Request, env: Bindings, ctx: ExecutionContext): Response | Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/api/")) {
      return api.fetch(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
