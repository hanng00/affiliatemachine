/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDb, sites, metricsSnapshots } from "./db";
import { eq, desc, and, gte, lte, sql, asc } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

function getPeriodDates(period: string) {
  const now = new Date();
  let startDate: Date;
  let prevStartDate: Date;
  let prevEndDate: Date;
  let yearAgoStartDate: Date;
  let yearAgoEndDate: Date;

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
    case "mtd":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
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
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
  }

  yearAgoStartDate = new Date(startDate);
  yearAgoStartDate.setFullYear(yearAgoStartDate.getFullYear() - 1);
  yearAgoEndDate = new Date(now);
  yearAgoEndDate.setFullYear(yearAgoEndDate.getFullYear() - 1);

  return {
    now,
    startDate,
    prevStartDate,
    prevEndDate,
    yearAgoStartDate,
    yearAgoEndDate,
  };
}

const formatDate = (d: Date) => d.toISOString().split("T")[0];

app.get("/api/sites", async (c) => {
  const db = createDb(c.env.DB);
  const period = c.req.query("period") || "mtd";
  const dates = getPeriodDates(period);

  const allSites = await db.select().from(sites).orderBy(sites.name);

  const sitesWithMetrics = await Promise.all(
    allSites.map(async (site) => {
      const currentMetrics = await db
        .select({
          totalClicks: sql<number>`COALESCE(sum(${metricsSnapshots.clicks}), 0)`,
          totalImpressions: sql<number>`COALESCE(sum(${metricsSnapshots.impressions}), 0)`,
          totalRevenue: sql<number>`COALESCE(sum(${metricsSnapshots.revenueSek}), 0)`,
          totalPendingRevenue: sql<number>`COALESCE(sum(${metricsSnapshots.revenuePendingSek}), 0)`,
        })
        .from(metricsSnapshots)
        .where(
          and(
            eq(metricsSnapshots.siteId, site.id),
            gte(metricsSnapshots.date, formatDate(dates.startDate)),
            lte(metricsSnapshots.date, formatDate(dates.now))
          )
        );

      const prevMetrics = await db
        .select({
          totalClicks: sql<number>`COALESCE(sum(${metricsSnapshots.clicks}), 0)`,
          totalImpressions: sql<number>`COALESCE(sum(${metricsSnapshots.impressions}), 0)`,
          totalRevenue: sql<number>`COALESCE(sum(${metricsSnapshots.revenueSek}), 0)`,
        })
        .from(metricsSnapshots)
        .where(
          and(
            eq(metricsSnapshots.siteId, site.id),
            gte(metricsSnapshots.date, formatDate(dates.prevStartDate)),
            lte(metricsSnapshots.date, formatDate(dates.prevEndDate))
          )
        );

      const yearAgoMetrics = await db
        .select({
          totalClicks: sql<number>`COALESCE(sum(${metricsSnapshots.clicks}), 0)`,
          totalImpressions: sql<number>`COALESCE(sum(${metricsSnapshots.impressions}), 0)`,
          totalRevenue: sql<number>`COALESCE(sum(${metricsSnapshots.revenueSek}), 0)`,
        })
        .from(metricsSnapshots)
        .where(
          and(
            eq(metricsSnapshots.siteId, site.id),
            gte(metricsSnapshots.date, formatDate(dates.yearAgoStartDate)),
            lte(metricsSnapshots.date, formatDate(dates.yearAgoEndDate))
          )
        );

      const current = currentMetrics[0];
      const prev = prevMetrics[0];
      const yearAgo = yearAgoMetrics[0];

      const clicks = current.totalClicks || 0;
      const impressions = current.totalImpressions || 0;
      const revenue = current.totalRevenue || 0;
      const pendingRevenue = current.totalPendingRevenue || 0;
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const rpc = clicks > 0 ? revenue / clicks : 0;
      const profit = revenue - site.costMonthly;

      return {
        ...site,
        metrics: {
          clicks,
          impressions,
          revenue,
          pendingRevenue,
          ctr,
          rpc,
          profit,
          changes: {
            mom: {
              clicks: clicks - (prev.totalClicks || 0),
              impressions: impressions - (prev.totalImpressions || 0),
              revenue: revenue - (prev.totalRevenue || 0),
              clicksPercent: prev.totalClicks ? ((clicks - prev.totalClicks) / prev.totalClicks) * 100 : 0,
              impressionsPercent: prev.totalImpressions ? ((impressions - prev.totalImpressions) / prev.totalImpressions) * 100 : 0,
              revenuePercent: prev.totalRevenue ? ((revenue - prev.totalRevenue) / prev.totalRevenue) * 100 : 0,
            },
            yoy: {
              clicks: clicks - (yearAgo.totalClicks || 0),
              impressions: impressions - (yearAgo.totalImpressions || 0),
              revenue: revenue - (yearAgo.totalRevenue || 0),
              clicksPercent: yearAgo.totalClicks ? ((clicks - yearAgo.totalClicks) / yearAgo.totalClicks) * 100 : 0,
              impressionsPercent: yearAgo.totalImpressions ? ((impressions - yearAgo.totalImpressions) / yearAgo.totalImpressions) * 100 : 0,
              revenuePercent: yearAgo.totalRevenue ? ((revenue - yearAgo.totalRevenue) / yearAgo.totalRevenue) * 100 : 0,
            },
          },
        },
      };
    })
  );

  const totals = sitesWithMetrics.reduce(
    (acc, site) => ({
      clicks: acc.clicks + site.metrics.clicks,
      impressions: acc.impressions + site.metrics.impressions,
      revenue: acc.revenue + site.metrics.revenue,
      pendingRevenue: acc.pendingRevenue + site.metrics.pendingRevenue,
      prevClicks: acc.prevClicks + (site.metrics.clicks - site.metrics.changes.mom.clicks),
      prevImpressions: acc.prevImpressions + (site.metrics.impressions - site.metrics.changes.mom.impressions),
      prevRevenue: acc.prevRevenue + (site.metrics.revenue - site.metrics.changes.mom.revenue),
      yearAgoClicks: acc.yearAgoClicks + (site.metrics.clicks - site.metrics.changes.yoy.clicks),
      yearAgoImpressions: acc.yearAgoImpressions + (site.metrics.impressions - site.metrics.changes.yoy.impressions),
      yearAgoRevenue: acc.yearAgoRevenue + (site.metrics.revenue - site.metrics.changes.yoy.revenue),
    }),
    {
      clicks: 0,
      impressions: 0,
      revenue: 0,
      pendingRevenue: 0,
      prevClicks: 0,
      prevImpressions: 0,
      prevRevenue: 0,
      yearAgoClicks: 0,
      yearAgoImpressions: 0,
      yearAgoRevenue: 0,
    }
  );

  const avgRpc = totals.clicks > 0 ? totals.revenue / totals.clicks : 0;

  return c.json({
    sites: sitesWithMetrics,
    totals: {
      clicks: totals.clicks,
      impressions: totals.impressions,
      revenue: totals.revenue,
      pendingRevenue: totals.pendingRevenue,
      avgRpc,
      changes: {
        mom: {
          clicks: totals.clicks - totals.prevClicks,
          impressions: totals.impressions - totals.prevImpressions,
          revenue: totals.revenue - totals.prevRevenue,
          clicksPercent: totals.prevClicks ? ((totals.clicks - totals.prevClicks) / totals.prevClicks) * 100 : 0,
          impressionsPercent: totals.prevImpressions ? ((totals.impressions - totals.prevImpressions) / totals.prevImpressions) * 100 : 0,
          revenuePercent: totals.prevRevenue ? ((totals.revenue - totals.prevRevenue) / totals.prevRevenue) * 100 : 0,
        },
        yoy: {
          clicks: totals.clicks - totals.yearAgoClicks,
          impressions: totals.impressions - totals.yearAgoImpressions,
          revenue: totals.revenue - totals.yearAgoRevenue,
          clicksPercent: totals.yearAgoClicks ? ((totals.clicks - totals.yearAgoClicks) / totals.yearAgoClicks) * 100 : 0,
          impressionsPercent: totals.yearAgoImpressions ? ((totals.impressions - totals.yearAgoImpressions) / totals.yearAgoImpressions) * 100 : 0,
          revenuePercent: totals.yearAgoRevenue ? ((totals.revenue - totals.yearAgoRevenue) / totals.yearAgoRevenue) * 100 : 0,
        },
      },
    },
    period: {
      start: formatDate(dates.startDate),
      end: formatDate(dates.now),
    },
  });
});

app.get("/api/sites/:id/metrics", async (c) => {
  const db = createDb(c.env.DB);
  const siteId = parseInt(c.req.param("id"));
  const days = parseInt(c.req.query("days") || "30");

  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const dailyMetrics = await db
    .select({
      date: metricsSnapshots.date,
      clicks: metricsSnapshots.clicks,
      impressions: metricsSnapshots.impressions,
      revenue: metricsSnapshots.revenueSek,
    })
    .from(metricsSnapshots)
    .where(
      and(
        eq(metricsSnapshots.siteId, siteId),
        gte(metricsSnapshots.date, formatDate(startDate)),
        lte(metricsSnapshots.date, formatDate(now))
      )
    )
    .orderBy(asc(metricsSnapshots.date));

  return c.json({
    siteId,
    days,
    metrics: dailyMetrics,
  });
});

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        console.log("Running scheduled job at", new Date().toISOString());
      })()
    );
  },
};
