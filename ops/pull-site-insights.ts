#!/usr/bin/env bun
/**
 * ops/pull-site-insights.ts — read-only GSC + GA4 snapshot for one site.
 *
 * Pulls what the admin dashboard doesn't: Search Console queries per page,
 * page/device/daily splits, and GA4 landing pages, channels, devices and
 * event counts (incl. the funnel events activation / affiliate_click /
 * form_submit). Output goes to ops/insights-<slug>-<date>.json, which is
 * gitignored by the `ops/*.json` rule (it can contain search queries).
 *
 *   bun ops/pull-site-insights.ts --slug solceller --days 90
 *
 * Auth: same owner-OAuth approach as the admin worker (a consumer gmail can't
 * grant a service account GSC access). Uses ops/oauth-client.json plus a
 * refresh token from $GOOGLE_OAUTH_REFRESH_TOKEN or ops/google-oauth-token.json.
 * If neither exists, it runs the loopback consent flow once (read-only scopes)
 * and caches the refresh token in ops/google-oauth-token.json (gitignored).
 * Never prints credential values.
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getSite } from "../packages/sites/src/index.ts";

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];
const OPS = import.meta.dir;
const CLIENT_PATH = join(OPS, "oauth-client.json");
const TOKEN_PATH = join(OPS, "google-oauth-token.json");

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const slug = arg("slug", "solceller");
const days = Number(arg("days", "90"));

const site = getSite(slug);
if (!site) throw new Error(`unknown slug: ${slug}`);

const { installed } = JSON.parse(readFileSync(CLIENT_PATH, "utf8")) as {
  installed: { client_id: string; client_secret: string; token_uri: string };
};

async function consentFlow(): Promise<string> {
  const PORT = 53682;
  const redirect_uri = `http://localhost:${PORT}`;
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: installed.client_id,
      redirect_uri,
      response_type: "code",
      scope: SCOPES.join(" "),
      access_type: "offline",
      prompt: "consent",
    });
  console.log("\nOpen this URL as the Google account that owns GSC/GA4, and approve:\n\n" + url + "\n");
  const code: string = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const u = new URL(req.url ?? "/", redirect_uri);
      const c = u.searchParams.get("code");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h2 style="font-family:system-ui">${c ? "Authorized, you can close this tab." : "No code returned"}</h2>`);
      server.close();
      c ? resolve(c) : reject(new Error(u.searchParams.get("error") ?? "no code"));
    });
    server.listen(PORT);
  });
  const res = await fetch(installed.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: installed.client_id,
      client_secret: installed.client_secret,
      redirect_uri,
      grant_type: "authorization_code",
    }),
  });
  const t = (await res.json()) as { refresh_token?: string };
  if (!t.refresh_token) throw new Error(`no refresh_token returned (HTTP ${res.status})`);
  writeFileSync(TOKEN_PATH, JSON.stringify({ refresh_token: t.refresh_token }), { mode: 0o600 });
  console.log(`Saved refresh token to ${TOKEN_PATH} (gitignored).`);
  return t.refresh_token;
}

async function accessToken(): Promise<string> {
  const refresh =
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN ??
    (existsSync(TOKEN_PATH) ? (JSON.parse(readFileSync(TOKEN_PATH, "utf8")).refresh_token as string) : undefined) ??
    (await consentFlow());
  const res = await fetch(installed.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: installed.client_id,
      client_secret: installed.client_secret,
      refresh_token: refresh,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`token refresh failed: HTTP ${res.status} (delete ${TOKEN_PATH} and rerun to re-consent)`);
  return ((await res.json()) as { access_token: string }).access_token;
}

const token = await accessToken();
const auth = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const iso = (d: Date) => d.toISOString().slice(0, 10);
const end = new Date();
const start = new Date(end.getTime() - days * 86400_000);

// ─── Search Console ─────────────────────────────────────────────────────────
// Same property form as the admin worker: domain property, punycode host.
const scProperty = `sc-domain:${new URL(`https://${site.domain}`).hostname}`;

async function gsc(dimensions: string[], rowLimit = 1000) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(scProperty)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: auth,
      body: JSON.stringify({ startDate: iso(start), endDate: iso(end), dimensions, rowLimit }),
    }
  );
  if (!res.ok) return { error: `GSC ${res.status}: ${(await res.text()).slice(0, 300)}` };
  return ((await res.json()) as { rows?: unknown[] }).rows ?? [];
}

// ─── GA4 Data API ───────────────────────────────────────────────────────────
async function ga4(dimensions: string[], metrics: string[], limit = 500) {
  if (!site!.ga4PropertyId) return { error: "no ga4PropertyId in registry" };
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${site!.ga4PropertyId}:runReport`,
    {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        dateRanges: [{ startDate: iso(start), endDate: iso(end) }],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: metrics.map((name) => ({ name })),
        limit,
      }),
    }
  );
  if (!res.ok) return { error: `GA4 ${res.status}: ${(await res.text()).slice(0, 300)}` };
  const data = (await res.json()) as {
    rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
  };
  return (data.rows ?? []).map((r) => ({
    ...Object.fromEntries(dimensions.map((d, i) => [d, r.dimensionValues[i].value])),
    ...Object.fromEntries(metrics.map((m, i) => [m, Number(r.metricValues[i].value)])),
  }));
}

const traffic = ["sessions", "engagedSessions", "averageSessionDuration", "keyEvents"];

const out = {
  site: { slug, domain: site.domain, scProperty, ga4PropertyId: site.ga4PropertyId },
  range: { start: iso(start), end: iso(end), days },
  gsc: {
    byQueryPage: await gsc(["query", "page"], 5000),
    byPage: await gsc(["page"]),
    byDevice: await gsc(["device"]),
    byDate: await gsc(["date"]),
  },
  ga4: {
    byLandingPage: await ga4(["landingPagePlusQueryString"], traffic),
    byChannel: await ga4(["sessionDefaultChannelGroup", "sessionSource"], traffic),
    byDevice: await ga4(["deviceCategory"], traffic),
    byDate: await ga4(["date"], ["sessions", "engagedSessions"], 1000),
    events: await ga4(["eventName"], ["eventCount", "totalUsers"]),
    eventsByPage: await ga4(["eventName", "pagePath"], ["eventCount"], 1000),
    eventsByDate: await ga4(["date", "eventName"], ["eventCount"], 5000),
  },
};

const file = join(OPS, `insights-${slug}-${iso(end)}.json`);
writeFileSync(file, JSON.stringify(out, null, 2));

// Short summary (no credentials, no raw queries).
const count = (v: unknown) => (Array.isArray(v) ? `${v.length} rows` : (v as { error: string }).error);
console.log(`\n${site.domain}  ${iso(start)} → ${iso(end)}`);
for (const [src, reports] of Object.entries({ gsc: out.gsc, ga4: out.ga4 }))
  for (const [k, v] of Object.entries(reports)) console.log(`  ${src}.${k}: ${count(v)}`);
console.log(`\nWrote ${file}`);
