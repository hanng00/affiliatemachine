import { getSite, domainBrand } from "@affiliate/sites";

const registry = getSite("bilforsakringar")!;
const brand = domainBrand(registry.domain);

export const siteConfig = {
  slug: registry.slug,
  name: registry.name,
  logo: "/logo.svg",
  domain: registry.domain,
  brand,
  defaultLocale: "sv",
  locales: ["sv"] as const,

  gtmId: registry.gtmId,
  ga4Id: registry.ga4Id,
  adtractionChannelId: registry.adtractionChannelId,

  title: `Jämför bilförsäkringar 2026 – Hitta billigaste försäkringen | ${brand}`,
  description:
    "Jämför bilförsäkringar från Sveriges största försäkringsbolag. Ange ditt registreringsnummer och få prisförslag direkt. Spara tusenlappar på din bilförsäkring.",

  ogImage: "/og-image.png",

  navigation: [
    { label: "Hem", href: "/" },
    { label: "Jämför försäkringar", href: "/jamfor" },
    { label: "Billigast 2026", href: "/basta-bilforsakring-2026" },
    { label: "Försäkringsbolag", href: "/forsakringsbolag" },
    { label: "Guide", href: "/guide" },
  ],

  footerLinks: [
    { label: "Om oss", href: "/om-oss" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Integritetspolicy", href: "/integritetspolicy" },
  ],
};

export type SiteConfig = typeof siteConfig;
