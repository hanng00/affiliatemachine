/**
 * Single source of truth for the affiliate site portfolio.
 *
 * Consumed by:
 *  - each app's `config/site.ts` (for ga4Id / gtmId / domain / adtraction ids)
 *  - the admin seed generator (`apps/admin/scripts/generate-seed-sql.ts`)
 *
 * Keeping integration ids here prevents drift between what the sites emit and
 * what the admin DB expects when reconciling clicks/revenue per site.
 */

export type SiteStatus = "healthy" | "warning" | "error";

export interface SiteRegistryEntry {
  /** Stable key used in sub-ids and seeds. */
  slug: string;
  name: string;
  /** Live hostname (Unicode for IDN å/ä/ö domains). */
  domain: string;
  /** GA4 measurement id on the site (G-XXXXXXXXXX). */
  ga4Id: string;
  /** GA4 Admin numeric property id for the Data API (e.g. "123456789"). */
  ga4PropertyId: string;
  /** GTM container id, e.g. "GTM-XXXXXXX". Empty when not configured yet. */
  gtmId: string;
  /**
   * Adtraction channel id for this site (one channel = one website). Revenue is
   * reconciled per-channel, which aggregates every program the channel links to
   * — so a single site can promote many advertisers without changing this. Empty
   * until the channel is created/approved in the Adtraction dashboard.
   */
  adtractionChannelId: string;
  /** Fixed monthly running cost in SEK (hosting, domain amortization, etc.). */
  costMonthly: number;
  status: SiteStatus;
  /**
   * This site's mid-funnel "aha". `kind` is the value emitted in the GA4
   * `activation` event (one kind per site today, so it's 1:1 with the site and
   * the admin reads it from here rather than re-querying GA4); `label` is the
   * human description shown on hover in the dashboard. Omitted until the app
   * actually fires the event.
   */
  activation?: { kind: string; label: string };
}

