import { Link } from "react-router-dom";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { siteConfig } from "@/config/site";

const description =
  "Räkna ut vad solceller kostar och sparar för just ditt hus. Rita taket, se besparing och återbetalning inklusive grönt avdrag. Jämför offerter gratis.";

const faqs = [
  {
    question: "Vad kostar solceller för en villa 2026?",
    answer:
      "Ett komplett solcellssystem för en villa kostar 13 000–18 000 kr per installerad kW inklusive installation och moms. En normalvilla väljer oftast en 10 kW-anläggning, vilket ger ungefär 120 000–180 000 kr före grönt avdrag. Med grönt avdrag på 15 % sänks priset direkt på fakturan.",
  },
  {
    question: "Lönar sig solceller 2026?",
    answer:
      "För de flesta villaägare ja. En normalvilla får en återbetalningstid på 8–10 år och en årlig avkastning på 8–12 % skattefritt. Efter återbetalningen har du i praktiken gratis el i 15–20 år till. Sedan skattereduktionen för såld överskottsel försvann 1 januari 2026 är egenanvändning viktigare än någonsin.",
  },
  {
    question: "Hur fungerar grönt avdrag för solceller 2026?",
    answer:
      "Som privatperson får du 15 % skattereduktion på kostnaden för material och arbete, upp till 50 000 kr per person och år. Bor ni två kan ni dela och få upp till 100 000 kr i avdrag. Avdraget dras direkt på fakturan av installatören.",
  },
];

