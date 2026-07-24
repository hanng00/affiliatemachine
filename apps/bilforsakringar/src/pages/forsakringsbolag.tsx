import { useParams, Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { ContentPage } from "../components/ContentPage";
import { ProviderTable } from "../components/ProviderTable";
import { CoverageComparison } from "../components/CoverageComparison";
import { providers } from "../config/content";
import { siteConfig } from "../config/site";

export default function ForsakringsbolagPage() {
  const { slug } = useParams<{ slug?: string }>();
  const provider = slug ? providers.find((p) => p.slug === slug) : undefined;

  if (slug && provider) {
    return (
      <ContentPage
        path={`/forsakringsbolag/${provider.slug}`}
        title={`${provider.name} bilförsäkring 2026 – pris & omdöme | ${siteConfig.brand}`}
        description={`${provider.name} bilförsäkring: vad ingår, ungefärligt pris och hur det står sig mot andra bolag. Jämför ${provider.name} med övriga och se ditt riktiga pris.`}
        h1={`${provider.name} bilförsäkring`}
        intro={provider.blurb}
        crumbs={[
          { name: "Hem", href: "/" },
          { name: "Försäkringsbolag", href: "/forsakringsbolag" },
          { name: provider.name, href: `/forsakringsbolag/${provider.slug}` },
        ]}
      >
        <div className="space-y-12">
          <section className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-bold text-foreground">
                Styrkor med {provider.name}
              </h2>
              <span className="rounded-full bg-[var(--color-secondary)] px-3 py-1 text-sm font-medium text-[var(--color-primary)]">
                ca {provider.priceRange[0]}–{provider.priceRange[1]} kr/mån*
              </span>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {provider.strengths.map((s) => (
                <li key={s} className="flex items-center gap-2 text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[var(--color-text-subtle)]">
              *Vägledande månadsspann för en typisk halvförsäkring — inte en offert.
              Ditt pris hos {provider.name} beror på bil, ålder, ort och körsträcka.
            </p>
          </section>

          <section>
            <h2 className="mb-5 font-display text-2xl font-bold text-foreground">
              Vad ingår i en bilförsäkring?
            </h2>
            <CoverageComparison />
          </section>

          <section className="rounded-[var(--radius)] bg-[var(--color-secondary)] p-6 text-center">
            <h2 className="font-display text-xl font-bold text-foreground">
              Är {provider.name} billigast för dig?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-[var(--color-text-muted)]">
              Det enda sättet att veta är att jämföra. Ange registreringsnumret så
              ser du {provider.name} sida vid sida med andra bolag.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Jämför {provider.name} med andra <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </ContentPage>
    );
  }

  // Hub view (also the fallback for an unknown slug).
  return (
    <ContentPage
      path="/forsakringsbolag"
      title={`Försäkringsbolag för bilförsäkring 2026 | ${siteConfig.brand}`}
      description="Översikt av de största försäkringsbolagen för bilförsäkring i Sverige — If, Trygg-Hansa, Gjensidige, Folksam och Länsförsäkringar. Jämför och hitta billigast."
      h1="Försäkringsbolag för bilförsäkring"
      intro="De största bolagen på den svenska marknaden, deras styrkor och ungefärliga prisnivå. Klicka in på ett bolag för mer detaljer, eller jämför allihop direkt med ditt registreringsnummer."
      crumbs={[
        { name: "Hem", href: "/" },
        { name: "Försäkringsbolag", href: "/forsakringsbolag" },
      ]}
    >
      <ProviderTable linkToCompany />
    </ContentPage>
  );
}
