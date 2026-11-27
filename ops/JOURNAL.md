# Operator Journal

Append-only memory for the autonomous revenue agent. Newest entries at the top.
Read the root [`CLAUDE.md`](../CLAUDE.md) for the operating loop and Playbook.

Entry format:

```
### <date> · <site> · <lever: traffic|CTR|RPC|cost>
- hypothesis / change / build / deploy / watch / review on / outcome
```

---

### 2026-07-24 · varmepumpsguiden · CTR (3D house scene + hero redesign) — DEPLOY REQUEST
- diagnosis: the Jun-18 build was functional but visually generic — "a spreadsheet".
  First-principles review: the audience is a Swedish villa owner making a 100–250k SEK
  decision. They're anxious, not excited. The old UI didn't show *their* house, didn't
  build confidence, didn't create desire. Perceived quality → trust → CTA clicks.
- hypothesis: a reactive 3D house scene (Three.js, lazy-loaded) that responds to their
  inputs will massively bump perceived quality and dwell time:
  - **Area slider** → house scales
  - **System selected** → heat pump unit swaps (bergvärme borehole, luft/vatten outdoor
    unit, luft/luft wall unit)
  - **Savings magnitude** → warm interior glow intensifies
  - Winter scene (snow, cold blue outside, warm orange inside) = visceral "this is what
    you're buying"
- change:
  - New `components/HouseScene.tsx` — low-poly Swedish villa, falling snow, reactive to
    `areaSqm`, `system`, `savingsPerYear`. Code-split (477kb → 121kb gzip), lazy-loaded
    via `Suspense` so it never blocks LCP or prerender.
  - New `components/HeroSection.tsx` — two-column layout (house left, calculator right
    on desktop; house above on mobile). Calculator exposes state via `onStateChange`
    callback to drive the scene.
  - Updated all three page types (`/`, `/{system}`, `/{system}/{kommun}`) to use the
    new HeroSection.
  - Added `three` + `@types/three` to deps.
- build: pass — `tsc --noEmit` clean, client+SSR+prerender green (7 routes). HouseScene
  chunk is separate, loads only when hero mounts.
- **DEPLOY REQUEST — awaiting human approval.** Same gate as Jun-18: domain not bought,
  GA4 not provisioned, tracking URL placeholder. This bet layers on top of the original.
- watch: once live, CTA CTR (GA4 `affiliate_click` / `heatpump_estimated`), dwell time
  (GA4 engagement), bounce rate. CTR bet → **review 2026-08-01** (~1 wk after deploy).
- spend ledger: 0 SEK (no new spend).
- outcome: _(pending)_

---

### 2026-06-18 · varmepumpsguiden (NEW SITE) · RPC+traffic (build the värmepump proof-spine) — DEPLOY + DOMAIN REQUEST
- bet: ship the approved "Momondo for värmepump" proof-spine (GO 2026-06-18). A free
  värmepump cost/savings tool fused with a verified-installer directory. New app
  `apps/varmepumpsguiden`, new domain package `domains/heatpump-calculator`.
- the exact key journeys it's built around (one buyer, three stages — all funnel to
  the same installer-lead CTA):
  - **Curious** → hub `/`: TELL US (boyta + nuvarande värme) → SEE all 3 systems
    ranked by saving → routes to a type page. Fires `heatpump_estimated`.
  - **Comparer** → `/{system}` (e.g. `/bergvarme`): same tool, pre-focused on their
    system; SCOP/livslängd/ROT/drift/besparing/payback for their house.
  - **Comparer+Ready (the money)** → spine `/{system}/{kommun}` (e.g.
    `/bergvarme/linkoping`): focused calc with location-tagged CTA + the
    **F-skatt-verified installer shortlist**. The fusion of OUR computed price with
    legally-sourced local firms is the anti-thin moat. (Journeys documented in full
    in `apps/varmepumpsguiden/APP.md`.)
- defensibility (the two landmines from the 2026-06-18 creative scout, both handled):
  (1) NO scraping of Reco/Trustpilot reviews (ToS + copyright + GDPR) — firms come
  only from free Bolagsverket "värdefulla datamängder" + SCB företagsregister
  (non-personal: name, org-nr, SNI, F-skatt). (2) every spine page carries our own
  computed value so it clears Google's March-2026 unique-value bar.
- math (sourced, in `domains/heatpump-calculator`, 7 unit tests pass): system prices
  + SCOP from varmekalkyl.se 2026; heat demand ~120 kWh/m²·år (Energimyndigheten);
  ROT 30 % of labour, cap 50 000 kr × owners (Skatteverket). Binding price = installer.
- scope (proof-spine, deliberately small + dense): 1 vertical, 1 kommun (Linköping),
  3 systems → 7 prerendered pages (`/` + 3 `/{system}` + 3 `/{system}/{kommun}`).
  Spine is one source of truth (`src/config/spine.ts`) for routing + prerender; clone
  kommuner only after it ranks/converts.
- build: pass — `tsc --noEmit` clean, `bun test` 7/7 green, client+SSR+prerender green
  (7 routes, unique per-page titles/canonicals/JSON-LD verified in `dist/`). No money
  yet: GA4/GTM empty, Adtraction channel not created, CTA tracking URL is a placeholder,
  installer list is a seed (Bolagsverket+SCB loader = follow-up ops tooling).
- **DEPLOY + DOMAIN REQUEST — awaiting human approval** (both gated per CLAUDE.md):
  1. **Domain** `värmepumpsguiden.se` (~150 SEK) — inside the approved envelope, but a
     new-domain commitment → escalated, not self-bought.
  2. **Deploy**: validate on `varmepumpsguiden.pages.dev` first
     (`deploy:varmepumpsguiden`), then point DNS + add custom domain + provision GA4
     and drop the ids into `packages/sites/src/index.ts`.
- watch: once live + indexed, GSC impressions on `[system] kostnad [kommun]` long-tail;
  activation rate (`heatpump_estimated`); CTA CTR. SEO latency → **review 2026-07-16**
  (~4 wks after deploy). Do not judge sooner.
- spend ledger: 0 SEK spent (domain pending approval).
- outcome: _(pending)_

---

### 2026-06-16 · bilforsakringar · traffic (internal-link the orphaned best-ranking page) — DEPLOY REQUEST
- evidence (GSC `Queries.csv`): the only terms we rank page 1-2 for —
  `billigaste bilförsäkring sverige 2026` @**p19**, `bästa bilförsäkringen 2026`
  @p50 — are served by `/basta-bilforsakring-2026`, but that page was an
  **orphan** (no internal link, sitemap-only). Site avg position 76.8, 0 clicks.
- diagnosis: ranking is authority-bound (new domain, no backlinks) and the head
  terms are owned by funded aggregators — unwinnable short-term. The one lever
  fully in our control is **internal linking**: surface our closest-to-page-1
  page from high-authority surfaces with keyword anchors so equity + relevance
  signal flow to it. Win the long tail first; head lifts as a byproduct.
