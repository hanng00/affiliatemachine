import { useParams, Navigate } from "react-router-dom";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { getSystem, formatSek } from "@affiliate/heatpump-calculator";
import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/HeroSection";
import { kommuner } from "@/config/spine";

export default function SystemPage() {
  const { system: systemId } = useParams();
  const system = systemId ? getSystem(systemId) : undefined;

  // Unknown system slug → home (also stops the /:system route from shadowing
  // any future static paths during client navigation).
  if (!system) return <Navigate to="/" replace />;

  const path = `/${system.id}`;
  const title = `${system.name} – kostnad, ROT & besparing 2026 | ${siteConfig.brand}`;
  const description = `Vad kostar ${system.name.toLowerCase()}? Räkna ut investering (${formatSek(
    system.investeringRange[0]
  )}–${formatSek(
    system.investeringRange[1]
  )} före ROT), ROT-avdrag, driftskostnad och återbetalning för ditt hus – och jämför installatörer.`;

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={canonicalUrl(siteConfig.domain, path)}
        ogImage={siteConfig.ogImage}
        siteName={siteConfig.name}
      />
      <SchemaScript
        schema={{
          type: "BreadcrumbList",
          items: [
            { name: "Hem", url: canonicalUrl(siteConfig.domain, "/") },
            { name: system.name, url: canonicalUrl(siteConfig.domain, path) },
          ],
        }}
      />

      {/* Hero with 3D house focused on this system */}
      <HeroSection focusSystem={system.id} placement={`system_${system.id}`} />

      {/* System specs */}
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold text-foreground">{system.name} i korthet</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{system.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-secondary px-3 py-1">
              <strong className="text-foreground">{formatSek(system.investeringRange[0])}–{formatSek(system.investeringRange[1])}</strong>
              <span className="text-muted-foreground"> före ROT</span>
            </span>
            <span className="rounded-full bg-secondary px-3 py-1">
              SCOP <strong className="text-foreground">{system.scop}</strong>
            </span>
            <span className="rounded-full bg-secondary px-3 py-1">
              Livslängd <strong className="text-foreground">{system.lifeYears} år</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Local intent → the spine */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            {system.name} nära dig
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Priset på {system.name.toLowerCase()} påverkas av var i landet du bor och av lokala installatörer.
            Välj din kommun för en lokal prisbild och en lista på F-skatt-verifierade installatörer:
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {kommuner.map((k) => (
              <a
                key={k.slug}
                href={`/${system.id}/${k.slug}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {system.name} i {k.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
