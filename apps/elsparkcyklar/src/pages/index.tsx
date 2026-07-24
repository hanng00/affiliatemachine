import { useState, useMemo } from "react";
import { SEOHead, SchemaScript, canonicalUrl, type ProductListItem } from "@affiliate/seo";
import { useTrackClick, useTrackActivation, buildSubId, appendSubId } from "@affiliate/analytics";
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

function ScooterCard({ 
  scooter, 
  rank 
}: { 
  scooter: ExtendedAffiliateProduct; 
  rank: number;
}) {
  const subId = buildSubId(siteConfig.slug, "product_card", scooter.id);
  const href = appendSubId(scooter.trackingUrl, subId);
  const trackBuy = useTrackClick({
    linkId: scooter.id,
    program: "adtraction",
    placement: "product_card",
    destinationUrl: href,
    subId,
  });
  return (
    <article className="overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-white" id={scooter.id}>
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
        {/* Image column */}
        <div className="relative flex items-start bg-white">
          <div className="sticky top-0 flex h-[180px] w-full items-center justify-center p-4">
            <span className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--color-accent)] font-mono text-[0.85rem] font-semibold text-white">
              {rank}
            </span>
            {scooter.image && (
              <img 
                src={scooter.image} 
                alt={`${scooter.name} elsparkcykel`}
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
              <h3 className="text-[1.15rem] font-bold leading-tight">{scooter.name}</h3>
              {scooter.badge && (
                <Badge variant={getBadgeVariant(scooter.badge)}>{scooter.badge}</Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[0.85rem] text-[var(--color-text-muted)]">
              <span className="font-mono font-semibold text-foreground">{scooter.rating}</span>
              <span className="text-[var(--color-text-subtle)]">/ 5</span>
              {scooter.bestFor && (
                <>
                  <span className="text-[var(--color-text-subtle)]">·</span>
                  <span>{scooter.bestFor}</span>
                </>
              )}
            </div>
          </div>

          {scooter.summary && (
            <p className="mb-3 text-[0.85rem] leading-[1.5] text-[var(--color-text-muted)]">{scooter.summary}</p>
          )}

          {/* Spec grid */}
          <div className="grid grid-cols-4 gap-px overflow-hidden rounded-[6px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)]">
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{scooter.topSpeedKmh ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">km/h</div>
            </div>
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{scooter.rangeKm ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">km</div>
            </div>
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{scooter.motorWatts ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">W</div>
            </div>
            <div className="bg-white px-2 py-3 text-center">
              <div className="font-mono text-base font-semibold">{scooter.weightKg ?? "–"}</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-text-muted)]">kg</div>
            </div>
          </div>

          {/* Pros */}
          {scooter.pros && scooter.pros.length > 0 && (
            <div className="mt-3 border-t border-[var(--color-border-subtle)] pt-3">
              <h4 className="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[0.04em] text-[var(--color-text-subtle)]">Fördelar</h4>
              <ul className="flex flex-col gap-0.5 text-[0.8rem] text-[var(--color-text-muted)]">
                {scooter.pros.slice(0, 3).map((pro, i) => (
                  <li key={i}><span className="font-bold text-[var(--color-success)]">+ </span>{pro}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex flex-col items-stretch gap-4 border-t border-[var(--color-border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[1.25rem] font-semibold">
                {scooter.price.amount.toLocaleString("sv-SE")} kr
              </span>
              <span className="text-[0.7rem] text-[var(--color-text-subtle)]">Pris hos E-Wheels</span>
            </div>
            <Button asChild>
              <a
                href={href}
                target="_blank"
                rel="noopener sponsored nofollow"
                onClick={trackBuy}
              >
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

export default function HomePage() {
  const allScooters = getAllAffiliates();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allScooters];

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
  }, [allScooters, activeFilter, sortBy]);

  // Activation = picked a need-filter ("for my use-case"), i.e. moved off "all".
  const trackActivation = useTrackActivation("list_filtered");
  function selectFilter(key: FilterKey) {
    if (key !== "all") trackActivation();
    setActiveFilter(key);
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Är elsparkcyklar lagliga i Sverige?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja. Elsparkcyklar med max 20 km/h och 250W motor klassas som cykel och får köras på cykelbanor utan körkort.",
        },
      },
      {
        "@type": "Question",
        name: "Vilken elsparkcykel är bäst för pendling?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "För daglig pendling rekommenderar vi modeller med minst 40 km räckvidd, 10-tums hjul, bra fjädring och vattentålighet.",
        },
      },
      {
        "@type": "Question",
        name: "Behöver jag försäkring för min elsparkcykel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Om din elsparkcykel håller sig inom 20 km/h och 250W täcks du vanligtvis av din hemförsäkring.",
        },
      },
      {
        "@type": "Question",
        name: "Kan man köra elsparkcykel på vintern?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, men batterikapaciteten minskar 20–40% i kyla och du bör överväga dubbdäck.",
        },
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Elsparkcyklar.se",
    url: "https://elsparkcyklar.se",
    description: "Oberoende tester och guider för elsparkcyklar i Sverige",
    inLanguage: "sv-SE",
  };

  const productListItems: ProductListItem[] = allScooters.map((s) => ({
    name: s.name,
    description: s.summary || s.description,
    image: s.image,
    url: `https://${siteConfig.domain}/#${s.id}`,
    price: s.price.amount,
    priceCurrency: s.price.currency || "SEK",
  }));

  return (
    <>
      <SEOHead
        title={siteConfig.title}
        description={siteConfig.description}
        canonical={canonicalUrl(siteConfig.domain, "/")}
        siteName={siteConfig.name}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SchemaScript schema={{ type: "ItemList", items: productListItems }} />

      {/* Hero */}
      <section className="border-b border-[var(--color-border-subtle)] py-12 md:py-14">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="rise grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="max-w-[480px]">
              <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[var(--color-accent)]">
                Uppdaterad maj 2026
              </p>
              <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.25] tracking-[-0.01em]">
                Hitta rätt elsparkcykel för svenska förhållanden
              </h1>
              <p className="mt-4 max-w-[540px] text-[1.1rem] leading-[1.65] text-[var(--color-text-muted)]">
                Oberoende tester och guider för dig som vill pendla smartare. 
                Vi hjälper dig välja rätt modell, förstå reglerna och klara vintern.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#produkter">Se alla modeller</a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/regler">Regler & Lagar</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="/hero.png" 
                alt="Person på elsparkcykel i stadsmiljö" 
                width="600" 
                height="400"
                className="max-w-full rounded-[10px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-muted)] py-6">
        <div className="mx-auto max-w-[1080px] px-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <span className="block font-mono text-[1.15rem] font-semibold">20 km/h</span>
              <span className="mt-0.5 block text-[0.75rem] text-[var(--color-text-muted)]">Laglig maxhastighet</span>
            </div>
            <div className="text-center">
              <span className="block font-mono text-[1.15rem] font-semibold">250 W</span>
              <span className="mt-0.5 block text-[0.75rem] text-[var(--color-text-muted)]">Max motoreffekt</span>
            </div>
            <div className="text-center">
              <span className="block font-mono text-[1.15rem] font-semibold">3 000 kr</span>
              <span className="mt-0.5 block text-[0.75rem] text-[var(--color-text-muted)]">Från-pris</span>
            </div>
            <div className="text-center">
              <span className="block font-mono text-[1.15rem] font-semibold">80 km</span>
              <span className="mt-0.5 block text-[0.75rem] text-[var(--color-text-muted)]">Bästa räckvidd</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products with filters */}
      <section id="produkter" className="py-12">
        <div className="mx-auto max-w-[1080px] px-5">
          <header className="mb-7">
            <h2 className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">Alla elsparkcyklar 2026</h2>
            <p className="mt-1 text-base text-[var(--color-text-muted)]">Testade och utvärderade för svenska förhållanden — regn, kyla och cykelbanor.</p>
          </header>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => selectFilter(option.key)}
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

          {/* Results count */}
          <p className="mb-4 text-[0.85rem] text-[var(--color-text-muted)]">
            Visar <strong className="text-foreground">{filteredAndSortedProducts.length}</strong> av {allScooters.length} modeller
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="ml-2 text-[var(--color-accent)] hover:underline"
              >
                Rensa filter
              </button>
            )}
          </p>

          {/* Product cards */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredAndSortedProducts.map((scooter, i) => (
                <ScooterCard key={scooter.id} scooter={scooter} rank={i + 1} />
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

      {/* Why trust us */}
      <section className="py-12">
        <div className="mx-auto max-w-[720px] px-5">
          <header className="mb-6 text-center">
            <h2 className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">Varför Elsparkcykeln.se?</h2>
          </header>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-base font-bold">Svenskt fokus</h3>
              <p className="mt-1 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                Vi testar med fokus på svenska förhållanden — vinterkyla, regn, cykelbanor och lokala regler. Inte kaliforniskt solsken.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold">Oberoende omdömen</h3>
              <p className="mt-1 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                Våra rankningar baseras på prestanda och värde, inte sponsring. Vi är transparenta med hur vi tjänar pengar.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold">Alltid uppdaterat</h3>
              <p className="mt-1 text-[0.9rem] leading-[1.55] text-[var(--color-text-muted)]">
                Priser, regler och modeller ändras. Vi håller allt aktuellt så du kan lita på informationen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-bg-muted)] py-12">
        <div className="mx-auto max-w-[720px] px-5">
          <header className="mb-7">
            <h2 className="font-display text-[clamp(1.35rem,2.5vw,1.75rem)] font-bold">Vanliga frågor</h2>
          </header>
          <div className="flex flex-col gap-2">
            <details className="group overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Är elsparkcyklar lagliga i Sverige?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-[1.6] text-[var(--color-text-muted)]">
                <p className="mb-3">
                  Ja. Elsparkcyklar med max 20 km/h och 250W motor klassas som cykel och får
                  köras på cykelbanor utan körkort. Modeller som överskrider dessa gränser
                  kräver registrering och trafikförsäkring.
                </p>
                <p><Link to="/regler" className="text-[var(--color-accent)] no-underline hover:underline">Läs mer om reglerna →</Link></p>
              </div>
            </details>
            <details className="group overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Vilken elsparkcykel är bäst för pendling?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-[1.6] text-[var(--color-text-muted)]">
                <p className="mb-3">
                  För daglig pendling rekommenderar vi modeller med minst 40 km räckvidd,
                  10-tums hjul, bra fjädring och vattentålighet (IPX5). Segway Ninebot Max G2 och
                  Xiaomi 5 Max är utmärkta val.
                </p>
                <p><a href="#produkter" className="text-[var(--color-accent)] no-underline hover:underline">Se pendlingsmodeller →</a></p>
              </div>
            </details>
            <details className="group overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Behöver jag försäkring för min elsparkcykel?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-[1.6] text-[var(--color-text-muted)]">
                <p className="mb-3">
                  Om din elsparkcykel håller sig inom 20 km/h och 250W täcks du vanligtvis
                  av din hemförsäkring. Modeller som kan köra snabbare kräver trafikförsäkring.
                </p>
                <p><Link to="/regler" className="text-[var(--color-accent)] no-underline hover:underline">Läs om försäkringsreglerna →</Link></p>
              </div>
            </details>
            <details className="group overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[0.95rem] font-semibold [&::-webkit-details-marker]:hidden">
                Kan man köra elsparkcykel på vintern?
                <span className="font-mono text-[1.1rem] text-[var(--color-text-subtle)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-[0.92rem] leading-[1.6] text-[var(--color-text-muted)]">
                <p className="mb-3">
                  Ja, men det kräver förberedelse. Batterikapaciteten minskar 20–40% i kyla,
                  och du bör överväga dubbdäck och extra belysning för säker vinterkörning.
                </p>
                <p><a href="#produkter" className="text-[var(--color-accent)] no-underline hover:underline">Se alla modeller →</a></p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
