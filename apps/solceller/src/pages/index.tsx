import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { useTrackActivation } from "@affiliate/analytics";
import {
  calculateSolar,
  defaultAssumptions,
  regions,
  formatSek,
  formatKwh,
} from "@affiliate/solar-calculator";
import { siteConfig } from "@/config/site";
import type { RoofMapHandle } from "@/components/RoofMap";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { SavingsChart } from "@/components/SavingsChart";
import { LeadCapture } from "@/components/LeadCapture";

// Client-only island. Leaflet touches `window`, so it must
// never render during prerender — lazy + Suspense keeps it out of the SSR pass.
const RoofMap = lazy(() => import("@/components/RoofMap"));

const faqs = [
  {
    question: "Hur räknar kalkylatorn ut min besparing?",
    answer:
      "Vi använder ytan du ritar in på ditt tak och publika antaganden: cirka 0,19 kWp per kvadratmeter användbar takyta, runt 950 kWh per installerad kWp och år för svenska förhållanden, samt elpris och ersättning för såld överskottsel. Resultatet är en uppskattning – den bindande offerten kommer alltid från installatören.",
  },
  {
    question: "Vad är grönt avdrag för solceller?",
    answer:
      "Grönt avdrag är en skattereduktion på 15 % av kostnaden för material och arbete vid installation av solceller, upp till 50 000 kr per person och år. Avdraget dras direkt på fakturan av installatören, så du behöver inte ansöka själv.",
  },
  {
    question: "Hur många solpaneler får plats på mitt tak?",
    answer:
      "Det beror på takets storlek, lutning och skuggning. En modern panel är ungefär 2 m² och cirka 0,42 kWp. Av den yta du ritar räknar vi med att en del går bort för kanter, takfönster och skugga, och dimensionerar i hela paneler.",
  },
  {
    question: "Är beräkningen exakt?",
    answer:
      "Nej, det är en uppskattning för att ge dig en känsla för storleksordningen. Faktisk produktion påverkas av takets väderstreck, lutning, skuggning och din elförbrukning. För ett exakt pris och en detaljerad dimensionering behöver du en offert från en installatör.",
  },
  {
    question: "Kostar det något att använda kalkylatorn?",
    answer:
      "Nej. Kalkylatorn är helt gratis och kräver ingen inloggning. Om du väljer att begära offert via våra länkar kan vi få ersättning från installatören – det kostar dig inget extra.",
  },
];

