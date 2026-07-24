# Revenue Playbook — how each site actually makes money

> Companion to [`CLAUDE.md`](../CLAUDE.md) (the operating loop) and [`JOURNAL.md`](JOURNAL.md)
> (the running log). This is the **reference map**: for each site, the exact method, who pays,
> what to build or sign, and the recommended path. Updated as programs get approved and bets
> resolve. Researched 2026-06-13.

## The one idea that reframes everything

`profit = traffic × CTR × RPC − cost`. Every site is stuck at **RPC = 0** for one reason:
**every `trackingUrl` is a placeholder** (`a=PLACEHOLDER&as=PLACEHOLDER&url=example.com`). No
real money can flow until those become real links **or** we stand up our own lead sale.

But "make the link real" means two completely different things depending on the site, because
the portfolio is **two businesses**:

| Shape | Sites | What we sell | How we get paid | Integration |
|-------|-------|--------------|-----------------|-------------|
| **Retail (CPS)** | robotdammsugare, elsparkcyklar, bastaelcykeln (buy-leg) | a click that ends in a product purchase | % of sale, via an affiliate network | swap the URL — done |
| **Lead (CPL)** | bilforsakringar, solceller, bastaelcykeln (leasing-leg) | a *qualified lead* (a quote request) | fixed fee per lead, OR % when the lead converts | **redirect** (easy) **or own-and-sell** (build) |

The mistake baked into the current code is treating the **Lead** sites like **Retail** sites
(a single Adtraction product redirect). That's why solceller's placeholder may never resolve —
**Adtraction does not run a normal solar program**; solar is a lead market.

Each Lead site therefore has a **v1 (redirect, fast, low RPC)** and a **v2 (own the lead, slow,
high RPC)**. We already have the infrastructure for v2 (Cloudflare Worker + KV/D1) — and
crucially, **two of these sites already capture the lead today** (see per-site notes).

---

## Per-site method

### 1. robotdammsugare — Retail (CPS). Easiest live revenue.

- **Method:** affiliate redirect to a retailer; earn % when the user buys.
- **Who pays (apply in this order):**
  1. **Amazon.se Associates** — huge catalog, instant approval, but **electronics commission is
     low (~2–4 %, often capped per item)**. A 8 000 kr robot @ 3 % ≈ **240 kr/sale**. Good
     fallback / always-available link.
  2. **Komplett SE**, **Teknikproffset SE** (both via **Adtraction/Adrecord**) — these often
     pay better than Amazon on electronics and stock the same SKUs. Prefer these as the primary
     link, Amazon as fallback.
  3. (NetOnNet / Power / Elgiganten run no useful public affiliate program — Elgiganten is a
     *marketplace*, not an affiliate. Skip.)
- **Build:** none. Replace the `trackingUrl` `a=`/`as=` ids + product deeplink in
  [`apps/robotdammsugare/src/config/affiliates.ts`](../apps/robotdammsugare/src/config/affiliates.ts).
  Match each product to the retailer that actually stocks it. The `epi` sub-id attribution is
  already wired (`buildSubId`/`appendSubId`).
- **RPC ceiling:** modest (low electronics %, but high-ish ticket). This is the **cash-flow**
  site, not the jackpot.
- **Recommended path:** **v1 only.** Pure retail; there's no lead to own. Ship real links.

### 2. elsparkcyklar — Retail (CPS). Easiest, and the program is confirmed.

- **Method:** affiliate redirect; earn % on the scooter sale.
- **Who pays:** **eWheels** — **confirmed live on Adtraction** (NO program verified; SE program
  exists). We *already link to ewheels.se* in the config, so the merchant match is perfect; we
  just need the real ids. Komplett/others as secondary for non-eWheels SKUs.
- **Build:** none. Swap placeholder ids in
  [`apps/elsparkcyklar/src/config/affiliates.ts`](../apps/elsparkcyklar/src/config/affiliates.ts).
- **RPC ceiling:** scooter retail ~5–8 %. 9 000 kr scooter ≈ **450–700 kr/sale**.
- **Recommended path:** **v1 only.** Retail. Ship real links.

### 3. bastaelcykeln — Hybrid: Retail buy-leg + Lead leasing-leg.

