import { SEOHead } from "@affiliate/seo";
import { AffiliateCard, Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAllAffiliates, getAffiliate, type RobotVacuumProduct } from "../config/affiliates";
import { FeatureBadges, SpecGrid } from "../components/ProductComponents";

export default function StoraHemPage() {
  const allProducts = getAllAffiliates();
  const longBatteryProducts = allProducts
    .filter(p => p.batteryLife && parseInt(p.batteryLife) >= 120)
    .sort((a, b) => parseInt(b.batteryLife!) - parseInt(a.batteryLife!));
  
  const topPick = getAffiliate("dreameL20Ultra");
  const runnerUp = getAffiliate("roborockS8ProUltra");

  return (
    <>
      <SEOHead
        title="Bästa robotdammsugare för stora hem 2026 – Lång batteritid | Robotdammsugare.se"
        description="Hitta den bästa robotdammsugaren för stora hem. Vi har testat vilka modeller som har längst batteritid och bäst kartläggning för stora ytor."
        siteName={siteConfig.name}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              🏡 Stora hem
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Bästa robotdammsugare för <span className="text-gradient">stora hem</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Har du ett stort hem? Batteritid och effektiv kartläggning är avgörande.
              Vi har testat vilka modeller som klarar stora ytor bäst.
            </p>
          </div>
        </div>
      </section>

      {/* What matters for large homes */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Vad är viktigt för stora hem?</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🔋</div>
                <h3 className="font-semibold">Lång batteritid</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Minst 150 min för att klara 150+ kvm. 200+ min för riktigt stora hem.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🗺️</div>
                <h3 className="font-semibold">Smart kartläggning</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  LiDAR-navigering och multi-floor-stöd för effektiv städning.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🔄</div>
                <h3 className="font-semibold">Recharge & Resume</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Roboten laddar och fortsätter där den slutade om batteriet tar slut.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🗑️</div>
                <h3 className="font-semibold">Stor dammbehållare</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Eller självtömmande station – annars fylls den innan städningen är klar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage guide */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Hur stor yta klarar roboten?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-left font-semibold">Batteritid</th>
                    <th className="py-3 text-left font-semibold">Ungefärlig yta</th>
                    <th className="py-3 text-left font-semibold">Passar för</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3">60-90 min</td>
                    <td className="py-3">50-80 kvm</td>
                    <td className="py-3">Lägenheter, små hus</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">120-150 min</td>
                    <td className="py-3">100-150 kvm</td>
                    <td className="py-3">Medelstora hem</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">
                      <Badge variant="success">180-200 min</Badge>
                    </td>
                    <td className="py-3">150-200 kvm</td>
                    <td className="py-3">Stora hem</td>
                  </tr>
                  <tr>
                    <td className="py-3">
                      <Badge variant="gold">200+ min</Badge>
                    </td>
                    <td className="py-3">200+ kvm</td>
                    <td className="py-3">Mycket stora hem, villor</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Obs:</strong> Verklig yta beror på golvtyp, möbler och hur roboten navigerar.
                Mattor och hinder minskar ytan. Alla modeller vi rekommenderar har "Recharge & Resume"
                som laddar och fortsätter om batteriet tar slut.
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
                🏆 Bäst för stora hem 2026
              </Badge>
              <h2 className="text-3xl font-bold">{topPick.name}</h2>
              <p className="mt-2 text-muted-foreground">
                260 min batteritid – längst i testet. Klarar upp till 300 kvm på en laddning.
              </p>
            </div>
            
            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg">
              <FeatureBadges product={topPick} />
              <div className="mt-4">
                <SpecGrid product={topPick} />
              </div>
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Varför den är bäst för stora hem:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>260 min batteritid</strong> – längst i testet, klarar 250-300 kvm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>7000 Pa sugkraft</strong> – starkast i testet, effektiv på stora ytor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>Multi-floor kartläggning</strong> – sparar kartor för flera våningar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>Självtömmande station</strong> – behöver inte tömmas mitt i städningen</span>
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

      {/* Runner up */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge className="mb-4 px-4 py-1">
                🥈 Stark utmanare
              </Badge>
              <h2 className="text-2xl font-bold">{runnerUp.name}</h2>
              <p className="mt-2 text-muted-foreground">
                180 min batteritid och bäst överlag – perfekt om du vill ha det bästa av allt
              </p>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <FeatureBadges product={runnerUp} />
              <div className="mt-4">
                <SpecGrid product={runnerUp} />
              </div>
              <div className="mt-6">
                <AffiliateCard product={runnerUp} rank={2} showProsCons={true} className="border-0 shadow-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All long battery products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Modeller med lång batteritid (120+ min)</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {longBatteryProducts.map((product, index) => (
              <div key={product.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="feature-badge">
                    🔋 {product.batteryLife}
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
            <h2 className="mb-8 text-center text-2xl font-bold">Tips för stora hem</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🗺️ Dela upp i zoner</h3>
                <p className="mt-2 text-muted-foreground">
                  Använd appen för att dela upp hemmet i zoner. Schemalägg olika zoner på olika dagar
                  för att minska slitaget på roboten.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🏠 Flera våningar?</h3>
                <p className="mt-2 text-muted-foreground">
                  Alla modeller vi rekommenderar stödjer multi-floor kartläggning. Du kan flytta roboten
                  mellan våningar och den kommer ihåg kartan.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🗑️ Självtömmande är ett måste</h3>
                <p className="mt-2 text-muted-foreground">
                  I stora hem fylls dammbehållaren snabbt. Självtömmande station är nästan ett krav
                  för att roboten ska kunna städa hela hemmet utan tillsyn.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">⚡ Placera stationen centralt</h3>
                <p className="mt-2 text-muted-foreground">
                  Placera dockningsstationen centralt i hemmet så roboten inte behöver köra långt
                  för att ladda och fortsätta.
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
