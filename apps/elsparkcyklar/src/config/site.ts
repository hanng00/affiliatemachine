export const siteConfig = {
  name: "Elsparkcyklar",
  logo: "/logo.svg",
  domain: "elsparkcyklar.se",
  defaultLocale: "sv",
  locales: ["sv"] as const,

  // Google
  gtmId: "GTM-WXHXDX9P",
  ga4Id: "G-VBSKY07630",

  // Meta
  title: "Bästa elsparkcyklarna 2026 – Test, jämförelse & köpguide | Elsparkcyklar.se",
  description:
    "Vi har testat och jämfört de bästa elsparkcyklarna på svenska marknaden. Hitta rätt modell för dig – från budget till premium. Uppdaterad maj 2026.",

  // Social
  ogImage: "/og-image.png",

  // Navigation
  navigation: [
    { label: "Hem", href: "/" },
    { label: "Jämför", href: "/jamfor" },
    { label: "Regler", href: "/regler" },
    { label: "Guider", href: "/guider" },
  ],

  // Footer links
  footerLinks: [
    { label: "Om oss", href: "/om-oss" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Integritetspolicy", href: "/integritetspolicy" },
  ],
};

export type SiteConfig = typeof siteConfig;
