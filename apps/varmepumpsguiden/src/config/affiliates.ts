/**
 * Lead-gen partner for the värmepump quote hand-off — the only money surface.
 *
 * Placeholder tracking URL until a värmepump/hantverkare lead program is approved
 * (Tjänstetorget, Offerta, Servicefinder, or a direct installer-lead network pay
 * a CPL for "få 3 offerter" on installs worth 90–250k SEK). The binding price
 * always comes from the installer — we only estimate from the user's house inputs
 * + public assumptions. Keep it that way (truth guardrail).
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
      "Få upp till 3 kostnadsfria offerter från värmepumpsinstallatörer i ditt område. Du väljer själv om du vill gå vidare.",
    points: [
      "Upp till 3 offerter – kostnadsfritt och utan köpkrav",
      "Lokala installatörer med F-skatt",
      "Svar inom några dagar",
    ],
    trackingUrl:
      "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://example.com/varmepump-offert",
    badge: "Populärast",
  },
];

export function getPrimaryPartner(): QuotePartner {
  return quotePartners[0];
}