export const sites: SiteRegistryEntry[] = [
  {
    slug: "elsparkcyklar",
    name: "Elsparkcyklar",
    domain: "bästaelsparkcykeln.se",
    ga4Id: "G-VBSKY07630",
    ga4PropertyId: "538294765",
    gtmId: "GTM-WXHXDX9P",
    // Channel: bästaelsparkcykeln.se. Links E-Wheels (1589959062, 8% CPS),
    // Evobike (1797469353), KopEnScooter (1954024945). Waiting approval.
    adtractionChannelId: "2084572371",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "list_filtered", label: "Filtered the scooter list by need" },
  },
  {
    slug: "robotdammsugare",
    name: "Robotdammsugare",
    domain: "bästarobotdammsugare.se",
    ga4Id: "G-2RCY01N8XE",
    ga4PropertyId: "540580334",
    gtmId: "",
    // Channel: bästarobotdammsugare.se. Links Elon (1606750990, 5% CPS),
    // Komplett (1615916037), Webhallen (2057601695), Teknikproffset (1954032645).
    // Waiting approval.
    adtractionChannelId: "2084572390",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "list_filtered", label: "Filtered the vacuum list by home type" },
  },
  {
    slug: "bilforsakringar",
    name: "Bilförsäkringar",
    domain: "billigastebilforsakringen.se",
    ga4Id: "G-J2K6PDM59R",
    ga4PropertyId: "540543812",
    gtmId: "",
    // Channel not created yet (bilförsäkringar wasn't in the first batch). Compricer
    // (1052530631) is the target: CPL 12 SEK/insurance search, 8 SEK/home, 600 SEK/loan.
    // Create the channel in Adtraction, then set its id here.
    adtractionChannelId: "",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "quotes_shown", label: "Saw real insurance quotes" },
  },
  {
    // Free-tool site: interactive solar/roof calculator. HIGHEST-RPC site in the
    // portfolio: Hemsol SE (Adtraction SE) pays 700 SEK per accepted solar quote
    // (350 SEK per battery quote); Tjänstetorget Solceller (1955589078) pays 170
    // SEK/lead as a CPL fallback. The roof→kWp estimate is the pre-qualified
    // top-of-funnel. Pending channel + program approval. Domain purchased
    // 2026-06-12 — point DNS at the Cloudflare Pages project and add it as a
    // custom domain, then provision GA4.
    slug: "solceller",
    name: "Solkalkylatorn",
    domain: "solkalkylatorn.se",
    ga4Id: "G-L6JJ8BD5QQ",
    ga4PropertyId: "541555572",
    gtmId: "",
    // Channel: solkalkylatorn.se. Links Hemsol (1810386646, 700 SEK/accepted solar
    // quote, 350 SEK/battery) + Tjänstetorget Solceller (1955589078, 170 SEK/lead).
    // Waiting approval.
    adtractionChannelId: "2084568833",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "roof_estimated", label: "Got a roof solar estimate (kWp/savings)" },
  },
  {
    // Free-tool site: förmånscykel (benefit-bike) savings calculator. The
    // domain (bästaelcykeln.se) is already owned in Cloudflare + GSC — no new
    // domain spend. Point DNS at the Pages project, add it as a custom domain,
    // then provision GA4. Earns via elcykel e-commerce affiliate: Evobike SE
    // (Adtraction SE, Automotive) 3% CPS; Stålhästen (1960530131) + MOVS
    // (1954024973) secondary. Förmånscykel leasing partners need a direct/other
    // network (not on Adtraction SE). Pending channel + program approval.
    slug: "bastaelcykeln",
    name: "Bästa Elcykeln",
    domain: "bästaelcykeln.se",
    ga4Id: "G-00EELXSM2K",
    ga4PropertyId: "541669788",
    gtmId: "",
    // Channel: bästaelcykeln.se (waiting approval).
    adtractionChannelId: "2084572353",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "benefit_calculated", label: "Calculated benefit-bike net cost" },
  },
  {
    // Free-tool site: samlingslån / "what does the 2026 ränteavdrag removal cost
    // you?" calculator. Rides a dated macro catalyst (skattereduktion on lån utan
    // säkerhet → 0 from 2026-01-01) and the deepest, highest-paying Adtraction SE
    // category (Finance: ~89 programs, 1000–2000 SEK per approved loan). Mirrors
    // the solceller free-tool pattern (prerendered SEO page + client-only
    // calculator island + CPA hand-off). Domain `samlalanet.se` bought + migrated
    // 2026-06-15 (the rantekollen.se placeholder was already taken — see JOURNAL
    // 2026-06-15 domain scout). Still pending: no Finance program approved, no
    // Adtraction channel. Earns via samlingslån förmedlare: Sambla (1923302868,
    // ~1035 SEK CPA), Plus 1 (1271269079, 2000 SEK/approved loan), Lendo
    // (1060519341, 400 SEK), Advisa (1923306188). Apply + create the channel, then
    // fill adtractionChannelId + the real trackingUrl. GA4 property id 541744114
    // wired 2026-06-15 (Data API pull keys on this, not the G- measurement id).
    slug: "samlalanet",
    name: "Samla Lånet",
    domain: "samlalanet.se",
    ga4Id: "G-EV861Z80HV",
    ga4PropertyId: "541744114",
    gtmId: "",
    // Channel: samlalanet.se (not created — apply to a Finance program first).
    adtractionChannelId: "",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "loan_edited", label: "Edited the loan calculator (own numbers)" },
  },
  {
    // Free-tool site: värmepump cost/savings calculator + verified-installer
    // directory ("Momondo for värmepump"). The defensible programmatic-aggregator
    // bet (see JOURNAL 2026-06-18 creative scout): each {system}×{kommun} page
    // fuses our OWN computed price/ROT/driftskostnad/återbetalning for that house
    // with a shortlist of F-skatt-VERIFIED local installers sourced from FREE
    // official APIs (Bolagsverket "värdefulla datamängder" + SCB företagsregister)
    // — NO scraping of review platforms (ToS + copyright + GDPR). The computed
    // layer is the anti-thin moat that survives Google's March-2026 scaled-content
    // update. Highest-lead-value vertical: bergvärme/luft-vatten installs are
    // 90–250k SEK tickets; installer-lead/CPL market is mature ("få 3 offerter").
    // Mirrors the solceller free-tool pattern (prerendered SEO + client-only
    // calculator island + CPA hand-off). Pending: no domain bought, no Adtraction
    // channel/program, GA4/GTM unprovisioned. Validate on the .pages.dev first.
    slug: "varmepumpsguiden",
    name: "Värmepumpsguiden",
    domain: "värmepumpsguiden.se",
    ga4Id: "",
    ga4PropertyId: "",
    gtmId: "",
    // Channel: värmepumpsguiden.se (not created — apply to a värmepump/hantverkare
    // lead program first; Tjänstetorget/Offerta/installer CPL are the targets).
    adtractionChannelId: "",
    costMonthly: 20,
    status: "healthy",
    activation: { kind: "heatpump_estimated", label: "Got a heat-pump cost/savings estimate" },
  },
  {
    // Externally-hosted side project (lives in a separate repo/Pages project, not
    // this monorepo). Tracked here only so it surfaces in the admin dashboard
    // alongside the portfolio. gtag.js (G-9LLE8S8X4K) is wired on the live site
    // in its own repo; here we only need the numeric ga4PropertyId so the admin
    // Data API pull (affiliate_click eventCount) keys on it. Resolved from the
    // GA4 Admin API 2026-06-15 (ops/list-ga4-properties.ts).
    slug: "tagstrul",
    name: "Tågstrul",
    domain: "tagstrul.se",
    ga4Id: "G-9LLE8S8X4K",
    ga4PropertyId: "541753359",
    gtmId: "",
    adtractionChannelId: "",
    costMonthly: 20,
    status: "healthy",
  },
];

export function getSite(slugOrDomain: string): SiteRegistryEntry | undefined {
  return sites.find((s) => s.slug === slugOrDomain || s.domain === slugOrDomain);
}

/** Title-tag suffix from the live domain, e.g. "Bästaelsparkcykeln.se". */
export function domainBrand(domain: string): string {
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

/** Worker/API hostname for a site, e.g. api.billigastebilforsakringen.se */
export function apiHostname(domain: string): string {
  return `api.${domain}`;
}

/** HTTPS origins allowed to call a site's Worker API (CORS). */
export function workerCorsOrigins(domain: string, pagesProject: string): string[] {
  return [
    `https://${domain}`,
    `https://www.${domain}`,
    `https://${pagesProject}.pages.dev`,
  ];
}

export function isAllowedWorkerCorsOrigin(
  origin: string,
  domain: string,
  pagesProject: string
): boolean {
  if (workerCorsOrigins(domain, pagesProject).includes(origin)) return true;
  return origin.endsWith(`.${pagesProject}.pages.dev`);
}
