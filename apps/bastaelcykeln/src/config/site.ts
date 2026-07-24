import { getSite, domainBrand } from "@affiliate/sites";

// Integration ids (domain, GA4, GTM, Adtraction) come from the shared registry
// so the sites and the admin DB can never drift out of sync.
const registry = getSite("bastaelcykeln")!;
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
  title: `Förmånscykel-kalkylator 2026 – räkna ut din besparing på elcykel | ${brand}`,
  description:
    "Räkna ut vad en elcykel kostar via förmånscykel (bruttolöneavdrag) jämfört med att betala kontant. Se nettokostnad per månad, förmånsvärde och total besparing – gratis och utan inloggning.",

  ogImage: "/og-image.png",

  navigation: [
    { label: "Kalkylator", href: "/#kalkylator" },
    { label: "Så funkar det", href: "/#sa-funkar-det" },
    { label: "Guide", href: "/guide" },
    { label: "Vanliga frågor", href: "/#faq" },
  ],

  footerLinks: [] as { label: string; href: string }[],
};

export type SiteConfig = typeof siteConfig;
