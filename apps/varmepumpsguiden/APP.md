# App: varmepumpsguiden

> Värmepumpsguiden (värmepumpsguiden.se): a free värmepump cost/savings tool fused
> with a verified-installer directory — "Momondo for värmepump". The user enters
> their house, we compute investering + ROT + driftskostnad + besparing +
> återbetalning per system type, then show a shortlist of F-skatt-verified local
> installers and hand off to a quote-request lead partner. Static — no Worker.

The differentiator: incumbents are either thin calculators **or** thin scraped
directories. This is the only Swedish page that fuses **our own computed cost for
your house** with a **legally-sourced verified-installer list per kommun** — the
combination that survives Google's March-2026 scaled-content update (a pure
scraped directory does not). We never scrape review platforms (see Money & truth).

## The audience — one journey, three personas

A värmepump buyer is the same person at three stages. Each page type catches one
stage at its exact search moment (see Key journeys):

| Persona | Stage | Searches | We give them |
|---------|-------|----------|--------------|
| **Curious** | problem-aware, solution-unaware | `värmepump`, `sänka uppvärmningskostnad` | orientation + a rough number → the hub tool |
| **Comparer** | solution-aware, vendor-unaware (the sweet spot) | `bergvärme kostnad`, `luft vatten värmepump pris [kommun]` | credible price/ROT/payback for *their* house + who installs nearby |
| **Ready** | vendor-seeking (the money: 90–250k SEK tickets) | `värmepumpsinstallatör [kommun]`, `installera bergvärme [stad]` | verified local installers + a frictionless "Få 3 offerter" CTA |

The Ready persona is where the revenue is; the Curious/Comparer are where the
traffic is and funnel down. All three converge on the same installer-lead CTA.

## Key journeys (the exact flows this app is built around)

Every journey reuses one mental model — **TELL US → SEE → ACT** — identical to
solceller's `search → compute → CTA`. The interactive `Calculator` island is the
spine of all three.

**Journey A — Curious (hub `/`)**
1. Lands on `/` from a head-term search.
2. **TELL US**: drags boyta slider + picks current heating.
3. **SEE**: the calculator shows all three systems ranked by saving (best first);
   fires `heatpump_estimated` (magnitude = best annual saving).
4. Routes onward: the "tre typer" cards link to the right `/{system}` page, or the
   user goes straight to the CTA. Curious → becomes Comparer.

**Journey B — Comparer (system `/{system}`, e.g. `/bergvarme`)**
1. Lands on a type page from `[type] kostnad` intent.
2. **TELL US**: same inputs; the calculator **pre-focuses their chosen system**.
3. **SEE**: that system leads, with investering range, SCOP, livslängd, and the
   computed ROT/drift/besparing/payback for their house.
4. **ACT**: either the CTA, or the "nära dig" kommun chips → the spine page.

**Journey C — Comparer + Ready (spine `/{system}/{kommun}`, e.g. `/bergvarme/linkoping`)** — the money page
1. Lands from `[type] + [location]` intent (the highest-intent query).
2. **TELL US → SEE**: focused calculator with a location-tagged CTA ("Få 3 offerter
   i Linköping").
3. **ACT**: below the calc, the **verified-installer shortlist** — F-skatt-active
   firms in that kommun matching the system's SNI, from free Bolagsverket/SCB data
   (never scraped reviews). The list is the *payoff of the computation*, not a bare
   directory — this fusion is the anti-thin moat.
4. Converts on the lead CTA.

## Composition

- **React Router** (`BrowserRouter`) under a shared `Layout`, three route shapes:
  `/` (hub) · `/:system` (type landing) · `/:system/:kommun` (programmatic spine).
- Pages **prerender fully** (H1, computed content, verified-firm list, ROT
  explainer, FAQ, WebSite/FAQPage/BreadcrumbList JSON-LD) so they rank without JS.
  The `components/Calculator.tsx` tool hydrates on top (uses `useState`, but is SSR-safe
  so it also prerenders its default 140 m² estimate for crawlers).
- Business math + firm data live in `@affiliate/heatpump-calculator` (domain),
  never in the app. The app only renders.
- The spine is defined in `src/config/spine.ts` — the single source of truth for
  both routing and `prerender.ts` (kommuner × systems). **Start small + dense**;
  expand a kommun in only when it has verified installers + search demand.
- Config:
  - `src/config/site.ts` — name/domain/SEO/nav (GA4/GTM empty until provisioned).
  - `src/config/affiliates.ts` — the quote-partner lead card. **Placeholder tracking
    URL** until a värmepump lead program is approved. The only money surface.
- Consumes `@affiliate/analytics`, `@affiliate/seo`, `@affiliate/sites`,
  `@affiliate/heatpump-calculator`.

## Build / Deploy

Native Vite SSG (same pattern as the rest of the portfolio): client build → SSR
build (`entry-server.tsx`) → `prerender.ts` enumerates `/` + every `/{system}` +
every `/{system}/{kommun}` in the spine. Cloudflare Pages, no Worker.
`deploy` = `bun run build && npx wrangler pages deploy dist --project-name=varmepumpsguiden --branch=production`.

## Money & truth

We only **estimate** from the user's house inputs + published assumptions
(varmekalkyl.se 2026 system prices/SCOP, Energimyndigheten heat demand, Skatteverket
ROT 30 % on labour, max 50 000 kr/person). The **binding quote always comes from
the installer** — we never quote a price ourselves.

**No scraping of review platforms** (Reco, Trustpilot, Google): their ToS ban it,
reviews are copyrighted, and review author identity is personal data under GDPR.
Installer facts come ONLY from free official sources (Bolagsverket "värdefulla
datamängder" + SCB företagsregister): name, org-nr, SNI, F-skatt status. "Verifierad
F-skatt" is a factual status, never a quality endorsement. Disclosure strip +
`rel="nofollow sponsored"` on the CTA, consent banner via `@affiliate/analytics`.

## Known Gaps / before live revenue

- **No domain bought, no Pages project** yet — validate on `varmepumpsguiden.pages.dev`
  first (escalation: domain purchase, ~150 SEK).
- **GA4/GTM ids empty** in the registry → analytics no-ops until provisioned.
- **Affiliate tracking URL is a placeholder** → CTA works but earns nothing until a
  värmepump/hantverkare lead program is approved and the real URL is dropped into
  `config/affiliates.ts`.
- **Installer directory is a seed** (`domains/heatpump-calculator/src/directory.ts`)
  until the Bolagsverket+SCB loader is wired (see that domain's DOMAIN.md). Spine is
  one kommun (Linköping) — the proof-spine, to be expanded after it ranks/converts.

## Decision Log

**(2026-06-18): Programmatic spine = computed value + verified firms, not scraped reviews**
The bet (JOURNAL 2026-06-18) is a defensible "Momondo for värmepump". Two landmines
shaped it: (1) scraping Reco/Trustpilot reviews = ToS + copyright + GDPR breach; (2)
Google's March-2026 update nuked thin scraped/aggregator directories (60–90% loss).
Resolution: firms from FREE official APIs only (Bolagsverket+SCB, non-personal data),
and every spine page must carry our OWN computed price/ROT/saving so it clears the
>25–30 % unique-value bar. The computation is mandatory, not decorative.

**(2026-06-18): One vertical (värmepump), one dense proof-spine first**
Chosen over takbyte for richer computed depth (drift/besparing/återbetalning per
system), higher lead value, and synergy with the existing energy angle (solceller).
Spine starts at one kommun to get a clean ranking/conversion signal before cloning
the template across kommuner and (later) to takbyte.
