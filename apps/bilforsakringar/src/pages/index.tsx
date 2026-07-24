import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingDown, Lock, BadgeCheck, ArrowRight } from "lucide-react";
import { siteConfig } from "../config/site";
import { QuoteInput } from "../components/QuoteInput";
import { CoverageComparison } from "../components/CoverageComparison";
import { ProviderTable } from "../components/ProviderTable";
import { Faq } from "../components/Faq";
import { generalFaq, priceFactors } from "../config/content";

export default function HomePage() {
  return (
    <>
      <SEOHead
        title={siteConfig.title}
        description={siteConfig.description}
        canonical={canonicalUrl(siteConfig.domain, "/")}
        siteName={siteConfig.name}
      />
      <SchemaScript
        schema={{
          type: "WebSite",
          name: siteConfig.name,
          url: canonicalUrl(siteConfig.domain, "/"),
          description: siteConfig.description,
        }}
      />
      <SchemaScript
        schema={{ type: "FAQPage", questions: generalFaq }}
      />

      {/* Hero: value + tool side by side. Tool leads with regno only (mobile-first). */}
      <section className="bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-background)] px-4 py-12 md:py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="rise text-center lg:text-left">
            <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-primary)]">
              Oberoende prisjämförelse · Uppdaterad 2026
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Jämför bilförsäkringar
              <span className="text-[var(--color-primary)]"> och hitta billigast</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--color-text-muted)] lg:text-xl">
              Priset för exakt samma bil kan skilja tusenlappar mellan bolagen. Ange
              ditt registreringsnummer så jämför vi riktiga priser från Sveriges
              största försäkringsbolag — gratis och oberoende.
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground lg:justify-start">
              <li className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-[var(--color-success)]" /> Riktiga priser
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[var(--color-primary)]" /> Krypterat
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-[var(--color-primary)]" /> Oberoende
              </li>
            </ul>
          </div>

          <div className="rise">
            <QuoteInput />
          </div>
        </div>
      </section>

      {/* Coverage comparison — the factual "jämför" content the head queries want. */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Trafik, halv eller helförsäkring?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--color-text-muted)]">
              Vilken nivå du behöver beror på bilens värde och om den är lånefinansierad.
              Så här skiljer sig skydden åt.
            </p>
          </div>
          <CoverageComparison />
        </div>
      </section>

      {/* Price factors — factual, no fabricated numbers. */}
      <section className="bg-[var(--color-secondary)] px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Vad påverkar priset?
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {priceFactors.map((f) => (
              <div
                key={f.title}
                className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)]">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Försäkringsbolag vi jämför
            </h2>
            <Link
              to="/jamfor"
              className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Se hela jämförelsen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProviderTable linkToCompany />

          <p className="mt-8 text-center text-[var(--color-text-muted)]">
            Letar du efter{" "}
            <Link
              to="/basta-bilforsakring-2026"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              billigaste och bästa bilförsäkringen 2026
            </Link>
            ? Vi går igenom hur du sänker priset i år. Är du ny bilägare kan du läsa
            vår{" "}
            <Link
              to="/forstagangsbil"
              className="font-semibold text-[var(--color-primary)] hover:underline"
            >
              guide för förstagångsbilägare
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-secondary)] px-4 py-14">
        <Faq items={generalFaq} title="Vanliga frågor om bilförsäkring" />
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <ShieldCheck className="h-4 w-4" />
            Läs hela guiden till bilförsäkring
          </Link>
        </div>
      </section>
    </>
  );
}
