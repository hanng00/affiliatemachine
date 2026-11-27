import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import {
  calculateSolar,
  brfAssumptions,
  applyMomsavdrag,
  regions,
  formatSek,
  formatKwh,
} from "@affiliate/solar-calculator";
import { siteConfig } from "@/config/site";
import type { RoofMapHandle } from "@/components/RoofMap";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { SavingsChart } from "@/components/SavingsChart";
import { LeadCapture } from "@/components/LeadCapture";

const RoofMap = lazy(() => import("@/components/RoofMap"));

const faqs = [
  {
    question: "Kan en BRF få grönt avdrag?",
    answer:
      "Nej, grönt avdrag gäller bara privatpersoner. Men om föreningen inför IMD (individuell mätning och debitering) och blir momsregistrerad kan ni istället dra av momsen på hela investeringen — det ger en reduktion på 20 %, ofta mer i kronor än grönt avdrag.",
  },
  {
    question: "Vad innebär IMD för solcellsekonomin?",
    answer:
      "Med IMD köper föreningen in all el gemensamt och säljer vidare till medlemmarna. Solelen används direkt i lägenheterna istället för bara gemensam el. Det höjer egenanvändningen från ~40 % till 60–80 %, och föreningen blir momsregistrerad och kan dra av moms på investeringen.",
  },
  {
    question: "Behöver stämman besluta om solceller?",
    answer:
      "Ja, installation av solceller är normalt ett stämmobeslut med enkel majoritet. Styrelsen kan förbereda genom att ta in offerter och presentera en kalkyl — den här sidan ger er ett underlag att visa på stämman.",
  },
  {
    question: "Hur stor anläggning passar en typisk BRF?",
    answer:
      "En medelstor BRF installerar ofta 30–50 kWp (70–115 paneler) till en kostnad av 400 000–750 000 kr. Stora föreningar med mycket takyta kan gå upp till 100 kWp+. Dimensionera efter gemensam elförbrukning och eventuell IMD-plan.",
  },
  {
    question: "Vad händer med överskottselen?",
    answer:
      "Sedan 2026 är skattereduktionen på 60 öre/kWh borta. Överskottsel säljs till spotpris (~50–70 öre/kWh). Därför är det viktigt att dimensionera rätt och maximera egenanvändning. Med batterilagring kan föreningen lagra dagsproduktion och använda kvällstid.",
  },
];