- **Retail leg (buy the bike):** same as elsparkcyklar — **eWheels** + other elcykel retailers
  on Adtraction. High ticket (15–30k bikes) → meaningful per-sale even at 5 %. **v1, easy.**
- **Leasing leg (förmånscykel via employer):** this is a **lead**. förmånscykel providers
  (Benify-class benefit portals, dedicated bike-leasing firms). **Verify a real program exists
  before promising it** — this is the least-confirmed program in the portfolio. If none exists
  on a network, it's a direct-deal / drop-the-leg decision.
- **Build:** none for retail. Leasing leg may need a direct partner.
- **Recommended path:** ship the **retail leg now (v1)**; treat the **leasing leg as a
  research item** — confirm a program or de-emphasize that CTA.

### 4. bilforsakringar — Lead (CPL/CPS). **Highest RPC in the portfolio.** Already captures leads.

- **Why it's special:** the worker **already stores every search** as a `StoredSearch` in KV
  (regno + yearlyKm + driver profile, 30-day TTL — see
  [`apps/bilforsakringar/worker/src/index.ts`](../apps/bilforsakringar/worker/src/index.ts)).
  **It is already a lead database.** It just (a) doesn't collect contact info and (b) doesn't
  sell or hand off the lead.
- **Method options:**
  - **v1 — redirect/affiliate (fast, available now):** on the `/s/:id` results page, CTA each
    quote row to a comparison/insurer affiliate. Confirmed programs:
    - **Compricer** (Adtraction) — *mandatory* deeplink `compricer.se/forsakring/bil/`, anchor
      "BIL LÄNK".
    - **Zmarta Försäkring** (Tradedoubler) — example payout **800 SEK** (the biggest single
      number found in research).
    - **Dina Försäkringar / Hedvig / Trygga** (Adtraction direct) — but note **strict terms**
      (fixed deeplinks, anchor-text rules, often **no brand bidding**). Read each program.
  - **v2 — own the lead (higher RPC, on-stack):** we already have the regno + risk profile.
    Add a consented contact-capture step ("vill du att 1–3 bolag kontaktar dig med ett
    skarpt pris?") and **sell the lead** to an insurer/broker or a finance lead-buyer. Insurance
    CPLs are high. The KV store + worker already exist; this is a contact field + a
    delivery/agreement, not a new system.
- **RPC ceiling:** **highest.** Insurance lead/conversion payouts dwarf product %.
- **Recommended path:** **v1 immediately** (Compricer + Zmarta CTAs on `/s/:id`), **v2 as the
  flagship escalation** — it's the single best RPC lever we have and the lead is already sitting
  in KV unused.

### 5. solceller — Lead (CPL). Adtraction does NOT cover this. The interesting one.

- **The reality:** solar in Sweden is a **lead market**, not an affiliate-catalog product. The
  buyers are aggregators: **Nettbureau** (Solceller.nu, Värmepump.se, Laddbox.nu — FT growth-
  champion, 7M+ leads), **Energify**, **LeadHive** (~149 kr/lead shown publicly), **Solceller24**,
  **Grönkraft**. They all *buy* qualified leads from publishers/installers — typically **no
  startup fee, pay per lead, accept delivery via email/webhook/REST/Zapier**.
- **Why our tool is a weapon here:** the draw-your-roof flow produces a **pre-qualified** lead —
  real roof m² → kWp → annual kWh → savings → payback (see
  [`apps/solceller/src/pages/index.tsx`](../apps/solceller/src/pages/index.tsx)). A lead with a
  computed system size and a drawn roof is worth **more** than a bare form fill, and we can prove
  it. This is the moat: we don't compete with Nettbureau on content authority — we *feed* them
  (or their competitors) a better lead.
- **Method options:**
  - **v1 — redirect (fast):** point the "Få offert" CTA at a solar aggregator that pays
    publishers for referred traffic/leads. Requires a **publisher/CPL agreement** with a
    Nettbureau-class aggregator (not a catalog signup). Lower RPC; we hand the user off and the
    aggregator captures the lead.
  - **v2 — own and sell the lead (highest RPC, the recommended play):** add a consented
    contact-capture step *after* the estimate ("få 1–3 offerter på din ~X kWp-anläggning"),
    store the lead (roof m², kWp, region, contact) in **D1/KV**, then **sell it** to installers
    directly (Energify/LeadHive/Grönkraft ingest via webhook/REST/Zapier) — splitting each lead
    across max 3 buyers, the standard model. We become the aggregator for our own niche.
- **RPC ceiling:** ~100–200+ SEK per qualified villa lead; **BRF/commercial leads worth
  materially more** (bigger installs). v2 multiplies this vs v1.
- **Recommended path:** **v2.** This is where the engineering moat pays off. v1 is the
  fallback if no buyer signs. Both require a commercial agreement → **escalation**.

### 6. tagstrul — out of scope (external repo, not monetized here).

---

## What it takes to "own and sell the lead" (the v2 build, shared shape)

For bilforsakringar and solceller, v2 is the same pattern (we already run the infra):

1. **Consent + contact capture** — a GDPR-consented step *after* we've delivered value (the
   estimate/quotes), asking only for what a buyer needs (name, email/phone, postcode). Reject
   path must be as easy as accept (marknadsföringslagen + our consent guardrail).
