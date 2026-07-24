import type { ReactNode } from "react";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { siteConfig } from "../config/site";
import type { FaqItem } from "../config/content";

interface ContentPageProps {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro?: string;
  crumbs: Crumb[];
  faq?: FaqItem[];
  children: ReactNode;
}

/**
 * Shared shell for editorial/content routes: per-page SEO + canonical, a visible
 * breadcrumb backed by BreadcrumbList JSON-LD, optional FAQPage JSON-LD, and a
 * constrained reading column. Keeps every cluster page consistent and crawlable.
 */
export function ContentPage({
  path,
  title,
  description,
  h1,
  intro,
  crumbs,
  faq,
  children,
}: ContentPageProps) {
  const canonical = canonicalUrl(siteConfig.domain, path);

  return (
    <>
      <SEOHead title={title} description={description} canonical={canonical} siteName={siteConfig.name} />
      <SchemaScript
        schema={{
          type: "BreadcrumbList",
          items: crumbs.map((c) => ({
            name: c.name,
            url: canonicalUrl(siteConfig.domain, c.href),
          })),
        }}
      />
      {faq && faq.length > 0 && <SchemaScript schema={{ type: "FAQPage", questions: faq }} />}

      <div className="mx-auto max-w-4xl px-4 py-10">
        <Breadcrumbs items={crumbs} />
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {h1}
          </h1>
          {intro && (
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-text-muted)]">{intro}</p>
          )}
        </header>
        {children}
      </div>
    </>
  );
}
