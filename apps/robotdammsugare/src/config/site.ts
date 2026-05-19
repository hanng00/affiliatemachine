export const siteConfig = {
  name: "Robotdammsugare",
  domain: "robotdammsugare.se",
  defaultLocale: "sv",
  locales: ["sv"] as const,

  // Google (empty for now)
  gtmId: "",
  ga4Id: "",

  // Meta
  title: "Bästa robotdammsugarna 2026 – Test, jämförelse & köpguide | Robotdammsugare.se",
  description:
    "Vi har testat och jämfört de bästa robotdammsugarna på svenska marknaden. Hitta rätt modell för ditt hem – från budget till premium. Baserat på 100+ användarrecensioner.",

  // Social
  ogImage: "/og-image.png",

  // Navigation
  navigation: [
    { label: "Hem", href: "/" },
    { label: "Jämför", href: "/jamfor" },
    { label: "Köpguide", href: "/guide" },
    { label: "Husdjur", href: "/husdjur" },
    { label: "Lägenheter", href: "/lagenheter" },
  ],

  // Footer links
  footerLinks: [
    { label: "Om oss", href: "/om-oss" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Integritetspolicy", href: "/integritetspolicy" },
  ],
};

export type SiteConfig = typeof siteConfig;
