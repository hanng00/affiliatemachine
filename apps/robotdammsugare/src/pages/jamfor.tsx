import { useState, useMemo } from "react";
import { SEOHead } from "@affiliate/seo";
import { AffiliateCard, Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAllAffiliates, type RobotVacuumProduct } from "../config/affiliates";
import { FeatureBadges, SpecGrid } from "../components/ProductComponents";

type SortKey = "price" | "rating" | "suction" | "battery";
type FilterKey = "all" | "selfEmpty" | "mopping" | "petFriendly" | "budget" | "premium";

const filterOptions: { key: FilterKey; label: string; description: string }[] = [
  { key: "all", label: "Alla", description: "Visa alla modeller" },
  { key: "selfEmpty", label: "Självtömmande", description: "Med självtömmande station" },
  { key: "mopping", label: "Med mopp", description: "Har moppfunktion" },
  { key: "petFriendly", label: "Husdjursvänlig", description: "Bra för djurhår" },
  { key: "budget", label: "Budget", description: "Under 6 000 kr" },
  { key: "premium", label: "Premium", description: "Bäst kvalitet" },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Betyg (högst först)" },
  { key: "price", label: "Pris (lägst först)" },
  { key: "suction", label: "Sugkraft (starkast först)" },
  { key: "battery", label: "Batteri (längst först)" },
];

function parseSuction(suction: string | undefined): number {
  if (!suction) return 0;
  const match = suction.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseBattery(battery: string | undefined): number {
  if (!battery) return 0;
  const match = battery.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function ComparisonTableRow({ product, rank }: { product: RobotVacuumProduct; rank: number }) {
  return (
    <tr className="comparison-row border-b border-border/50 transition-colors hover:bg-muted/50">
      <td className="p-4 text-center">
        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rank === 1 ? "rank-badge-gold text-white" : "bg-muted text-muted-foreground"}`}>
          {rank}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{product.name}</span>
              {product.badge && (
                <Badge
                  variant={product.badge === "Bäst i test" ? "gold" : "secondary"}
                  className="text-[10px]"
                >
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {product.petFriendly && (
                <span className="text-xs font-medium text-amber-600">🐾 Husdjur</span>
              )}
              {product.hasMopping && (
                <span className="text-xs font-medium text-blue-600">💧 Mopp</span>
              )}
              {product.hasSelfEmpty && (
                <span className="text-xs font-medium text-emerald-600">✓ Självtömmande</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="star-filled">★</span>
          <span className="font-medium">{product.rating?.toFixed(1)}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <span className="price-tag font-bold">{product.price.amount.toLocaleString("sv-SE")} kr</span>
      </td>
      <td className="hidden p-4 text-center md:table-cell">
        <span className="font-medium">{product.suctionPower}</span>
      </td>
      <td className="hidden p-4 text-center md:table-cell">
        <span>{product.batteryLife}</span>
      </td>
      <td className="hidden p-4 text-center lg:table-cell">
        <span>{product.noiseLevel}</span>
      </td>
      <td className="p-4 text-right">
        <Button asChild size="sm" className="cta-glow">
          <a href={product.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
            Se pris →
          </a>
        </Button>
      </td>
    </tr>
  );
}

export default function JamforPage() {
  const allProducts = getAllAffiliates();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    switch (activeFilter) {
      case "selfEmpty":
        filtered = filtered.filter((p) => p.hasSelfEmpty);
        break;
      case "mopping":
        filtered = filtered.filter((p) => p.hasMopping);
        break;
      case "petFriendly":
        filtered = filtered.filter((p) => p.petFriendly);
        break;
      case "budget":
        filtered = filtered.filter((p) => p.price.amount < 6000);
        break;
      case "premium":
        filtered = filtered.filter((p) => p.category === "premium");
        break;
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price.amount - b.price.amount;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "suction":
          return parseSuction(b.suctionPower) - parseSuction(a.suctionPower);
        case "battery":
          return parseBattery(b.batteryLife) - parseBattery(a.batteryLife);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, activeFilter, sortBy]);

  return (
    <>
      <SEOHead
        title="Jämför robotdammsugare 2026 – Hitta bästa modellen | Robotdammsugare.se"
        description="Jämför de bästa robotdammsugarna sida vid sida. Filtrera på självtömmande, moppfunktion, husdjursvänlig och mer. Uppdaterad maj 2026."
        siteName={siteConfig.name}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Jämför robotdammsugare <span className="text-gradient">2026</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Filtrera och sortera för att hitta den perfekta robotdammsugaren för ditt hem.
              Alla priser och specifikationer uppdaterade maj 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 border-b border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeFilter === option.key
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  title={option.description}
                >
                  {option.key === "selfEmpty" && "🗑️ "}
                  {option.key === "mopping" && "💧 "}
                  {option.key === "petFriendly" && "🐾 "}
                  {option.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sortera:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results count */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            Visar <strong>{filteredAndSortedProducts.length}</strong> av {allProducts.length} modeller
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="ml-2 text-primary hover:underline"
              >
                Rensa filter
              </button>
            )}
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-center text-sm font-semibold text-muted-foreground">#</th>
                    <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Modell</th>
                    <th className="p-4 text-center text-sm font-semibold text-muted-foreground">Betyg</th>
                    <th className="p-4 text-center text-sm font-semibold text-muted-foreground">Pris</th>
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground md:table-cell">Sugkraft</th>
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground md:table-cell">Batteri</th>
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground lg:table-cell">Ljudnivå</th>
                    <th className="p-4 text-right text-sm font-semibold text-muted-foreground">Länk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProducts.map((product, index) => (
                    <ComparisonTableRow key={product.id} product={product} rank={index + 1} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <p className="text-lg text-muted-foreground">Inga modeller matchar dina filter.</p>
              <Button onClick={() => setActiveFilter("all")} className="mt-4">
                Visa alla modeller
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Detailed Cards */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Detaljerad jämförelse</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredAndSortedProducts.map((product, index) => (
              <div key={product.id} className="space-y-4">
                <FeatureBadges product={product} />
                <SpecGrid product={product} />
                <AffiliateCard
                  product={product}
                  rank={index + 1}
                  showProsCons={true}
                  className="card-hover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guide */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Snabbguide: Vad ska du tänka på?
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
                  Sugkraft (Pa)
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Högre Pa = starkare sugkraft. För djurhår och mattor, sikta på minst 4000 Pa.
                  Premium-modeller har 6000-8000 Pa.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
                  Självtömmande station
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Sparar tid och är perfekt för allergiker. Roboten tömmer sig själv efter varje städning.
                  Värt extrakostnaden för de flesta.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
                  Moppfunktion
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Bra för daglig underhållsstädning av hårda golv. De bästa modellerna har roterande moppar
                  och automatisk mopptvätt.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">4</span>
                  Hinderdetektering
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Viktigt om du har husdjur eller barn. Bra modeller undviker kablar, leksaker och djurspillning.
                  iRobot Roomba j7+ är bäst på detta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Vill du veta mer?</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/guide">Läs vår kompletta köpguide →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
