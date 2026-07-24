import { getSite } from "@affiliate/sites";

// Integration ids (domain, GA4, GTM, Adtraction) come from the shared registry
// so the sites and the admin DB can never drift out of sync.
const registry = getSite("varmepumpsguiden")!;
const brand = registry.name;

export const siteConfig = {
  slug: registry.slug,
  name: registry.name,
  domain: registry.domain,
  brand,
  defaultLocale: "sv",
  locales: ["sv"] as const,

  // Google
  gtmId: registry.gtmId,
  ga4Id: registry.ga4Id,
  adtractionChannelId: registry.adtractionChannelId,

  // Meta
  title: `Värmepump 2026 – räkna ut kostnad, ROT & besparing | ${brand}`,
  description:
    "Räkna ut vad en värmepump kostar för just ditt hus – investering, ROT-avdrag, driftskostnad, besparing och återbetalningstid för bergvärme, luft/vatten och luft/luft. Jämför sedan F-skatt-verifierade installatörer i din kommun. Gratis och utan inloggning.",

  ogImage: "/og-image.png",

  navigation: [
    { label: "Bergvärme", href: "/bergvarme" },
    { label: "Luft/vatten", href: "/luft-vatten" },
    { label: "Luft/luft", href: "/luft-luft" },
    { label: "Vanliga frågor", href: "/#faq" },
  ],

  footerLinks: [] as { label: string; href: string }[],
};

export type SiteConfig = typeof siteConfig;
