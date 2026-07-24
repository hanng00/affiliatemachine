import { SEOHead, canonicalUrl } from "@affiliate/seo";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAffiliate } from "../config/affiliates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReglerPage() {
  const roadLegalPick = getAffiliate("eWheelsE2S");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Är elsparkcyklar lagliga i Sverige 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, elsparkcyklar är lagliga i Sverige om de har max 250W motor och max 20 km/h topphastighet.",
        },
      },
      {
        "@type": "Question",
        name: "Behöver jag försäkring för min elsparkcykel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Du behöver trafikförsäkring om din elsparkcykel går snabbare än 20 km/h, ELLER snabbare än 14 km/h OCH väger mer än 25 kg.",
        },
      },
      {
        "@type": "Question",
        name: "Var får jag köra elsparkcykel i Sverige?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Du får köra på cykelbanor och cykelvägar. Du får INTE köra på trottoarer eller gångbanor.",
        },
      },
      {
        "@type": "Question",
        name: "Måste jag ha hjälm när jag kör elsparkcykel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hjälm är obligatoriskt för personer under 15 år. För vuxna är det inte lagkrav, men starkt rekommenderat.",
        },
      },
    ],
  };

  return (
    <>
      <SEOHead
        title={`Svenska regler för elsparkcyklar 2026 – Lagar, försäkring & krav | ${siteConfig.brand}`}
        description="Komplett guide till svenska regler för elsparkcyklar. Lär dig om lagkrav, försäkring, var du får köra och vilka modeller som är väglagliga."
        canonical={canonicalUrl(siteConfig.domain, "/regler")}
        siteName={siteConfig.name}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-[var(--color-border-subtle)] py-10 md:py-14">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[var(--color-accent)]">
              Uppdaterad maj 2026
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.25] tracking-tight">
              Svenska regler för elsparkcyklar
            </h1>
            <p className="mt-4 text-[1.1rem] leading-[1.65] text-muted-foreground">
              Allt du behöver veta om lagar, försäkringskrav och var du får köra.
              Undvik böter och kör lagligt.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">
              Snabb sammanfattning
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center">
                <div className="mb-2 font-mono text-2xl font-bold text-[var(--color-success)]">✓</div>
                <h3 className="font-bold">Väglaglig</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Max 250W motor<br />
                  Max 20 km/h<br />
                  Ingen registrering krävs
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center">
                <div className="mb-2 font-mono text-2xl font-bold text-[var(--color-warning)]">⚠</div>
                <h3 className="font-bold">Kräver försäkring</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Över 20 km/h<br />
                  ELLER över 14 km/h + 25 kg<br />
                  Klassas som moped
                </p>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center">
                <div className="mb-2 font-mono text-2xl font-bold text-[var(--color-danger)]">✗</div>
                <h3 className="font-bold">Förbjudet</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
                  Köra på trottoar<br />
                  Köra utan ljus i mörker<br />
                  Under 15 utan hjälm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Rules */}
      <section className="bg-[var(--color-bg-muted)] py-12">
        <div className="mx-auto max-w-[720px] px-5">
          <div className="flex flex-col gap-6">

            {/* Classification */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] font-mono text-sm font-semibold text-white">1</span>
                Klassificering
              </h2>
              <div className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
                <p className="mb-4">I Sverige klassificeras elsparkcyklar baserat på motoreffekt och topphastighet:</p>
                <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-muted)]">
                        <th className="p-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Klass</th>
                        <th className="p-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Specifikation</th>
                        <th className="p-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Krav</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="p-3"><Badge variant="legal">Cykel</Badge></td>
                        <td className="p-3">Max 250W, max 20 km/h</td>
                        <td className="p-3">Inga särskilda krav</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="p-3"><Badge variant="warning">Moped klass II</Badge></td>
                        <td className="p-3">Max 25 km/h</td>
                        <td className="p-3">Försäkring, 15 år</td>
                      </tr>
                      <tr>
                        <td className="p-3"><Badge variant="destructive">Moped klass I</Badge></td>
                        <td className="p-3">Max 45 km/h</td>
                        <td className="p-3">Försäkring, körkort AM, 15 år</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] font-mono text-sm font-semibold text-white">2</span>
                Försäkringskrav
              </h2>
              <div className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
                <p className="mb-3">
                  Du <strong className="text-foreground">behöver trafikförsäkring</strong> om din elsparkcykel uppfyller något av följande:
                </p>
                <ul className="mb-4 ml-4 list-disc space-y-1.5">
                  <li>Topphastighet <strong className="text-foreground">över 20 km/h</strong></li>
                  <li>Topphastighet <strong className="text-foreground">över 14 km/h OCH vikt över 25 kg</strong></li>
                </ul>
                <div className="rounded-[var(--radius-md)] border-l-3 border-l-[var(--color-warning)] bg-[var(--color-warning-bg)] p-4">
                  <p className="font-medium text-foreground">
                    ⚠️ Att köra utan försäkring när det krävs kan ge böter på upp till 4 000 kr.
                  </p>
                </div>
              </div>
            </div>

            {/* Where to ride */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] font-mono text-sm font-semibold text-white">3</span>
                Var får du köra?
              </h2>
              <div className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-success-bg)] p-4">
                    <h4 className="font-semibold text-[var(--color-success)]">✓ Tillåtet</h4>
                    <ul className="mt-2 space-y-1 text-[0.85rem]">
                      <li>• Cykelbanor och cykelvägar</li>
                      <li>• Körbanan (om cykelbana saknas)</li>
                      <li>• Gågator (max gångfart)</li>
                    </ul>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[rgba(185,28,28,0.06)] p-4">
                    <h4 className="font-semibold text-[var(--color-danger)]">✗ Förbjudet</h4>
                    <ul className="mt-2 space-y-1 text-[0.85rem]">
                      <li>• Trottoarer och gångbanor</li>
                      <li>• Motorvägar och motortrafikleder</li>
                      <li>• Gångfartsområden (över gångfart)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Helmet */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] font-mono text-sm font-semibold text-white">4</span>
                Hjälmkrav
              </h2>
              <div className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
                <p className="mb-3">
                  <strong className="text-foreground">Hjälm är obligatoriskt för personer under 15 år.</strong>
                </p>
                <p>
                  För vuxna finns inget lagkrav på hjälm, men vi rekommenderar starkt att alltid använda hjälm.
                  Skador vid elsparkcykelolyckor är ofta allvarliga, särskilt huvudskador.
                </p>
              </div>
            </div>

            {/* Lights */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] font-mono text-sm font-semibold text-white">5</span>
                Belysning
              </h2>
              <div className="mt-4 text-[0.9rem] leading-relaxed text-muted-foreground">
                <p className="mb-3">Vid körning i mörker eller dålig sikt måste du ha:</p>
                <ul className="ml-4 list-disc space-y-1.5">
                  <li><strong className="text-foreground">Vitt eller gult ljus fram</strong></li>
                  <li><strong className="text-foreground">Rött ljus bak</strong></li>
                  <li><strong className="text-foreground">Röd reflex bak</strong></li>
                </ul>
              </div>
            </div>

            {/* Penalties */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
              <h2 className="flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-accent)] font-mono text-sm font-semibold text-white">6</span>
                Böter och straff
              </h2>
              <div className="mt-4">
                <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-muted)]">
                        <th className="p-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Överträdelse</th>
                        <th className="p-3 text-right text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Böter</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="p-3">Köra utan försäkring (när det krävs)</td>
                        <td className="p-3 text-right font-mono font-medium">~4 000 kr</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="p-3">Köra på trottoar</td>
                        <td className="p-3 text-right font-mono font-medium">500–1 500 kr</td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="p-3">Köra utan belysning i mörker</td>
                        <td className="p-3 text-right font-mono font-medium">500 kr</td>
                      </tr>
                      <tr>
                        <td className="p-3">Barn under 15 utan hjälm</td>
                        <td className="p-3 text-right font-mono font-medium">500 kr</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Road Legal Recommendation */}
      <section className="py-12">
        <div className="mx-auto max-w-[720px] px-5">
          <div className="mb-6 text-center">
            <Badge variant="legal" className="mb-3">✓ Väglaglig</Badge>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">
              Vår rekommendation för laglig körning
            </h2>
            <p className="mt-2 text-muted-foreground">
              Om du vill köra helt lagligt utan försäkring eller registrering.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold">{roadLegalPick.name}</h3>
                <p className="mt-2 text-[0.9rem] text-muted-foreground">{roadLegalPick.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {roadLegalPick.pros?.slice(0, 4).map((pro, i) => (
                    <li key={i} className="flex items-center gap-2 text-[0.85rem] text-muted-foreground">
                      <span className="font-bold text-[var(--color-success)]">+</span> {pro}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <span className="font-mono text-2xl font-bold">
                    {roadLegalPick.price.amount.toLocaleString("sv-SE")} kr
                  </span>
                </div>
                <Button asChild className="mt-4">
                  <a href={roadLegalPick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                    Se pris hos återförsäljare →
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] p-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Motor:</span>
                      <span className="font-mono font-medium">{roadLegalPick.motor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Topphastighet:</span>
                      <span className="font-mono font-medium">{roadLegalPick.topSpeed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Räckvidd:</span>
                      <span className="font-mono font-medium">{roadLegalPick.range}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vikt:</span>
                      <span className="font-mono font-medium">{roadLegalPick.weight}</span>
                    </div>
                    <div className="border-t border-[var(--color-border-subtle)] pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Väglaglig:</span>
                        <Badge variant="legal">Ja</Badge>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="text-muted-foreground">Försäkring:</span>
                        <span className="font-medium text-[var(--color-success)]">Ej nödvändig</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-bg-muted)] py-12">
        <div className="mx-auto max-w-[720px] px-5">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">
            Vanliga frågor om regler
          </h2>
          <div className="flex flex-col gap-2">
            <details className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Får jag köra elsparkcykel på trottoaren?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-relaxed text-muted-foreground">
                <p>
                  Nej, det är förbjudet att köra elsparkcykel på trottoarer och gångbanor. Du ska köra på cykelbanor
                  eller på körbanan om cykelbana saknas.
                </p>
              </div>
            </details>
            <details className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Kan jag begränsa hastigheten för att göra den laglig?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-relaxed text-muted-foreground">
                <p>
                  Tekniskt sett ja, men det är komplicerat. Många modeller har hastighetsbegränsning i appen, men
                  det är motoreffekten som avgör klassificeringen. En 400W-motor är inte laglig även om du begränsar
                  hastigheten till 20 km/h.
                </p>
              </div>
            </details>
            <details className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Vad händer om jag kör utan försäkring?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-relaxed text-muted-foreground">
                <p>
                  Om du kör en elsparkcykel som kräver försäkring utan att ha det, riskerar du böter på cirka 4 000 kr.
                  Dessutom kan du bli personligt ansvarig för skador du orsakar.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border-subtle)] py-12">
        <div className="mx-auto max-w-[1080px] px-5 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">
            Redo att hitta din elsparkcykel?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Nu när du vet reglerna – jämför modeller och hitta rätt för dig.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/#produkter">Jämför alla modeller →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Se topplistan</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
