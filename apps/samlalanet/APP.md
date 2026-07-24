# App: rantekollen  *(BUILT — gate green; awaiting deploy approval, see `ops/JOURNAL.md` 2026-06-13)*

> **Räntekollen** — an interactive "what does the 2026 ränteavdrag removal cost you?"
> calculator. The user adds their unsecured loans (privatlån, kreditkort, smslån,
> delbetalning — **no personal data**), and we instantly show two numbers: the extra
> kronor/year the abolished interest deduction now costs them, and the kronor/month they'd
> save by consolidating to a lower rate. Then we hand off to a samlingslån förmedlare
> (Sambla/Lendo/Advisa). Static — no Worker. Mirrors the proven `solceller` shape.

The differentiator: incumbents (Sambla, Lendo, Compricer, plus affiliate blogs) cover
"samla lån" as static comparison/SERP content and the 2026 deduction change as a buried
FAQ blurb. Räntekollen is the only Swedish tool that makes the *fresh, dated tax change*
personal and quantified, then routes the motivated user to the CPA action. The 1 Jan 2026
removal of ränteavdrag on unsecured loans is the **one-time demand catalyst** (effective
borrowing cost up to ~+40% with no rate change; Skatteverket).

## Mission & positioning

"See in 30 seconds how much the 2026 tax change costs you on your loans — and whether
consolidating saves money." We sell **clarity/relief**, not a loan. Brand is the
**independent referee**: calm, plain-spoken, trust-first, anti-payday-loan. Räntekollen =
"the interest check" — deliberately not tied to one lender's brand.

## Audience (priority order)

- **A — multi-debt juggler** (primary, highest CPA value): 30–50, 3–6 separate debts at
  18–25%, feels the squeeze, never added it up. The 2026 change is the trigger. Exactly
  who a consolidation lender approves and pays 1000–2000 SEK for.
- **B — worried single-loan owner** (volume): heard the news, asks "how much more will
  this cost me?". Informational; we answer, then plant the consolidation seed.
- **C — proactive optimizer** (low volume, clean credit, easy approval).

Design serves B's fear first (the traffic) and converts the A-subset (the money) with the
same inputs. Emotional job-to-be-done: turn diffuse money-anxiety into one answerable
question — and answer it.

## User journey

