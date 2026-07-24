import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { siteConfig } from "@/config/site";
import LoanCalculator from "@/components/LoanCalculator";
import { CostDiagram, ConsolidationDiagram } from "@/components/Diagrams";

// The calculator owns the above-the-fold hero (headline + live number + the
// tool). It SSRs with seeded values — its window-only work (rAF count-up) lives
// in effects, so prerender renders the full hero (H1 + figures + inputs) into
// the HTML. No lazy boundary: unlike solceller's Leaflet map, nothing here
// touches window at render time, so keeping it in the SSR pass is what makes
// the page rank without JS and avoids an empty-form flash.

const faqs = [
  {
    question: "Vad innebär det slopade ränteavdraget 2026?",
    answer:
      "Tidigare fick du tillbaka 30 % av räntekostnaden på lån utan säkerhet (privatlån, kreditkort, snabblån) som skattereduktion. Avdraget halverades till 15 % för inkomståret 2025 och tas bort helt från och med 1 januari 2026. Det betyder att samma lån, med samma ränta, blir dyrare för dig – du betalar full ränta utan att få något tillbaka i deklarationen. Källa: Skatteverket.",
  },
  {
    question: "Hur räknar kalkylatorn ut vad det kostar mig?",
    answer:
      "Vi tar räntekostnaden på de lån du lägger in och multiplicerar med 30 % – det är ungefär vad du tidigare fick tillbaka via skattereduktionen och som nu försvinner. Det är en uppskattning baserad på dina egna uppgifter; exakt belopp beror på din totala kapitalsituation i deklarationen.",
  },
  {
    question: "Vad är ett samlingslån?",
    answer:
      "Ett samlingslån (eller saml/refinansieringslån) innebär att du tar ett nytt lån som löser dina befintliga dyra lån och krediter, så att du får en enda ränta och en enda månadsbetalning. Om den nya räntan är lägre än ditt nuvarande viktade snitt minskar din räntekostnad – och du får bättre överblick.",
  },
  {
    question: "Sparar jag verkligen på att samla mina lån?",
    answer:
      "Det beror på räntan. Har du dyra krediter och snabblån på 18–25 % och kan samla dem till exempelvis 7–9 % minskar räntekostnaden tydligt. Har du redan låg ränta finns det lite att vinna – då visar kalkylatorn det. Den faktiska räntan sätts av banken efter en kreditprövning; vi visar bara en uppskattning.",
  },
  {
    question: "Lämnar jag ut några personuppgifter?",
    answer:
      "Nej. Kalkylatorn körs helt i din webbläsare och sparar inga personuppgifter. Först om du själv väljer att gå vidare och jämföra samlingslån lämnar du uppgifter – och då hos förmedlaren, inte hos oss.",
  },
  {
    question: "Kostar det något att använda Räntekollen?",
    answer:
      "Nej, kalkylatorn är gratis och kräver ingen inloggning. Om du väljer att ansöka om samlingslån via våra länkar kan vi få ersättning från förmedlaren – det kostar dig inget extra (annonssamarbete).",
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

      {/* App — split hero: story + live number (left) · the tool (right).
          The calculator renders both columns so one component owns the state
          that feeds the headline figure and the inputs. */}
      <section id="rakna" className="relative overflow-hidden bg-gradient-to-b from-teal-soft/40 to-background">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <LoanCalculator />
        </div>
      </section>

      {/* The SEO wedge — ränteavdrag 2026 explainer (prerendered) */}
      <section id="ranteavdrag" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-semibold text-foreground">
              Ränteavdraget på lån utan säkerhet 2026
            </h2>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">
              <CostDiagram className="mx-auto w-full max-w-md" />
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Av räntan på dina lån fick du tidigare tillbaka 30 % via skattereduktionen – från 2026 är den noll.
              </p>
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">
              Fram till och med inkomståret 2024 fick du en <strong className="text-foreground">skattereduktion
              på 30 %</strong> av räntekostnaden på dina lån, även lån utan säkerhet som privatlån,
              kreditkort, snabblån och delbetalningar. För inkomståret 2025 halverades avdraget till
              <strong className="text-foreground"> 15 %</strong>, och från och med
              <strong className="text-foreground"> 1 januari 2026 tas det bort helt</strong> för lån utan
              säkerhet. Avdraget på bolån och andra lån med säkerhet påverkas inte.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Det betyder att samma lån blir dyrare – inte för att räntan stigit, utan för att du inte
              längre får tillbaka en del av räntan i deklarationen. För ett hushåll med 100 000 kr i dyra
              krediter på 18 % är det runt <strong className="text-foreground">5 400 kr om året</strong> som
              tidigare kom tillbaka och nu försvinner. Räkna på just dina lån med kalkylatorn ovan.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Källa: Skatteverket, ”Avdrag för ränteutgifter”. Räntetaket för konsumtionskrediter är 22 %
              (Finansinspektionen, sedan mars 2025).
            </p>
          </div>
        </div>
      </section>

      {/* How consolidation works (prerendered) */}
      <section id="samlingslan" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground">Så funkar samlingslån</h2>
          <p className="mt-3 text-muted-foreground">
            Ett lån som löser dina dyra – en ränta, en betalning, bättre överblick.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8">
          <ConsolidationDiagram className="mx-auto w-full max-w-md" />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Din räntekostnad per år idag jämfört med ett samlat lån till en lägre ränta – ändra dina lån ovan så uppdateras siffrorna.
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { n: "1", t: "Samla det dyra", d: "Krediter och snabblån på 18–25 % är det som kostar mest. Ett samlingslån löser dem." },
            { n: "2", t: "En lägre ränta", d: "Med säkrare återbetalning på ett samlat lån kan räntan bli betydligt lägre än korträntorna." },
            { n: "3", t: "En betalning", d: "I stället för flera förfallodatum får du en månadsbetalning – enklare att överblicka." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust block — "en ansökan, en UC" (prerendered) */}
      <section className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                En ansökan, en kreditupplysning
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Att jämföra samlingslån via en förmedlare innebär att du fyller i en enda ansökan som
                skickas till många banker samtidigt. Det blir bara <strong className="text-foreground">en
                kreditupplysning (UC)</strong> även om flera banker svarar – inte en per bank. Du ser
                erbjudandena och väljer själv om du vill tacka ja. Helt utan kostnad och utan köpkrav.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "En ansökan – flera bankers erbjudanden",
                "Endast en kreditupplysning (UC)",
                "Kostnadsfritt och utan förpliktelser",
                "Du väljer själv – inget köptvång",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
                    ✓
                  </span>
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ — matches the FAQPage schema above */}
      <section id="faq" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-semibold text-foreground">Vanliga frågor</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-semibold text-foreground">
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
