/**
 * Samlingslån förmedlare for the Räntekollen hand-off.
 *
 * These are PLACEHOLDER tracking URLs until a Finance program is approved in the
 * Adtraction dashboard and a channel is created for samlalanet.se. The binding
 * rate — the only number that matters legally — always comes from the bank/
 * förmedlare after a credit check; we only ever estimate from the user's entered
 * loans + sourced typical rates. Keep it that way (truth guardrail,
 * marknadsföringslagen).
 *
 * Candidate programs (Adtraction SE, Finance), highest CPA first:
 *  - Plus 1 (programId 1271269079) — ~2000 SEK per approved loan
 *  - Sambla (1923302868)          — ~1035 SEK CPA
 *  - Advisa (1923306188)
 *  - Lendo  (1060519341)          — ~400 SEK
 * Finance programs are strict on brand-bidding / deeplink / anchor-text terms —
 * read each program's terms before going live and set the real trackingUrl here.
 */
export interface LoanPartner {
  id: string;
  name: string;
  description: string;
  /** Selling points shown on the hand-off card. Must be factual/sourced. */
  points: string[];
  trackingUrl: string;
  badge?: string;
}

export const loanPartners: LoanPartner[] = [
  {
    id: "samlingslan-formedlare",
    name: "Jämför samlingslån",
    description:
      "En ansökan skickas till 40+ banker och långivare som tävlar om att ge dig den lägsta räntan. Du väljer själv om du vill tacka ja – utan kostnad och utan köpkrav.",
    points: [
      "En ansökan, en kreditupplysning (UC) – inte en per bank",
      "Erbjudanden från 40+ banker och långivare",
      "Kostnadsfritt och utan förpliktelser",
    ],
    trackingUrl:
      "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://example.com/samlingslan",
    badge: "Flest banker",
  },
];

export function getPrimaryPartner(): LoanPartner {
  return loanPartners[0];
}
