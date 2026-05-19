import { SEOHead } from "@affiliate/seo";
import { AffiliateCard, Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAllAffiliates, getAffiliate, getReviewsForProduct, type RobotVacuumProduct } from "../config/affiliates";
import { ReviewCard, FeatureBadges, SpecGrid } from "../components/ProductComponents";

export default function LagenheterPage() {
  const allProducts = getAllAffiliates();
  const quietProducts = allProducts.filter(p => p.noiseLevel && parseInt(p.noiseLevel) <= 68).sort((a, b) => parseInt(a.noiseLevel!) - parseInt(b.noiseLevel!));
  const topPick = getAffiliate("dreameL20Ultra");
  const qRevoReviews = getReviewsForProduct("roborock-q-revo");

  return (
    <>
      <SEOHead
        title="Bästa robotdammsugare för lägenheter 2026 – Tysta modeller | Robotdammsugare.se"
        description="Hitta den bästa robotdammsugaren för din lägenhet. Vi har testat vilka modeller som är tystast och passar bäst för lägenhetsliv."
        siteName={siteConfig.name}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              🏢 Lägenheter
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Bästa robotdammsugare för <span className="text-gradient">lägenheter</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Bor du i lägenhet? Ljudnivå och kompakt storlek är extra viktigt.
              Vi har testat vilka modeller som passar bäst för lägenhetsliv.
            </p>
          </div>
        </div>
      </section>

      {/* What matters for apartments */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Vad är viktigt för lägenheter?</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🔇</div>
                <h3 className="font-semibold">Låg ljudnivå</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Under 65 dB är idealiskt. Tänk på grannarna – och dig själv om du jobbar hemifrån.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">📦</div>
                <h3 className="font-semibold">Kompakt station</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dockningsstationer kan vara stora. Kolla måtten innan du köper.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🗺️</div>
                <h3 className="font-semibold">Smart navigering</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Lägenheter har ofta trånga utrymmen. Bra navigering är viktigt.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">💧</div>
                <h3 className="font-semibold">Moppfunktion</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Många lägenheter har hårda golv. Moppfunktion är ett stort plus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Noise level guide */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Ljudnivåer förklarade</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-left font-semibold">Ljudnivå</th>
                    <th className="py-3 text-left font-semibold">Jämförelse</th>
                    <th className="py-3 text-left font-semibold">Passar för</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3">
                      <Badge variant="success">Under 60 dB</Badge>
                    </td>
                    <td className="py-3">Som ett samtal</td>
                    <td className="py-3">Kan köras när du är hemma</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">
                      <Badge>60-65 dB</Badge>
                    </td>
                    <td className="py-3">Som en diskmaskin</td>
                    <td className="py-3">Bra för de flesta lägenheter</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">
                      <Badge variant="warning">65-70 dB</Badge>
                    </td>
                    <td className="py-3">Som en dammsugare på låg</td>
                    <td className="py-3">Kör när du inte är hemma</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <Badge variant="destructive">Över 70 dB</Badge>
                    </td>
                    <td className="py-3">Som en vanlig dammsugare</td>
                    <td className="py-3">Kan störa grannar</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Tips:</strong> De flesta robotdammsugare har ett "tyst läge" som sänker ljudnivån
                med 5-10 dB, men också sugkraften. Perfekt för nattlig städning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Pick */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge variant="gold" className="mb-4 px-4 py-1">
                🏆 Bäst för lägenheter 2026
              </Badge>
              <h2 className="text-3xl font-bold">{topPick.name}</h2>
              <p className="mt-2 text-muted-foreground">
                65 dB ljudnivå, 260 min batteritid och MopExtend som når in i hörn
              </p>
            </div>
            
            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg">
              <FeatureBadges product={topPick} />
              <div className="mt-4">
                <SpecGrid product={topPick} />
              </div>
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Varför den är bäst för lägenheter:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>65 dB ljudnivå</strong> – bland de tystaste i testet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>MopExtend-teknik</strong> – når in i hörn och längs väggar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>7000 Pa sugkraft</strong> – starkast i testet, perfekt för mattor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>Automatisk mopptvätt i 55°C</strong> – hygieniskt för hårda golv</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <AffiliateCard product={topPick} rank={1} showProsCons={true} className="border-0 shadow-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget alternative */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge variant="success" className="mb-4 px-4 py-1">
                💰 Budgetvänligt alternativ
              </Badge>
              <h2 className="text-2xl font-bold">Roborock Q Revo</h2>
              <p className="mt-2 text-muted-foreground">
                67 dB och utmärkt pris/prestanda – perfekt för mindre lägenheter
              </p>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <FeatureBadges product={getAffiliate("roborockQRevo")} />
              <div className="mt-4">
                <SpecGrid product={getAffiliate("roborockQRevo")} />
              </div>
              <div className="mt-6">
                <AffiliateCard product={getAffiliate("roborockQRevo")} rank={2} showProsCons={true} className="border-0 shadow-none" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {qRevoReviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All quiet products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Tystaste modellerna (under 68 dB)</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quietProducts.map((product, index) => (
              <div key={product.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="feature-badge feature-badge-quiet">
                    🔇 {product.noiseLevel}
                  </span>
                </div>
                <AffiliateCard
                  product={product}
                  rank={index + 1}
                  showProsCons={false}
                  className="card-hover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Tips för lägenhetsstädning</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">⏰ Schemalägg smart</h3>
                <p className="mt-2 text-muted-foreground">
                  Kör roboten när du är på jobbet eller ute. De flesta appar låter dig schemalägga
                  städning på specifika tider.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🔇 Använd tyst läge</h3>
                <p className="mt-2 text-muted-foreground">
                  De flesta robotar har ett tyst läge som sänker ljudnivån. Perfekt för kvällsstädning
                  eller om du jobbar hemifrån.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🚪 Stäng dörrar</h3>
                <p className="mt-2 text-muted-foreground">
                  Stäng dörrar till rum du inte vill städa. Det sparar tid och batteri,
                  och minskar ljudet i resten av lägenheten.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">📍 Placera stationen smart</h3>
                <p className="mt-2 text-muted-foreground">
                  Placera dockningsstationen i ett hörn eller under en möbel om möjligt.
                  Det sparar plats och döljer den.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Vill du jämföra fler modeller?</h2>
          <p className="mt-2 text-muted-foreground">
            Se alla robotdammsugare sida vid sida.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="cta-glow">
              <Link to="/jamfor">Jämför alla modeller →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/guide">Läs köpguiden</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