- change (surgical, internal links only — no content/price/logic changes):
  - Home: in-content link → `/basta-bilforsakring-2026` (anchor "billigaste och
    bästa bilförsäkringen 2026") + → `/forstagangsbil`.
  - Nav (`site.ts`): added "Billigast 2026" → wedge (site-wide link).
  - Cluster cross-links: `/jamfor` ↔ wedge; wedge → `/jamfor` + `/guide`, all with
    descriptive anchor text.
  - Verified link ships server-side in prerendered `dist/index.html`.
- build: pass — `tsc --noEmit` clean; client+SSR+prerender green (14 routes). No deps.
- deploy: **awaiting human approval.** Run `deploy:bilforsakringar`. After deploy,
  (re)submit sitemap in GSC; the wedge URL already exists in `sitemap.xml`.
- watch (GSC): position of `/basta-bilforsakring-2026` and its two wedge queries.
  SEO latency → **review 2026-07-07** (3 wks). Do not judge sooner.
- outcome: _(pending)_

---

### 2026-06-16 · bilforsakringar · traffic+CTR (content cluster from GSC evidence) — DEPLOY REQUEST
- evidence (GSC export `apps/bilforsakringar/docs/data/`, ~9 days): 262 impressions,
  **0 clicks**, avg **position 76.8** (page ~7-8), **1** indexed page (`/` only), 72
  distinct queries — all wide-market head terms (`jämför bilförsäkring` 39 impr @p75,
  `billig bilförsäkring` 14, `billigaste bilförsäkringen` 8). 68% mobile, 89% Sweden.
  Bright spot: long-tail "...2026" ranks far better — `billigaste bilförsäkring
  sverige 2026` @**p19**, `bästa bilförsäkringen 2026` @p50.
- diagnosis: the leak is **position, not snippet** (CTR ~0 is expected at p76) and
  **not conversion** (almost nobody arrives). One thin gated page can't rank or earn
  clicks. Initial "fix the CTR/snippet" read was overturned by the position data.
- decision (human-approved): build the **wide comparison shell** (matches 100% of
  demand) + wedge the long-tail "2026/billigaste" specificity we already rank for;
  add ONE fenced first-time/young-driver experiment cluster (own URL) to *generate* a
  niche signal we currently lack. Niche-first was rejected — no demand data for it.
- change (one coherent cluster, this app only):
  - Rebuilt `/` — comparison content (coverage table, price factors, providers, FAQ)
    above/around the tool; `QuoteInput` now progressive (regno first, personnummer
    revealed on step 2) → removes the mobile personnummer wall.
  - New crawlable pages: `/jamfor`, `/basta-bilforsakring-2026` (long-tail wedge),
    `/forsakringsbolag` (+ `/:slug` per company), `/guide`, `/forstagangsbil`
    (experiment). Legal/info (closes dead-nav + GDPR gap): `/om-oss`, `/kontakt`,
    `/integritetspolicy`.
  - All prerendered; `sitemap.xml` updated (14 urls); each emits canonical + per-page
    title/meta + JSON-LD (FAQPage/BreadcrumbList). Content single-sourced in
    `src/config/content.ts`; prices = illustrative ranges only (truthfulness guardrail).
  - RPC-prep (not fabricated): fixed `QuoteResults` CTA — was `https://www.{provider}.se`
    (wrong host for `trygg-hansa`), now correct public site + `epi` sub-id +
    `affiliate_click` event + `rel=sponsored`. Real affiliate program URLs remain an
    escalation (program approvals).
  - Added site-local data-grounded decision log `apps/bilforsakringar/docs/JOURNAL.md`.
- build: pass — tsc clean; client+SSR+prerender green (14 routes); shipped HTML
  verified (real content + canonical + BreadcrumbList/FAQPage JSON-LD; FAQ answers in
  DOM even when collapsed). No new deps.
- deploy: **REQUESTED** — `deploy:bilforsakringar` (Pages + worker). Then resubmit
  `sitemap.xml` in GSC. No self-deploy.
- watch (GSC, this site, 2-4w): indexed pages 1→~14; long-tail "...2026" position
  p19→top-10; first clicks > 0; does `/forstagangsbil` earn ANY first-time/ung-förare
  impressions (validates/kills the niche). Mobile engagement on `/`.
- spend: 0. review on: 2026-06-29 (+2w, SEO latency). outcome: _(pending)_

---

### 2026-06-18 · portfolio · traffic+RPC (CREATIVE SCOUT — programmatic review-aggregator / "Momondo for hantverkare") — ESCALATED
- trigger (human): not interested in lead-buyer outreach (a). Focus = **mass A/B-test sites**. Idea:
  "scrape review-sites for hantverkare reviews, let users search by need, serve a Momondo/Hotels.com-style
  aggregator." Got creative + pressure-tested it against the two things that actually kill this model.
  I researched only — nothing built/scraped/bought, 0 SEK.

- **VERDICT: the *shape* is right and fits the mass-A/B thesis — but the naive version (scrape reviews →
  republish → thin location pages) walks into two landmines at once. There's a defensible version that
  dodges both, and it's stronger because it reuses our existing moat.**

- **LANDMINE 1 — legal (scraping & republishing reviews).** Confirmed from the sources' own ToS this cycle:
  - **Reco.se, Trustpilot, Google all ban scraping** in ToS. Trustpilot's terms explicitly forbid
    "text/data mining or web scraping … including for AI." Reco grants *itself* an **exclusive perpetual
    license** on every review → republishing their reviews is a direct IP conflict, not a grey area.
  - **GDPR:** reviews carry author identity (name, first-letter surname, photo). EU enforcement is
    unambiguous — "it's public" is **not** a lawful basis; DPAs call scraping personal data "almost always
    a violation." Republishing individual reviews = copyright infringement **+** personal-data processing.
  - **The clean line (also from the sources):** *non-personal* public/official data — firm name, org-nr,
    SNI/verksamhet, address, F-skatt status, **aggregate** rating numbers without author text — is outside
    GDPR and broadly legal. So: **firm facts = safe; other people's review *content* = do not touch.**
- **The unlock:** we don't *need* to scrape — Sweden hands us the firm graph for free.
  - **Bolagsverket "värdefulla datamängder" API** — free, no contract, REST/JSON: name, org-nr,
    verksamhetsbeskrivning, SNI codes, status (likvidation/konkurs).
  - **SCB företagsregister API** — free since 26 Jun 2025 (gov't dropped fees): **all** Swedish firms +
    arbetsställen, **F-skatt / moms / arbetsgivar-registrering** ("verksam organisation"), city, SNI.
    (New key-auth API lands Sept 2026.) ~2.9M companies, filterable by SNI + city.
  - **BolagsAPI** (commercial, 500 req/mo free, ~0.05 kr/lookup) for enrichment (financials, PRV) if wanted.
  → We can build a **legit, F-skatt-verified hantverkare directory by SNI + kommun** with zero scraping
  and zero personal data. That alone is "real NAP signals + unique business data" — the *exact* thing
  Google's 2026 survivors have.

- **LANDMINE 2 — SEO (this is now the bigger risk).** Google's **March 2026 core update explicitly
  targeted this pattern.** From the post-mortems: "**aggregator sites that added no context beyond the
  source data they scraped**" and "**local service directories with identical content except location
  names**" lost **60–90%** of traffic overnight, algorithmically (no manual action, no reconsideration,
  3–6 mo recovery). Passing scraped data through an LLM for "cosmetic rewriting" was called out as
  **explicitly insufficient.** A pure {{service}}-in-{{city}} directory is now the textbook penalty.
  - **But the survivors are named, and we fit them:** "local directories with **unique business data**,"
    "comparison **tools** with **live pricing + unique editorial**," "pages with **genuine data depth**."
    The bar: **>25–30% unique, non-template value per page**, real intent, governed (not blind-published).
  - **Our edge:** the portfolio already manufactures the one thing a scraper can't — a **computed layer**
    (solceller roof→kWp, samlalanet loan math, värmepump sizing, takbyte m²→price-band). A directory page
    that pairs *free official firm data* + *our own price/ROT/sizing computation for that job in that
    kommun* clears the uniqueness bar; a page that just lists scraped firms + stars does not.

- **THE DEFENSIBLE DESIGN (fits "mass A/B sites" + our Cloudflare/LLM stack):**
  - **Data spine (legal):** Bolagsverket + SCB APIs → KV/D1 of F-skatt-verified firms by SNI × kommun.
    No reviews scraped. If we ever show ratings, only via an *official partner API/affiliate* (e.g. a
    Reco/Trustpilot widget or a lead-network feed), never scraped text.
  - **Unique per-page value (the anti-thin moat):** each {service}×{kommun} page ships our **own computed
    price band + ROT/grönt-avdrag math + "what a fair offert includes" checklist** for that job — the
    calculator content we already build, localized with real cost drivers. LLM used for *enrichment of our
    own data*, not rewriting someone's reviews.
  - **Search → match (the Momondo bit):** user picks need + postcode → we rank verified local firms →
    CTA = **a lead** (sell it to the hungry buyers mapped on 2026-06-18: Offerta/Servicefinder/Nettbureau,
    600–2200 SEK/renovation lead) **or** affiliate. Same RPC engine as the rest of the portfolio.
  - **A/B at scale (the actual ask):** the value isn't 10k thin pages — it's **a templated *site factory***
    (one engine, many SNI verticals/kommun sets) where we A/B the *template* (hero, table, CTA, schema,
    intro depth) on a **dense spine of high-value pages**, expand only where impressions justify it
    (crawl-budget discipline per the pSEO skill). Mass *experiments*, not mass *thin pages*.
  - **Stack:** native-SSG prerender (what every app already uses) + a Cloudflare Worker reading the firm
    KV/D1 + the existing `@affiliate/*` analytics/seo/consent. No new infra; this is our golden path.

- **Honest risks / why I'm flagging, not building:** (1) SEO is genuinely hard now — a directory with no
  computed depth *will* get demoted; the computation is mandatory, not optional. (2) Cold-start authority:
  a zero-authority domain ranking a directory is slow — pair it with the existing tool-sites' internal
  links. (3) Don't promise reviews we can't legally show; design CTAs that don't depend on review content.
  (4) Volume ≠ value post-March-2026 — resist the urge to spray pages.

- **Recommendation (cheapest test first):** **don't** build a 10k-page directory. Build **one
  proof-spine**: pick the highest-lead-value vertical from the 2026-06-18 map (värmepump or takbyte,
  600–2200 SEK/lead), ship ~20–50 {job}×{kommun} pages where **each carries our own computed price/ROT
  band + verified-firm list from the free APIs**, wire the lead/affiliate CTA, and **A/B the template**.
  If a dense, enriched spine ranks + converts, *then* scale the factory across SNI verticals. That's the
  mass-A/B engine, de-risked against both landmines.
- guardrails: **no scraping of review platforms** (ToS + copyright + GDPR); only free official firm data +
  partner/affiliate APIs; estimate-only price bands (sourced, never a binding quote); GDPR consent;
  disclosure; **new domain / any data-vendor spend = human approval.**
- build/deploy: n/a (scout). spend: 0.
- decision needed (human): (b-new) green-light a **single enriched proof-spine** (one vertical, ~20–50
  computed+verified pages, A/B the template) on a new domain (~150 SEK) before any factory; pick the
  vertical (  recommend **takbyte** or **värmepump** — highest lead value, clear price drivers to compute).
  outcome: **GO (human, 2026-06-18).** Approved: build a single enriched proof-spine on a new domain
  (~150 SEK). Vertical decision below.

- **VERTICAL DECISION (human asked "A or B or both?"): → B (värmepump) first, single spine. NOT both.**
  Rationale (researched this cycle, sourced price/ROT data):
  - **Doing both at once breaks attribution** — the spine's job is to answer ONE question ("does
    verified-firm-data + computed-price + lead-CTA rank & convert?"). Two verticals = can't tell if a
    result is the vertical or the template. One vertical, A/B the *template*, get a clean read, then clone.
  - **Why värmepump beats takbyte as #1:**
    - *Computed depth (the anti-thin moat):* värmepump page can compute investering + ROT + **driftskostnad/år,
      besparing/år, återbetalningstid** per system (luft/luft 35–62k efter ROT, luft/vatten 90–142k,
      bergvärme 145–200k; SCOP-driven savings). Decision-grade unique value. Takbyte is mostly m²×material
      band + ROT — real but thinner, closer to a calculator than a decision tool.
    - *Lead value:* bergvärme/luft-vatten = 90–250k SEK tickets; mature installer-lead/CPL market (every
      incumbent result page = "få 3 offerter"). High RPC.
    - *Portfolio synergy:* ties to our existing energy angle (solceller, grönt/ROT) → internal-link
      authority from day one, directly attacking the cold-start-authority risk.
  - **Takbyte = clone #2** once the pattern validates (1 200–2 500 kr/kvm, ROT on 40–50% arbetskostnad).
- next action (me): write the build spec for the värmepump proof-spine (data spine via free
  Bolagsverket+SCB APIs → KV/D1 of F-skatt-verified VVS/värmepump installers by SNI×kommun; computed
  price/ROT/driftskostnad module; ~20–50 {system|job}×{kommun} pages; lead/affiliate CTA; A/B the
  template; native SSG prerender + Worker + `@affiliate/*`). Build behind the deploy gate; request domain.

- **AUDIENCE + FLOW (human: "nail user intent + journey").** Anchored to the proven solceller pattern
  (single above-fold tool: search→compute→result→CTA; prerendered SEO prose below; activation fires when a
  real estimate exists; illustrative bands, binding quote from installer).
  - **Audience = ONE journey, THREE personas/stages** (programmatic pages must catch the right stage):
    1. **Curious** (top, problem-aware): villa w/ direktel/olja, high winter bills. Searches `värmepump`,
       `sänka uppvärmningskostnad`. Needs orientation + a rough number. → traffic, low intent.
    2. **Comparer** (mid, solution-aware — the sweet spot): decided on a type, wants price/payback truth.
       Searches `bergvärme kostnad`, `luft vatten värmepump pris [kommun]`. Needs credible price band +
       ROT + driftskostnad/återbetalning for THEIR house + who installs nearby.
    3. **Ready** (bottom, vendor-seeking — the money): wants 3 quotes now. Searches
       `värmepumpsinstallatör [kommun]`, `installera bergvärme [stad]`. Needs verified local firms + CTA.
       Highest lead value (90–250k SEK tickets, premium CPL).
  - **Page architecture (each = programmatic template, catches a persona at its search moment):**
    - `/` hub — Curious; the interactive sizing tool lives here (analog of solceller's map).
    - `/{system}` (`/bergvarme`,`/luft-vatten`,`/luft-luft`) — Comparer on type intent; deep computed cost.
    - `/{system}/{kommun}` (e.g. `/bergvarme/linkoping`) — Comparer+Ready at `[type]+[location]`; **this is
      where the verified-firm shortlist + local price band live (the legal "Momondo" bit) = the spine.**
  - **3-step flow (1:1 with solceller search→rita→resultat):** (1) TELL US: house m² + current heating +
    kommun → (2) SEE: investering, ROT, driftskostnad/år, besparing, återbetalning per system, for their
    house → (3) ACT: shortlist of **F-skatt-verified local installers** (free firm data) + "Få 3 offerter".
  - **The moat / anti-thin move:** the installer shortlist is the *payoff of the calculation*, not a bare
    scraped list — "för din 140 m² villa i Linköping: bergvärme ≈175k efter ROT, payback ~8 år → här är 6
    verifierade installatörer nära dig." Fused computed-value + verified-local-firms = the >25–30% unique
    content that survives March-2026; a thin scraper-directory cannot produce it.
  - **Conversion:** all three stages funnel to the same installer lead — Ready clicks now; Comparer
    converts post-calc; Curious gets oriented on hub → system page → becomes Comparer.

---

- trigger: follow-up to the 2026-06-15 revenue-model scout — "what's the current supply side like,
  where do we have good new needs?" In a lead-gen marketplace the **supply side = the buyers** (firms
  who pay for leads). A "good new need" = a vertical where **buyer demand is strong but the supply of
  *interactive-tool* publishers (our moat) is thin**, ideally with a dated catalyst forcing demand.

- **SUPPLY-SIDE FINDING #1 — the buy side is deep, open, and consolidating under one roof.**
  Almost every Swedish quote-vertical site is run by **Nettbureau** (Solceller.nu, Värmepump.se,
  Laddbox.nu, Takläggare.nu, Elektriker.se, flyttfirmor, mäklare, rörmokare, elavtal). LeadHive and
  Energy Group are the main challengers. What they all advertise to *installers* (the buyers), in their
  own words this cycle:
  - **No startup fee, no lock-in, pause/stop anytime, set a per-day/week/month cap.**
  - **Each lead shared with max 2–3 firms** (so exclusive/near-exclusive leads command more).
  - Delivery to email **or CRM/webhook** ("Leadkit Inbox").
  - They are *actively recruiting* publishers/installers ("Gör det du också", "anslut gratis").
  → Read-through for us: as a **publisher with our own qualified leads**, the buy side is a solved,
  no-commitment market. The constraint was never "will someone buy the lead" — it's "do we have the
  qualified lead to sell." That's exactly what our tools manufacture. It also means our real competitor
  is **Nettbureau's top-of-funnel**, and the way to beat a form is the thing we already do: an
  *interactive, computed* lead (draw-your-roof, your-own-numbers) they don't build.

- **SUPPLY-SIDE FINDING #2 — buyer hunger is highest where the job ticket is biggest** (more margin to
  pay for a lead). Per-lead prices confirmed from buyers' pages: renovation/bygg **600–2200**, takbyte
  (135k–310k job) high, bergvärme (150–250k job) high, värmepump 25–120 shared, laddbox mid, solar
  149→1000. **Ticket size ≈ lead price.** The portfolio currently sits mostly on *mid*-ticket
  (vacuums, scooters); the money is in **big-ticket home installation**.