export default function BrfPage() {
  const [roofAreaSqm, setRoofAreaSqm] = useState(0);
  const [regionId, setRegionId] = useState<(typeof regions)[number]["id"]>("stockholm");
  const [hasZoomed, setHasZoomed] = useState(false);
  const [withImd, setWithImd] = useState(true);

  const mapRef = useRef<RoofMapHandle>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  function handleAutocompleteSelect(lat: number, lon: number) {
    setSearchError(null);
    setHasZoomed(true);
    mapRef.current?.flyTo(lat, lon);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const found = await mapRef.current?.search(query.trim());
      if (!found) {
        setSearchError("Hittade ingen adress. Försök med föreningens gatuadress.");
      } else {
        setHasZoomed(true);
      }
    } catch {
      setSearchError("Något gick fel vid sökningen. Försök igen.");
    } finally {
      setSearching(false);
    }
  }

  const region = regions.find((r) => r.id === regionId) ?? regions[2];
  const assumptions = {
    ...brfAssumptions,
    kwhPerKwpYear: region.kwhPerKwpYear,
    selfConsumptionShare: withImd ? 0.75 : 0.45,
  };
  const result = useMemo(
    () => calculateSolar({ roofAreaSqm, usableShare: 0.8 }, assumptions),
    [roofAreaSqm, region.kwhPerKwpYear, withImd]
  );
  const momsavdrag = withImd ? applyMomsavdrag(result.grossCost) : 0;
  const netCostBrf = result.grossCost - momsavdrag;

  const hasRoof = result.panels > 0;
  const step = hasRoof ? 3 : hasZoomed ? 2 : 1;

  return (
    <>
      <SEOHead
        title="Solceller BRF – kalkyl & offert för bostadsrättsföreningar 2026 | Solkalkylatorn"
        description="Solceller för BRF: rita ert tak och se direkt kostnad, besparing och återbetalning – med och utan IMD och momsavdrag. Få offert och ett kalkylunderlag till stämman. Kostnadsfritt."
        canonical={canonicalUrl(siteConfig.domain, "/brf")}
        ogImage={siteConfig.ogImage}
        siteName={siteConfig.name}
      />
      <SchemaScript
        schema={{
          type: "WebSite",
          name: siteConfig.name,
          url: canonicalUrl(siteConfig.domain, "/brf"),
          description: "Solcellskalkylator för bostadsrättsföreningar (BRF) – rita taket, se besparingen och få offert.",
        }}
      />
      <SchemaScript schema={{ type: "FAQPage", questions: faqs }} />

      <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft/60 to-background">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-2 inline-block rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">
              För bostadsrättsföreningar
            </div>
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">
              Solceller för BRF – kalkyl och offert
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Rita ert tak, se besparingen och få offert från installatörer med BRF-erfarenhet — med stordriftsfördelar och momsavdrag. Ett färdigt kalkylunderlag till stämman.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative z-40 mx-auto mt-5 flex max-w-xl flex-col gap-2 sm:flex-row">
            <AddressAutocomplete
              value={query}
              onChange={setQuery}
              onSelect={handleAutocompleteSelect}
              placeholder="Föreningens adress, t.ex. Sveavägen 44, Stockholm"
              disabled={searching}
            />
            <button
              type="submit"
              disabled={searching}
              className="whitespace-nowrap rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90 disabled:opacity-60"
            >
              {searching ? "Söker…" : "Sök →"}
            </button>
          </form>
          {searchError && (
            <p className="mt-2 text-center text-sm text-destructive">{searchError}</p>
          )}

          <div className="mt-5 grid gap-4 lg:grid-cols-5">
            <div id="kartan" className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="flex h-[340px] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground lg:h-[460px]">
                    Laddar karta…
                  </div>
                }
              >
                <RoofMap ref={mapRef} onAreaChange={setRoofAreaSqm} />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-2">
              {/* Step indicator */}
              <div className="flex items-center gap-2 px-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        s < step
                          ? "bg-grass text-white"
                          : s === step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < step ? "✓" : s}
                    </span>
                    <span className={`text-xs font-medium ${s === step ? "text-foreground" : "text-muted-foreground"}`}>
                      {s === 1 ? "Sök" : s === 2 ? "Rita" : "Resultat"}
                    </span>
                    {s < 3 && <div className={`h-px w-4 ${s < step ? "bg-grass" : "bg-border"}`} />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    🏢
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">Steg 1: Sök föreningens adress</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Skriv er gatuadress i sökfältet ovan så zoomar vi in på fastigheten med satellitbild.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    ▢
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">Steg 2: Rita taket</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Markera takytan. Platta BRF-tak har ofta 80 %+ användbar yta för paneler.
                  </p>
                </div>
              )}

              {step === 3 && (
                <>
                  {/* IMD toggle */}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                    <input
                      type="checkbox"
                      checked={withImd}
                      onChange={(e) => setWithImd(e.target.checked)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    <span className="text-xs font-medium text-foreground">IMD (individuell mätning)</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {withImd ? "75 % egenanvändning + momsavdrag" : "45 % egenanvändning, ingen moms"}
                    </span>
                  </label>

                  <SavingsChart
                    annualKwh={result.annualKwh}
                    annualSavings={result.annualSavings}
                    electricityPrice={assumptions.electricityPrice}
                    sellPrice={assumptions.sellPrice}
                    selfConsumptionShare={assumptions.selfConsumptionShare}
                  />

                  {/* Key facts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border bg-card p-3">
                      <div className="text-[11px] text-muted-foreground">
                        {withImd ? "Pris efter momsavdrag" : "Investeringskostnad"}
                      </div>
                      <div className="mt-0.5 text-base font-bold text-foreground">{formatSek(netCostBrf)}</div>
                      {withImd && (
                        <div className="text-[10px] text-muted-foreground">momsavdrag {formatSek(momsavdrag)}</div>
                      )}
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3">
                      <div className="text-[11px] text-muted-foreground">Återbetalningstid</div>
                      <div className="mt-0.5 text-base font-bold text-foreground">
                        {result.annualSavings > 0 ? Math.round((netCostBrf / result.annualSavings) * 10) / 10 : 0} år
                      </div>
                      <div className="text-[10px] text-muted-foreground">{result.panels} paneler · {result.kwp} kWp</div>
                    </div>
                  </div>

                  {/* Region + area */}
                  <div className="flex items-center gap-2 px-1">
                    <select
                      id="region"
                      value={regionId}
                      onChange={(e) => setRegionId(e.target.value as typeof regionId)}
                      className="rounded-lg border border-input bg-background px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-ring"
                    >
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {roofAreaSqm} m² tak
                    </span>
                  </div>

                  {/* CTA — lead capture first */}
                  <LeadCapture
                    roofAreaSqm={roofAreaSqm}
                    kwp={result.kwp}
                    annualSavings={result.annualSavings}
                    netCost={netCostBrf}
                    region={regionId}
                    address={query}
                    source="brf"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BRF-specific economics section */}
      <section id="ekonomi" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Ekonomi: Solceller i BRF 2026
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ska er bostadsrättsförening ta in <strong className="text-foreground">offert på solceller</strong>?
              Börja med en egen kalkyl: rita taket ovan, se kostnad, besparing och återbetalning, och ta sedan in
              jämförbara offerter från installatörer med BRF-erfarenhet. Då blir anbuden lätta att jämföra och ni
              har ett färdigt underlag till stämman.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Spelreglerna har ändrats. Sedan 1 januari 2026 är skattereduktionen på 60 öre/kWh för
              överskottsel borta. Det innebär att <strong className="text-foreground">egenanvändning är allt</strong> —
              den mest lönsamma kilowattimmen är den som aldrig lämnar huset.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-base font-bold text-foreground">Med IMD</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-grass">✓</span> 60–80 % egenanvändning</li>
                  <li className="flex gap-2"><span className="text-grass">✓</span> Momsavdrag (20 % av kostnaden)</li>
                  <li className="flex gap-2"><span className="text-grass">✓</span> Medlemmarna slipper fasta nätavgifter</li>
                  <li className="flex gap-2"><span className="text-grass">✓</span> Kortare återbetalningstid</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-base font-bold text-foreground">Utan IMD</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-muted-foreground">—</span> 40–50 % egenanvändning</li>
                  <li className="flex gap-2"><span className="text-muted-foreground">—</span> Ingen momsavdrag</li>
                  <li className="flex gap-2"><span className="text-muted-foreground">—</span> Solelen täcker bara gemensam el</li>
                  <li className="flex gap-2"><span className="text-grass">✓</span> Enklare att införa (inget stämmobeslut för IMD)</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-sky/30 bg-sky/5 p-5">
              <h3 className="font-display text-base font-bold text-foreground">Typisk BRF-investering 2026</h3>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Anläggning (30 kWp)</div>
                  <div className="font-bold text-foreground">360 000–460 000 kr</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Besparing per år</div>
                  <div className="font-bold text-foreground">50 000–75 000 kr</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Återbetalningstid</div>
                  <div className="font-bold text-foreground">6–9 år</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Källa: Solcellsstockholm.se, Brfpris.se (2026). Pris exkl. moms vid IMD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-extrabold text-foreground">Vanliga frågor — BRF</h2>
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
        </div>
      </section>
    </>
  );
}
