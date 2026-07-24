# bilforsakringar — Decision Log (data-grounded)

Site-local, append-only memory for `billigastebilforsakringen.se`. Newest entries
at the top. Every bet here must trace to a number in `docs/data/` (the GSC export)
or a later GSC/GA4 pull. The portfolio-wide loop and guardrails live in the root
[`CLAUDE.md`](../../../CLAUDE.md); the portfolio memory is [`ops/JOURNAL.md`](../../../ops/JOURNAL.md).
This file is the *zoomed-in* record for this one site so its insights compound.

Entry format:

```
### <date> · <lever: traffic|CTR|RPC|cost> · <title>
- evidence / hypothesis / change / build / deploy / watch / review on / outcome
```

---

### 2026-06-16 · traffic · Internal-link the orphaned best-ranking wedge page
- evidence (Queries.csv): `/basta-bilforsakring-2026` targets the only terms we
  already rank page 1-2 for despite zero domain authority —
  `billigaste bilförsäkring sverige 2026` **p19**, `bästa bilförsäkringen 2026`
  **p50** — vs. the head terms owned by funded aggregators (`jämför bilförsäkring`
  p75, unwinnable short-term). Yet that page was an **orphan**: no internal link
  pointed to it (only the sitemap). Site avg position 76.8, 0 clicks.
- hypothesis: internal linking is the one ranking lever fully in our control (no
  backlinks/authority needed). Surfacing the best-ranking page from the
  highest-authority surfaces (home + site-wide nav) with keyword-rich anchor text
  channels link equity to the page closest to page 1, and helps Google understand
  which long-tail intent we serve. Expect the p19/p50 terms to climb first; head
  terms lift later as a byproduct.
- change (surgical, internal links only — no content/price changes):
  1. Home: added in-content link to `/basta-bilforsakring-2026` (anchor
     "billigaste och bästa bilförsäkringen 2026") + link to `/forstagangsbil`.
  2. Nav (`site.ts`): added "Billigast 2026" → `/basta-bilforsakring-2026` so
     every page links to it.
  3. Cluster cross-links: `/jamfor` → wedge (descriptive anchor); wedge → `/jamfor`
     + `/guide` (descriptive anchors). Reciprocal cluster interlinking.
  Verified the link ships in prerendered `dist/index.html` (server-side, crawlable).
- build: pass (tsc + client/SSR/prerender green, 14 routes prerendered). No deps.
- deploy: request written in `ops/JOURNAL.md`, awaiting human approval.
- watch (GSC, `/basta-bilforsakring-2026` + the two wedge queries): position trend.
  SEO latency → review on: **2026-07-07** (3 wks). Do not judge sooner.
- outcome: _(pending)_

---

### 2026-06-16 · CTR/RPC · Honest price anchoring on results (more brands, no fake quotes)
- evidence/idea (operator): the live results only show the 2-3 brands that
  return a scrape (Gjensidige 289, If 318; Trygg-Hansa fails intermittently).
  Proposal was to add the missing brands as dummy quotes priced *above* the real
  ones so users click the cheaper real options.
- guardrail call (REJECTED the dummy-price form): fabricating firm kr/mån numbers
  next to real scraped quotes = misleading price claims (CLAUDE.md truthfulness
  rule + marknadsföringslagen). Intentionally inflating them to steer clicks makes
  it indefensible. Did NOT build that.
- what shipped instead (honest anchoring, allowed CRO): `QuoteResults` now renders
  brands without a live quote as **clearly-labelled "Indikativt prisspann · ca
  X–Y kr/mån*"** cards — dashed/muted styling, no firm price, "* inte en offert"
  disclaimer, CTA "Hämta exakt pris" (real provider site, `epi`-tracked,
  rel=sponsored). Ranges come from `content.ts` (already illustrative) and top out
  (700–740) above the live quotes, so the cheap real prices still read as the win.
  Anchoring effect kept; fabrication avoided.
