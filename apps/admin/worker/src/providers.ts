/// <reference types="@cloudflare/workers-types" />
import type { SiteRegistryEntry } from "@affiliate/sites";

// Providers only read identity + integration ids off a site; the admin's numeric
// `id` is irrelevant here, so accept the shared registry shape directly.
type Site = SiteRegistryEntry;

/**
 * Read-through metrics from the platforms that *own* each number:
 *   - clicks       → GA4 (the `affiliate_click` event we emit from the sites)
 *   - impressions  → Google Search Console
 *   - revenue      → Adtraction
 *
 * The admin never persists these — it reads them on demand and edge-caches the
 * result for 24h (see `cachedExternalSeries` in index.ts). When no credentials
 * are configured, `fetchExternalSeries` returns null and the dashboard reports
 * empty (zeroed) series, so it keeps working out of the box with no fake data.
 *
 * Auth: OAuth "as the owner". The portfolio runs on a consumer @gmail account,
 * where a service account can't be granted Search Console access (GSC's add-user
 * UI rejects iam.gserviceaccount.com addresses). Instead we hold a refresh token
 * for the owner account — already a verified owner of every GSC property and GA4
 * account — and mint short-lived access tokens from it on demand (cached ~50 min).
 * Three secrets (client id/secret + refresh token), scales to every site with no
 * per-site grant. Generate the refresh token once via ops/mint-google-refresh-token.ts.
 */
export interface ProviderEnv {
  GOOGLE_OAUTH_CLIENT_ID?: string;
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
  GOOGLE_OAUTH_REFRESH_TOKEN?: string;
  ADTRACTION_API_TOKEN?: string;
}

export interface DailyMetric {
  date: string; // yyyy-mm-dd
  clicks: number;
  impressions: number;
  revenue: number;
  revenuePending: number;
  // Google Search Console average position for the day. Stored alongside the
  // day's impressions so it can be re-weighted into a correct period average
  // (position is an impressions-weighted mean, never a plain sum/average).
  position: number;
  // Search Console organic clicks (SERP → site). Distinct from `clicks`, which
  // is the GA4 affiliate_click count (site → advertiser). Lets the dashboard
  // separate "did they click into us" from "did they click out to a partner".
  organicClicks: number;
  // GA4 funnel building blocks. Stored as raw counts (not ratios) so a period
  // average is a correct sum/sum, never an average-of-averages. Rates are
  // derived at aggregation time in index.ts.
  sessions: number;
  engagedSessions: number;
  engagementDuration: number; // userEngagementDuration, seconds
  activations: number; // GA4 `activation` event count (mid-funnel "aha")
}

export function externalConfigured(env: ProviderEnv): boolean {
  return Boolean(env.GOOGLE_OAUTH_REFRESH_TOKEN || env.ADTRACTION_API_TOKEN);
}

function emptyDay(date: string): DailyMetric {
  return {
    date,
    clicks: 0,
    impressions: 0,
    revenue: 0,
    revenuePending: 0,
    position: 0,
    organicClicks: 0,
    sessions: 0,
    engagedSessions: 0,
    engagementDuration: 0,
    activations: 0,
  };
}

/**
 * Merge whatever sources are configured into a single daily series.
 * Returns null when nothing is configured (→ caller reports an empty series).
 * Each source is isolated: one failing/absent source contributes zeros rather
 * than failing the whole read.
 */
export async function fetchExternalSeries(
  env: ProviderEnv,
  site: Site,
  from: string,
  to: string
): Promise<DailyMetric[] | null> {
  if (!externalConfigured(env)) return null;

  const googleToken = await getGoogleToken(env);

  const byDate = new Map<string, DailyMetric>();
  const ensure = (date: string) => {
    let row = byDate.get(date);
    if (!row) {
      row = emptyDay(date);
      byDate.set(date, row);
    }
    return row;
  };

  await Promise.all([
    safe(() => fetchGa4Clicks(googleToken, site, from, to, ensure)),
    safe(() => fetchGa4Activations(googleToken, site, from, to, ensure)),
    safe(() => fetchGa4Sessions(googleToken, site, from, to, ensure)),
    safe(() => fetchSearchConsoleImpressions(googleToken, site, from, to, ensure)),
    safe(() => fetchAdtractionRevenue(env, site, from, to, ensure)),
  ]);

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function safe(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    console.error("metrics provider failed", err);
  }
}

// ─── Google OAuth Token (refresh-token exchange) ─────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getGoogleToken(env: ProviderEnv): Promise<string | null> {
  if (!env.GOOGLE_OAUTH_REFRESH_TOKEN || !env.GOOGLE_OAUTH_CLIENT_ID || !env.GOOGLE_OAUTH_CLIENT_SECRET) {
    return null;
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }).toString(),
  });

  if (!res.ok) {
    console.error("Google token refresh failed", await res.text());
    return null;
  }

  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = { token: access_token, expiresAt: now + (expires_in - 600) * 1000 };
  return access_token;
}

