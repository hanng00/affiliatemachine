import { SEOHead } from "@affiliate/seo";
import { AffiliateCard, Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getPetFriendlyAffiliates, getAffiliate, getReviewsForProduct, type RobotVacuumProduct } from "../config/affiliates";
import { ReviewCard, FeatureBadges, SpecGrid } from "../components/ProductComponents";

export default function HusdjurPage() {
  const petFriendlyProducts = getPetFriendlyAffiliates();
  const topPick = getAffiliate("roborockS8ProUltra");
  const topPickReviews = getReviewsForProduct("roborock-s8-pro-ultra");
  const dreameReviews = getReviewsForProduct("dreame-l20-ultra");

  return (
    <>
      <SEOHead
        title="Bästa robotdammsugare för husdjur 2026 – Katthår & hundhår | Robotdammsugare.se"
        description="Hitta den bästa robotdammsugaren för husdjur. Vi har testat vilka modeller som hanterar katthår och hundhår bäst. Baserat på riktiga användarrecensioner."
        siteName={siteConfig.name}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1">
              🐾 Husdjursägare
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Bästa robotdammsugare för <span className="text-gradient">husdjur</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Har du katt eller hund? Vi har testat vilka robotdammsugare som hanterar djurhår bäst.
              Baserat på riktiga recensioner från svenska husdjursägare.
            </p>
          </div>
        </div>
      </section>

      {/* What matters for pet owners */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Vad är viktigt för husdjursägare?</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">💪</div>
                <h3 className="font-semibold">Stark sugkraft</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Minst 4000 Pa för att ta upp djurhår effektivt. 6000+ Pa för tjocka mattor.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🔄</div>
                <h3 className="font-semibold">Gummiborstar</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Gummiborstar trasslar inte hår som traditionella borstvalsar gör.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">🗑️</div>
                <h3 className="font-semibold">Självtömmande</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Djurhår fyller dammbehållaren snabbt. Självtömmande station är nästan ett måste.
                </p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="mb-3 text-3xl">👁️</div>
                <h3 className="font-semibold">Hinderdetektering</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Undviker matskålar, leksaker och – viktigast – djurspillning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Pick */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge variant="gold" className="mb-4 px-4 py-1">
                🏆 Bäst för husdjur 2026
              </Badge>
              <h2 className="text-3xl font-bold">{topPick.name}</h2>
              <p className="mt-2 text-muted-foreground">
                Vårt toppval för husdjursägare – stark sugkraft, gummiborstar och utmärkt hinderdetektering
              </p>
            </div>
            
            <div className="rounded-2xl border-2 border-amber-200 bg-card p-6 shadow-lg">
              <FeatureBadges product={topPick} />
              <div className="mt-4">
                <SpecGrid product={topPick} />
              </div>
              <div className="mt-6">
                <h3 className="mb-3 font-semibold">Varför den är bäst för husdjur:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>Dubbla gummiborstar</strong> – trasslar inte hår som traditionella borstar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>6000 Pa sugkraft</strong> – tar upp allt djurhår, även från mattor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>Reactive AI 2.0</strong> – undviker matskålar, leksaker och djurspillning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span><strong>Självtömmande station</strong> – perfekt när dammbehållaren fylls snabbt</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <AffiliateCard product={topPick} rank={1} showProsCons={true} className="border-0 shadow-none" />
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h3 className="mb-4 text-center text-lg font-semibold">Vad husdjursägare säger</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {topPickReviews.map((review, i) => (
                  <ReviewCard key={i} review={review} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Runner up */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge className="mb-4 px-4 py-1">
                🥈 Stark utmanare
              </Badge>
              <h2 className="text-2xl font-bold">Dreame L20 Ultra</h2>
              <p className="mt-2 text-muted-foreground">
                Starkast sugkraft i testet (7000 Pa) och MopExtend som når in i hörn
              </p>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <FeatureBadges product={getAffiliate("dreameL20Ultra")} />
              <div className="mt-4">
                <SpecGrid product={getAffiliate("dreameL20Ultra")} />
              </div>
              <div className="mt-6">
                <AffiliateCard product={getAffiliate("dreameL20Ultra")} rank={2} showProsCons={true} className="border-0 shadow-none" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {dreameReviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* iRobot for obstacle avoidance */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <Badge variant="success" className="mb-4 px-4 py-1">
                👁️ Bäst hinderdetektering
              </Badge>
              <h2 className="text-2xl font-bold">iRobot Roomba j7+</h2>
              <p className="mt-2 text-muted-foreground">
                Bäst på att undvika djurspillning med P.O.O.P.-tekniken
              </p>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-emerald-800">
                  <strong>P.O.O.P. (Pet Owner Official Promise):</strong> iRobot garanterar att Roomba j7+
                  undviker djurspillning. Om den misslyckas, ersätter de roboten.
                </p>
              </div>
              <FeatureBadges product={getAffiliate("irobotRoombaj7Plus")} />
              <div className="mt-4">
                <SpecGrid product={getAffiliate("irobotRoombaj7Plus")} />
              </div>
              <div className="mt-6">
                <AffiliateCard product={getAffiliate("irobotRoombaj7Plus")} rank={3} showProsCons={true} className="border-0 shadow-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All pet-friendly products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Alla husdjursvänliga modeller</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {petFriendlyProducts.map((product, index) => (
              <div key={product.id} className="space-y-3">
                <FeatureBadges product={product} />
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
            <h2 className="mb-8 text-center text-2xl font-bold">Tips för husdjursägare</h2>
            <div className="space-y-4">
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🗓️ Kör roboten dagligen</h3>
                <p className="mt-2 text-muted-foreground">
                  Med husdjur samlas hår snabbt. Schemalägg roboten att städa varje dag, gärna när du inte är hemma
                  så djuren inte stressas.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🧹 Rengör borstarna regelbundet</h3>
                <p className="mt-2 text-muted-foreground">
                  Även gummiborstar behöver rengöras. Kolla dem varje vecka och ta bort hår som fastnat.
                </p>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm">
                <h3 className="font-semibold">🚫 Skapa förbjudna zoner</h3>
                <p className="mt-2 text-muted-foreground">
                  Använd appen för att markera matskålar och kattlådor som förbjudna zoner.
                  De flesta moderna robotar stödjer detta.
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