- build: pass (tsc + client/SSR/prerender green). deploy: rides the cluster deploy
  request in `ops/JOURNAL.md`. No new deps.
- note: deferred adding Folksam/LF as *live* providers — each is a brittle
  reverse-engineered private API (capture needs real pnr, may be BankID-gated) and
  it's downstream of the real leak (0 clicks @ p76). Revisit once traffic arrives.
- watch: GA4 `affiliate_click` by placement (`results_indicative` vs `results_cta`)
  — does showing more brands lift total outbound clicks without cannibalising the
  real-quote CTAs? review on: 2026-06-23. outcome: _(pending)_

---
- evidence (manual test, screenshots): the quote flow works but the live scrape
  (Browser binding for `if`, + a `trygghansa` failure waiting out its timeout)
  takes ~30–45s. Tester read the frozen-looking spinner as "no quote retrieved"
  and nearly abandoned. Quotes already stream in per-provider (Gjensidige 289,
  If 318 rendered incrementally) — so the leak is *perceived* latency, not the
  scrape itself.
- hypothesis: setting expectation ("tar oftast 30–45 sekunder") + a visible
  elapsed-seconds counter makes the wait read as progress, cutting abandons on
  the conversion step. Cheapest possible fix — no scrape re-architecture.
- change (`src/pages/search.tsx` only): elapsed-seconds ticker while
  `status !== complete`; expectation copy under the provider-progress header and
  under the empty "Väntar på första offerten" state.
- build: pass (tsc + client/SSR/prerender green). deploy: bundled with the
  cluster deploy request in `ops/JOURNAL.md`. No new deps.
- watch: GA4 `quotes_shown` activation rate vs `/quote/start` calls (abandon during
  wait). Bigger lever if abandons stay high: speed up the scrape / drop the slowest
  provider from the blocking set. review on: 2026-06-23.
- outcome: _(pending)_

---

The numbers that anchor every bet below. Source: Search Console export.

| Metric | Value | Source file |
|--------|-------|-------------|
| Impressions (total) | 262 | `Pages.csv`, `Chart.csv` |
| Clicks (total) | **0** | all files |
| CTR | 0% | all files |
| **Avg position** | **76.8** | `Pages.csv` |
| Indexed pages with impressions | **1** (`/` only) | `Pages.csv` |
| Distinct queries | 72 | `Queries.csv` |
| Mobile share | 177 / 262 = **68%** | `Devices.csv` |
| Sweden share | 233 / 262 = **89%** | `Countries.csv` |

### Findings (what the data proves, not what we assumed)

1. **The leak is POSITION, not snippet, not conversion.** Avg position 76.8 = page
   ~7-8. CTR at that depth is ~0% for everyone. So 0 clicks is *expected*, and
   rewriting titles/meta alone cannot fix it. The real lever is climbing to page
   1-2. (This overturned an initial "fix the snippet/CTR" hypothesis.)
2. **Demand is 100% wide-market head terms.** All 72 queries are generic
   comparison/cheap intent (`jämför bilförsäkring` 39 impr, `billig bilförsäkring`
   14, `billigaste bilförsäkringen` 8…). The head term `jämför bilförsäkring` sits
   at position 75.
3. **No niche signal in the data (yet).** Zero vehicle-name queries, zero
   first-time / "ung förare" queries, zero "efter ägarbyte" queries. An audience
   niche is therefore a *speculative* bet, not a data-backed one — Google can't
   show us for intent we have no page for (chicken-and-egg).
4. **The one bright spot = long-tail "2026 / billigaste" specificity.** These rank
   far better than the 76.8 average:
   - `billigaste bilförsäkring sverige 2026` → **position 19** (page 2)
   - `bilförsäkring billigast jämför` → position 44
   - `bästa bilförsäkringen 2026` → position 50
   - `billigaste bilförsäkringen` → position 59
   A zero-authority domain can crack page 1-2 on these long-tails; the head terms
   are owned by funded aggregators (Compricer/Insplanet/Zmarta) and are unwinnable
   short-term. **Win the long tail first; the head lifts as a byproduct.**
