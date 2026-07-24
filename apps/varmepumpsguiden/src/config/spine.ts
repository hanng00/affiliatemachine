import { systems } from "@affiliate/heatpump-calculator";

/**
 * The programmatic spine: kommuner we publish {system}×{kommun} pages for.
 *
 * Start SMALL and dense (per the pSEO playbook + JOURNAL 2026-06-18): a tight
 * spine of high-value, enriched pages beats spraying thin ones. Expand a kommun
 * into the spine only once it has verified installers + search demand. The list
 * is the single source of truth for both routing (App.tsx) and prerender.
 */
export const kommuner: { slug: string; name: string }[] = [
  { slug: "linkoping", name: "Linköping" },
];

export const systemSlugs = systems.map((s) => s.id);

/** Every {system}/{kommun} path in the spine, e.g. "/bergvarme/linkoping". */
export function spinePaths(): string[] {
  return systemSlugs.flatMap((sys) => kommuner.map((k) => `/${sys}/${k.slug}`));
}

/** System landing paths, e.g. "/bergvarme". */
export function systemPaths(): string[] {
  return systemSlugs.map((sys) => `/${sys}`);
}

export function getKommun(slug: string) {
  return kommuner.find((k) => k.slug === slug);
}