2. **Store the lead** — D1 (admin already has a D1) or per-site KV, with the qualifying data
   we computed (kWp/roof for solar; risk profile for insurance) — that data is the premium.
3. **Deliver/sell** — webhook/REST/Zapier push to the buyer's CRM (every aggregator supports
   this). Cap distribution at 3 buyers/lead (industry norm).
4. **Reconcile** — record sold leads + payout in admin so RPC/profit columns populate.

This is a **bet + an escalation**, not a self-serve task: it needs a **signed CPL agreement**
(commercial commitment) before any code ships, and the contact-capture/consent surface is a real
(if small) build. Do not self-build or self-sign — propose, get go/no-go, then build green +
deploy-request per the loop.

---

## Action checklist (all SEK 0 — signups, not spend)

Ordered by effort-to-first-krona. Each completed item unblocks a surgical code cycle (swap real
ids into the relevant `affiliates.ts` + fill `adtractionProgramId` in `packages/sites`).

- [ ] **Create one Adtraction publisher account** (free, no company required) + add every live
      domain as a channel. Covers retail + insurance in one account.
- [ ] **Retail — apply (fastest real revenue):**
  - [ ] eWheels (→ elsparkcyklar, bastaelcykeln buy-leg) — already the linked merchant.
  - [ ] Amazon.se Associates + Komplett/Teknikproffset (→ robotdammsugare).
- [ ] **Insurance — apply (highest CPS/CPL):**
  - [ ] Compricer (Adtraction; deeplink `compricer.se/forsakring/bil/`).
  - [ ] Zmarta Försäkring (Tradedoubler; ~800 SEK example payout).
  - [ ] (optional) Dina/Hedvig/Trygga direct — mind the brand-bidding/anchor terms.
- [ ] **Solar — ESCALATION (decide path, then act):**
  - [ ] Decide **v1 (redirect-affiliate)** vs **v2 (own-and-sell)** for solceller.
  - [ ] Email a solar aggregator (Nettbureau / Energify / LeadHive) as *a publisher with
        qualified, pre-computed solar leads* — get a CPL number + delivery method.
- [ ] **bilforsakringar — ESCALATION:** decide whether to add v2 contact-capture and sell the
      KV leads we already store (the single highest-RPC lever in the portfolio).
- [ ] **Registry hygiene:** once any program is approved, set `adtractionProgramId` per site in
      [`packages/sites/src/index.ts`](../packages/sites/src/index.ts) so admin reconciles
      revenue → site.

## Guardrails carried into every option

- Keep `rel="sponsored nofollow"` on every affiliate CTA; keep the **Annonssamarbete** disclosure.
- **Never quote a binding price** — we *estimate*; the installer/insurer quotes (truth +
  marknadsföringslagen).
- Lead capture is **consented, reject-as-easy-as-accept**, minimal fields (GDPR).
- No deploy and no signed agreement without human approval (deploy + spend gates).

## Decision log

- **2026-06-13:** Established the Retail-vs-Lead split as the portfolio's core monetization
  model. Confirmed Adtraction does **not** cover solar (it's a CPL lead market: Nettbureau et
  al.). Found bilforsakringar already persists leads in KV (unused) and solceller produces
  pre-qualified leads — both are v2 ("own the lead") candidates on existing infra. Recommended:
  v1 retail links ship first; bilforsakringar + solceller "own-and-sell" are the high-RPC
  escalations.