const ga4Date = (compact: string) =>
  `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;

/** Run a GA4 report and return its rows, or [] on absent property/token. */
async function ga4RunReport(
  token: string | null,
  propertyId: string | undefined,
  body: Record<string, unknown>
): Promise<{ dimensionValues: { value: string }[]; metricValues: { value: string }[] }[]> {
  if (!propertyId || !token) return [];
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`GA4 ${res.status}`);
  const data = (await res.json()) as {
    rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
  };
  return data.rows ?? [];
}

/** Daily count of a single GA4 event (eventCount filtered by eventName). */
async function fetchGa4EventByDate(
  token: string | null,
  site: Site,
  from: string,
  to: string,
  eventName: string
): Promise<{ date: string; count: number }[]> {
  const rows = await ga4RunReport(token, site.ga4PropertyId, {
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: eventName } } },
  });
  return rows.map((row) => ({
    date: ga4Date(row.dimensionValues[0].value),
    count: Number(row.metricValues[0].value) || 0,
  }));
}

async function fetchGa4Clicks(
  token: string | null,
  site: Site,
  from: string,
  to: string,
  ensure: (date: string) => DailyMetric
): Promise<void> {
  for (const { date, count } of await fetchGa4EventByDate(token, site, from, to, "affiliate_click")) {
    ensure(date).clicks += count;
  }
}

async function fetchGa4Activations(
  token: string | null,
  site: Site,
  from: string,
  to: string,
  ensure: (date: string) => DailyMetric
): Promise<void> {
  for (const { date, count } of await fetchGa4EventByDate(token, site, from, to, "activation")) {
    ensure(date).activations += count;
  }
}

/**
 * Daily sessions, engaged sessions and total engagement duration. Stored as raw
 * counts so the period engagement-rate and avg-session-duration can be derived
 * correctly (sum/sum), not averaged from daily averages.
 */
async function fetchGa4Sessions(
  token: string | null,
  site: Site,
  from: string,
  to: string,
  ensure: (date: string) => DailyMetric
): Promise<void> {
  const rows = await ga4RunReport(token, site.ga4PropertyId, {
    dateRanges: [{ startDate: from, endDate: to }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "sessions" },
      { name: "engagedSessions" },
      { name: "userEngagementDuration" },
    ],
  });
  for (const row of rows) {
    const day = ensure(ga4Date(row.dimensionValues[0].value));
    day.sessions += Number(row.metricValues[0].value) || 0;
    day.engagedSessions += Number(row.metricValues[1].value) || 0;
    day.engagementDuration += Number(row.metricValues[2].value) || 0;
  }
}

async function fetchSearchConsoleImpressions(
  token: string | null,
  site: Site,
  from: string,
  to: string,
  ensure: (date: string) => DailyMetric
): Promise<void> {
  if (!token) return;
  // GSC stores IDN domain properties in punycode (sc-domain:xn--…). The URL API
  // normalizes IDN hostnames to ASCII/punycode, so this matches what Google
  // expects even for å/ä/ö domains.
  const host = new URL(`https://${site.domain}`).hostname;
  const property = `sc-domain:${host}`;

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startDate: from, endDate: to, dimensions: ["date"], rowLimit: 25000 }),
    }
  );
  if (!res.ok) throw new Error(`GSC ${res.status}`);
  const data = (await res.json()) as {
    rows?: { keys: string[]; clicks: number; impressions: number; position: number }[];
  };
  for (const row of data.rows ?? []) {
    const day = ensure(row.keys[0]);
    day.impressions += row.impressions || 0;
    day.organicClicks += row.clicks || 0;
    // GSC returns the day's average position directly; store it for weighting.
    day.position = row.position || 0;
  }
}

async function fetchAdtractionRevenue(
  env: ProviderEnv,
  site: Site,
  from: string,
  to: string,
  ensure: (date: string) => DailyMetric
): Promise<void> {
  if (!env.ADTRACTION_API_TOKEN || !site.adtractionChannelId) return;

  // Per-channel pull: one call returns every program's transactions for this
  // site (channel = one website, many advertisers), so revenue reconciliation
  // never depends on enumerating programs. Token is a query param (v2 auth);
  // fromDate/toDate want full ISO timestamps; transactionStatus 3 = approved +
  // pending. The `epi` sub-id we attach to tracking urls flows back on
  // `click.epi` for future placement-level attribution.
  const res = await fetch(
    `https://api.adtraction.net/v2/partner/transactions/?token=${env.ADTRACTION_API_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        fromDate: `${from}T00:00:00+0000`,
        toDate: `${to}T23:59:59+0000`,
        transactionStatus: 3,
        channelId: Number(site.adtractionChannelId),
        market: "SE",
      }),
    }
  );
  if (!res.ok) throw new Error(`Adtraction ${res.status}`);
  const transactions = (await res.json()) as {
    commission: number;
    currency: string;
    transactionDate: string;
    transactionStatus: number; // 1 approved, 2 pending
  }[];
  if (!Array.isArray(transactions)) return; // {message,status} envelope = nothing yet
  for (const tx of transactions) {
    const date = tx.transactionDate.slice(0, 10);
    const row = ensure(date);
    if (tx.transactionStatus === 1) row.revenue += tx.commission || 0;
    else row.revenuePending += tx.commission || 0;
  }
}