- **NEW-NEED GAPS (demand high + tool-supply thin + a 2026 catalyst). Ranked:**
  1. **Tilläggslån / renovate-vs-move calculator — strongest dated catalyst.** From **1 April 2026**
     the bolåneregler changed: bolånetak up to 90% (easier to *buy*), skärpt amorteringskrav removed,
     **BUT tilläggslån (borrow against your home for renovation) capped at 80%** + a "tröghetsregel"
     (revalue only every 5 years). Net effect: **millions of owners who assumed they'd renovate on
     tilläggslån now can't borrow as much** → a fresh, confusing, high-stakes money question with
     *no interactive tool* answering "how much can I still borrow / renovate vs move?" This is the same
     event-driven moat as samlalanet's ränteavdrag play, in the bolån vertical (Finance = highest CPA,
     400–2000 SEK). Tool-supply: essentially zero. **Best lift×confidence÷effort.**
  2. **Värmepump / bergvärme quote tool — biggest buyer hunger, thin interactive supply.** Värmepump.se
     (Nettbureau) is a *form*; nobody offers "compute your värmebehov → system pick (luft-luft vs
     luft-vatten vs bergvärme) → cost with ROT → payback → get 3 quotes." High ticket (30k–250k), deep
     buyer pool, and stacks with **Villaeffekten** (below). Same free-tool moat as solceller.
  3. **Villaeffekten / grönt-avdrag eligibility + bidrag calculator — brand-new subsidy catalyst.**
     "Villaeffekten" (förordning in force **17 Aug 2026**, retroactive to 1 Jan 2026): **30% of material
     up to 60 000 SEK** for energy-efficiency work; house värdeår ≤1989, no fjärrvärme. Plus grönt
     avdrag (laddbox/battery **50%**, solar 15%). The rules are genuinely confusing (eligibility,
     stacking, max). **No tool tells a villaägare "are you eligible, for how much, on which åtgärd."**
     This is a perfect top-of-funnel that feeds värmepump + laddbox + solar leads at once — a
     *catalyst content/tool wedge*, monetized by routing to the three install verticals we'd already
     be in.
  4. **Laddbox install tool — clean grönt-avdrag (50%) story, dedicated hungry buyer (Laddbox.nu).**
     Smaller ticket than heat pump but very clean ("box + installation från samma leverantör = 50%
     direkt på fakturan"), EV-owner tailwind, and a buyer literally emailing for installers. Good
     *secondary* leg, weaker as a standalone site.

- **What this changes about the earlier plan:** the 2026-06-15 scout said "own-the-lead + a värmepump/
  hantverkare site." This sharpens it: the single best *new* need is the **tilläggslån/renovation-
  financing calculator** (a dated, universal, untooled Finance catalyst on the highest-CPA vertical),
  with **värmepump+Villaeffekten** as the best *home-install* lead play (one tool, three install
  verticals, brand-new subsidy). Both reuse the proven solceller/samlalanet pattern and the existing
  Cloudflare lead-capture infra.

- **Recommendation (staged, escalations — 0 SEK, nothing built/bought):**
  - **Confirm the buy side is real (free, do first):** let me email **one** Nettbureau-class buyer
    (Värmepump.se / LeadHive) as a publisher to get a concrete CPL number + delivery method for solar +
    värmepump. De-risks every "own-the-lead" bet before any build.
  - **Best new-need bet (new-domain escalation, ~150 SEK):** green-light a **tilläggslån / renovera-vs-
    flytta** calculator site riding the 1-April bolån change — OR a **värmepump+Villaeffekten** install-
    lead tool. I recommend tilläggslån first (higher CPA, sharper catalyst, zero tool competition).
  - **Stack later:** Villaeffekten eligibility wedge as a content/tool feeder once a home-install
    vertical exists.
- guardrails: estimate-only (never a binding price/quote); GDPR consent, reject=accept, minimal fields;
  disclosure; **no new domain and no signed lead agreement without human approval.** Researched only.
- build/deploy: n/a (scout). spend: 0.
- decision needed (human, pick a subset): (a) I contact one lead-buyer for a CPL number; (b) green-light
  the tilläggslån/renovation-financing site (new domain); (c) green-light the värmepump+Villaeffekten
  install-lead tool (new domain); (d) park Villaeffekten as a feeder wedge for later.
  outcome: _(pending human go/no-go)_

---

- trigger: "go beyond affiliate links ONLY — where can we make money? constraints: Cloudflare infra
  + exceptional LLMs to build. research the internet (Reddit, underserved markets)." This is a
  strategy scout, not a build. Diagnosed against the loop (`profit = traffic × CTR × RPC − cost`):
  affiliate CPS is the lowest RPC ceiling we have, and the portfolio is **structurally RPC=0** anyway
  (placeholder URLs). The question is which *higher-RPC monetization model* to layer on the assets
  and infra we already run.

- **CORE FINDING — the highest-RPC lever isn't a new site, it's a model switch we're already 90% built for.**
  The portfolio is two businesses (`ops/REVENUE.md`): Retail (CPS, low RPC) and **Lead (CPL, high RPC)**.
  Market data pulled this cycle on what a *lead* actually sells for in Sweden, per the buyers' own pages:
  | Vertical | Price per lead (SEK) | Buyers (open to publishers, no startup fee) |
  |----------|----------------------|---------------------------------------------|
  | Solar (solceller) | **149** (LeadHive public avg) → **350–1000** (Energy Group: external leads) | LeadHive, Nettbureau (Solceller.nu), Energify, Energy Group |
  | Heat pump (värmepump) | ~25–120 (Nettbureau shared) → higher exclusive | Värmepump.se (Nettbureau), Jämförvärmepump.se |
  | Hantverkare / renovation | **600–1600**, up to **2200** specialised | Offerta, Servicefinder, BraByggare, Totalbyggarna, Nettbureau |
  | Insurance (bil/hem) | high CPL/CPS (Compricer 12/8/600; Zmarta ~800/lead) | Adtraction/Tradedoubler programs |
  | Finance (samlingslån) | **400–2000 per approved loan** (Plus1 2000, Sambla 1035) | Adtraction Finance (~89 programs) |
  Affiliate CPS for a robot vacuum nets ~240 SEK *per completed sale*; a single qualified renovation
  **lead** (not a sale) sells for 600–2200 SEK. That's the whole thesis: **a click is worth cents; a
  qualified, pre-computed lead is worth hundreds.**

- **The unfair advantage we already own (verified in code this cycle):**
  - `apps/bilforsakringar/worker` is a live **Cloudflare Worker (Hono) that already stores every search
    as a lead in KV** (`StoredSearch`: regno + risk profile, 30-day TTL, SSE provider fan-out). It is
    *already a lead database* — it just (a) collects no contact field and (b) never sells the lead.
  - `apps/solceller` produces a **pre-qualified** lead (drawn roof → m² → kWp → annual kWh → savings).
    A lead with a computed system size is worth materially more than a bare form-fill — and BRF/commercial
    roofs are worth multiples of villa.
  - Every site is a Cloudflare Pages/Workers + KV stack. The v2 "own-and-sell-the-lead" build
    (consent + contact field → store → webhook/REST push to buyer, cap 3 buyers/lead) is the **same
    shape on infra we already run**, not a new system. `ops/REVENUE.md` already specs it.

- **Revenue models beyond affiliate, ranked by (expected RPC lift × confidence ÷ effort):**
  1. **Own-and-sell the lead (CPL) — flagship.** Switch bilforsakringar + solceller from redirect to
     captured-and-sold leads. Highest RPC, lowest *new* build (infra exists), buyers are actively
     recruiting publishers with **no startup fee / no lock-in** (LeadHive, Nettbureau, Värmepump.se all
     advertise exactly this). Needs ONE signed CPL agreement before code ships → escalation.
  2. **New lead-gen niche: hantverkare/värmepump quote tool.** Same proven free-tool-as-moat pattern
     (solceller/samlalanet), pointed at the **highest per-lead vertical in the country** (renovation
     600–2200 SEK/lead; värmepump install 25k–250k ticket). Underserved by *interactive* tools — incumbents
     (Offerta/Servicefinder) are form-and-catalog, not "compute your job + ROT + system pick." One new
     site = new-domain escalation (~150 SEK).
  3. **Cloudflare-native paid micro-tool (NEW model, not affiliate at all).** CF shipped the rails this
     year: **Workers AI** ($0.011/1k neurons, 10k/day free), **Stripe Agent Toolkit on Workers**
     (one-time / subscription / **metered** billing), **pay-per-crawl** (HTTP 402 — charge AI crawlers
     for content, CF is merchant-of-record). A high-value, narrow tool (e.g. an LLM that reads a
     hantverkare PDF offert and flags missing posts / ROT errors / ÄTA risk — a real Reddit/forum pain:
     "how do I read this offert, am I being lured?") can charge **per use or per month** instead of
     hoping for a click. Sell the *outcome*, not the link — the dominant 2026 indie playbook. Higher
     effort + unproven demand → pilot, don't bet the cycle on it.
  4. **Recurring/data model (lowest priority now):** elavtal/elpris is high-volume but low-trust-to-
     monetize and crowded (Elskling/Compricer/Elpriskollen). Pay-per-crawl on our sourced calculators is
     near-zero-effort to *enable* but pays ~nothing until we have crawled traffic. Park both.

- **Underserved-market signal (Reddit/forums + buyer pages):** the recurring consumer pain is *"jag fick
  en offert, är jag blåst?"* — reading/comparing hantverkare quotes, hidden ÄTA, what ROT actually covers,
  is-this-price-real. Every incumbent answers it with a static guide + a form. None answers it with a
  tool that ingests the user's *own* numbers/quote and reasons about it. That gap = the same moat
  solceller's draw-your-roof exploited, in a 600–2200 SEK/lead vertical. Strong candidate for bet #2/#3.

- **Recommendation (one decision, staged):**
  - **Now (escalation, 0 SEK):** approve me to *email one lead-buyer as a publisher* for
    solceller+bilforsakringar (LeadHive / Nettbureau / a värmepump buyer) to get a real CPL number +
    delivery method. No code, no spend — just unlocks whether v2 RPC is real before we build it.
  - **Next (on a CPL number):** build v2 own-the-lead (consent contact step → KV → webhook) on the
    existing workers; this is the single biggest RPC lever in the portfolio.
  - **Parallel (new-domain escalation):** green-light a **värmepump/hantverkare quote tool** as the
    next site — highest per-lead vertical, proven pattern, ~150 SEK domain.
  - **Pilot (low priority):** one Cloudflare-paid micro-tool (offert-läsare) as the first *non-affiliate*
    revenue line, to learn the Workers-AI + Stripe-metered rails on a small surface.

- guardrails carried: never quote binding prices (estimate-only); GDPR consent, reject-as-easy-as-accept,
  minimal fields; affiliate/lead disclosure; **no signed agreement and no new domain without human
  approval** (spend + escalation gates). I researched only — nothing built, nothing bought, 0 SEK.
- build/deploy: n/a (scout). spend: 0.
- decision needed (human go/no-go, pick any subset): (a) I contact a lead-buyer for a CPL quote;
  (b) green-light v2 own-the-lead build once a number exists; (c) green-light the värmepump/hantverkare
  site; (d) green-light a Cloudflare-paid micro-tool pilot. outcome: _(pending human go/no-go)_

---

### 2026-06-15 · admin · observability fix (trend sparkline falls back to impressions)
- symptom: after the mid-funnel/activation work, the TREND column read flat lines on most rows and an
  empty grey box on samlalanet. Root cause was *not* a regression — the sparkline plots daily `clicks`
  (GA4 affiliate_click), which are uniformly 0 right now; rows with GSC impressions drew a flat zero line,
  and samlalanet (0 impressions, not indexed) had no daily rows at all → empty array → placeholder box.
- change: worker `computeMetrics` now builds the 30-day sparkline from clicks, but falls back to
  impressions when the click series is all-zero, and emits `sparklineMetric: "clicks"|"impressions"`.
  `MiniSparkline` renders a clean `—` when there is truly no signal, and draws the impressions fallback
  in neutral grey + dashed with a hover label so it can't be mistaken for a real clicks trend.
- build: pass — admin typecheck + build green. deploy: REQUESTED — `deploy:admin` (worker + static).
- watch: every row with impressions now shows a (dashed grey) trend; rows flip to green/red solid once
  affiliate clicks arrive. review on: n/a (display fix).


- context: samlalanet was the only site firing `activation`; the other live sites read `—` in the new
  Activ./Action columns. Wire each app's own mid-funnel "aha" so the funnel split works portfolio-wide.
- per-site activation moment (one `kind` each, session-guarded fire, magnitude where one exists):
  - **bastaelcykeln** `benefit_calculated` — first edit of the seeded benefit-bike calc (price slider /
    term buttons / tax select), value = `result.savingTotal`. (`BenefitCalculator.tsx`, `activate()` helper.)
  - **robotdammsugare** `list_filtered` — picked a need-filter off the "alla" default (Husdjur/Lägenhet/
    Stora hem). (`pages/index.tsx`, `selectFilter()`.)
  - **elsparkcyklar** `list_filtered` — picked a need-filter off the "all" default. (`pages/index.tsx`,
    `selectFilter()`.) Homepage only — session guard stops jamfor double-counting.
  - **bilforsakringar** `quotes_shown` — first real quote renders on the poll (not mere submit, since a
    regno with zero quotes isn't value), value = cheapest monthly premium. (`pages/search.tsx`.)
  - **solceller** `roof_estimated` — estimate becomes real (`result.kwp > 0` via address-search or manual
    draw), value = `result.annualSavings`. (`pages/index.tsx`, effect keyed on kWp.)
- registry: added `activation {kind,label}` to all 5 entries (tagstrul left out — externally hosted, own
  repo). Flows through the worker `...site` spread → admin Activ./Action columns + hover, no worker change.
- build: pass — typecheck + build + SSR + prerender green for all 5 apps; admin re-typecheck+build green.
- deploy: REQUESTED — redeploy all 5 sites (`deploy:bastaelcykeln`, `deploy:robotdammsugare`,
  `deploy:elsparkcyklar`, `deploy:bilforsakringar`, `deploy:solceller`) so they emit the event; admin
  already queued. Then `POST /api/cache/clear`.
- watch: per-site activationRate/actionRate populate as each site gets traffic (0/0 → `—` until then).
- spend: 0. review on: 2026-06-29 (+2w, with samlalanet). outcome: _(pending)_

---
- context: follow-up to the mid-funnel entry below — the worker returned activationRate/actionRate but
  no card surfaced them, and "is `kind` shown on hover?" The two ratios split the funnel's failure
  modes, so they belong *in the table*, not just on a tooltip.
- change: added optional `activation {kind, label}` to `SiteRegistryEntry` (`packages/sites`) +
  populated samlalanet (`loan_edited`); flows through the worker's existing `...site` spread (no worker
  change); mirrored on the admin `Site` type. `PropertiesTable` gains two columns between CTR and
  vs-Prev: **Activ.** (activationRate, hover → "label · N activations ÷ M sessions · event
  activation{kind}") and **Action** (actionRate, hover → "clicks ÷ activations"). Both render a dimmed
  `—` when the denominator is 0 (honest on zero-traffic sites). So the activation *description* is
  visible on hover right where its number is.
- build: pass — `apps/admin` typecheck + build green; lint clean.
- deploy: REQUESTED — `deploy:admin` (rolls in with the mid-funnel worker deploy below; same project).
- watch: columns populate on samlalanet once the event flows post-deploy; 0/0 → `—` until then.
- spend: 0. outcome: _(pending admin redeploy)_

---
- hypothesis: the loop only sees the funnel's two ends — impressions (GSC) and affiliate_click (GA4)
  → revenue. The middle (did they land? engage? reach the tool's value?) is dark, so a flat CTR can't
  tell "page doesn't hook them" from "hooked but didn't click out" — two different bets. Closing that
  blind spot lets diagnosis pick the right lever.
- decision (human-approved sketch): one shared `activation` event with a site-defined `kind`, fired
  once per session — shared worker query + dashboard, local meaning. Build Tier 1 (free GA4/GSC
  metrics) + activation plumbing together.
- change:
  1. `@affiliate/analytics` — `ActivationEvent {kind, value?}` + `trackActivation` /
     `trackActivationOnce` (sessionStorage-guarded) + `useTrackActivation(kind)` hook (mount+session
     once-guard). Exported.
  2. admin worker `providers.ts` — `DailyMetric` gains `organicClicks, sessions, engagedSessions,
     engagementDuration, activations` (raw counts, so period rates are sum/sum not avg-of-avg).
     Captures GSC clicks (was discarded); new GA4 reports: `activation` eventCount + sessions/
     engagedSessions/userEngagementDuration. Extracted `ga4RunReport`/`fetchGa4EventByDate` helpers.
  3. admin worker `index.ts` — aggregates the new fields; derives `organicCtr, engagementRate,
     avgSessionDuration, activationRate (activation÷sessions), actionRate (clicks÷activation)`.
     Mirrored in admin `types.ts`.
  4. `apps/samlalanet` `LoanCalculator.tsx` — fires `activation{kind:"loan_edited", value:lostDeduction}`
     on the first real edit of the seeded scenario (row edit/add/remove or either slider).
- build: pass — `samlalanet` typecheck+build+SSR+prerender green; `admin` (incl. worker) typecheck green.
- deploy: REQUESTED — `deploy:admin` (new metrics) + `deploy:samlalanet` (fires the event). After admin
  deploy, `POST /api/cache/clear`. Other sites still emit no `activation` until each wires its own kind
  (follow-up per APP) — they simply read 0, which is honest.
- watch: activationRate + actionRate on samlalanet once it has traffic. Caveat: 0/0 on near-zero-traffic
  sites for weeks — this is plumbing to *read later*, not a number that lights up tomorrow.
- spend: 0. review on: 2026-06-29 (+2w). outcome: _(pending)_

---
- context: human supplied tagstrul.se's gtag.js snippet (measurement id `G-9LLE8S8X4K`). tagstrul is
  externally hosted (own repo/Pages project), tracked in the registry only so it surfaces in the admin
  dashboard. The admin GA4 pull (`affiliate_click` eventCount via the Data API) keys on the **numeric**
  `ga4PropertyId`, not the `G-` id — so the registry entry needed both filled.
- change: resolved the numeric property id from the GA4 Admin API (`ops/list-ga4-properties.ts`):
  `tågstrul.se → G-9LLE8S8X4K → propertyId 541753359` (measurement id matches the snippet). Set both
  `ga4Id` + `ga4PropertyId` on the `tagstrul` entry in `packages/sites/src/index.ts` (was empty). No
  app code: tagstrul's gtag is wired in its own repo; the admin reads the registry.
- build: pass — `apps/admin` typecheck + build green.
- deploy: REQUESTED — `deploy:admin` (worker reads the registry; needs redeploy to pick up the new id).
  After deploy, `POST /api/cache/clear` to bypass the 24h TTL. Caveat: GA4 *clicks* stay 0 until the
  portfolio-wide Data API enablement is done (see 2026-06-15 admin Data-API-disabled entry); GSC
  impressions for tagstrul should appear regardless (it had 105 in that entry).
- watch: tagstrul row in the admin table shows non-zero GSC impressions; clicks once Data API enabled.
- spend: 0. outcome: _(pending admin redeploy)_


- hypothesis: the favicon/logo was a generic vibecoded arrow and there was no `og-image.png` at all
  (`siteConfig.ogImage` → `/og-image.png` 404'd). A coherent mark + a real social card lift shared-link
  CTR and first-impression trust — small, but the OG image is the entire visible payload of any share.
- change (`apps/rantekollen`, surgical, brand-only): redrew `public/favicon.svg` and the header
  `BrandMark` (`Layout.tsx`) as a falling line resolving into a gold check on a baseline ("cost under
  control"). Authored `public/og-image.svg` (source of truth, kept for re-editing) and rasterized to a
  1200×630 `public/og-image.png` via `rsvg-convert` — Calm Ledger palette, the new mark, dated eyebrow,
  serif headline, and the cost→saving motif echoing the on-page diagrams.
- not done / known gap (separate, portfolio-wide bet — not self-applied): `og:image` is emitted as a
  root-relative `/og-image.png`; most scrapers need an **absolute** URL. Same pattern across all 6 sites,
  so fixing it belongs in `@affiliate/seo` (`meta.tsx`) once domains are live, not in this one app.
- build: `typecheck && build` green; verified `dist/og-image.png` ships at 1200×630.
- deploy: REQUESTED — rolls into the rantekollen first-deploy request below.
- watch: link-share CTR / unfurl correctness once the domain is live (validate in a social debugger).
- review on: 2026-06-22 (+7d). outcome: _(pending)_

---

### 2026-06-15 · rantekollen · CTR (hero CRO — qualify before quantify)
- hypothesis: a journey-first review (canvas, persona B = the worried "is this for me?" visitor,
  the traffic driver) found the page jumps straight to the rule + calculator and never answers the
  first three questions in the user's head — "is this for me?", "does my mortgage count?", "what
  date changes?". All three abandon branches fire *above* the calculator, i.e. before the figure
  that monetizes. Closing them above the fold should lift engaged-rate → CTR to the CPA.
- change (`apps/rantekollen`, hero only = `LoanCalculator.tsx`, surgical):
  1. **Qualify line + chip row** above the headline — "Har du privatlån, kreditkort, snabblån eller
     delbetalningar? Då gäller det dig." + ✓ chips for the four covered debt types and an explicit
     ✕ "Bolån påverkas inte" (the mortgage-scope fact was previously buried 3 sections down).
  2. **Date promoted** from a faint eyebrow to a clay pill badge: "Gäller från 1 januari 2026".
  3. **Trust travels with the number**: pinned "Källa: Skatteverket." next to the kr-figure.
  4. **Seeded loans reframed** as "Exempel ifyllt – byt till dina egna belopp och räntor." so the
     pre-filled 3 debts read as a sample to replace, not someone else's data.
- not done (logged for a later, separate bet): _(none — chart rebuild folded into this cycle below)._
- build: `bun run --cwd apps/rantekollen typecheck && build` green; confirmed the new qualify/scope/
  date copy is present in prerendered `dist/index.html` (ranks + reassures without JS).
- deploy: REQUESTED — rolls into the existing rantekollen first-deploy request above (still gated on
  Pages project + `*.pages.dev` validation + Finance program before domain/GA4).
- watch: engaged sessions / scroll-past-hero and CTA click-through once live + analytics flowing.
- review on: 2026-06-22 (+7d, CRO window). outcome: _(pending)_

---

### 2026-06-15 · rantekollen · CTR (story diagrams — show, don't tell)
- hypothesis: both story SVGs were static and misleading, so they added no persuasion and risked
  eroding trust. (1) The 30→15→0 diagram shrank the *benefit* circle → reads as "less scary", the
  opposite of the cost message. (2) The consolidation diagram mapped rate→bar-height (read as money)
  with hardcoded 9/19/21→7.5 bars that never moved with the user's input. A chart that doesn't reflect
  the user's own situation tells; it doesn't show.
- change (`apps/rantekollen`): introduced a tiny external store (`src/lib/loanStore.ts`,
  `useSyncExternalStore`) so the calculator publishes its live `result`; the prerendered diagram
  sections (page-tree siblings, not descendants) subscribe — `getServerSnapshot` returns the seeded
  example so the static HTML stays populated for SEO/no-JS. Rewrote both as pure fns of `LoanResult`
  in real kr: **CostDiagram** = your annual interest as one bar with the now-gone 30 % refund slice
  struck through (calls out *your* `lostDeductionPerYear`); **ConsolidationDiagram** = annual interest
  in kr today (clay) → at target rate (teal), height = money, gap = the saving. Both update live as
  the user edits loans/sliders. Updated section captions to match.
- build: typecheck + build green; verified the live labels ("försvinner 2026", "du betalar ändå",
  "samlat · …") prerender into `dist/index.html` from the seed snapshot.
- deploy: REQUESTED — same rantekollen first-deploy request.
- watch: same CRO signals (scroll-depth past the story sections, CTA CTR).
- review on: 2026-06-22 (+7d). outcome: _(pending)_

---
- hypothesis: both sites had `ga4Id` (tag fires) but empty `ga4PropertyId`, so the admin
  worker's GA4 Data API pull short-circuits (`if (!site.ga4PropertyId) return`) → permanent
  0 clicks even once deployed + earning. The property id is the admin-side key, distinct
  from the on-site `G-` measurement id.
- change: set `ga4PropertyId` in `packages/sites/src/index.ts` — bastaelcykeln `541669788`,
  solceller `541555572` (human-supplied from GA4 Admin). The 3 already-set ids
  (bilforsakringar/elsparkcyklar/robotdammsugare) were re-confirmed identical to the registry.
- note: solceller's property was labelled "solcellsguiden" by the human but the registry
  domain is `solkalkylatorn.se` — verify `541555572` is the property bound to the
  solkalkylatorn.se data stream (likely an old property name), else admin clicks stay 0.
- build: `bastaelcykeln` + `admin` typecheck green.
- deploy: no deploy needed for this change to take effect in admin — but the admin worker
  still needs its `GOOGLE_OAUTH_*` secrets set (outstanding) before any clicks read non-zero.

---
- hypothesis: site has no GA4 → zero traffic/CTR visibility; can't observe the loop for it.
- change: set `ga4Id: "G-00EELXSM2K"` for bastaelcykeln in `packages/sites/src/index.ts`.
  No app code change needed — `entry-client` already calls `initAnalytics(siteConfig)` which
  loads gtag.js (consent-gated, analytics_storage denied until banner opt-in) via the shared
  `@affiliate/analytics` package. The single shared tag replaces the manual gtag snippet.
- build: `typecheck` + `build` green; confirmed `G-00EELXSM2K` present in bundled `dist`.
- deploy: requested (see open threads) — human runs `bun run --cwd apps/bastaelcykeln deploy`.
- watch / review on: once deployed, confirm GA4 Realtime shows hits after granting consent.

---

**Outstanding deploy requests** (I never deploy; human runs these):
- `apps/admin` — stateless worker (D1 removed). `bun run --cwd apps/admin deploy`, then set
  secrets (`GOOGLE_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN`, `ADTRACTION_API_TOKEN`). Orphaned prod
  D1 `affiliate-admin` (`6b83bfd6-…`, demo data only) safe to `wrangler d1 delete`.
- `apps/bastaelcykeln` — first deploy (new site). Create Pages project (`--production-branch
  production`), `deploy`, add custom domain `bästaelcykeln.se`, submit sitemap. GA4 ID
  (`G-00EELXSM2K`) now wired in the registry (2026-06-15) — no longer blocking.
- `apps/rantekollen` — **first deploy (new site, built 2026-06-13).** Create the `rantekollen`
  Pages project (`--production-branch production`), `bun run --cwd apps/rantekollen deploy`,
  **validate on `*.pages.dev` before buying the domain**. Then apply to a Finance program +
  create the channel → real tracking URL; only then buy `rantekollen.se` + provision GA4.
- SEO/structured-data redeploys: `deploy:solceller`, `deploy:bilforsakringar` (JSON-LD gaps).
- Earlier still-unconfirmed: robotdammsugare/elsparkcyklar/bilforsakringar (CRO + SSG +
  consent/attribution bets), admin worker (live metrics). Confirm what actually shipped.

**Open escalations** (do not self-approve — human decision):
- **Next site go/no-go:** ✅ RESOLVED 2026-06-13 — green-lit + built as `rantekollen` (Räntekollen).
  Now an outstanding deploy request (above) + the Finance program application below.
- **Adtraction Finance program (rantekollen):** apply to Plus1 (1271269079, ~2000 SEK), Sambla
  (1923302868, ~1035), Advisa (1923306188), or Lendo (1060519341, 400); read strict brand-bidding/
  deeplink/anchor terms; create the rantekollen.se channel → drop tracking URL into its affiliates config.
- **Adtraction program approvals:** 4 channels exist (ids below); programs (Hemsol, E-Wheels,
  Elon, Evobike, Tjänstetorget, Compricer, finance brokers) need per-program apply → tracking
  URLs → drop into `apps/*/src/config/affiliates.ts`. Until then RPC=0 (correct).
- **Create bilförsäkringar Adtraction channel** (not in first batch), set id in registry.
- **Solar monetization path:** v1 redirect (Compricer-class) vs v2 own-and-sell-the-lead
  (bilforsakringar already stores leads in KV; solceller has pre-qualified roof leads).
- **Domain purchase** for any new site (per-domain ~150 SEK pattern).

**Adtraction channel ids** (registry `adtractionChannelId`, 1:1 with site):
solkalkylatorn `2084568833` · bästaelcykeln `2084572353` · bästaelsparkcykeln `2084572371` ·
bästarobotdammsugare `2084572390` · bilförsäkringar _(channel not created yet)_.

**Pending reviews** (SEO bets — don't judge before the date):
- 2026-06-27 — rantekollen launch (new site): once deployed + a Finance program approved, first
  >0 impressions on the ränteavdrag-2026 long-tail; calc-start → CTA-click rate.
- 2026-06-24 — IDN sitemap punycode + SSG prerender (all 3 public sites) + solceller launch:
  first **>0 impressions** on elsparkcyklar + robotdammsugare (both at 0); pages move to Indexed.
- 2026-06-26 — solceller BRF segment; bastaelcykeln launch; GSC sitemaps submitted.
- 2026-07-10 — structured-data rich-result coverage (solceller villa/brf, bilforsakringar home).
- 2026-06-19 — CRO: elsparkcyklar+bilforsakringar redesign; solceller editable multi-roof.
- 2026-06-17 — foundation (consent/attribution), robotdammsugare images, admin live metrics.

**Structural facts** (recurring context):
- Portfolio RPC is **structurally 0** until real affiliate URLs replace placeholders.
- `billigastebilforsakringen.se` is an **aged/previously-owned** domain (stale 2012 sitemap from
  prior owner) — only site with impressions; worth a spam/penalty sanity check.
- All sites are native-Vite-SSG prerendered (crawlable HTML); admin is private (no SEO).

---

## Spend ledger

| Date | Site | Channel | Amount (SEK) | Note |
|------|------|---------|--------------|------|
| 2026-06-15 | rantekollen | domain | ~150 | Bought `samlalanet.se` (.se, ~1yr; confirm exact amount). Replaces the taken `rantekollen.se` placeholder. |
| 2026-06-12 | solceller | domain | ~150 | Bought `solkalkylatorn.se` (.se, ~1yr; confirm exact amount). |

Monthly cap: `<SET_SEK>` SEK. ROAS target: revenue ≥ 1.5× spend / 30d.

---

## Notes for the Playbook (candidates — promote in CLAUDE.md on confirmation)

- **Pattern (candidate):** interactive sourced free-tool in a high-intent niche beats a thin
  comparison page for a zero-authority domain (solceller draw-your-roof; bastaelcykeln
  förmånscykel-kalkylator). Two builds, no ranking data yet — confirm at review.
- **Anti-pattern (candidate):** `vite-react-ssg` is incompatible with react-router v7 (expects
  the removed `react-router-dom/server.js` subpath). Use native Vite SSG prerender instead.

---

## Bets & deploy requests (newest first)

### 2026-06-15 · admin + portfolio · measurement (OPS: GA4/GSC metric expansion — proposal) — ESCALATED
- context: GA4 click pipeline now live (clicks rendering after the Data API fix). Question: what else
  is worth fetching/instrumenting? Thought it through against the loop (`profit = traffic × CTR × RPC`)
  and what the sites already emit (`page_view`, `affiliate_click`) + what GA4 auto-collects (sessions,
  engagementRate — free, no instrumentation). Conclusion below; ranked by leverage ÷ effort.
- **Core finding (the real bug, not a nice-to-have):** the dashboard's "CTR" = `affiliate_click ÷
  GSC-impressions`. That conflates two different stages into one mislabeled number and blinds the
  CLAUDE.md diagnostic table (can't tell "high impressions, low CTR / snippet problem" from "lands but
  doesn't convert / CRO problem"). They need different bets. Must split into:
  - **SERP CTR** = GSC clicks ÷ GSC impressions ("is the snippet compelling?")
  - **Landing→action** = affiliate_click ÷ GA4 sessions ("does the page convert?")
- **Tier 1 — free, stop discarding data we already fetch (do first):**
  1. **GSC `clicks`** — `fetchSearchConsoleImpressions` (providers.ts ~200-208) reads `impressions` +
     `position` but **throws away `row.clicks`**, which GSC returns in the SAME response. Add it →
     real SERP CTR + true top-of-funnel volume. ~3-line change.
  2. **GA4 `sessions` + `engagementRate`** — auto-collected by GA4; one extra metric in the existing
     `runReport`. Enables landing→action conversion + an engagement/quality proxy (bounce inverse).
- **Tier 2 — one new event, the funnel's missing rung:**
  3. **`tool_engaged` / `calc_complete`** event from the calculator islands (samlalanet `LoanCalculator`,
     solceller `RoofMap`, bastaelcykeln `BenefitCalculator`). Without it we can't separate "didn't
     engage the tool" from "engaged but didn't click CTA" — the difference between a hero-clarity bet
     and a CTA/offer bet. These are tool-first sites, so this is THE activation metric. Add to
     `@affiliate/analytics` events.ts (typed) + fire once per session on first meaningful interaction.
- **Tier 3 — skip for now (not worth the noise yet):** scroll depth; GA4 placement-level outbound
  breakdown (the `epi` sub-id already carries site/placement/link for Adtraction revenue attribution —
  GA4 placement is redundant until click volume justifies it).
- effort: Tier 1 ~10 lines in providers.ts + types/columns; Tier 2 one shared event + 3 island call
  sites + a worker metric + admin column. No new infra. build-then-escalate (worker + new events +
  shared pkg = same gate as a deploy per CLAUDE.md).
- decision needed (human): approve scope. Recommend **Tier 1 now** (near-free, fixes the mislabeled
  CTR — the actual diagnostic blocker), **Tier 2 next cycle** (needs site redeploys anyway), Tier 3 no.
- spend: 0. outcome: _(pending go/no-go on scope)_

### 2026-06-15 · admin · measurement (ROOT CAUSE: 0 clicks for ALL sites → GA4 Data API disabled)
- symptom: admin dashboard shows **0 clicks / 0.00% CTR for every site**, even ones with live GSC
  impressions (bilforsakringar 262, tagstrul 105, elsparkcyklar 5). So GSC + Google auth work but
  the GA4 click path returns nothing across the board — not a per-site config issue.
- debug (local, service-account key + the worker's exact query): reproduced `fetchGa4Clicks`
  (`affiliate_click` eventCount by date) against all 6 properties → **every one returns HTTP 403
  "Google Analytics Data API has not been used in project 692636111897 (affiliate-machine-ops) before
  or it is disabled."** The Admin API (`analyticsadmin`) IS enabled (list-ga4-properties works); the
  **Data API (`analyticsdata`) is NOT**. In the worker `fetchGa4Clicks` is wrapped in `safe()`, so the
  403 is swallowed → silent 0 clicks. The report query itself is correct (event name `affiliate_click`
  matches `@affiliate/analytics` events.ts). CTR math is correct (clicks/impressions); it's 0 only
  because clicks is 0.
- two stacked bugs found:
  1. **(blocker, all sites)** GA4 Data API disabled in the Cloud project. **Human action (Console,
     not code):** enable at
     https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview?project=692636111897
  2. **(samlalanet only)** `ga4PropertyId` was empty in the registry → would stay 0 even after (1).
     Real id from the Admin API = **541744114**.
- change: set samlalanet `ga4PropertyId: "541744114"` in `packages/sites/src/index.ts`. (Wrote a
  temporary `ops/debug-ga4-clicks.ts` probe to diagnose; deleted after — safe to recreate from this
  entry if needed: it JWT-signs the SA key for `analytics.readonly` and runs the worker's report.)
- build: admin typecheck green.
- still needed (human): (a) enable the Data API (link above); (b) the admin worker still needs its
  `GOOGLE_OAUTH_*` secrets set + deploy (long-outstanding); (c) `POST /api/cache/clear` to bypass the
  24h TTL after enabling. Note also: real clicks may stay near-0 until deployed sites get traffic +
  analytics consent (events are consent-gated).
- known property ids (Admin API, 2026-06-15): elsparkcyklar 538294765 · robotdammsugare 540580334 ·
  bilforsakringar 540543812 · solceller 541555572 · bastaelcykeln 541669788 · samlalanet 541744114.
- outcome: _(pending human: enable Data API + worker secrets/deploy)_

### 2026-06-15 · rantekollen · CTR (above-fold declutter — one focal point)
- hypothesis: the hero had too many competing focal points (two big colored numbers + a qualifier
  paragraph on the left; inputs + 2 sliders + a 3-stat summary row on the right) → "where do I look?"
  → diluted attention before the CTA. The page thesis (APP.md) is **one** hero: the clay "what it
  costs you" number; everything else should be secondary.
- change (surgical, CRO; no logic change): in `LoanCalculator.tsx` — (1) trimmed the qualifier to a
  single quiet line (H1 + tool already state who it's for); (2) demoted the "Du kan spara …/mån" line
  to small muted text so it supports, not competes with, the clay hero; (3) **moved the 3-stat row
  (Total skuld / Snittränta / Räntekostnad) below the CTA** as reference detail, leaving the input
  card as one clean task (loans → sliders → one CTA). Verified visually on the dev server.
- build: pass — typecheck+build+SSR+prerender green. (2 pre-existing accent-var lint warnings on the
  sliders left untouched — not mine.) deploy: rolls into the pending rantekollen first deploy. spend: 0.
- watch: calc-start → CTA-click rate once live. review on: 2026-06-22 (+7d, CRO window).
- outcome: _(pending deploy + traffic)_

### 2026-06-15 · rantekollen · compliance (consumer-credit risk warning — konsumentkreditlagen måttfullhet)
- context: finance/credit marketing in SE is governed by konsumentkreditlagen (2010:1846) +
  Konsumentverket KOVFS — marketing must be **måttfull** and not push ill-considered borrowing. The
  site already had: affiliate disclosure ("annonssamarbete") on CTA/footer/FAQ, `rel="nofollow
  sponsored noopener"`, estimate-not-a-quote disclaimer, GDPR consent + zero PII, sourced claims.
  **Gap:** no standardized credit-risk warning (the line every compliant SE lender/broker shows).
- change (surgical, copy-only, Calm Ledger tone — muted clay, no fearmongering):
  - `LoanCalculator.tsx`: risk band directly under the CTA — "Att låna pengar kostar. Kan du inte
    betala tillbaka i tid riskerar du en betalningsanmärkning. Samla bara lån om den nya räntan och
    de totala kostnaderna faktiskt blir lägre – jämför alltid effektiv ränta."
  - `Layout.tsx` footer Transparens: "...Om du inte kan betala tillbaka i tid riskerar du en
    betalningsanmärkning. Samla bara lån när den nya räntan och de totala kostnaderna blir lägre.
    Vi är inte kreditgivare och lämnar inga lånelöften." (clarifies publisher-not-lender role.)
- build: pass — typecheck+build+SSR+prerender green; verified **both** warning variants render into
  the static `dist/index.html` (crawlable, present without JS — the calculator SSRs, not lazy).
- caveat: I'm not a lawyer; this is the expected restraint element, not a full legal sign-off. A SE
  jurist should review the page before scaling paid spend on a finance property (flagged to human).
- deploy: rolls into the pending rantekollen first deploy (see entry above). spend: 0.
- outcome: n/a (compliance hardening).

### 2026-06-15 · rantekollen · cost+measurement (domain bought `samlalanet.se` + migrated + GA4 wired)
- context: human approved + **bought `samlalanet.se`** (the recommended domain from the same-day
  scout below; the old `rantekollen.se` placeholder was already registered by a third party). GA4
  data stream created for `https://samlalanet.se` (measurement id `G-EV861Z80HV`, stream 15077220342).
- change: migrated the dead placeholder everywhere it was live —
  - `packages/sites/src/index.ts`: `domain` `rantekollen.se`→`samlalanet.se`; set `ga4Id:
    "G-EV861Z80HV"`; refreshed the registry comment. Brand name kept as **"Räntekollen"** (referee
    brand survives the descriptive URL; title now renders `… | Samlalanet.se` via `domainBrand`).
  - `apps/rantekollen`: `public/sitemap.xml` + `public/robots.txt` loc/Sitemap → samlalanet.se;
    `config/affiliates.ts` channel comment. Canonical/OG derive from `siteConfig.domain` (no edit).
  - No app code change for GA4 — `entry-client` already calls `initAnalytics(siteConfig)` (shared
    `@affiliate/analytics`, consent-gated gtag.js); the registry `ga4Id` is the only wiring needed.
- build: **pass** — `apps/rantekollen` typecheck+build+SSR+prerender green; verified `dist/index.html`
  canonical/OG = `https://samlalanet.se/` with **0** stale `rantekollen.se` refs; `G-EV861Z80HV`
  present in client + SSR bundles. Whole-portfolio gate `ops/deploy-all.sh --check` green (6 apps + admin).
- deploy: **REQUESTED** (I don't deploy). Steps for the human:
  1. Create the `rantekollen` Cloudflare Pages project (`--production-branch production`), `bun run
     --cwd apps/rantekollen deploy`, add custom domain `samlalanet.se` + DNS, submit sitemap in GSC.
  2. Provision the GA4 **numeric property id** → set `ga4PropertyId` in the registry (admin click
     attribution short-circuits on empty property id, same gotcha as bastaelcykeln/solceller).
  3. Apply to a Finance program + create the Adtraction channel for samlalanet.se → set
     `adtractionChannelId` + real `trackingUrl` in `config/affiliates.ts` (still placeholder).
- spend: 150 SEK (domain — see ledger). review on: 2026-06-27 (unchanged launch-watch window).
- outcome: _(pending deploy + property id + program approval)_

### 2026-06-15 · rantekollen · cost (DOMAIN SCOUT — placeholder is taken; pick the real domain) — ESCALATED
- trigger: the registry/config placeholder `rantekollen.se` is **not ours and not available** —
  WHOIS `whois.iis.se` shows it registered 2025-10-01 (registrar 1Api/GoDaddy NS, active). So a
  domain decision is forced before launch regardless. Scouted alternatives on hard data.
- method: candidates derived from the two query clusters the page already targets (APP.md) — the
  **action** ("samla lån / samlingslån") and the **catalyst** ("ränteavdrag 2026"); availability
  verified live via IIS WHOIS using **IDNA-correct punycode** (first-pass hand-rolled punycode gave
  false positives — re-verified all IDN labels). `.se` ≈ 150 SEK/yr (matches the solkalkylatorn.se
  ledger line). Scored on: exact-match intent, brand fit (APP.md: "independent referee, not tied to
  one lender"; sells clarity), and the portfolio's own descriptive-EMD pattern (solkalkylatorn.se,
  bästaelcykeln.se).
- availability (verified 2026-06-15, correct punycode):
  - TAKEN: `rantekollen.se` (2025-10-01), `räntekollen.se` (deactivated, 2025-06-02),
    `ranteavdraget.se` (2022), `räntesmart.se` (2019), `lånekollen.se` (2024),
    `lånekalkylatorn.se` (2026-04-19), `samlasmart.se` (2026-02-06), `skuldkollen.se` (2020),
    `rantekoll.se` (2025-08-19).
  - **AVAILABLE**: `samlalanet.se` (xn n/a, ASCII), `samlalånet.se` (xn--samlalnet-b3a),
    `räntekoll.se` (xn--rntekoll-0za), `ranteavdrag2026.se`, `samlalanet.nu`.
- recommendation (ranked):
  1. **`samlalanet.se`** — exact-match for the highest-CPA action query ("samla lånet/samlingslån"),
     evergreen (not dated like ...2026), reads as a brandable tool ("Samla lånet"), ASCII = no IDN/
     punycode/email friction (unlike the å-sites in the portfolio). Best lift×confidence÷effort.
     Defensive add: grab `samlalånet.se` (the å spelling) too if buying, to stop a copycat.
  2. `räntekoll.se` — closest to the built "Räntekollen" brand/H1 (least code churn: name/JSON-LD/OG
     stay almost as-is), independent-referee fit; but IDN (å) friction and weaker exact-match intent.
  3. `ranteavdrag2026.se` — strongest catalyst-keyword match but **self-dating** (dead branding in
     2027) → reject for a domain (it's a great *page/H1*, which we already have, not a brand).
- decision needed (human; new-domain = escalated spend per CLAUDE.md): approve **`samlalanet.se`**
  (~150 SEK) + optional defensive `samlalånet.se`. On approval I'll switch the registry `domain`
  (`packages/sites/src/index.ts`) + `apps/rantekollen` config/sitemap/robots/canonicals from the dead
  `rantekollen.se` placeholder to the chosen domain, re-run the build gate, and write the deploy req.
  NOTE: brand string "Räntekollen" can stay as the product name even on samlalanet.se (referee brand),
  or rename to "Samla Lånet" — flag which you want; I default to keeping "Räntekollen" as the name.
- spend: 0 so far (nothing bought). outcome: _(pending human go/no-go)_

### 2026-06-13 · rantekollen · traffic+RPC (NEW SITE built — samlingslån/ränteavdrag-2026 calculator)
- hypothesis: the highest-RPC niche found (Adtraction Finance: Plus1 2000, Sambla 1035, Lendo 400
  SEK/approved loan) + a dated demand catalyst (ränteavdrag on unsecured loans → 0 from 2026-01-01)
  is best captured the same way solceller captures solar: an interactive, sourced free-tool that
  makes the change *personal and quantified*, then routes the motivated user to the CPA action.
  Incumbents only cover it as static FAQ blurbs → the interactive tool is the moat.
- change: built v1 (green-lit from the 2026-06-13 NEXT-SITE proposal below).
  - new domain pkg `@affiliate/loan-calculator` (pure math, **10 unit tests pass**): total/
    weighted-avg rate, `lostDeductionPerYear = interest × 0.30` (the abolished skattereduktion),
    `annuityMonthlyPayment`, consolidation saving (honest "—" when current rate already beats target).
  - new app `apps/rantekollen` — native-SSG 4-file pattern mirroring solceller: prerendered SEO
    page (H1 + ränteavdrag-2026 explainer wedge + "så funkar samlingslån" + "en ansökan, en UC"
    trust block + FAQ + WebSite/FAQPage JSON-LD in `<head>`), calculator as a **client-only island**
    (`lazy`+`Suspense`, own chunk; rAF count-up respects reduced-motion). "Calm Ledger" theme
    (Fraunces serif + Inter, teal/paper/gold/clay, tabular money). Pre-seeded 3-debt example so a
    result shows pre-input. CTA reuses `buildSubId`/`useTrackClick`, `rel="nofollow sponsored
    noopener"`, annonssamarbete microcopy. **Zero PII** (v1 redirect-only).
  - registered in `@affiliate/sites` (slug `rantekollen`, domain `rantekollen.se`, all integration
    ids empty until provisioned); added to `ops/deploy-all.sh`.
- truth/law: every figure is a labeled estimate from the user's own inputs + sourced rates
  (Skatteverket 30%→0; FI räntetak 22%); binding rate set by the bank. Disclosure on CTA + footer.
- build: **pass** — `apps/rantekollen` typecheck+build+SSR+prerender green; verified `dist/index.html`
  contains the SEO copy + 2 JSON-LD blocks + canonical/title and **not** the calculator markup;
  whole-portfolio gate `ops/deploy-all.sh --check` green (registry change didn't break siblings/admin).
- deploy: **REQUESTED** (I don't deploy). Steps for the human:
  1. Create the `rantekollen` Cloudflare Pages project (`--production-branch production`) and run
     `bun run --cwd apps/rantekollen deploy` — **validate live on `*.pages.dev` before buying a domain**.
  2. Apply to a Finance program in Adtraction (Plus1 1271269079 / Sambla 1923302868 / Advisa
     1923306188 / Lendo 1060519341), read its brand-bidding/deeplink/anchor terms, create the channel
     for rantekollen.se → set `adtractionChannelId` + the real `trackingUrl` in `config/affiliates.ts`.
  3. Only then: buy `rantekollen.se` (~150 SEK, escalated spend) + add custom domain; provision GA4.
- spend: 0 (no domain bought yet — gated on pages.dev validation + program approval).
- watch: once live + a program approved — first >0 GSC impressions on the ränteavdrag-2026 long-tail;
  calc-start → CTA-click rate; then CPA. review on: 2026-06-27 (+2w from first deploy).
- outcome: _(pending deploy + program approval)_

### 2026-06-13 · admin · cost (remove D1; key revenue on Adtraction channelId)
- hypothesis: the admin D1 earned nothing real — `sites` was a synced copy of `@affiliate/sites`
  (drift surface for 6 static rows); `metrics_snapshots` held only seeded random demo data as a
  fallback. Every real number is recomputable live (GSC 16-mo, GA4, Adtraction) and edge-cached 24h.
- change: worker now stateless — imports `sites` from registry (1-based numeric `id` for the
  frontend key); returns empty/zeroed series when creds absent (no fake data). Deleted `db/`,
  `migrations/`, `drizzle.config.ts`, both SQL generators, 4 `.sh` + 2 `.sql`, `db:*` scripts,
  drizzle deps, D1 binding. Registry field `adtractionProgramId`→`adtractionChannelId` (1:1 with
  site, transactions report aggregates all its programs). Fixed `fetchAdtractionRevenue` to v2
  (`api.adtraction.net/v2/partner/transactions/?token=`, body `fromDate`/`toDate`/`transactionStatus:3`/
  `channelId`/`market:SE`; approved→revenue, pending→revenuePending). Updated 5 app `site.ts`,
  `cta-button.tsx`, admin `types.ts`, `APP.md` Decision Log.
- build: pass — tsc clean (admin+worker, sites, 5 apps); vite build green; `wrangler deploy
  --dry-run` bundles with only `env.ASSETS` (D1 gone).
- deploy: REQUESTED (see Open threads). spend: 0 SEK.
- review on: n/a (infra correctness). outcome: _(pending deploy)_

### 2026-06-13 · portfolio · RPC (monetization map + per-site method → `ops/REVENUE.md`)
- hypothesis: every site links to **placeholder** Adtraction URLs → RPC=0. Sites split into two
  shapes we'd wrongly treated identically: **retail/CPS** (robotdammsugare, elsparkcyklar,
  bastaelcykeln) solvable via standard Adtraction; **lead/CPL** (solceller, bilforsakringar,
  bastaelcykeln leasing) which don't monetize via a product link. Solar specifically is owned by
  lead aggregators (Nettbureau/Energify/LeadHive), not Adtraction.
- change: wrote per-site method + v1-redirect vs v2-own-the-lead paths to **[`ops/REVENUE.md`](REVENUE.md)**.
  Code-grounded finding: bilforsakringar already stores every lead in KV (`StoredSearch`, 30-day
  TTL) — an unused lead DB; with solceller's roof leads, both are v2 own-and-sell candidates on
  infra we already run. Recommendation: ship v1 retail links first; pursue lead-sale as escalation.
- build/deploy: n/a (research + doc). Escalations → Open threads (solar path, program shortlist).
- outcome: _(pending human go/no-go)_

### 2026-06-13 · portfolio · traffic+RPC (NEXT-SITE proposal: samlingslån calculator) — DECISION-GATED
- hypothesis (Adtraction v2 API + macro research): Finance is the deepest SE category (89
  programs) and highest-RPC (Plus1 **2000**, Sambla **1035**, Lånekoll 800, Lendo 400 SEK/loan —
  dwarf robot-vac ~240 / solar lead ~170). **Why now:** ränteavdrag for unsecured loans fully
  abolished 1 Jan 2026 → ~+40% effective cost with no rate change → universal "samla dina lån"
  advice = the 1000–2000 SEK CPA action. Head term is contested, but the event-driven long-tail
  ("ränteavdrag borttaget — hur mycket dyrare?") is only static FAQ blurbs at incumbents → an
  interactive calculator is the same moat as solceller. US market assessed + declined (saturated,
  compliance-heavy, shares none of the SE moat).
- bet: new site `samlalanet` — prerendered SEO page + client-only consolidation/ränteavdrag-impact
  calculator; new `domains/loan-calculator` (annuitet + abolished-deduction delta, sourced); v1
  CPA redirect on approval, KV-lead v2 later.
- build/deploy: n/a (new site = escalation; stop for go/no-go). Escalations → Open threads.
- outcome: **GO (2026-06-13)** — human green-lit; built as `rantekollen` (see the build entry
  at top). Name finalized Räntekollen (independent-referee brand) over the `samlalanet` placeholder.

### 2026-06-12 · portfolio · traffic (SEO completeness audit — sitemaps, robots, structured data)
- hypothesis: every public page should ship the full SEO baseline; a portfolio audit catches
  silent gaps that suppress impressions.
- change: audited all 6 apps — 5 public sites confirmed to have robots.txt (ASCII/punycode for
  IDN), sitemap.xml matching prerender routes, `_redirects`, favicon, correct `index.html`; every
  prerendered route emits canonical+meta; bilforsakringar `/s/:id` correctly noindex+disallowed.
  Fixed 3 JSON-LD gaps: solceller/villa (Article+BreadcrumbList+FAQPage), solceller/brf/guide
  (Article+BreadcrumbList), bilforsakringar home (WebSite). Surgical, no markup/style changes.
- build: pass — 5 apps build green; shipped HTML re-verified to contain the JSON-LD. tsc clean.
- deploy: REQUESTED — `deploy:solceller`, `deploy:bilforsakringar`. spend: 0.
- watch: GSC rich-result coverage for the 3 pages; no new crawl errors.
- review on: 2026-07-10 (+4w). outcome: _(pending)_

### 2026-06-12 · bastaelcykeln · traffic (NEW SITE: förmånscykel-kalkylator)
- hypothesis: `bästaelcykeln.se` is owned but empty; a head-on "bästa elcykeln" review race is
  unwinnable. The winnable, monetizable gap is **förmånscykel** (bruttolöneavdrag) — calculator-
  shaped, high intent, current tools vendor-biased/thin. Same tool-as-moat thesis as solceller.
- change: new `domains/bike-benefit` (Skatteverket förmånscykel math, sourced; 7 tests pass,
  estimate-never-quote). New `apps/bastaelcykeln` — prerendered SEO page + `/guide` (JSON-LD that
  ranks without JS) wrapping a client-only `BenefitCalculator` with dual CTA (leasing lead +
  retail commission). Wired registry, tsconfig, provision GA4 category (SHOPPING), deploy scripts.
- build: pass — tsc clean, build green (client+SSR+prerender), shipped HTML verified, tests 7/7,
  portfolio gate green for all 5 sites + admin. spend: 0 (domain already owned).
- deploy: REQUESTED (first deploy — see Open threads). Escalation: new site (self-edit-adjacent).
- watch: bästaelcykeln GSC impressions >0 on förmånscykel long-tail; calculator use → CTA CTR.
- review on: 2026-06-26. outcome: _(pending)_

### 2026-06-12 · portfolio · traffic (GSC sitemaps submitted — standing gap closed)
- hypothesis: no sitemap had ever been *submitted* to GSC for any site (every prior mention was a
  NEXT step never confirmed) — leading suspect for elsparkcyklar+robotdammsugare at 0 impressions.
- change: none in repo — manual GSC work (human). All sitemaps submitted 2026-06-12. Found
  billigastebilforsakringen.se had a **stale 2012 sitemap from a prior owner** ("Couldn't fetch")
  → confirms aged/dropped domain (see Structural facts).
- watch: GSC Sitemaps → Success + discovered URLs; real win = elsparkcyklar+robotdammsugare >0
  impressions. Note: solceller sitemap only submittable once `solkalkylatorn.se` resolves.
- review on: 2026-06-26. outcome: _(pending)_

### 2026-06-12 · solceller · cost (domain `solkalkylatorn.se` purchased — escalation closed)
- `solkalkylatorn.se` bought (human-approved; ~150 SEK in ledger). Registry comment updated.
- NEXT (human): add custom domain on Pages project; DNS-verify + submit sitemap in GSC; provision
  GA4 (`bun ops/provision-site.ts --slug solceller`) + redeploy; apply to a solar program.

### 2026-06-12 · solceller · CTR/UX (editable multi-roof) + GA4 wiring
- hypothesis: the draw-your-roof tool is the differentiator, but the auto OSM boundary couldn't be
  edited (distrust) and single-polygon under-counts complex BRF roofs → wrong kWp → lower CTA
  conversion. Editable + multi-section roofs should lift tool completion → quote-CTA CTR.
- change (RoofMap.tsx): multi-roof model reporting summed area (unchanged contract); draggable
  corner handles + live area recompute + Swedish explainer + auto badge; add/remove/clear roofs
  with a below-map list. SSR-safe island, no new deps. Set solceller `ga4Id: G-L6JJ8BD5QQ` in
  registry (collection only; admin dashboard still needs numeric `ga4PropertyId` + sync).
- build: pass — typecheck clean, build+SSR+prerender green (4 routes).
- deploy: REQUESTED — `deploy:solceller`. Escalation: numeric ga4PropertyId after GA4 collecting.
- watch: tool-completion → quote-CTA CTR on `/brf` and `/`. review on: 2026-06-19 (+7d CRO).
- outcome: _(pending)_

### 2026-06-12 · solceller · traffic (new BRF segment + SEO content)
- hypothesis: GSC shows breakout BRF terms ("solceller brf", "...bostadsrättsförening",
  "batterilagring solceller"); BRF leads carry far higher ticket (400k–1.5M vs villa 80–180k) →
  higher RPC, and no competitor has an interactive BRF roof tool. Expand (not pivot) into BRF +
  add high-intent SEO write-ups for the fat villa head terms.
- change: `solar-calculator` domain gained `brfAssumptions` + `applyMomsavdrag()` (sourced 2026
  figures); new prerendered routes `/brf` (BRF calculator, IMD toggle), `/villa`, `/brf/guide`;
  villa+BRF price tables, lönsamhet + batterilagring write-ups (captures battery breakout), FAQ
  schema, nav/sitemap/cross-links. All claims sourced; estimate-never-quote preserved.
- build: pass — typecheck+build+SSR+prerender green (4 routes).
- deploy: REQUESTED — `deploy:solceller` + resubmit sitemap. watch: GSC impressions on new
  BRF/content URLs. review on: 2026-06-26 (+2w). outcome: _(pending)_

### 2026-06-12 · elsparkcyklar + bilforsakringar · CTR (design/CRO)
- hypothesis: two live sites looked template-grade vs the robotdammsugare bar; a more polished,
  trustworthy editorial design lifts credibility → CTA CTR, lower bounce.
- change: elsparkcyklar — "urban-mobility editorial" identity (charcoal+electric-blue, Geist,
  rewrote CSS+Layout, fixed 6 dangling CSS vars). bilforsakringar — trustworthy fintech look
  (self-hosted Geist, insurance blue, BrandMark, disclosure strip, 3-col footer); form
  logic/API untouched. solceller assessed — already at bar, no change.
- build: pass — typecheck+build green for all three.
- deploy: REQUESTED — `deploy:elsparkcyklar`, `deploy:bilforsakringar`.
- watch: CTR on both (caveat: ~0 GSC impressions until verification clears — don't over-read).
- review on: 2026-06-19 (+7d). outcome: _(pending)_
- note: robotdammsugare `G-2RCY01N8XE` is a GA4 measurement id (not GTM); already wired, tracking
  live, no change needed.

### 2026-06-12 · portfolio · traffic (IDN sitemap punycode + native SSG prerender)
- hypothesis: two compounding traffic bugs. (1) Sitemaps/robots used Unicode IDN hosts
  (`bästa…`, `elsparkcyklar.nu`/`å`) → some crawlers reject non-punycode → discovery loss.
  (2) Apps shipped near-empty `<div id="root">` (client-only React) → crawlers saw no content →
  the most likely cause of elsparkcyklar+robotdammsugare at 0 impressions.
- change: rewrote every public site to **punycode** hosts in sitemap.xml/robots.txt/canonicals;
  added native Vite SSG prerender (entry-server + `prerender.ts`) so each route ships full HTML.
  Rejected `vite-react-ssg` (breaks on react-router v7 — see Anti-pattern candidate).
- build: pass — verified shipped HTML contains real content + correct canonicals for all 3 sites.
- deploy: REQUESTED (rolled into per-site redeploys). watch: Indexed coverage + first >0
  impressions on the two dead sites. review on: 2026-06-24 (+2w). outcome: _(pending)_

### 2026-06-12 · foundation · consent + attribution (GDPR + sub-id) and robotdammsugare images
- hypothesis: before scaling spend/RPC we need (a) lawful analytics (Swedish/GDPR consent) and
  (b) click attribution, or revenue can never be traced to a placement. Separately,
  robotdammsugare shipped with missing/broken product imagery hurting trust → CTR.
- change: `@affiliate/analytics` consent gate + banner (no GA4 before opt-in); affiliate links
  carry an `epi` sub-id (site/page/slot) for Adtraction placement attribution; added hero/product
  images to robotdammsugare with correct dimensions + lazy-loading.
- build: pass — typecheck+build green. deploy: REQUESTED — `deploy:robotdammsugare` + others.
- watch: consent opt-in rate; attribution sub-ids present in Adtraction once links go live.
- review on: 2026-06-17. outcome: _(pending)_

### 2026-06-12 · admin · observability (live metrics worker — GA4 + GSC + Adtraction)
- hypothesis: the loop needs real numbers; a dashboard pulling GSC (impressions/clicks/CTR), GA4
  (sessions/conversions), and Adtraction (revenue) per site makes diagnosis possible.
- change: built the admin worker + `providers.ts` (Google OAuth refresh-token flow, 16-month GSC
  window, GA4 Data API, Adtraction transactions) with a 24h edge cache. `ops/` scripts to mint a
  Google refresh token, list GA4 properties, grant access, provision a site. (This worker was
  later made stateless — see 2026-06-13 · admin.)
- build: pass. deploy: REQUESTED (superseded by the 06-13 stateless redeploy). watch: dashboard
  returns non-zero GSC numbers for billigastebilforsakringen. review on: 2026-06-17.
- outcome: _(superseded; redeploy as stateless)_

### 2026-06-12 · portfolio · baseline (repo bootstrap + first observation)
- Established the operating model (CLAUDE.md loop + guardrails), the apps/domains/packages
  architecture (ARCHITECTURE.md/PHILOSOPHY.md), and `@affiliate/sites` as the single registry.
- First observation: only `billigastebilforsakringen.se` (aged domain) shows GSC impressions;
  all greenfield sites at 0. Portfolio RPC structurally 0 (placeholder affiliate URLs). These two
  facts seed the Structural facts block at the top.


### 2026-11-27 · solceller · security (lock down public GET /leads)
- finding: `GET https://api.solkalkylatorn.se/leads` returned HTTP 200 with no auth: every stored
  lead's email + address was publicly readable (GDPR exposure).
- change: `apps/solceller/worker/src/index.ts` — `/leads` now 404s unless `LEADS_ADMIN_TOKEN` is
  set, and then requires `Authorization: Bearer <token>`. POST `/lead` unchanged.
- build: worker typechecks (only pre-existing error is the app's missing `three` types in a fresh install).
- deploy: REQUESTED — from the local clone (its uncommitted wrangler.toml holds the LEADS KV id):
  `cd apps/solceller && bun run worker:deploy`. Expected: `/leads` → 404.
- note: new read-only tool `ops/pull-site-insights.ts` (GSC queries/pages + GA4 events). Flagged per
  self-development rule; output is gitignored.