export default function VillaLandingPage() {
  return (
    <>
      <SEOHead
        title="Solceller för villa 2026 – kalkylator, grönt avdrag & offerter | Solkalkylatorn"
        description={description}
        canonical={canonicalUrl(siteConfig.domain, "/villa")}
        ogImage={siteConfig.ogImage}
        siteName={siteConfig.name}
      />

      <SchemaScript
        schema={{
          type: "Article",
          headline: "Solceller för villa 2026 – kalkylator, grönt avdrag och offerter",
          description,
          author: siteConfig.name,
          datePublished: "2026-01-15",
        }}
      />
      <SchemaScript
        schema={{
          type: "BreadcrumbList",
          items: [
            { name: "Start", url: canonicalUrl(siteConfig.domain, "/") },
            { name: "Solceller för villa", url: canonicalUrl(siteConfig.domain, "/villa") },
          ],
        }}
      />
      <SchemaScript schema={{ type: "FAQPage", questions: faqs }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft/60 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              Solceller för din villa
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Rita in ditt tak på kartan och se direkt hur mycket du kan spara — inklusive grönt avdrag på 15 %.
              Från uppskattning till offert på under en minut.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
              >
                Rita mitt tak →
              </Link>
              <a
                href="#fordelar"
                className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Läs mer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="fordelar" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-3xl font-extrabold text-foreground">
              Varför solceller på villan?
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "💰",
                  title: "Sänk elräkningen",
                  text: "En typisk villa sparar 15 000–25 000 kr per år. Med grönt avdrag (15 %) blir återbetalningstiden 8–12 år — sedan är elen gratis.",
                },
                {
                  icon: "📈",
                  title: "Öka husets värde",
                  text: "Studier visar att bostäder med solceller säljs till ett premium. Köpare värderar energieffektivitet allt högre.",
                },
                {
                  icon: "🌱",
                  title: "Minska klimatavtrycket",
                  text: "En genomsnittlig villaanläggning undviker ca 500 kg CO₂ per år — utan att du behöver ändra din livsstil.",
                },
              ].map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-extrabold text-foreground">
            Så funkar kalkylatorn
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Sök din adress", d: "Vi zoomar in på ditt hus med satellitbild från Google." },
              { n: "2", t: "Rita taket", d: "Markera ytan — vi räknar fram paneler, kWp och kostnad." },
              { n: "3", t: "Se din besparing", d: "Elkostnad, besparing och återbetalning med grönt avdrag." },
            ].map((s) => (
              <div key={s.n} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky text-sm font-bold text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
            >
              Prova kalkylatorn →
            </Link>
          </div>
        </div>
      </section>

      {/* Price table — captures "vad kostar solceller", "solceller pris 2026", "solcellspaket pris" */}
      <section id="priser" className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Vad kostar solceller 2026?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ett komplett solcellssystem för en villa kostar <strong className="text-foreground">13 000–18 000 kr per
              installerad kW</strong> inklusive installation och moms. En normalvilla väljer oftast en 10 kW-anläggning.
              Med grönt avdrag (15 %) sänks priset direkt på fakturan.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Storlek</th>
                    <th className="px-4 py-3 font-semibold">Paneler</th>
                    <th className="px-4 py-3 font-semibold">Pris före avdrag</th>
                    <th className="px-4 py-3 font-semibold">Efter grönt avdrag</th>
                    <th className="px-4 py-3 font-semibold">Återbetalning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { size: "5 kW (mindre villa)", panels: "13–15 st", gross: "80 000–110 000 kr", net: "68 000–94 000 kr", payback: "11–13 år" },
                    { size: "8 kW (medelvilla)", panels: "19–21 st", gross: "100 000–130 000 kr", net: "85 000–111 000 kr", payback: "9–11 år" },
                    { size: "10 kW (normalvilla)", panels: "24–26 st", gross: "120 000–180 000 kr", net: "102 000–153 000 kr", payback: "8–10 år" },
                    { size: "15 kW (stor villa)", panels: "33–39 st", gross: "175 000–240 000 kr", net: "149 000–204 000 kr", payback: "7–9 år" },
                  ].map((r) => (
                    <tr key={r.size} className="text-foreground">
                      <td className="px-4 py-3 font-medium">{r.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.panels}</td>
                      <td className="px-4 py-3">{r.gross}</td>
                      <td className="px-4 py-3 font-medium text-grass">{r.net}</td>
                      <td className="px-4 py-3">{r.payback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Riktvärden 2026 inkl. moms och grönt avdrag 15 %. Källa: Solguide.se, Elprisguiden.nu, Solceller24.se.
              Spann = lägsta–högsta offert beroende på taktyp, region och tillverkare. Rita ditt tak ovan för en
              uppskattning för just ditt hus.
            </p>
          </div>
        </div>
      </section>

      {/* Lönar sig solceller — captures "lönar sig solceller", "är solceller lönsamt" */}
      <section className="border-t border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Lönar sig solceller 2026?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ja — för de flesta villaägare är solceller en av de tryggaste investeringarna du kan göra. En
              normalvilla får en <strong className="text-foreground">återbetalningstid på 8–10 år</strong> och en årlig
              avkastning på 8–12 %, skattefritt. Efter återbetalningen har du i praktiken gratis el i 15–20 år till.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Sedan 1 januari 2026 är skattereduktionen på 60 öre/kWh för såld överskottsel borta. Det gör
              <strong className="text-foreground"> egenanvändning viktigare än någonsin</strong> — den el du producerar
              och använder själv är värd 2–3 kr/kWh (du slipper elpris, nätavgift, energiskatt och moms), medan såld el
              bara ger 40–90 öre/kWh. Ju mer du använder själv, desto snabbare betalar anläggningen av sig.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Bankkonto", value: "2–3 %", note: "ränta" },
                { label: "Börsen", value: "~7 %", note: "snitt, med risk" },
                { label: "Solceller", value: "8–12 %", note: "skattefritt, låg risk" },
              ].map((c) => (
                <div key={c.label} className={`rounded-2xl border p-4 ${c.label === "Solceller" ? "border-grass/40 bg-grass/5" : "border-border bg-card"}`}>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className={`mt-0.5 text-xl font-extrabold ${c.label === "Solceller" ? "text-grass" : "text-foreground"}`}>{c.value}</div>
                  <div className="text-[11px] text-muted-foreground">{c.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grönt avdrag */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">Grönt avdrag 2026</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Som privatperson får du <strong className="text-foreground">15 % skattereduktion</strong> på kostnaden
              för material och arbete — upp till 50 000 kr per person och år. Bor ni två kan ni dela: upp till
              100 000 kr i avdrag. Avdraget dras direkt på fakturan av installatören.
            </p>
            <div className="mt-6 rounded-2xl border border-sky/30 bg-sky/5 p-5">
              <h3 className="text-sm font-bold text-foreground">Räkneexempel</h3>
              <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Installationskostnad</div>
                  <div className="font-bold text-foreground">170 000 kr</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Grönt avdrag (15 %)</div>
                  <div className="font-bold text-grass">−25 500 kr</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Nettopris</div>
                  <div className="font-bold text-foreground">144 500 kr</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-segment link — captures BRF visitors who landed on villa */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center sm:flex-row sm:text-left">
            <span className="text-2xl">🏢</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground">Bor du i en bostadsrättsförening?</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                BRF:er har andra förutsättningar — momsavdrag, IMD och stordriftsfördelar. Vi har en egen kalkylator.
              </p>
            </div>
            <Link
              to="/brf/guide"
              className="shrink-0 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Solceller för BRF →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="font-display text-2xl font-extrabold text-foreground">Redo att ta reda på vad du sparar?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Det tar under en minut. Rita ditt tak och se resultatet direkt — helt gratis.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
          >
            Starta kalkylatorn →
          </Link>
        </div>
      </section>
    </>
  );
}
