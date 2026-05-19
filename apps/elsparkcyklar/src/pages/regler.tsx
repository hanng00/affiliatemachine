import { SEOHead } from "@affiliate/seo";
import { Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAffiliate } from "../config/affiliates";

export default function ReglerPage() {
  const roadLegalPick = getAffiliate("niuKqi3Pro");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Är elsparkcyklar lagliga i Sverige 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, elsparkcyklar är lagliga i Sverige om de har max 250W motor och max 20 km/h topphastighet. Dessa klassas som cyklar och får köras på cykelbanor utan registrering eller körkort.",
        },
      },
      {
        "@type": "Question",
        name: "Behöver jag försäkring för min elsparkcykel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Du behöver trafikförsäkring om din elsparkcykel: 1) Går snabbare än 20 km/h, ELLER 2) Går snabbare än 14 km/h OCH väger mer än 25 kg. Elsparkcyklar som uppfyller dessa krav klassas som moped.",
        },
      },
      {
        "@type": "Question",
        name: "Var får jag köra elsparkcykel i Sverige?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Du får köra på cykelbanor och cykelvägar. Du får INTE köra på trottoarer eller gångbanor. På vägar utan cykelbana får du köra på körbanan, men håll dig till höger.",
        },
      },
      {
        "@type": "Question",
        name: "Måste jag ha hjälm när jag kör elsparkcykel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hjälm är obligatoriskt för personer under 15 år. För vuxna är det inte lagkrav, men starkt rekommenderat för din säkerhet.",
        },
      },
      {
        "@type": "Question",
        name: "Vilka elsparkcyklar är lagliga på väg i Sverige?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Elsparkcyklar med max 250W motor och max 20 km/h topphastighet är lagliga på cykelbanor. Exempel på väglagliga modeller är NIU KQi3 Pro och Ninebot F2 Pro D (20 km/h-versionen).",
        },
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Svenska regler för elsparkcyklar 2026 – Lagar, försäkring & krav | Elsparkcyklar.se"
        description="Komplett guide till svenska regler för elsparkcyklar. Lär dig om lagkrav, försäkring, var du får köra och vilka modeller som är väglagliga."
        siteName={siteConfig.name}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="legal" className="mb-4 px-4 py-1">
              Uppdaterad maj 2026
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Svenska regler för <span className="text-gradient">elsparkcyklar</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Allt du behöver veta om lagar, försäkringskrav och var du får köra.
              Undvik böter och kör lagligt.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Snabb sammanfattning</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
                <div className="mb-3 text-4xl">✓</div>
                <h3 className="font-bold text-emerald-900">Väglaglig</h3>
                <p className="mt-2 text-sm text-emerald-700">
                  Max 250W motor<br />
                  Max 20 km/h<br />
                  Ingen registrering krävs
                </p>
              </div>
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6 text-center">
                <div className="mb-3 text-4xl">⚠</div>
                <h3 className="font-bold text-amber-900">Kräver försäkring</h3>
                <p className="mt-2 text-sm text-amber-700">
                  Över 20 km/h<br />
                  ELLER över 14 km/h + 25 kg<br />
                  Klassas som moped
                </p>
              </div>
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center">
                <div className="mb-3 text-4xl">✗</div>
                <h3 className="font-bold text-red-900">Förbjudet</h3>
                <p className="mt-2 text-sm text-red-700">
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
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            
            {/* Classification */}
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">1</span>
                Klassificering av elsparkcyklar
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  I Sverige klassificeras elsparkcyklar baserat på motoreffekt och topphastighet:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 text-left font-semibold text-foreground">Klass</th>
                        <th className="py-2 text-left font-semibold text-foreground">Specifikation</th>
                        <th className="py-2 text-left font-semibold text-foreground">Krav</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3">
                          <Badge variant="legal">Cykel</Badge>
                        </td>
                        <td className="py-3">Max 250W, max 20 km/h</td>
                        <td className="py-3">Inga särskilda krav</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">
                          <Badge variant="warning">Moped klass II</Badge>
                        </td>
                        <td className="py-3">Max 25 km/h</td>
                        <td className="py-3">Försäkring, 15 år</td>
                      </tr>
                      <tr>
                        <td className="py-3">
                          <Badge variant="destructive">Moped klass I</Badge>
                        </td>
                        <td className="py-3">Max 45 km/h</td>
                        <td className="py-3">Försäkring, körkort AM, 15 år</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">2</span>
                Försäkringskrav
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Du <strong>behöver trafikförsäkring</strong> om din elsparkcykel uppfyller något av följande:
                </p>
                <ul className="ml-4 list-disc space-y-2">
                  <li>Topphastighet <strong>över 20 km/h</strong></li>
                  <li>Topphastighet <strong>över 14 km/h OCH vikt över 25 kg</strong></li>
                </ul>
                <div className="rounded-lg bg-amber-50 p-4">
                  <p className="font-medium text-amber-900">
                    ⚠️ Viktigt: Att köra utan försäkring när det krävs kan ge böter på upp till 4 000 kr.
                  </p>
                </div>
                <p>
                  De flesta populära modeller som Xiaomi 4 Pro, Segway Max G2 och VSETT 9+ går snabbare än 20 km/h
                  och kräver därför försäkring om du kör dem i full hastighet.
                </p>
              </div>
            </div>

            {/* Where to ride */}
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">3</span>
                Var får du köra?
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-emerald-50 p-4">
                    <h4 className="font-semibold text-emerald-900">✓ Tillåtet</h4>
                    <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                      <li>• Cykelbanor och cykelvägar</li>
                      <li>• Körbanan (om cykelbana saknas)</li>
                      <li>• Gågator (max gångfart)</li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4">
                    <h4 className="font-semibold text-red-900">✗ Förbjudet</h4>
                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                      <li>• Trottoarer och gångbanor</li>
                      <li>• Motorvägar och motortrafikleder</li>
                      <li>• Gångfartsområden (över gångfart)</li>
                    </ul>
                  </div>
                </div>
                <p>
                  På körbanan ska du hålla dig så långt till höger som möjligt och följa samma regler som cyklister.
                </p>
              </div>
            </div>

            {/* Helmet */}
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">4</span>
                Hjälmkrav
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  <strong>Hjälm är obligatoriskt för personer under 15 år.</strong>
                </p>
                <p>
                  För vuxna finns inget lagkrav på hjälm, men vi rekommenderar starkt att alltid använda hjälm.
                  Skador vid elsparkcykelolyckor är ofta allvarliga, särskilt huvudskador.
                </p>
              </div>
            </div>

            {/* Lights */}
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">5</span>
                Belysning
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Vid körning i mörker eller dålig sikt måste du ha:
                </p>
                <ul className="ml-4 list-disc space-y-2">
                  <li><strong>Vitt eller gult ljus fram</strong></li>
                  <li><strong>Rött ljus bak</strong></li>
                  <li><strong>Röd reflex bak</strong></li>
                </ul>
                <p>
                  De flesta moderna elsparkcyklar har inbyggd belysning som uppfyller kraven.
                </p>
              </div>
            </div>

            {/* Penalties */}
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">6</span>
                Böter och straff
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 text-left font-semibold text-foreground">Överträdelse</th>
                        <th className="py-2 text-right font-semibold text-foreground">Böter</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Köra utan försäkring (när det krävs)</td>
                        <td className="py-3 text-right font-medium">~4 000 kr</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Köra på trottoar</td>
                        <td className="py-3 text-right font-medium">500-1 500 kr</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Köra utan belysning i mörker</td>
                        <td className="py-3 text-right font-medium">500 kr</td>
                      </tr>
                      <tr>
                        <td className="py-3">Barn under 15 utan hjälm</td>
                        <td className="py-3 text-right font-medium">500 kr</td>
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
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <Badge variant="legal" className="mb-4 px-4 py-1">
                ✓ Väglaglig
              </Badge>
              <h2 className="text-2xl font-bold">Vår rekommendation för laglig körning</h2>
              <p className="mt-2 text-muted-foreground">
                Om du vill köra helt lagligt utan försäkring eller registrering, rekommenderar vi NIU KQi3 Pro.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">{roadLegalPick.name}</h3>
                  <p className="mt-2 text-emerald-700">{roadLegalPick.description}</p>
                  <ul className="mt-4 space-y-2">
                    {roadLegalPick.pros?.slice(0, 4).map((pro, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-emerald-700">
                        <span className="text-emerald-600">✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <span className="price-tag text-2xl font-bold text-emerald-900">
                      {roadLegalPick.price.amount.toLocaleString("sv-SE")} kr
                    </span>
                  </div>
                  <Button asChild className="mt-4 cta-glow">
                    <a href={roadLegalPick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                      Se pris hos återförsäljare →
                    </a>
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Motor:</span>
                        <span className="font-medium">{roadLegalPick.motor}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Topphastighet:</span>
                        <span className="font-medium">{roadLegalPick.topSpeed}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Räckvidd:</span>
                        <span className="font-medium">{roadLegalPick.range}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Vikt:</span>
                        <span className="font-medium">{roadLegalPick.weight}</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between gap-8">
                          <span className="text-muted-foreground">Väglaglig:</span>
                          <Badge variant="legal">Ja</Badge>
                        </div>
                        <div className="mt-2 flex justify-between gap-8">
                          <span className="text-muted-foreground">Försäkring:</span>
                          <span className="font-medium text-emerald-600">Ej nödvändig</span>
                        </div>
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
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Vanliga frågor om regler</h2>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Får jag köra elsparkcykel på trottoaren?</h3>
              <p className="mt-2 text-muted-foreground">
                Nej, det är förbjudet att köra elsparkcykel på trottoarer och gångbanor. Du ska köra på cykelbanor
                eller på körbanan om cykelbana saknas.
              </p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Kan jag begränsa hastigheten på min elsparkcykel för att göra den laglig?</h3>
              <p className="mt-2 text-muted-foreground">
                Tekniskt sett ja, men det är komplicerat. Många modeller har hastighetsbegränsning i appen, men
                det är motoreffekten som avgör klassificeringen. En 400W-motor är inte laglig även om du begränsar
                hastigheten till 20 km/h.
              </p>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Vad händer om jag kör utan försäkring?</h3>
              <p className="mt-2 text-muted-foreground">
                Om du kör en elsparkcykel som kräver försäkring utan att ha det, riskerar du böter på cirka 4 000 kr.
                Dessutom kan du bli personligt ansvarig för skador du orsakar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Redo att hitta din elsparkcykel?</h2>
          <p className="mt-2 text-muted-foreground">
            Nu när du vet reglerna – jämför modeller och hitta rätt för dig.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="cta-glow">
              <Link to="/jamfor">Jämför alla modeller →</Link>
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
