# App: solceller

> Interactive solar calculator (solkalkylatorn.se): the user types their address,
> the satellite map zooms to their house, they **draw their roof**, and we instantly
> estimate panels, production, savings, payback and grönt avdrag — then hand off to a
> solceller quote-request lead-gen partner. Static — no Worker.

The differentiator: incumbents (Energify, Solara, Hemsol) are text + a form. This is
the only Swedish tool that collapses intent→offer by letting you draw your own roof.

## Composition

- **React Router** (`BrowserRouter`) under a shared `Layout`, single live route `/` → `pages/index`.
- The page **prerenders fully** (H1, "så funkar det", grönt-avdrag explainer, FAQ,
  WebSite + FAQPage JSON-LD) so it ranks without JS. The interactive parts are
  **client-only islands**, lazy-loaded so they never enter the SSR/prerender pass:
  - `components/RoofMap.tsx` — address geocode via `lib/geocode.ts` (Google Places
    API New, Nominatim fallback) → Leaflet map on Google satellite tiles → `leaflet-draw`
    polygon/rectangle → `@turf/area` computes the drawn roof area in m². Emits `onAreaChange(sqm)`.
- Business math lives in `@affiliate/solar-calculator` (domain), never in the app.
- Config:
  - `src/config/site.ts` — name/domain/SEO/nav (GA4/GTM empty until provisioned).
  - `src/config/affiliates.ts` — the quote-partner lead card(s). **Placeholder tracking
    URLs** until a solar quote program is approved. This is the only money surface.
- Consumes `@affiliate/analytics`, `@affiliate/seo`, `@affiliate/sites`, `@affiliate/solar-calculator`.

## Build / Deploy

Native Vite SSG (same pattern as the rest of the portfolio): client build → SSR build
(`entry-server.tsx`) → `prerender.ts` writes the static `/`. Cloudflare Pages, no Worker.
`deploy` = `bun run build && npx wrangler pages deploy dist --project-name=solceller --branch=production`
(`--branch=production` required, see other apps' notes).

## Money & truth

We only **estimate** from the user's drawn area + public assumptions (Energimyndigheten
~950 kWh/kWp, ~17 000 kr/kWp; Skatteverket grönt avdrag 15 %, max 50 000 kr/person). The
**binding quote always comes from the partner** — we never quote a price ourselves. This
keeps the site safe under the truth guardrail and marknadsföringslagen. Disclosure strip +
`rel="nofollow sponsored"` on the CTA, consent banner via `@affiliate/analytics`.

## Known Gaps / before live revenue

- **No domain bought, no Pages project** yet — validate on `solceller.pages.dev` first
  (escalation: domain purchase).
- **GA4/GTM ids empty** in the registry → analytics no-ops until provisioned.
- **Affiliate tracking URL is a placeholder** → CTA works but earns nothing until a
  solceller quote program is approved and the real URL is dropped into `config/affiliates.ts`.
- Map needs network at runtime (Google Places + Google satellite tiles + OSM Overpass
  for building footprints). Without `VITE_GOOGLE_MAPS_API_KEY` the search falls back to Nominatim.

## Decision Log

**(2026-06-13): Google Places API (New) for address search, Nominatim as fallback**
Nominatim resolved small/partial Swedish addresses poorly (especially in smaller
areas), hurting the search → map → draw flow. Switched address autocomplete +
geocoding to Google Places API (New) via `src/lib/geocode.ts`, keyed by
`VITE_GOOGLE_MAPS_API_KEY` (client-side, so it needs HTTP-referrer + API
restrictions in Google Cloud Console). When the key is unset the lib transparently
falls back to Nominatim, so key-less builds still work. This relaxes the original
zero-cost stance for the search box only — Places is billed per session, but a
session token batches each search's keystrokes + details call into one billable
unit. Map tiles and the OSM Overpass building-footprint lookup are unchanged.

**(initial): Leaflet + free Esri satellite tiles over Google Maps**
Google Maps satellite + drawing is billed per load and needs a public API key (cost +
key-leak risk) — conflicts with the cost=0 guardrail. Leaflet + Esri World Imagery +
`leaflet-draw` + `turf` gives the same draw-your-roof UX with zero cost and no key.

**(initial): Interactive parts are lazy client-only islands**
Leaflet and Three.js both touch `window`; rendering them in the prerender pass would crash
it and add nothing for crawlers. `lazy()` + `Suspense` keeps them out of the SSR HTML, so
the page stays a fully prerendered, indexable document with the tool hydrating on top.
