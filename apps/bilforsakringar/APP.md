# App: bilforsakringar

> Swedish car-insurance comparison site (bilforsakringar.se). User enters a registration number; the site fetches and compares live quotes from multiple providers.

## Composition

- **React Router** (`BrowserRouter`), all routes under a shared `Layout`:
  - `/` → `pages/index` (reg-number input / start)
  - `/s/:id` → `pages/search` (quote results for a stored search)
- Config: `src/config/site.ts` only — name/domain, SEO meta, og image, GTM/GA4 IDs, `navigation` + `footerLinks`.
- Consumes `@affiliate/analytics`, `@affiliate/seo`, and the **`@affiliate/insurance-providers` domain** (in the Worker). Local shadcn UI under `src/components/ui/`.

## Backend (`worker/`)

Cloudflare Worker, **Hono**, wraps the insurance domain registry:

- `GET /providers`, `GET /providers/:provider/configurations`
- `POST /quote`, `/quote/start`, `/quote/stream` (SSE), `/quote/:provider`
- `GET /search/:id` — retrieve a stored search
- Searches persisted in **KV** (`SEARCHES`). The IF provider uses the **Cloudflare Browser binding** (`@cloudflare/playwright`) when available — see `worker/src/if-browser-quote.ts`.

## Scripts

`dev`, `build`, `preview`, `typecheck`, `deploy` (Pages `bilforsakringar` + worker), `worker:dev`, `worker:deploy`.

## Routes (live in `App.tsx`)

Content cluster (all prerendered, in `sitemap.xml`): `/`, `/jamfor`,
`/basta-bilforsakring-2026` (long-tail "2026" SEO wedge), `/forsakringsbolag`
(+ `/forsakringsbolag/:slug` per company), `/guide`, `/forstagangsbil`
(first-time/young-driver experiment cluster), plus legal/info `/om-oss`,
`/kontakt`, `/integritetspolicy`. Dynamic `/s/:id` stays client-rendered + noindex.

Editorial/comparison content is single-sourced in `src/config/content.ts`
(providers, coverage facts, FAQ). Prices there are illustrative ranges only — never
quoted as fact (truthfulness guardrail; see `docs/JOURNAL.md`).

## Decision Log

**(initial): Quote logic lives in `domains/insurance-providers`, not here**
The app only composes routing + UI; provider quoting is a reusable business capability owned by the domain. The Worker is a thin HTTP adapter over `registry`.