5. **Mobile-first is mandatory.** 68% mobile. The old home page was a personnummer
   wall — especially punishing on mobile and a likely engagement killer even if
   traffic arrived.

### Strategic stance (resolves "niche vs. wide?")

Not either/or. **Build the wide comparison shell (it matches 100% of demand) and
wedge in on the long-tail "billigaste/bästa bilförsäkring 2026" specificity where
we already rank ~p19.** Add ONE explicitly-fenced first-time/young-driver cluster
as an experiment to *generate* its own demand signal (own URL path so its GSC
trend is cleanly attributable). Decision: human-approved 2026-06-15.

### Guardrail for this site

Truthfulness: we do **not** publish specific per-company prices as fact. Prices are
shown as clearly-labelled illustrative ranges with a "get your live price" CTA.
Coverage facts (trafik/halv/hel scope) are real and sourced from the
`insurance-providers` domain + Swedish law (trafikförsäkring is mandatory).

---

## Bets (newest first)

### 2026-06-15 · traffic+CTR · Content cluster: wide shell + long-tail "2026" wedge + first-time experiment
- evidence: baseline above — 262 impr / 0 clicks / pos 76.8 / 1 indexed page; best
  ranking on long-tail "...2026"/"billigaste" terms (p19-59); 68% mobile.
- hypothesis: one thin gated page at p76 can't earn clicks. Giving Google a real
  crawlable comparison cluster (depth + internal links + fresh "2026" framing on
  the exact long-tails we already rank for) lifts position into the click zone,
  and de-gating the tool removes the mobile conversion wall for traffic that lands.
- change (one coherent cluster, surgical to this app):
  - Rebuilt `/` so comparison content (coverage table, how-it-works, FAQ) renders
    above/around the tool; personnummer no longer demanded up front (mobile-first).
  - New crawlable pages: `/jamfor` (wide comparison hub), `/basta-bilforsakring-2026`
    (long-tail wedge — the p19 term), `/forsakringsbolag` (per-company hub),
    `/guide` (buyer's guide). Experiment cluster (fenced): `/forstagangsbil`
    (first-time / young-driver) — its own path for clean GSC attribution.
  - Legal/info (closes dead-nav + GDPR gap): `/integritetspolicy`, `/om-oss`, `/kontakt`.
  - All routes prerendered (crawlable HTML), added to `sitemap.xml`, each emits
    canonical + per-page title/meta + JSON-LD (FAQPage / BreadcrumbList / ItemList).
  - Content single-sourced in `src/config/content.ts`; prices = illustrative ranges
    only (truthfulness guardrail), real coverage facts.
- build: pass — tsc clean; client+SSR+prerender green (14 routes prerendered);
  shipped HTML verified to contain real content + BreadcrumbList/FAQPage JSON-LD +
  canonical on the wedge page; FAQ answers present in DOM even when collapsed
  (sr-only) so they're crawlable. No new deps.
- deploy: REQUESTED — see `ops/JOURNAL.md` deploy request (no self-deploy).
- watch (GSC, this site): (1) indexed pages 1 → ~9; (2) avg position on the
  "...2026"/"billigaste" long-tails moving p19→top-10; (3) first clicks > 0;
  (4) does `/forstagangsbil` earn ANY impressions on first-time/ung-förare queries
  (the niche signal we currently lack). Mobile engagement on `/`.
- review on: 2026-06-29 (+2w, SEO latency per CLAUDE.md). outcome: _(pending)_

---

## Open questions / next data to pull

- Full GSC export refresh at review: did long-tail positions move? Did
  `/forstagangsbil` create first-time-owner impressions (validate/kill the niche)?
- RPC is still structurally 0 — quote-result CTAs link to bare `https://www.{provider}.se`
  with no affiliate link or `epi` sub-id. Wiring real affiliate URLs is an
  escalation (program approvals), tracked portfolio-side; noted here so the leak
  isn't forgotten once a program is approved.
