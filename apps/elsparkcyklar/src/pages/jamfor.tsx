import { useState, useMemo } from "react";
import { SEOHead } from "@affiliate/seo";
import { AffiliateCard, Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAllAffiliates, type ExtendedAffiliateProduct } from "../config/affiliates";

type SortKey = "price" | "rating" | "range" | "weight";
type FilterKey = "all" | "roadLegal" | "budget" | "premium" | "commuter" | "power";

const filterOptions: { key: FilterKey; label: string; description: string }[] = [
  { key: "all", label: "Alla", description: "Visa alla modeller" },
  { key: "roadLegal", label: "Väglagliga", description: "Max 250W, 20 km/h" },
  { key: "budget", label: "Budget", description: "Under 7 000 kr" },
  { key: "commuter", label: "Pendling", description: "Bäst för daglig användning" },
  { key: "premium", label: "Premium", description: "Bäst kvalitet" },
  { key: "power", label: "Kraftfulla", description: "Mest prestanda" },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Betyg (högst först)" },
  { key: "price", label: "Pris (lägst först)" },
  { key: "range", label: "Räckvidd (längst först)" },
  { key: "weight", label: "Vikt (lättast först)" },
];

function parseRange(range: string | undefined): number {
  if (!range) return 0;
  const match = range.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseWeight(weight: string | undefined): number {
  if (!weight) return 999;
  const match = weight.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 999;
}

function ComparisonTableRow({ product, rank }: { product: ExtendedAffiliateProduct; rank: number }) {
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
                  variant={
                    product.isRoadLegal ? "legal" :
                    product.badge === "Bäst i test" || product.badge === "Bäst i test 2026" ? "gold" :
                    product.requiresInsurance ? "warning" : "secondary"
                  }
                  className="text-[10px]"
                >
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {product.isRoadLegal && (
                <span className="text-xs font-medium text-emerald-600">✓ Väglaglig</span>
              )}
              {product.requiresInsurance && (
                <span className="text-xs font-medium text-amber-600">⚠ Kräver försäkring</span>
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
        <span className="font-medium">{product.range}</span>
      </td>
      <td className="hidden p-4 text-center md:table-cell">
        <span>{product.motor}</span>
      </td>
      <td className="hidden p-4 text-center lg:table-cell">
        <span>{product.topSpeed}</span>
      </td>
      <td className="hidden p-4 text-center lg:table-cell">
        <span>{product.weight}</span>
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
      case "roadLegal":
        filtered = filtered.filter((p) => p.isRoadLegal);
        break;
      case "budget":
        filtered = filtered.filter((p) => p.price.amount < 7000);
        break;
      case "premium":
        filtered = filtered.filter((p) => p.category === "premium");
        break;
      case "commuter":
        filtered = filtered.filter((p) => p.category === "commuter");
        break;
      case "power":
        filtered = filtered.filter((p) => p.category === "power");
        break;
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price.amount - b.price.amount;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "range":
          return parseRange(b.range) - parseRange(a.range);
        case "weight":
          return parseWeight(a.weight) - parseWeight(b.weight);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, activeFilter, sortBy]);

  return (
    <>
      <SEOHead
        title="Jämför elsparkcyklar 2026 – Hitta bästa modellen | Elsparkcyklar.se"
        description="Jämför de bästa elsparkcyklarna sida vid sida. Filtrera på väglagliga, pris, räckvidd och mer. Uppdaterad maj 2026."
        siteName={siteConfig.name}
      />

      {/* Hero */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Jämför elsparkcyklar <span className="text-gradient">2026</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Filtrera och sortera för att hitta den perfekta elsparkcykeln för dina behov.
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
                  {option.key === "roadLegal" && "✓ "}
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
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground md:table-cell">Räckvidd</th>
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground md:table-cell">Motor</th>
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground lg:table-cell">Hastighet</th>
                    <th className="hidden p-4 text-center text-sm font-semibold text-muted-foreground lg:table-cell">Vikt</th>
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
              <AffiliateCard
                key={product.id}
                product={product}
                rank={index + 1}
                showProsCons={true}
                className="card-hover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Buying Guide */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Så väljer du rätt elsparkcykel
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
                  Bestäm din budget
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Elsparkcyklar finns från runt 5 000 kr till över 15 000 kr. För de flesta räcker en modell i mellanklassen
                  (6 000-10 000 kr) som erbjuder bra prestanda och hållbarhet.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
                  Tänk på räckvidden
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Hur långt behöver du kunna köra? För korta pendlingar räcker 30-40 km. För längre turer eller om du vill ha
                  marginal, sikta på 50+ km räckvidd. Kom ihåg att verklig räckvidd ofta är 20-30% lägre än tillverkarens uppgift.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
                  Kolla lagkraven
                </h3>
                <p className="mt-3 text-muted-foreground">
                  I Sverige är endast elsparkcyklar med max 250W motor och 20 km/h topphastighet lagliga på cykelbanor.
                  Snabbare modeller kräver registrering och försäkring. <Link to="/regler" className="text-primary hover:underline">Läs mer om reglerna →</Link>
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">4</span>
                  Vikt och portabilitet
                </h3>
                <p className="mt-3 text-muted-foreground">
                  Om du ska bära elsparkcykeln i trappor eller på kollektivtrafik är vikten viktig. Lätta modeller väger
                  runt 15-18 kg, medan kraftfullare modeller kan väga 24-26 kg.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Osäker på reglerna?</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/regler">Läs om svenska lagar och regler →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
