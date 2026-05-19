import { Helmet } from "react-helmet-async";

export interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
  locale?: string;
  siteName?: string;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  locale = "sv_SE",
  siteName,
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {canonical && <link rel="canonical" href={canonical} />}

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={locale} />
      {siteName && <meta property="og:site_name" content={siteName} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
