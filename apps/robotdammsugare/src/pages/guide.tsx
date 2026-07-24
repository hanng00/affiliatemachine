import { Link } from "react-router-dom";
import { SEOHead, SchemaScript, canonicalUrl } from "@affiliate/seo";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getAffiliate } from "@/config/affiliates";

export default function GuidePage() {
  const premiumPick = getAffiliate("roborockS8ProUltra");
  const valuePick = getAffiliate("roborockQRevo");
  const budgetPick = getAffiliate("xiaomiX10Plus");

  return (
    <>
      <SEOHead
        title={`Köpguide robotdammsugare 2026 – Så väljer du rätt | ${siteConfig.brand}`}
        description="Komplett köpguide för robotdammsugare 2026: sugkraft (Pa), självtömmande station, moppfunktion och priskategorier. Allt du behöver för att välja rätt modell."
        canonical={canonicalUrl(siteConfig.domain, "/guide")}
        siteName={siteConfig.name}
      />
      <SchemaScript
        schema={{
          type: "Article",
          headline: "Köpguide robotdammsugare 2026 – Så väljer du rätt",
          description:
            "Komplett köpguide för robotdammsugare 2026: sugkraft, självtömmande station, moppfunktion och priskategorier.",
          author: siteConfig.name,
          datePublished: "2026-01-15",
          dateModified: "2026-05-01",
        }}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Köpguide 2026</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Så väljer du rätt robotdammsugare
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Allt du behöver veta innan du köper – förklarat utan teknisk jargong.
              Vi går igenom det som faktiskt spelar roll för städresultatet.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💪 Sugkraft (Pa)</h2>
              <p className="text-gray-600 mb-4">
                Pascal (Pa) mäter sugkraften. Högre Pa = bättre på mattor och djurhår. För hårda golv
                räcker det med 2 000–3 000 Pa, men har du mattor eller husdjur bör du sikta på minst 4 000 Pa.
              </p>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>2 000–3 000 Pa</span>
                  <span className="text-gray-500">Hårda golv, lite damm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>4 000–5 500 Pa</span>
                  <span className="text-gray-500">Mattor, djurhår, vardagsstädning</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="font-medium">6 000–8 000 Pa</span>
                  <span className="text-emerald-700">Tjocka mattor, mycket djurhår</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🗑️ Självtömmande station</h2>
              <p className="text-gray-600 mb-4">
                Stationen tömmer robotens dammbehållare automatiskt i en större påse som räcker veckor.
                Värt extrakostnaden för de flesta – särskilt för allergiker.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-emerald-900 mb-2">✓ Fördelar</h3>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Slipper tömma efter varje städning</li>
                    <li>• Bättre för allergiker (förseglat damm)</li>
                    <li>• Mindre underhåll</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">✗ Nackdelar</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Kostar 2 000–4 000 kr extra</li>
                    <li>• Tar mer golvyta</li>
                    <li>• Påsar är en löpande kostnad</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💧 Moppfunktion</h2>
              <p className="text-gray-600 mb-4">
                Moderna robotar med roterande moppar skrubbar faktiskt golvet. Perfekt för daglig
                underhållsstädning – men ersätter inte en ordentlig golvtvätt.
              </p>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Tips:</strong> Vill du slippa tömma och fylla vatten manuellt? Välj en modell
                  vars station även tvättar och torkar moppen automatiskt.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Priskategorier</h2>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-emerald-900">Budget: Under 6 000 kr</span>
                    <span className="text-sm text-emerald-700">Xiaomi X10+</span>
                  </div>
                  <p className="text-sm text-emerald-700 mt-1">Grundläggande funktioner, perfekt för mindre hem</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Mellanklass: 6 000–10 000 kr</span>
                    <span className="text-sm text-blue-700">Roborock Q Revo</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Sweet spot för de flesta – bra funktioner till rimligt pris</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-900">Premium: Över 10 000 kr</span>
                    <span className="text-sm text-amber-700">Roborock S8 Pro Ultra</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">Bäst i allt – för dig som vill ha det bästa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Våra rekommendationer</h2>
            <p className="text-gray-600 text-center mb-8">Ett tryggt val i varje priskategori</p>
            <div className="space-y-4">
              <ProductCard product={budgetPick} placement="guide_budget" />
              <ProductCard product={valuePick} placement="guide_value" />
              <ProductCard product={premiumPick} placement="guide_premium" featured />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Vill du se alla modeller sida vid sida?</p>
          <Button asChild className="mt-4">
            <Link to="/jamfor">Jämför alla robotdammsugare →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
