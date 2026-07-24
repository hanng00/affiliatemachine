import { lazy, Suspense } from "react";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { siteConfig } from "@/config/site";

// Client-only island. Lazy + Suspense keeps the interactive calculator out of the
// SSR/prerender pass, so the page ships as static, crawlable HTML and the tool
// hydrates on top.
const BenefitCalculator = lazy(() => import("@/components/BenefitCalculator"));

const faqs = [
  {
    question: "Vad är en förmånscykel?",
    answer:
      "En förmånscykel är en cykel som din arbetsgivare erbjuder som en löneförmån, oftast finansierad genom bruttolöneavdrag (löneväxling). Du betalar för cykeln med pengar innan skatt, vilket gör den billigare än att köpa kontant. Sedan 2022 är förmånen dessutom skattefri upp till 3 000 kr per år.",
  },
  {
    question: "Hur räknar kalkylatorn ut min besparing?",
    answer:
      "Vi använder cykelns pris, avtalets längd och din marginalskatt. Bruttolöneavdraget minskar din skattepliktiga lön, så du sparar din marginalskatt på beloppet. Samtidigt beskattas den del av förmånsvärdet som överstiger 3 000 kr per år. Förmånsvärdet beräknas enligt Skatteverkets metod: 20 % värdeminskning plus en kapitalkostnad på 3,55 % av cykelns marknadsvärde för 2026.",
  },
  {
    question: "Hur mycket är skattefritt?",
    answer:
      "Upp till 3 000 kr av förmånsvärdet per år är skattefritt. Eftersom förmånsvärdet för en elcykel ofta landar runt 3 000–6 000 kr per år blir en stor del – ibland hela – förmånen skattefri. Endast den del som överstiger 3 000 kr beskattas som lön.",
  },
  {
    question: "Är beräkningen exakt?",
    answer:
      "Nej, det är en uppskattning för att visa storleksordningen. Den faktiska kostnaden beror på din arbetsgivares avtal (vad som ingår i service och försäkring), exakt marknadsvärde och dina skattesatser. För ett bindande pris behöver du en offert från en förmånscykel-leverantör och din arbetsgivares godkännande.",
  },
  {
    question: "Påverkar förmånscykel min pension eller SGI?",
    answer:
      "Ett bruttolöneavdrag sänker din bruttolön, vilket i teorin kan påverka sjukpenninggrundande inkomst (SGI) och allmän pension om lönen hamnar under taken. För de flesta heltidsanställda med normal lön är effekten liten, men det är värt att känna till. Kalkylatorn räknar inte med detta.",
  },
  {
    question: "Kostar det något att använda kalkylatorn?",
    answer:
      "Nej. Kalkylatorn är helt gratis och kräver ingen inloggning. Om du väljer att gå vidare till en leverantör via våra länkar kan vi få ersättning – det kostar dig inget extra.",
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

      {/* Hero + calculator — the above-the-fold tool */}
      <section
        id="kalkylator"
        className="relative overflow-hidden bg-gradient-to-b from-leaf-soft/50 to-background"
      >
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-3 py-1 text-xs font-semibold text-primary">
              Uppdaterad för 2026
            </span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
              Förmånscykel-kalkylator: räkna ut din besparing
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Dra reglaget till elcykelns pris och se vad den kostar via bruttolöneavdrag –
              nettokostnad per månad, förmånsvärde och hur mycket du sparar mot att betala
              kontant.
            </p>
          </div>

          <div className="mx-auto mt-7 max-w-4xl">
            <Suspense
              fallback={
                <div className="flex h-[420px] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted-foreground">
                  Laddar kalkylator…
                </div>
              }
            >
              <BenefitCalculator />
            </Suspense>
          </div>
        </div>
      </section>

      {/* How it works — prerendered SEO content */}
      <section id="sa-funkar-det" className="border-y border-border bg-secondary">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold text-foreground">Så funkar förmånscykel</h2>
            <p className="mt-3 text-muted-foreground">
              En löneförmån som gör elcykeln betydligt billigare – i tre steg.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Välj cykel",
                d: "Du väljer elcykel hos en leverantör som din arbetsgivare har avtal med.",
              },
              {
                n: "2",
                t: "Bruttolöneavdrag",
                d: "Kostnaden dras från din lön före skatt varje månad under avtalstiden.",
              },
              {
                n: "3",
                t: "Betala mindre",
                d: "Du sparar din marginalskatt på avdraget, och upp till 3 000 kr/år är skattefritt.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Förmånsvärde explainer — captures informational intent */}
      <section id="formansvarde" className="container mx-auto px-4 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold text-foreground">
            Så beräknas förmånsvärdet 2026
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Förmånsvärdet är det belopp Skatteverket anser att cykelförmånen är värd per år.
            För en elcykel består det av två delar:{" "}
            <strong className="text-foreground">värdeminskning på 20 %</strong> av cykelns
            marknadsvärde (inklusive batteri) plus en{" "}
            <strong className="text-foreground">kapitalkostnad</strong> som för inkomståret
            2026 är 3,55 % – statslåneräntan den 30 november 2025 (2,55 %) plus en
            procentenhet.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Exempel: en elcykel som kostar 25 000 kr ger ett förmånsvärde på cirka{" "}
            <strong className="text-foreground">5 000 kr + 888 kr = 5 888 kr per år</strong>.
            Eftersom 3 000 kr är skattefritt beskattas bara cirka 2 888 kr som lön. Det är den
            skatten – tillsammans med din marginalskatt på själva avdraget – som kalkylatorn
            ovan väger mot vad cykeln hade kostat kontant. Vill du läsa mer finns hela
            uträkningen i vår{" "}
            <a href="/guide" className="font-semibold text-primary underline-offset-2 hover:underline">
              guide till förmånscykel
            </a>
            .
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
