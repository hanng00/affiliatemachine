# App: admin

> Internal analytics dashboard for the affiliate portfolio. Shows clicks, impressions, revenue and MoM/YoY comparisons across all sites. Not public.

## Composition

- **Single-page**, no router. `src/App.tsx` renders the dashboard directly.
- UI is local shadcn-style (`src/components/ui/`) + dashboard components (`MetricCard`, `Sparkline`, `SummaryCards`, `PropertiesTable`, `PeriodSelector`, `CompareSelector`).
- Frontend consumes only its own worker API. The site list/ids come from the shared `@affiliate/sites` registry (single source of truth), compiled into the Worker.

## Backend (`worker/`)

Cloudflare Worker, **Hono**:

- `GET /api/sites?period=` — portfolio rows for a period.
- `GET /api/sites/:id?period=` — one site's metrics for a period.
- `GET /api/sites/:id/metrics?days=` — daily time series for one site.
- `POST /api/cache/clear` — bump the cache version to force a fresh pull.
- CORS enabled. No cron. **No database.**

The site list is `@affiliate/sites` mapped to a stable 1-based numeric `id` at startup. Nothing is persisted.

### Data source — read-through + 24h cache (`worker/src/providers.ts`)

Each number is read from the platform that owns it, on demand, and edge-cached for 24h:

- **clicks** → GA4 (`affiliate_click` event)
- **impressions** → Search Console
- **revenue** → Adtraction, pulled **per channel** (`site.adtractionChannelId`). One channel = one website but many advertiser programs, so a single per-channel call reconciles all of a site's programs at once (attributed via the `epi` sub-id we attach to tracking urls, built by `@affiliate/analytics buildSubId`).

Providers are env-guarded (Worker secrets). When nothing is configured, the worker reports an **empty (zeroed) series** — honest, no fake data. All period math is computed in-memory from a single daily series.

## Scripts

`dev`, `build`, `preview`, `typecheck`, `deploy` (Worker + static assets in one unit), `worker:dev`, `worker:deploy`.

### Infra (IaC)

`wrangler.jsonc` is the source of truth (assets, observability, optional custom-domain route). No D1 binding — the Worker is stateless.

First prod deploy: `bun run deploy` (builds + deploys Worker and static assets in one unit). Set the GA4/GSC/Adtraction secrets to switch from zeroed series to live data.

## Decision Log

**(initial): Hono + D1 over a separate service**
Dashboard data is low-volume and portfolio-scoped; co-locating the API as a Worker kept it one deployable unit.

**Read-through + 24h cache over cron-into-D1 for third-party metrics**
Revenue (Adtraction), impressions (GSC) and clicks (GA4) are owned by external platforms. Rather than persist them via a cron job (extra state, drift, a pipeline to babysit), the worker reads them on demand and edge-caches for 24h.

**Removed the D1 database entirely (2026-06-13)**
The `sites` table was a synced copy of `@affiliate/sites` (drift surface + sync scripts for 6 static rows) — the Worker now imports the registry directly. The `metrics_snapshots` table only ever held *seeded random demo data* used as a fallback; every real number is recomputable live from the upstream APIs (GSC 16-month window, GA4, Adtraction history), already edge-cached. Dropping both tables removes the schema, migrations, drizzle deps, and seed/sync SQL machinery with zero loss of real data. If durable point-in-time history is ever needed (e.g. how Adtraction pending→approved revenue settles), the right shape is an append-only R2/KV cron, not a relational DB here.

**Revenue keyed on Adtraction `channelId`, not `programId`**
A site promotes many advertisers; one `programId` per site couldn't represent that. `channelId` is 1:1 with a site and the transactions report aggregates all programs under it, so reconciliation stays a single per-site call as the program mix grows.
