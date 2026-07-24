import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { systems, formatSek } from "@affiliate/heatpump-calculator";
import { siteConfig } from "@/config/site";
import { HeroSection } from "@/components/HeroSection";

const faqs = [
  {
    question: "Hur räknar kalkylatorn ut min kostnad och besparing?",
    answer:
      "Vi utgår från din uppvärmda boyta och nuvarande uppvärmning samt publika antaganden: ett typiskt värmebehov på cirka 120 kWh per kvadratmeter och år, systemens årsvärmefaktor (SCOP) och dagens elpris. ROT-avdraget beräknas som 30 % av arbetskostnaden. Resultatet är en uppskattning – den bindande offerten kommer alltid från installatören.",
  },
  {
    question: "Vad kostar en värmepump 2026?",
    answer:
      "Det beror på typ: en luft/luft-värmepump kostar ofta 40 000–70 000 kr, luft/vatten 100 000–160 000 kr och bergvärme 170 000–230 000 kr inklusive borrning. ROT-avdraget sänker arbetskostnaden med 30 %. Använd kalkylatorn för en uppskattning för just ditt hus.",
  },
  {
    question: "Hur fungerar ROT-avdraget för värmepump?",
    answer:
      "ROT-avdraget ger 30 % skattereduktion på arbetskostnaden (inte på själva pumpen eller materialet), upp till 50 000 kr per person och år. Installatören drar av beloppet direkt på fakturan. Äger ni huset tillsammans kan ni dela på avdraget.",
  },
  {
    question: "Vilken värmepump är bäst för mig?",
    answer:
      "Har du vattenburet system är luft/vatten eller bergvärme oftast bäst – bergvärme ger lägst driftskostnad men kostar mest att installera. Saknar du vattenburet system är luft/luft billigast och enklast, men täcker inte hela värmebehovet. Kalkylatorn visar besparing och återbetalning för alla tre så du kan jämföra.",
  },
  {
    question: "Är beräkningen exakt?",
    answer:
      "Nej, det är en uppskattning för att ge dig en känsla för storleksordningen. Faktisk kostnad och besparing påverkas av husets isolering, klimatzon, befintligt system och din elförbrukning. För ett exakt pris behöver du en offert från en installatör.",
  },
];

export default function HomePage() {
  return (
    <>
      <SEOHead
        title={siteConfig.title}
        description={siteConfig.description}
        canonical={canonicalUrl(siteConfig.domain, "/")}
        ogImage={siteConfig.ogImage}
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
      <SchemaScript schema={{ type: "FAQPage", questions: faqs }} />

      {/* Hero with 3D house + calculator */}
      <HeroSection placement="home_hero" />

      {/* System overview — routes the Comparer to the right type page */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-foreground">Tre typer av värmepump</h2>
          <p className="mt-3 text-muted-foreground">Välj en typ för att läsa mer om kostnad, drift och passform.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {systems.map((s) => (
            <a
              key={s.id}
              href={`/${s.id}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary">
                {s.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-foreground">
                Från {formatSek(s.investeringRange[0])}
                <span className="font-normal text-muted-foreground"> före ROT</span>
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-primary">Läs mer →</span>
            </a>
          ))}
        </div>
      </section>

      {/* ROT explainer — captures informational intent */}
      <section id="rot-avdrag" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">ROT-avdrag för värmepump 2026</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Vid installation av värmepump får du <strong className="text-foreground">ROT-avdrag</strong> – en
              skattereduktion på <strong className="text-foreground">30 %</strong> av arbetskostnaden, upp till
              50 000 kr per person och år. Avdraget gäller bara arbetet, inte själva pumpen eller materialet, och
              dras direkt på fakturan av installatören. Bor ni två som äger huset tillsammans kan ni dela på
              avdraget – upp till 100 000 kr totalt.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              För bergvärme är arbetskostnaden – särskilt borrningen – en stor del av totalen, vilket gör
              ROT-avdraget extra värdefullt. Använd kalkylatorn ovan för en uppskattning för just ditt hus.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — matches the FAQPage schema above */}
      <section id="faq" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-extrabold text-foreground">Vanliga frågor</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold text-foreground">
                  {f.question}
                  <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
