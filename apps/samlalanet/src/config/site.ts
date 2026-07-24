import { getSite, domainBrand } from "@affiliate/sites";

// Integration ids (domain, GA4, GTM, Adtraction) come from the shared registry
// so the sites and the admin DB can never drift out of sync.
const registry = getSite("samlalanet")!;
const brand = domainBrand(registry.domain);

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
  title: `Samla Lånet 2026 – vad kostar slopat ränteavdrag dig? Räkna på samlingslån | ${brand}`,
  description:
    "Lägg in dina lån och se direkt vad det slopade ränteavdraget 2026 kostar dig per år – och hur mycket du kan spara på att samla lånen till en lägre ränta. Gratis, ingen inloggning, inga personuppgifter.",

  ogImage: "/og-image.png",

  navigation: [
    { label: "Räkna", href: "/#rakna" },
    { label: "Ränteavdraget 2026", href: "/#ranteavdrag" },
    { label: "Så funkar samlingslån", href: "/#samlingslan" },
    { label: "Vanliga frågor", href: "/#faq" },
  ],

  footerLinks: [] as { label: string; href: string }[],
};

export type SiteConfig = typeof siteConfig;
