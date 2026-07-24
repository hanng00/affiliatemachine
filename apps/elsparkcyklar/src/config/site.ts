import { getSite, domainBrand } from "@affiliate/sites";

// Integration ids (domain, GA4, GTM, Adtraction) come from the shared registry
// so the sites and the admin DB can never drift out of sync.
const registry = getSite("elsparkcyklar")!;
const brand = domainBrand(registry.domain);

export const siteConfig = {
  slug: registry.slug,
  name: registry.name,
  logo: "/logo.svg",
  domain: registry.domain,
  brand,
  defaultLocale: "sv",
  locales: ["sv"] as const,

  // Google
  gtmId: registry.gtmId,
  ga4Id: registry.ga4Id,
  adtractionChannelId: registry.adtractionChannelId,

  // Meta
  title: `Bästa elsparkcyklarna 2026 – Test, jämförelse & köpguide | ${brand}`,
  description:
    "Vi har testat och jämfört de bästa elsparkcyklarna på svenska marknaden. Hitta rätt modell för dig – från budget till premium. Uppdaterad maj 2026.",

  // Social
  ogImage: "/og-image.png",

  // Navigation
  navigation: [
    { label: "Hem", href: "/" },
    { label: "Jämför", href: "/jamfor" },
    { label: "Regler", href: "/regler" },
  ],

  // Footer links
  footerLinks: [
    { label: "Om oss", href: "/om-oss" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Integritetspolicy", href: "/integritetspolicy" },
  ],
};

export type SiteConfig = typeof siteConfig;
