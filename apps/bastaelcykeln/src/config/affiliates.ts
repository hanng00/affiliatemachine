/**
 * Affiliate partners for the bästaelcykeln hand-off.
 *
 * Two intents, two partner types (placeholder tracking URLs until programs are
 * approved on Adtraction / AddRevenue):
 *  - `leasing`  → förmånscykel providers (Bikelease, Lease a Bike-type). The user
 *    has computed a saving and wants to set up the benefit through their employer.
 *  - `retail`   → elcykel e-commerce (10–12 % commission) for users who decide to
 *    buy privately instead. High-ticket bikes → meaningful RPC.
 *
 * We *estimate* the saving from public Skatteverket rules; the binding figure (the
 * leasing offer, the employer's policy) always comes from the partner/employer,
 * never from us. Keep it that way (truth guardrail).
 */
export interface AffiliatePartner {
  id: string;
  kind: "leasing" | "retail";
  name: string;
  description: string;
  /** Selling points shown on the card. Must be factual/sourced. */
  points: string[];
  trackingUrl: string;
  badge?: string;
}

export const partners: AffiliatePartner[] = [
  {
    id: "formanscykel-leasing",
    kind: "leasing",
    name: "Skaffa förmånscykel via jobbet",
    description:
      "Jämför leverantörer av förmånscykel och kom igång via din arbetsgivare. Du väljer cykel, de sköter avtal, försäkring och service.",
    points: [
      "Bruttolöneavdrag – betala med pengar före skatt",
      "Service och försäkring ingår ofta i avtalet",
      "Kostnadsfritt att jämföra – inget köpkrav",
    ],
    trackingUrl:
      "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://example.com/formanscykel",
    badge: "Populärast",
  },
  {
    id: "elcykel-retail",
    kind: "retail",
    name: "Köp elcykeln direkt",
    description:
      "Vill du hellre köpa privat? Jämför aktuella priser på testvinnande elcyklar hos svenska återförsäljare.",
    points: [
      "Stort utbud av pendling-, terräng- och hopfällbara elcyklar",
      "Fri frakt och öppet köp hos de flesta butiker",
      "Ofta delbetalning utan ränta",
    ],
    trackingUrl:
      "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://example.com/elcyklar",
  },
];

export function getLeasingPartner(): AffiliatePartner {
  return partners.find((p) => p.kind === "leasing") ?? partners[0];
}

export function getRetailPartner(): AffiliatePartner {
  return partners.find((p) => p.kind === "retail") ?? partners[0];
}
