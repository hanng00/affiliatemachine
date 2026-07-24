import { useParams, Navigate } from "react-router-dom";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { getSystem, installersFor } from "@affiliate/heatpump-calculator";
import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/HeroSection";
import { getKommun } from "@/config/spine";

/**
 * The programmatic spine page ({system}×{kommun}) — the legal "Momondo" payoff:
 * our OWN computed price/ROT/saving for the house PLUS a shortlist of F-skatt-
 * verified local installers (from free Bolagsverket/SCB data, NEVER scraped
 * reviews). The fused computed-value + verified-firms is the unique content that
 * survives Google's scaled-content update — a thin scraper directory cannot.
 */
export default function SpinePage() {
  const { system: systemId, kommun: kommunSlug } = useParams();
  const system = systemId ? getSystem(systemId) : undefined;
  const kommun = kommunSlug ? getKommun(kommunSlug) : undefined;

  if (!system || !kommun) return <Navigate to="/" replace />;

  const path = `/${system.id}/${kommun.slug}`;
  const installers = installersFor(system.id, kommun.slug);

  const title = `${system.name} i ${kommun.name} – pris, ROT & installatörer 2026 | ${siteConfig.brand}`;
  const description = `Vad kostar ${system.name.toLowerCase()} i ${kommun.name}? Räkna ut pris efter ROT, driftskostnad och besparing för ditt hus – och jämför ${installers.length} F-skatt-verifierade installatörer i ${kommun.name}.`;

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
            { name: system.name, url: canonicalUrl(siteConfig.domain, `/${system.id}`) },
            { name: kommun.name, url: canonicalUrl(siteConfig.domain, path) },
          ],
        }}
      />

      {/* Hero with 3D house focused on this system + location */}
      <HeroSection
        focusSystem={system.id}
        locationLabel={`i ${kommun.name}`}
        placement={`spine_${system.id}_${kommun.slug}`}
      />

      {/* The verified-installer shortlist — the Momondo payoff, legal data only */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">
            Installatörer för {system.name.toLowerCase()} i {kommun.name}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Företag i {kommun.name} med <strong className="text-foreground">aktiv F-skatt</strong> inom värme och
            installation, enligt Bolagsverket och SCB. Statusen är en faktauppgift – ingen kvalitetsrankning.
            Begär offert nedan så matchas du mot lokala installatörer.
          </p>

          {installers.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {installers.map((inst) => (
                <li
                  key={inst.orgNr}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">{inst.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Org.nr {inst.orgNr} · {kommun.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-grass-soft px-3 py-1 text-xs font-semibold text-grass">
                    Verifierad F-skatt
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
              Vi bygger just nu listan med verifierade installatörer i {kommun.name}. Använd kalkylatorn ovan
              och begär offert så matchar vi dig med installatörer i området.
            </p>
          )}

          <p className="mt-6 text-sm text-muted-foreground">
            Priset på {system.name.toLowerCase()} kan vara 15–25 % högre i storstadsregioner. Begär alltid minst
            tre offerter och se till att arbete och material specificeras separat för korrekt ROT-avdrag.
          </p>
        </div>
      </section>
    </>
  );
}