`[1] Frame (the question, prerendered) → [2] Input (add your loans, zero PII) →
[3] Reveal (cost ↑ in clay, saving ↓ in gold — the hero, counts up) → [4] Act (CTA appears
only after a result: "Jämför hos Sambla/Lendo")`. Pre-seed a realistic example so a working
answer shows before any input (show value first, à la solceller's auto-drawn roof).

## Composition (built — proven native-SSG pattern)

- **React Router** (`BrowserRouter`) under a shared `Layout` (`src/components/Layout.tsx`),
  single route `/` → `src/pages/index.tsx`. Entries: `entry-client.tsx` (hydrate) +
  `entry-server.tsx` (renderToString) + `prerender.ts` (writes `dist/index.html`).
- The page **prerenders fully** (H1, **ränteavdrag-2026 explainer** (the SEO wedge), "så
  funkar samlingslån", "en ansökan, en UC" trust block, FAQ, WebSite + FAQPage JSON-LD in
  `<head>` via react-helmet-async) so it ranks without JS. Verified: SEO copy is in
  `dist/index.html`, the calculator markup is not.
- The **calculator is a client-only island** (`src/components/LoanCalculator.tsx`): state +
  sliders + a `prefers-reduced-motion`-aware count-up (rAF/matchMedia touch `window`), `lazy`
  + `Suspense` so it never enters the SSR/prerender pass and splits into its own chunk —
  same discipline as solceller's `RoofMap`.
- Business math lives in the **`@affiliate/loan-calculator`** domain pkg
  (`domains/loan-calculator`, 10 unit tests green), never in the app: weighted-avg current
  cost, the abolished-deduction delta (Skatteverket 30%→0 on unsecured), `annuityMonthlyPayment`
  for the consolidated loan, monthly/total/annual saving. Same shape as `@affiliate/solar-calculator`.
- Config: `src/config/site.ts` (name/domain/SEO/nav; GA4/GTM read from the registry, empty
  until provisioned), `src/config/affiliates.ts` (the förmedlare CPA card; **placeholder
  tracking URL** until a Finance program is approved — the only money surface).
- Consumes `@affiliate/analytics`, `@affiliate/seo`, `@affiliate/sites`, `@affiliate/loan-calculator`.

## Visual system — "Calm Ledger"

- **Canvas:** warm off-white / paper (not stark white).
- **Primary/trust:** deep teal-navy (CTA, headline accents) — banking trust, modern not cold.
- **Accent/"your saving":** warm gold/amber — used *only* for the positive saving number + CTA hover.
- **Caution:** muted terracotta/clay (never pure red) for the "+X kr/år you now pay" figure.
- **Rule:** ≤2 saturated colors on screen at once; restraint *is* the trust signal.
- **Type:** editorial serif display (distinct from solceller's geometric sans); **tabular
  figures** for all money; airy line-height. **Motion:** calm; the headline number counts up
  (~600ms) as the one flourish; respect `prefers-reduced-motion`.

## Money & truth

We only **estimate** from the user's entered loans + sourced typical rates; the **binding
rate always comes from the bank/förmedlare** — we never quote. v1 monetization = **redirect**
to a samlingslån förmedlare (standard CPA, ships on approval): Sambla (programId 1923302868,
~1035 SEK CPA), Lendo (1060519341, 400 SEK), Advisa (1923306188), Plus 1 (1271269079, 2000
SEK/approved loan). Disclosure strip ("Annonssamarbete") + `rel="nofollow sponsored"` on the
CTA; consent banner via `@affiliate/analytics`. CTA microcopy pre-empts the two biggest fears:
"En ansökan, en kreditupplysning (UC), erbjudanden från 40+ banker — utan kostnad, utan köpkrav."

## Guardrails (per CLAUDE.md + Swedish law)

- **Truth:** sourced assumptions, labeled estimates, bank sets the binding rate.
- **GDPR:** the core tool collects **zero personal data**; analytics consent-gated. The PII
  "own-the-lead" v2 is a separate, later, **escalated** build — not in v1.
- **No dark patterns:** ignoring the CTA is as easy as taking it; no fake urgency/countdowns,
  no pre-checked boxes. Responsible tone: we only ever frame *reducing* cost on existing debt,
  never "borrow more."
- **Disclosure:** annonssamarbete on every CTA + footer (marknadsföringslagen).

## Status / what's left before it earns

- **BUILT & GREEN.** `bun run --cwd apps/rantekollen typecheck && build` passes; the
  prerender writes `dist/index.html` with the SEO content + JSON-LD; 10 domain tests pass;
  the whole-portfolio gate (`ops/deploy-all.sh --check`) is green (registry change didn't
  break siblings). Registered in `@affiliate/sites` and added to `ops/deploy-all.sh`.
- **Awaiting human (per the deploy + spend gates):**
  1. **Deploy** to the `rantekollen` Cloudflare Pages project — validate live on
     `*.pages.dev` **before** any domain purchase (deploy gate; a human runs it).
  2. **Apply** to a Finance program in Adtraction (Plus 1 1271269079 ~2000 SEK, Sambla
     1923302868 ~1035 SEK, Advisa 1923306188, Lendo 1060519341) and **create the channel**
     for rantekollen.se — read each program's brand-bidding/deeplink/anchor terms (Finance
     is strict). Then set `adtractionChannelId` in the registry and the **real** `trackingUrl`
     in `src/config/affiliates.ts` (today: placeholder).
  3. **Domain** (~150 SEK, escalated spend) only once the page validates and a program is
     approved; then provision GA4 (`ga4Id`/`ga4PropertyId` in the registry).
- **v2 (later, separately escalated):** the PII "own-the-lead" flow is explicitly **not** in
  v1 — v1 is redirect-only, zero personal data.

## Decision Log

**(2026-06-13): sketch direction locked** — wedge = the 2026 ränteavdrag-removal event
("what does it cost you?"), brand = Räntekollen (independent referee), v1 monetization =
redirect CPA to Sambla/Lendo, palette = Calm Ledger (teal-navy + paper + gold/clay). Niche
chosen on hard evidence: Adtraction Finance is the deepest SE category (89 programs) and pays
the highest in the portfolio (1000–2000 SEK/approved loan), riding a one-time 2026 macro
catalyst. Reuses the validated solceller pattern (prerendered SEO page + client-only
calculator island + CPA CTA). "Beyond Sweden" (US Adtraction, 277 programs) assessed and
declined for v1: most saturated/compliance-heavy market, shares none of the portfolio moat.

**(2026-06-13): built v1** — `@affiliate/loan-calculator` (pure math, 10 tests) + `apps/rantekollen`
(native-SSG 4-file pattern, Calm Ledger theme: Fraunces serif + Inter, teal/paper/gold/clay,
tabular money, 600ms count-up). Pre-seeded a realistic 3-debt example so a result shows before
input. Two hero numbers: lost deduction (clay ▲) computed as `interest × 0.30`, monthly saving
(gold ▼) from the annuity delta — shown only when the target rate beats the weighted current
rate (honest "—" otherwise). CTA placement reuses solceller's `buildSubId`/`useTrackClick`,
`rel="nofollow sponsored noopener"`, annonssamarbete microcopy. Single route (no HowTo schema
shipped — WebSite + FAQPage only, to match the actual content). Gate green; deploy + program
application escalated to human.
