/**
 * Lead-gen partners for the solceller quote hand-off.
 *
 * These are placeholder tracking URLs until a solar quote-request program is
 * approved (Adtraction / AddRevenue list several Swedish installers paying
 * ~100–200 SEK per qualified quote request). The quote itself — the binding
 * price — always comes from the partner, never from us; we only estimate from
 * the user's drawn roof + public assumptions. Keep it that way (truth guardrail).
 */
export interface QuotePartner {
  id: string;
  name: string;
  description: string;
  /** Selling points shown on the lead card. Must be factual/sourced. */
  points: string[];
  trackingUrl: string;
  badge?: string;
}

export const quotePartners: QuotePartner[] = [
  {
    id: "offert-installator",
    name: "Jämför installatörer",
    description:
      "Få upp till 4 kostnadsfria offerter från kvalitetssäkrade solcellsinstallatörer i ditt område. Du väljer själv om du vill gå vidare.",
    points: [
      "Upp till 4 offerter – kostnadsfritt och utan köpkrav",
      "Lokala, kvalitetssäkrade installatörer",
      "Svar inom några dagar",
    ],
    trackingUrl:
      "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://example.com/solceller-offert",
    badge: "Populärast",
  },
];

export function getPrimaryPartner(): QuotePartner {
  return quotePartners[0];
}
