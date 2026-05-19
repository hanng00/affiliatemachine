import { SEOHead } from "@affiliate/seo";
import { Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAffiliate } from "../config/affiliates";

export default function GuidePage() {
  const topPick = getAffiliate("roborockS8ProUltra");
  const budgetPick = getAffiliate("xiaomiX10Plus");
  const midrangePick = getAffiliate("roborockQRevo");

  return (
    <>
      <SEOHead
        title="Köpguide: Så väljer du rätt robotdammsugare 2026 | Robotdammsugare.se"
        description="Komplett guide till att välja rätt robotdammsugare. Lär dig om sugkraft, moppfunktion, hinderdetektering och vad som är värt pengarna."
        siteName={siteConfig.name}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              Köpguide 2026
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Så väljer du rätt <span className="text-gradient">robotdammsugare</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Allt du behöver veta för att göra rätt val. Vi går igenom funktioner,
              priskategorier och vanliga misstag.
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">Innehåll</h2>
            <nav className="space-y-2 text-sm">
              <a href="#vad-ar-viktigt" className="block text-primary hover:underline">1. Vad är viktigt att tänka på?</a>
              <a href="#sugkraft" className="block text-primary hover:underline">2. Sugkraft – hur mycket behöver du?</a>
              <a href="#sjalvtommande" className="block text-primary hover:underline">3. Självtömmande station – värt det?</a>
              <a href="#moppfunktion" className="block text-primary hover:underline">4. Moppfunktion – fungerar det?</a>
              <a href="#hinderdetektering" className="block text-primary hover:underline">5. Hinderdetektering och navigering</a>
              <a href="#priskategorier" className="block text-primary hover:underline">6. Priskategorier – vad får du för pengarna?</a>
              <a href="#vanliga-misstag" className="block text-primary hover:underline">7. Vanliga misstag att undvika</a>
              <a href="#rekommendationer" className="block text-primary hover:underline">8. Våra rekommendationer</a>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-12">
            
            {/* Section 1 */}
            <div id="vad-ar-viktigt" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">1. Vad är viktigt att tänka på?</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  Att välja rätt robotdammsugare handlar om att matcha dina behov med rätt funktioner.
                  Här är de viktigaste faktorerna att överväga:
                </p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold">🏠 Bostadens storlek</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Större hem kräver längre batteritid och bättre kartläggning.
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold">🐾 Husdjur</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Djurhår kräver stark sugkraft och gummiborstar som inte trasslar.
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold">🧹 Golvtyper</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Mattor kräver mer sugkraft. Hårda golv gynnas av moppfunktion.
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold">🔇 Ljudnivå</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Bor du i lägenhet? Välj en modell under 65 dB.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div id="sugkraft" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">2. Sugkraft – hur mycket behöver du?</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  Sugkraft mäts i Pascal (Pa). Högre siffra = starkare sugkraft. Men mer är inte alltid bättre –
                  det beror på dina golv och behov.
                </p>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 text-left font-semibold">Sugkraft</th>
                      <th className="py-3 text-left font-semibold">Passar för</th>
                      <th className="py-3 text-left font-semibold">Exempel</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3">2000-3000 Pa</td>
                      <td className="py-3">Hårda golv, lite damm</td>
                      <td className="py-3">Electrolux Pure i9</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3">4000-5500 Pa</td>
                      <td className="py-3">Mattor, djurhår, vardagsstädning</td>
                      <td className="py-3">Xiaomi X10+, Roborock Q Revo</td>
                    </tr>
                    <tr>
                      <td className="py-3">6000-8000 Pa</td>
                      <td className="py-3">Tjocka mattor, mycket djurhår</td>
                      <td className="py-3">Roborock S8 Pro Ultra, Ecovacs X2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tips:</strong> För de flesta svenska hem räcker 4000-5500 Pa. Har du husdjur eller
                  tjocka mattor, sikta på 6000+ Pa.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div id="sjalvtommande" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">3. Självtömmande station – värt det?</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  En självtömmande station tömmer robotens dammbehållare automatiskt efter varje städning.
                  Dammet samlas i en påse som du byter var 1-2 månad.
                </p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-4">
                  <h4 className="font-semibold text-emerald-900">✓ Fördelar</h4>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-700">
                    <li>• Slipper tömma efter varje städning</li>
                    <li>• Bättre för allergiker (dammet förseglas)</li>
                    <li>• Roboten kan städa oftare</li>
                    <li>• Mindre underhåll</li>
                  </ul>
                </div>
                <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900">✗ Nackdelar</h4>
                  <ul className="mt-2 space-y-1 text-sm text-red-700">
                    <li>• Kostar mer (2000-4000 kr extra)</li>
                    <li>• Tar mer plats</li>
                    <li>• Kan vara högljudd vid tömning</li>
                    <li>• Påsar kostar pengar</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Vår rekommendation:</strong> Självtömmande station är värt det för de flesta.
                  Speciellt om du har husdjur eller vill att roboten ska städa dagligen utan tillsyn.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div id="moppfunktion" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">4. Moppfunktion – fungerar det?</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  Moderna robotdammsugare med moppfunktion har blivit betydligt bättre. De bästa modellerna
                  har roterande moppar som faktiskt skrubbar golvet, inte bara drar en fuktig trasa.
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h4 className="font-semibold">Enkel mopp (drag-mopp)</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    En fuktig trasa som dras efter roboten. Fungerar för lätt underhåll men tar inte bort fläckar.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h4 className="font-semibold">Roterande moppar</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Två roterande moppar som skrubbar golvet. Mycket effektivare. Finns på Roborock Q Revo och Dreame L20 Ultra.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h4 className="font-semibold">Automatisk mopptvätt</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Stationen tvättar mopparna automatiskt, ibland med varmt vatten. Dreame L20 Ultra tvättar i 55°C.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <strong>Viktigt:</strong> Moppfunktion ersätter inte vanlig golvtvätt, men är perfekt för
                  daglig underhållsstädning mellan ordentliga städningar.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div id="hinderdetektering" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">5. Hinderdetektering och navigering</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  Moderna robotdammsugare använder olika tekniker för att navigera och undvika hinder.
                  Detta är extra viktigt om du har husdjur, barn eller många saker på golvet.
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h4 className="font-semibold">LiDAR-navigering</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Laser som skannar rummet och skapar en karta. Mycket precis och snabb. Standard på de flesta modeller.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h4 className="font-semibold">Kamera + AI</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Kamera som identifierar objekt (skor, kablar, djurspillning). iRobot Roomba j7+ är bäst på detta.
                  </p>
                </div>
                <div className="rounded-lg bg-card p-4 shadow-sm">
                  <h4 className="font-semibold">3D-strukturerat ljus</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Kombinerar LiDAR med 3D-sensorer för ännu bättre hinderdetektering. Finns på Roborock S8 Pro Ultra.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div id="priskategorier" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">6. Priskategorier – vad får du för pengarna?</h2>
              
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="success" className="mb-2">Budget</Badge>
                      <h3 className="text-xl font-bold text-emerald-900">Under 6 000 kr</h3>
                    </div>
                    <span className="text-3xl">💰</span>
                  </div>
                  <p className="mt-3 text-emerald-700">
                    Grundläggande funktioner, ofta med självtömmande station och enkel moppfunktion.
                    Perfekt för mindre hem utan speciella behov.
                  </p>
                  <p className="mt-2 font-medium text-emerald-900">
                    Rekommendation: <strong>{budgetPick.name}</strong> ({budgetPick.price.amount.toLocaleString("sv-SE")} kr)
                  </p>
                </div>

                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2">Mellanklass</Badge>
                      <h3 className="text-xl font-bold text-blue-900">6 000 – 10 000 kr</h3>
                    </div>
                    <span className="text-3xl">⭐</span>
                  </div>
                  <p className="mt-3 text-blue-700">
                    Bättre sugkraft, roterande moppar, automatisk mopptvätt. Bra hinderdetektering.
                    Sweet spot för de flesta.
                  </p>
                  <p className="mt-2 font-medium text-blue-900">
                    Rekommendation: <strong>{midrangePick.name}</strong> ({midrangePick.price.amount.toLocaleString("sv-SE")} kr)
                  </p>
                </div>

                <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="gold" className="mb-2">Premium</Badge>
                      <h3 className="text-xl font-bold text-amber-900">Över 10 000 kr</h3>
                    </div>
                    <span className="text-3xl">👑</span>
                  </div>
                  <p className="mt-3 text-amber-700">
                    Bäst i allt: sugkraft, navigering, moppfunktion, app. Allt-i-ett stationer med
                    automatisk tömning, mopptvätt och ibland varmvatten.
                  </p>
                  <p className="mt-2 font-medium text-amber-900">
                    Rekommendation: <strong>{topPick.name}</strong> ({topPick.price.amount.toLocaleString("sv-SE")} kr)
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div id="vanliga-misstag" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">7. Vanliga misstag att undvika</h2>
              <div className="space-y-4">
                <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900">❌ Köpa för billigt</h4>
                  <p className="mt-2 text-sm text-red-700">
                    Robotdammsugare under 3000 kr saknar ofta viktig teknik som LiDAR-navigering.
                    De städar ineffektivt och missar stora ytor.
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900">❌ Ignorera golvtyper</h4>
                  <p className="mt-2 text-sm text-red-700">
                    Har du mattor? Se till att roboten har tillräcklig sugkraft och kan höja moppen
                    automatiskt för att inte blöta ner mattorna.
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900">❌ Glömma underhåll</h4>
                  <p className="mt-2 text-sm text-red-700">
                    Även självtömmande robotar behöver underhåll. Borstar, filter och sensorer
                    måste rengöras regelbundet.
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900">❌ Förvänta sig för mycket av moppen</h4>
                  <p className="mt-2 text-sm text-red-700">
                    Moppfunktion är bra för underhåll, men ersätter inte ordentlig golvtvätt.
                    Intorkade fläckar kräver fortfarande manuell rengöring.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div id="rekommendationer" className="scroll-mt-20">
              <h2 className="mb-6 text-2xl font-bold">8. Våra rekommendationer</h2>
              <div className="space-y-4">
                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="gold" className="mb-2">Bäst överlag</Badge>
                      <h3 className="text-lg font-bold">{topPick.name}</h3>
                      <p className="text-sm text-muted-foreground">{topPick.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{topPick.price.amount.toLocaleString("sv-SE")} kr</p>
                      <Button asChild size="sm" className="mt-2 cta-glow">
                        <a href={topPick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                          Se pris →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2">Bäst pris/prestanda</Badge>
                      <h3 className="text-lg font-bold">{midrangePick.name}</h3>
                      <p className="text-sm text-muted-foreground">{midrangePick.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{midrangePick.price.amount.toLocaleString("sv-SE")} kr</p>
                      <Button asChild size="sm" className="mt-2 cta-glow">
                        <a href={midrangePick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                          Se pris →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="success" className="mb-2">Bäst budget</Badge>
                      <h3 className="text-lg font-bold">{budgetPick.name}</h3>
                      <p className="text-sm text-muted-foreground">{budgetPick.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{budgetPick.price.amount.toLocaleString("sv-SE")} kr</p>
                      <Button asChild size="sm" className="mt-2 cta-glow">
                        <a href={budgetPick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                          Se pris →
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center text-primary-foreground shadow-xl md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Redo att jämföra?</h2>
            <p className="mt-4 text-primary-foreground/90">
              Se alla modeller sida vid sida och hitta den perfekta för ditt hem.
            </p>
            <Button asChild size="xl" variant="secondary" className="mt-6">
              <Link to="/jamfor">Jämför alla modeller →</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
