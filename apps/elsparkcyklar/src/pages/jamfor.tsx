import { useState, useMemo } from "react";
import { SEOHead, SchemaScript, canonicalUrl, type ProductListItem } from "@affiliate/seo";
import { useTrackClick } from "@affiliate/analytics";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAllAffiliates, type ExtendedAffiliateProduct } from "../config/affiliates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

function getBadgeVariant(badge?: string): "best" | "budget" | "premium" {
  if (!badge) return "best";
  if (badge.toLowerCase().includes("budget") || badge.toLowerCase().includes("bästa köp") || badge.toLowerCase().includes("prisvärd")) return "budget";
  if (badge.toLowerCase().includes("premium")) return "premium";
  return "best";
}

function ComparisonCard({ product, rank }: { product: ExtendedAffiliateProduct; rank: number }) {
  const trackBuy = useTrackClick({
    linkId: product.id,
    program: "adtraction",
    placement: "compare_card",
    destinationUrl: product.trackingUrl,
  });
  return (
    <article className="overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
        {/* Image column */}
        <div className="relative flex items-start bg-white">
          <div className="sticky top-0 flex h-[180px] w-full items-center justify-center p-4">
            <span className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--color-accent)] font-mono text-[0.85rem] font-semibold text-white">
              {rank}
            </span>
            {product.image && (
              <img
                src={product.image}
                alt={`${product.name} elsparkcykel`}
                loading="lazy"
                width="200"
                height="200"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Content column */}
        <div className="px-5 py-4">
          <div className="mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1.15rem] font-bold leading-tight">{product.name}</h3>
              {product.badge && (
                <Badge variant={getBadgeVariant(product.badge)}>{product.badge}</Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[0.85rem] text-[var(--color-text-muted)]">
              <span className="font-mono font-semibold text-foreground">{product.rating}</span>
              <span className="text-[var(--color-text-subtle)]">/ 5</span>
              {product.bestFor && (
                <>
                  <span className="text-[var(--color-text-subtle)]">·</span>
                  <span>{product.bestFor}</span>
                </>
              )}
            </div>
          </div>

          {product.summary && (
            <p className="mb-3 text-[0.85rem] leading-[1.5] text-[var(--color-text-muted)]">{product.summary}</p>
          )}

          {/* Spec grid */}
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)]">
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{product.topSpeedKmh ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">km/h</div>
            </div>
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{product.rangeKm ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">km</div>
            </div>
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{product.motorWatts ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">W</div>
            </div>
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{product.weightKg ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">kg</div>
            </div>
          </div>

          {/* Pros */}
          {product.pros && product.pros.length > 0 && (
            <div className="mt-3 border-t border-[var(--color-border-subtle)] pt-3">
              <h4 className="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Fördelar</h4>
              <ul className="flex flex-col gap-0.5 text-[0.8rem] text-[var(--color-text-muted)]">
                {product.pros.slice(0, 3).map((pro, i) => (
                  <li key={i}><span className="font-bold text-[var(--color-success)]">+ </span>{pro}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex flex-col items-stretch gap-4 border-t border-[var(--color-border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[1.25rem] font-semibold">
                {product.price.amount.toLocaleString("sv-SE")} kr
              </span>
              <span className="text-[0.7rem] text-[var(--color-text-subtle)]">Pris hos E-Wheels</span>
            </div>
            <Button asChild>
              <a href={product.trackingUrl} target="_blank" rel="noopener sponsored nofollow" onClick={trackBuy}>
                Köp nu →
              </a>
            </Button>
          </div>
          <p className="mt-3 text-right text-[0.7rem] text-[var(--color-text-subtle)]">Affiliatelänk — vi kan få provision vid köp</p>
        </div>
      </div>
    </article>
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

  const productListItems: ProductListItem[] = allProducts.map((p) => ({
    name: p.name,
    description: p.summary || p.description,
    image: p.image,
    url: `https://${siteConfig.domain}/#${p.id}`,
    price: p.price.amount,
    priceCurrency: p.price.currency || "SEK",
  }));

  return (
    <>
      <SEOHead
        title={`Jämför elsparkcyklar 2026 – Hitta bästa modellen | ${siteConfig.brand}`}
        description="Jämför de bästa elsparkcyklarna sida vid sida. Filtrera på väglagliga, pris, räckvidd och mer. Uppdaterad maj 2026."
        canonical={canonicalUrl(siteConfig.domain, "/jamfor")}
        siteName={siteConfig.name}
      />
      <SchemaScript schema={{ type: "ItemList", items: productListItems }} />

      {/* Hero */}
      <section className="border-b border-[var(--color-border-subtle)] py-12 md:py-14">
        <div className="mx-auto max-w-[1080px] px-5">
          <header className="max-w-[600px]">
            <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[var(--color-accent)]">
              Uppdaterad maj 2026
            </p>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.25] tracking-[-0.01em]">
              Jämför elsparkcyklar
            </h1>
            <p className="mt-4 text-[1.1rem] leading-[1.65] text-[var(--color-text-muted)]">
              Filtrera och sortera för att hitta den perfekta elsparkcykeln för dina behov.
              Alla priser och specifikationer uppdaterade.
            </p>
          </header>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-14 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-elevated)]/80">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={`rounded-[6px] px-3.5 py-2 text-[0.88rem] font-medium transition-all ${
                    activeFilter === option.key
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)]/80"
                  }`}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-[0.85rem] text-[var(--color-text-muted)]">
                Sortera:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-[6px] border border-[var(--color-border)] bg-white px-3 py-2 text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
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
        <div className="mx-auto max-w-[1080px] px-5">
          <p className="text-[0.85rem] text-[var(--color-text-muted)]">
            Visar <strong className="text-foreground">{filteredAndSortedProducts.length}</strong> av {allProducts.length} modeller
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="ml-2 text-[var(--color-accent)] hover:underline"
              >
                Rensa filter
              </button>
            )}
          </p>
        </div>
      </section>

      {/* Product cards */}
      <section className="pb-12">
        <div className="mx-auto max-w-[1080px] px-5">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredAndSortedProducts.map((product, index) => (
                <ComparisonCard key={product.id} product={product} rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-12 text-center">
              <p className="text-[var(--color-text-muted)]">Inga modeller matchar dina filter.</p>
              <Button onClick={() => setActiveFilter("all")} className="mt-4">
                Visa alla modeller
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Buying Guide */}
      <section className="bg-[var(--color-bg-muted)] py-12">
        <div className="mx-auto max-w-[720px] px-5">
          <header className="mb-7">
            <h2 className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">
              Så väljer du rätt elsparkcykel
            </h2>
            <p className="mt-1 text-base text-[var(--color-text-muted)]">
              Fyra steg till rätt val — baserat på dina behov och svenska förhållanden.
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-6">
              <h3 className="flex items-center gap-3 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--color-accent)] font-mono text-[0.85rem] font-semibold text-white">1</span>
                Bestäm din budget
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                Elsparkcyklar finns från runt 3 000 kr till över 15 000 kr. För de flesta räcker en modell i mellanklassen
                (6 000–10 000 kr) som erbjuder bra prestanda och hållbarhet.
              </p>
            </div>

            <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-6">
              <h3 className="flex items-center gap-3 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--color-accent)] font-mono text-[0.85rem] font-semibold text-white">2</span>
                Tänk på räckvidden
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                Hur långt behöver du kunna köra? För korta pendlingar räcker 30–40 km. Kom ihåg att verklig räckvidd 
                ofta är 20–30% lägre än tillverkarens uppgift.
              </p>
            </div>

            <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-6">
              <h3 className="flex items-center gap-3 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--color-accent)] font-mono text-[0.85rem] font-semibold text-white">3</span>
                Kolla lagkraven
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                I Sverige är endast elsparkcyklar med max 250W motor och 20 km/h topphastighet lagliga på cykelbanor.
                Snabbare modeller kräver registrering och försäkring. <Link to="/regler" className="text-[var(--color-accent)] hover:underline">Läs mer om reglerna →</Link>
              </p>
            </div>

            <div className="rounded-[10px] border border-[var(--color-border)] bg-white p-6">
              <h3 className="flex items-center gap-3 font-bold">
                <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--color-accent)] font-mono text-[0.85rem] font-semibold text-white">4</span>
                Vikt och portabilitet
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                Om du ska bära elsparkcykeln i trappor eller på kollektivtrafik är vikten viktig. Lätta modeller väger
                runt 11–17 kg, medan kraftfullare modeller kan väga 24–30 kg.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-[1080px] px-5 text-center">
          <p className="text-[var(--color-text-muted)]">Osäker på reglerna?</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/regler">Läs om svenska lagar och regler →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
