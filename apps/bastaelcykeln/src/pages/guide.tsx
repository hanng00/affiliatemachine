import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { siteConfig } from "@/config/site";

const title = `Förmånscykel 2026: så fungerar bruttolöneavdrag för elcykel | ${siteConfig.brand}`;
const description =
  "Komplett guide till förmånscykel 2026: hur bruttolöneavdrag fungerar, hur förmånsvärdet beräknas, vad som är skattefritt och hur mycket du sparar på en elcykel via jobbet.";

export default function GuidePage() {
  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={canonicalUrl(siteConfig.domain, "/guide")}
        ogImage={siteConfig.ogImage}
        ogType="article"
        siteName={siteConfig.name}
      />
      <SchemaScript
        schema={{
          type: "Article",
          headline: "Förmånscykel 2026: så fungerar bruttolöneavdrag för elcykel",
          description,
          author: siteConfig.name,
          datePublished: "2026-06-12",
        }}
      />
      <SchemaScript
        schema={{
          type: "BreadcrumbList",
          items: [
            { name: "Start", url: canonicalUrl(siteConfig.domain, "/") },
            { name: "Guide: förmånscykel", url: canonicalUrl(siteConfig.domain, "/guide") },
          ],
        }}
      />

      <article className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <nav className="text-xs text-muted-foreground" aria-label="Brödsmulor">
            <a href="/" className="hover:text-foreground">Start</a>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Guide: förmånscykel</span>
          </nav>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
            Förmånscykel 2026: så fungerar bruttolöneavdrag för elcykel
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Förmånscykel är ett av de mest prisvärda sätten att skaffa elcykel i Sverige. Här
            går vi igenom exakt hur det fungerar, hur förmånsvärdet räknas ut och varför det blir
            så mycket billigare än att betala kontant.
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground">Vad är en förmånscykel?</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                En förmånscykel är en cykel som din arbetsgivare tillhandahåller som en
                löneförmån. I praktiken sker det nästan alltid genom{" "}
                <strong className="text-foreground">bruttolöneavdrag</strong> (även kallat
                löneväxling): ett fast belopp dras från din lön <em>innan</em> skatt varje månad
                under avtalstiden, oftast 24 eller 36 månader. Eftersom avdraget tas på
                bruttolönen sänks din skattepliktiga inkomst, och du sparar din marginalskatt på
                hela beloppet.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground">
                3 000 kr är skattefritt
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Sedan den 1 januari 2022 är cykelförmån skattefri upp till{" "}
                <strong className="text-foreground">3 000 kr per år</strong> (11 kap. 12 a §
                inkomstskattelagen). Det betyder att om förmånsvärdet för din cykel är 3 000 kr
                eller lägre betalar du ingen förmånsskatt alls. Är det högre beskattas bara den
                överskjutande delen som lön.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Så beräknas förmånsvärdet
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Förmånsvärdet för en elcykel består av två delar enligt Skatteverket:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Värdeminskning:</strong> 20 % av cykelns
                    marknadsvärde inklusive batteri, per år.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Kapitalkostnad:</strong> marknadsvärdet ×
                    räntesatsen. För inkomståret 2026 är räntesatsen 3,55 % – statslåneräntan den
                    30 november 2025 (2,55 %) plus en procentenhet.
                  </span>
                </li>
              </ul>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                För en elcykel som kostar 25 000 kr blir förmånsvärdet alltså 5 000 kr (20 %) +
                888 kr (3,55 %) = <strong className="text-foreground">5 888 kr per år</strong>.
                Efter det skattefria avdraget på 3 000 kr återstår 2 888 kr som beskattas som lön.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Hur mycket sparar man?
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Besparingen kommer från två håll: du betalar avdraget med pengar före skatt (du
                sparar din marginalskatt, ofta 30–52 %), och du betalar bara förmånsskatt på den
                lilla del av förmånsvärdet som överstiger 3 000 kr. Sammantaget brukar en
                förmånscykel kosta runt{" "}
                <strong className="text-foreground">40–55 % mindre</strong> än att köpa samma
                cykel kontant. Räkna på just din situation i kalkylatorn:
              </p>
              <a
                href="/#kalkylator"
                className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                Öppna förmånscykel-kalkylatorn →
              </a>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold text-foreground">Saker att tänka på</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Ett bruttolöneavdrag sänker din bruttolön, vilket i teorin kan påverka
                sjukpenninggrundande inkomst (SGI) och allmän pension om lönen hamnar under
                respektive tak. För de flesta heltidsanställda är effekten liten. Kontrollera
                också vad som ingår i avtalet – service, försäkring och vad som händer vid
                anställningens slut varierar mellan leverantörer. Den bindande offerten och de
                exakta villkoren kommer alltid från leverantören och din arbetsgivare.
              </p>
            </section>
          </div>

          <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
            Källor: Skatteverket (cykelförmån, ställningstagande om elcyklar), 11 kap. 12 a §
            inkomstskattelagen, Riksgälden (statslåneräntan 2025-11-30). Innehållet är
            informativt och utgör inte skatterådgivning. Uppdaterad juni 2026.
          </p>
        </div>
      </article>
    </>
  );
}
