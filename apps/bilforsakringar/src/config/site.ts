export const siteConfig = {
  name: "Bilförsäkringar",
  logo: "/logo.svg",
  domain: "bilforsakringar.se",
  defaultLocale: "sv",
  locales: ["sv"] as const,

  gtmId: "",
  ga4Id: "",

  title: "Jämför bilförsäkringar 2026 – Hitta billigaste försäkringen | Bilförsäkringar.se",
  description:
    "Jämför bilförsäkringar från Sveriges största försäkringsbolag. Ange ditt registreringsnummer och få prisförslag direkt. Spara tusenlappar på din bilförsäkring.",

  ogImage: "/og-image.png",

  navigation: [
    { label: "Hem", href: "/" },
    { label: "Jämför försäkringar", href: "/jamfor" },
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
