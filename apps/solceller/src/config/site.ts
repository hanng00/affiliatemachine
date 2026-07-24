import { getSite } from "@affiliate/sites";

// Integration ids (domain, GA4, GTM, Adtraction) come from the shared registry
// so the sites and the admin DB can never drift out of sync.
const registry = getSite("solceller")!;
// Brand = the registry name ("Solkalkylatorn"), used as the consistent title
// suffix + og:site_name so Google shows the brand (not the bare domain) in SERP.
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
  title: `Solcellskalkylator – rita på kartan, se besparing & grönt avdrag | ${brand}`,
  description:
    "Solcellskalkylator med karta: rita solceller på ditt tak och få en uppskattning av antal paneler, årsproduktion, besparing och återbetalningstid – inklusive grönt avdrag. Gratis, utan inloggning.",

  ogImage: "/og-image.png",

  navigation: [
    { label: "Villa", href: "/villa" },
    { label: "BRF", href: "/brf/guide" },
    { label: "Grönt avdrag", href: "/#gront-avdrag" },
    { label: "Vanliga frågor", href: "/#faq" },
  ],

  footerLinks: [] as { label: string; href: string }[],
};

export type SiteConfig = typeof siteConfig;
