import { getSite, domainBrand } from "@affiliate/sites";

// Integration ids (domain, GA4, GTM, Adtraction) come from the shared registry
// so the sites and the admin DB can never drift out of sync.
const registry = getSite("robotdammsugare")!;
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
  title: `Bästa robotdammsugarna 2026 – Test, jämförelse & köpguide | ${brand}`,
  description:
    "Vi har testat och jämfört de bästa robotdammsugarna på svenska marknaden. Hitta rätt modell för ditt hem – från budget till premium. Baserat på 100+ användarrecensioner.",

  // Social
  ogImage: "/og-image.png",

  // In-page anchors — the site is a single live route (/), so nav scrolls.
  navigation: [
    { label: "Topplista", href: "/#topplista" },
    { label: "Jämför", href: "/#jamfor" },
    { label: "Köpguide", href: "/#guide" },
    { label: "Vanliga frågor", href: "/#faq" },
  ],

  // Footer links (legal/about pages not built yet)
  footerLinks: [] as { label: string; href: string }[],
};

export type SiteConfig = typeof siteConfig;
