import { Link } from "react-router-dom";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { siteConfig } from "@/config/site";

const description =
  "Så lönar sig solceller för er BRF. Interaktiv kalkylator, ekonomi med och utan IMD, momsavdrag och underlag till stämman. Kostnadsfritt.";

export default function BrfLandingPage() {
  return (
    <>
      <SEOHead
        title="Solceller för bostadsrättsförening 2026 – kalkyl, IMD & offerter | Solkalkylatorn"
        description={description}
        canonical={canonicalUrl(siteConfig.domain, "/brf/guide")}
        ogImage={siteConfig.ogImage}
        siteName={siteConfig.name}
      />

      <SchemaScript
        schema={{
          type: "Article",
          headline: "Solceller för bostadsrättsförening 2026 – kalkyl, IMD och offerter",
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
            { name: "Solceller för BRF", url: canonicalUrl(siteConfig.domain, "/brf/guide") },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft/60 to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 inline-block rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">
              För styrelsemedlemmar i BRF
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl">
              Solceller för er bostadsrättsförening
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Sänk föreningens driftskostnader, öka fastighetsvärdet och ge medlemmarna billigare el.
              Rita ert tak och få ett kalkylunderlag till stämman — på en minut.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/brf"
                className="inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
              >
                Öppna BRF-kalkylatorn →
              </Link>
              <a
                href="#varfor"
                className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Varför investera?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="varfor" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-3xl font-extrabold text-foreground">
              Varför investerar BRF:er i solceller?
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                {
                  icon: "💸",
                  title: "Sänk avgiften",
                  text: "En 50 kWp-anläggning sparar 80 000–120 000 kr/år. Det motsvarar hundralappar per månad och medlem som kan lyftas från avgiften.",
                },
                {
                  icon: "🏠",
                  title: "+10–14 % fastighetsvärde",
                  text: "Köpare prioriterar energieffektiva bostäder. Med EU:s nya energideklarationer (EPBD) ökar värdet av synlig energiåtgärd.",
                },
                {
                  icon: "📋",
                  title: "Stordriftsfördelar",
                  text: "En BRF betalar 12 000–14 000 kr/kWp jämfört med villans 17 000. Större anläggning = lägre styckpris.",
                },
                {
                  icon: "🔋",
                  title: "Batterilagring + effektstyrning",
                  text: "Kombinera med batteri för att kapa effekttoppar, lagra dagsel till kväll, och tjäna på stödtjänster till Svenska Kraftnät.",
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

      {/* IMD section */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold text-foreground">
            IMD — nyckeln till maximal lönsamhet
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Individuell mätning och debitering</strong> innebär att
            föreningen köper in all el gemensamt och säljer vidare till medlemmarna. Det ger tre fördelar:
          </p>
          <ol className="mt-6 space-y-4">
            {[
              "Egenanvändningen ökar från ~40 % till 60–80 % — solelen används i lägenheter, inte bara gemensamma ytor.",
              "Föreningen blir momsregistrerad och kan dra av moms (20 %) på hela investeringen — ofta mer än grönt avdrag.",
              "Medlemmarna slipper sina individuella nätavgifter (ofta 3 000–5 000 kr/år per hushåll).",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-grass text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Price table — captures "solceller brf pris", "solceller bostadsrättsförening kostnad" */}
      <section id="priser" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Vad kostar solceller för en BRF 2026?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Priset ligger på <strong className="text-foreground">12 000–17 000 kr per installerad kW</strong> inklusive
              moms — något lägre per kW än för villor tack vare stordriftsfördelar. Momsregistrerade föreningar (med IMD)
              kan dra av momsen, vilket sänker nettokostnaden med 20 %.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Anläggning</th>
                    <th className="px-4 py-3 font-semibold">Paneler</th>
                    <th className="px-4 py-3 font-semibold">Pris inkl. moms</th>
                    <th className="px-4 py-3 font-semibold">Efter momsavdrag (IMD)</th>
                    <th className="px-4 py-3 font-semibold">Besparing/år</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { size: "Liten (20 kW)", panels: "~46 st", gross: "240 000–320 000 kr", net: "192 000–256 000 kr", save: "30 000–45 000 kr" },
                    { size: "Medel (30 kW)", panels: "~70 st", gross: "360 000–460 000 kr", net: "288 000–368 000 kr", save: "50 000–75 000 kr" },
                    { size: "Stor (50 kW)", panels: "~115 st", gross: "570 000–750 000 kr", net: "456 000–600 000 kr", save: "80 000–120 000 kr" },
                    { size: "Mycket stor (100 kW)", panels: "~230 st", gross: "1,1–1,5 mkr", net: "880 000 kr–1,2 mkr", save: "160 000–240 000 kr" },
                  ].map((r) => (
                    <tr key={r.size} className="text-foreground">
                      <td className="px-4 py-3 font-medium">{r.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.panels}</td>
                      <td className="px-4 py-3">{r.gross}</td>
                      <td className="px-4 py-3 font-medium text-grass">{r.net}</td>
                      <td className="px-4 py-3">{r.save}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Riktvärden 2026. Källa: Solcellerstockholm.se, Brfpris.se. Besparing baserad på SE3-elpris och
              60–80 % egenförbrukning med IMD. Faktiskt pris beror på takets förutsättningar och dimensionering.
            </p>
          </div>
        </div>
      </section>

      {/* Battery storage — captures breakout terms "batterilagring solceller brf", "solceller med batterilagring" */}
      <section id="batterilagring" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold text-foreground">
            Batterilagring för BRF — lönar det sig?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Allt fler föreningar kombinerar solceller med batterilagring. Men ett batteri lönar sig
            <strong className="text-foreground"> sällan på enbart lagring av solel</strong> — ersättningen för såld el
            är låg och prisskillnaden mellan köpt och såld el är liten. Lönsamheten kommer från tre andra håll:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Egenanvändning", d: "Lagra dagens överskott och använd kvällstid när förbrukningen är som högst." },
              { t: "Effekttoppar", d: "Kapa effekttoppar från hissar, laddboxar och värmepumpar — sänker effekttariffen." },
              { t: "Stödtjänster", d: "Hyr ut batterikapacitet till Svenska Kraftnät via en aggregator och få betalt även när solen inte skiner." },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold text-foreground">{b.t}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-border bg-secondary p-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Kostnad:</strong> Batterisystem för flerbostadshus (40–200 kWh) ligger
            på cirka <strong className="text-foreground">3 000–5 000 kr/kWh</strong> före momsavdrag. Med rätt styrning
            och effekttariff hamnar återbetalningstiden ofta på 4–8 år. Inget grönt avdrag för BRF, men momsavdrag
            gäller för momsregistrerade föreningar.
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Från idé till solel — så ser processen ut
            </h2>
            <div className="mt-8 space-y-6">
              {[
                { step: "1", title: "Förstudie & kalkyl", desc: "Använd vår kalkylator för att få ett initialt underlag. Stäm av med installatör." },
                { step: "2", title: "Styrelse & offerter", desc: "Ta in 3–4 offerter. Presentera alternativ för styrelsen. Besluta om stämmoförslag." },
                { step: "3", title: "Stämmobeslut", desc: "Enkel majoritet räcker normalt. Presentera kalkylen med ROI och månadsavgiftseffekt." },
                { step: "4", title: "Installation", desc: "Installatören projekterar, söker bygglov vid behov, monterar. Vanlig tid: 2–4 veckor." },
                { step: "5", title: "Drift & uppföljning", desc: "Övervaka produktion. Utvärdera efter 12 månader. Överväg batterilagring som tillägg." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky text-xs font-bold text-white">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cross-segment link — captures villa visitors who landed on BRF */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center sm:flex-row sm:text-left">
            <span className="text-2xl">🏡</span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground">Äger du en villa istället?</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Som privatperson får du grönt avdrag på 15 %. Räkna på solceller för ditt eget hus.
              </p>
            </div>
            <Link
              to="/villa"
              className="shrink-0 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Solceller för villa →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Redo att räkna på solceller för er BRF?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Rita taket på kartan och få ett kalkylunderlag — kostnadsfritt och utan köpkrav.
          </p>
          <Link
            to="/brf"
            className="mt-6 inline-flex items-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
          >
            Starta BRF-kalkylatorn →
          </Link>
        </div>
      </section>
    </>
  );
}
