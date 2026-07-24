import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SEOHead, SchemaScript, canonicalUrl, type ProductListItem } from "@affiliate/seo";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getAllAffiliates, getReviewsForProduct } from "@/config/affiliates";

type SortKey = "rating" | "price-asc" | "price-desc" | "suction";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Betyg (högst först)" },
  { key: "price-asc", label: "Pris (lägst först)" },
  { key: "price-desc", label: "Pris (högst först)" },
  { key: "suction", label: "Sugkraft (starkast först)" },
];

function suction(value?: string): number {
  if (!value) return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function JamforPage() {
  const allProducts = getAllAffiliates();
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const sorted = useMemo(() => {
    const list = [...allProducts];
    list.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price.amount - b.price.amount;
        case "price-desc":
          return b.price.amount - a.price.amount;
        case "suction":
          return suction(b.suctionPower) - suction(a.suctionPower);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });
    return list;
  }, [allProducts, sortBy]);

  const productListItems: ProductListItem[] = allProducts.map((p) => ({
    name: p.name,
    description: p.description,
    image: p.image,
    url: `https://${siteConfig.domain}/jamfor#${p.id}`,
    price: p.price.amount,
    priceCurrency: p.price.currency || "SEK",
    ratingValue: p.rating,
    reviewCount: getReviewsForProduct(p.id).length,
  }));

  return (
    <>
      <SEOHead
        title={`Jämför robotdammsugare 2026 – Alla modeller sida vid sida | ${siteConfig.brand}`}
        description="Jämför marknadens bästa robotdammsugare sida vid sida: sugkraft, batteritid, ljudnivå, mopp och pris. Sortera och hitta rätt modell för ditt hem."
        canonical={canonicalUrl(siteConfig.domain, "/jamfor")}
        siteName={siteConfig.name}
      />
      <SchemaScript schema={{ type: "ItemList", items: productListItems }} />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Uppdaterad maj 2026
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Jämför robotdammsugare
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Alla {allProducts.length} testade modeller sida vid sida. Sortera på betyg, pris eller
              sugkraft för att snabbt hitta rätt robotdammsugare för ditt hem.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Detaljerad jämförelsetabell</h2>
            <ComparisonTable products={sorted} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">Alla modeller</h2>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600">Sortera:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {sortOptions.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {sorted.map((product, i) => (
                <div key={product.id} id={product.id}>
                  <ProductCard product={product} rank={i + 1} featured={i === 0} placement="compare_card" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Osäker på vad du ska titta efter?</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/guide">Läs vår köpguide →</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