export default function HomePage() {
  const [roofAreaSqm, setRoofAreaSqm] = useState(0);
  const [regionId, setRegionId] = useState<(typeof regions)[number]["id"]>("mellan");
  const [hasZoomed, setHasZoomed] = useState(false);

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
        setSearchError("Hittade ingen adress. Försök med gatuadress, postnummer och ort.");
      } else {
        setHasZoomed(true);
      }
    } catch {
      setSearchError("Något gick fel vid sökningen. Försök igen.");
    } finally {
      setSearching(false);
    }
  }

  const region = regions.find((r) => r.id === regionId) ?? regions[1];
  const result = useMemo(
    () =>
      calculateSolar(
        { roofAreaSqm },
        { ...defaultAssumptions, kwhPerKwpYear: region.kwhPerKwpYear }
      ),
    [roofAreaSqm, region.kwhPerKwpYear]
  );

  // Activation = a real estimate exists (roof drawn/found → kWp > 0). Fired once
  // per session; magnitude = the annual saving the visitor sees.
  const trackActivation = useTrackActivation("roof_estimated");
  useEffect(() => {
    if (result.kwp > 0) trackActivation(result.annualSavings);
  }, [result.kwp, result.annualSavings, trackActivation]);

  const hasRoof = result.panels > 0;
  const step = hasRoof ? 3 : hasZoomed ? 2 : 1;

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

      {/* App — single above-the-fold tool: search → map → results → CTA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft/60 to-background">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Compact intro + address bar */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground md:text-3xl">
              Rita solceller på taket – se din besparing direkt
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Sök din adress, rita takets yta och få en uppskattning på sekunder — antal paneler, årsproduktion, besparing och återbetalning inklusive grönt avdrag. Äger ni en{" "}
              <a href="/brf" className="font-semibold text-primary underline-offset-2 hover:underline">bostadsrättsförening? Se solceller för BRF</a>.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative z-40 mx-auto mt-5 flex max-w-xl flex-col gap-2 sm:flex-row">
            <AddressAutocomplete
              value={query}
              onChange={setQuery}
              onSelect={handleAutocompleteSelect}
              placeholder="Adress, t.ex. Storgatan 12, Linköping"
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

          {/* Two-column: map (main) + results panel (side) */}
          <div className="mt-5 grid gap-4 lg:grid-cols-5">
            {/* Map — takes 3/5 of the width on desktop */}
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

            {/* Right panel — progressive steps */}
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

              {/* Step 1: Search guidance */}
              {step === 1 && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    📍
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">Steg 1: Sök din adress</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Skriv din gatuadress i sökfältet ovan så zoomar vi in på ditt hus med satellitbild.
                  </p>
                </div>
              )}

              {/* Step 2: Draw guidance */}
              {step === 2 && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    ▢
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">Steg 2: Rita ditt tak</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Vi ritar oftast byggnadens kontur automatiskt. Vill du rita själv: klicka <span className="inline-block rounded border border-border bg-muted px-1">✏️ Rita tak manuellt</span> på kartan, klicka sedan hörn för hörn och dubbelklicka för att stänga ytan.
                  </p>
                </div>
              )}

              {/* Step 3: Results */}
              {step === 3 && (
                <>
                  {/* Savings chart — the hero */}
                  <SavingsChart
                    annualKwh={result.annualKwh}
                    annualSavings={result.annualSavings}
                    electricityPrice={defaultAssumptions.electricityPrice}
                    sellPrice={defaultAssumptions.sellPrice}
                    selfConsumptionShare={defaultAssumptions.selfConsumptionShare}
                  />

                  {/* Key facts: cost + payback */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border bg-card p-3">
                      <div className="text-[11px] text-muted-foreground">Pris efter grönt avdrag</div>
                      <div className="mt-0.5 text-base font-bold text-foreground">{formatSek(result.netCost)}</div>
                      <div className="text-[10px] text-muted-foreground">avdrag {formatSek(result.greenDeduction)}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3">
                      <div className="text-[11px] text-muted-foreground">Återbetalningstid</div>
                      <div className="mt-0.5 text-base font-bold text-foreground">{result.paybackYears} år</div>
                      <div className="text-[10px] text-muted-foreground">{result.panels} paneler · {result.kwp} kWp</div>
                    </div>
                  </div>

                  {/* Region control — small, secondary */}
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

                  {/* CTA — lead capture first, then affiliate link */}
                  <LeadCapture
                    roofAreaSqm={roofAreaSqm}
                    kwp={result.kwp}
                    annualSavings={result.annualSavings}
                    netCost={result.netCost}
                    region={regionId}
                    address={query}
                    source="villa"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works — prerendered SEO content */}
      <section id="sa-funkar-det" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-foreground">Rita solceller på ditt tak – så funkar det</h2>
            <p className="mt-3 text-muted-foreground">Från adress till offert på under en minut.</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Sök din adress", d: "Vi zoomar in på ditt hus på en satellitkarta." },
              { n: "2", t: "Rita ditt tak", d: "Markera takets yta. Vi räknar fram paneler och kWp." },
              { n: "3", t: "Se din besparing", d: "Produktion, besparing och återbetalning – med grönt avdrag." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rita på tak — owns "rita solceller på tak" intent vs municipal solkartor */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold text-foreground">Rita solceller på tak – direkt på kartan</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Många kommuner har en <strong className="text-foreground">solkarta</strong> som visar hur mycket solen
            strålar på taket, men inte vad en anläggning faktiskt kostar eller sparar dig. Här gör du tvärtom:
            du <strong className="text-foreground">ritar in solcellerna på ditt eget tak</strong> på en
            satellitkarta, och vi räknar direkt fram antal paneler, installerad effekt (kWp), årsproduktion,
            besparing och återbetalningstid – inklusive grönt avdrag. Inga proffsprogram, ingen inloggning och
            inget pris att betala.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { t: "Sök adressen", d: "Vi zoomar in på ditt hus med satellitbild." },
              { t: "Rita takytan", d: "Markera taket – eller justera den automatiska konturen." },
              { t: "Se kalkylen", d: "Paneler, kWp, besparing och payback på sekunder." },
            ].map((s) => (
              <li key={s.t} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="text-sm font-bold text-foreground">{s.t}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Äger du en villa?{" "}
            <a href="/villa" className="font-semibold text-primary underline-offset-2 hover:underline">
              Se solceller för villa och grönt avdrag
            </a>
            . Driver du en bostadsrättsförening? Då gäller andra förutsättningar – momsavdrag, IMD och
            stordriftsfördelar.{" "}
            <a href="/brf" className="font-semibold text-primary underline-offset-2 hover:underline">
              Rita taket och få en BRF-kalkyl och offert
            </a>.
          </p>
        </div>
      </section>

      {/* Grönt avdrag explainer — captures informational intent */}
      <section id="gront-avdrag" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold text-foreground">Grönt avdrag för solceller 2026</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Vid installation av solceller får du <strong className="text-foreground">grönt avdrag</strong> – en
            skattereduktion på <strong className="text-foreground">15 %</strong> av kostnaden för material och
            arbete. Avdraget är på upp till 50 000 kr per person och år och dras direkt på fakturan av installatören,
            precis som ROT- och RUT-avdrag. Bor ni två som äger huset tillsammans kan ni dela på avdraget.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            En typisk villainstallation på 8–10 kWp kostar runt 17 000 kr per kWp. Efter grönt avdrag landar
            priset normalt en bra bit lägre, och med dagens elpriser brukar återbetalningstiden hamna runt
            8–12 år – varefter elen i praktiken är gratis under panelernas resterande livslängd på 25–30 år.
            Använd kalkylatorn ovan för en uppskattning för just ditt tak.
          </p>
        </div>
      </section>

      {/* FAQ — matches the FAQPage schema above */}
      <section id="faq" className="border-t border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
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
        </div>
      </section>
    </>
  );
}
