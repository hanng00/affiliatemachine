import { useState, useMemo } from "react";
import { SEOHead, SchemaScript, canonicalUrl, type ProductListItem } from "@affiliate/seo";
import { useTrackClick, useTrackActivation, buildSubId, appendSubId } from "@affiliate/analytics";
import { ComparisonTable } from "@/components/ui/comparison-table";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getAllAffiliates, getAffiliate, getReviewsForProduct } from "@/config/affiliates";

type FilterKey = "alla" | "husdjur" | "lagenheter" | "stora-hem";

const filterOptions: { key: FilterKey; label: string; emoji: string; hint: string }[] = [
  { key: "alla", label: "Alla modeller", emoji: "🏆", hint: "Hela vår testade topplista" },
  { key: "husdjur", label: "Husdjur", emoji: "🐾", hint: "Stark sugkraft + gummiborstar som inte trasslar djurhår" },
  { key: "lagenheter", label: "Lägenhet", emoji: "🌙", hint: "Tysta modeller (under 68 dB) – kör utan att störa" },
  { key: "stora-hem", label: "Stora hem", emoji: "🏡", hint: "Lång batteritid (120+ min) för stora ytor" },
];

function ReviewQuote({ text, author, location, source }: { text: string; author: string; location: string; source: string }) {
  return (
    <blockquote className="rounded-2xl border border-border bg-card p-6">
      <div className="text-amber-400" aria-hidden="true">★★★★★</div>
      <p className="mt-3 leading-relaxed text-foreground/80">"{text}"</p>
      <footer className="mt-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{author}</span>, {location}
        <span className="text-muted-foreground/70"> · via {source}</span>
      </footer>
    </blockquote>
  );
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("alla");

  const topPick = getAffiliate("roborockS8ProUltra");
  const allProducts = getAllAffiliates();
  const topPickReviews = getReviewsForProduct("roborock-s8-pro-ultra");

  const topSubId = buildSubId(siteConfig.slug, "featured", topPick.id);
  const topHref = appendSubId(topPick.trackingUrl, topSubId);
  const trackTop = useTrackClick({
    linkId: topPick.id,
    program: "adtraction",
    placement: "featured",
    destinationUrl: topHref,
    subId: topSubId,
  });

  const finalSubId = buildSubId(siteConfig.slug, "final_cta", topPick.id);
  const finalHref = appendSubId(topPick.trackingUrl, finalSubId);
  const trackFinal = useTrackClick({
    linkId: topPick.id,
    program: "adtraction",
    placement: "final_cta",
    destinationUrl: finalHref,
    subId: finalSubId,
  });

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case "husdjur":
        return allProducts.filter((p) => p.petFriendly);
      case "lagenheter":
        return allProducts.filter((p) => p.noiseLevel && parseInt(p.noiseLevel) <= 68);
      case "stora-hem":
        return allProducts.filter((p) => p.batteryLife && parseInt(p.batteryLife) >= 120);
      default:
        return allProducts;
    }
  }, [allProducts, activeFilter]);

  const activeOption = filterOptions.find((o) => o.key === activeFilter)!;

  // Activation = picked a need-filter ("for my home"), i.e. moved off "alla".
  const trackActivation = useTrackActivation("list_filtered");
  function selectFilter(key: FilterKey) {
    if (key !== "alla") trackActivation();
    setActiveFilter(key);
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vilken robotdammsugare är bäst i test 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Roborock S8 Pro Ultra är vårt toppval för 2026 med 4.9/5 betyg. Den har 6000 Pa sugkraft, självtömmande station, automatisk mopptvätt och utmärkt hinderdetektering.",
        },
      },
      {
        "@type": "Question",
        name: "Vilken robotdammsugare är bäst för husdjur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Roborock S8 Pro Ultra och Dreame L20 Ultra är bäst för husdjursägare. De har gummiborstar som inte trasslar hår, stark sugkraft och bra hinderdetektering.",
        },
      },
      {
        "@type": "Question",
        name: "Hur mycket kostar en bra robotdammsugare?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En bra robotdammsugare kostar mellan 5 000-15 000 kr. Budgetmodeller kostar runt 5 000 kr, mellanklassen 7 000-10 000 kr, och premiummodeller 10 000-15 000 kr.",
        },
      },
    ],
  };

  const productListItems: ProductListItem[] = allProducts.map((p) => {
    const reviewCount = getReviewsForProduct(p.id).length;
    return {
      name: p.name,
      description: p.description,
      image: p.image,
      url: `https://${siteConfig.domain}/#${p.id}`,
      price: p.price.amount,
      priceCurrency: p.price.currency || "SEK",
      ratingValue: p.rating,
      reviewCount,
    };
  });

  return (
    <>
      <SEOHead
        title={siteConfig.title}
        description={siteConfig.description}
        canonical={canonicalUrl(siteConfig.domain, "/")}
        siteName={siteConfig.name}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SchemaScript schema={{ type: "ItemList", items: productListItems }} />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div className="rise">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
                <span className="text-amber-500">★</span> Oberoende test · Uppdaterad maj 2026
              </div>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Robotdammsugaren som
                <span className="text-teal"> klarar svenska hem</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Vi testade marknadens robotdammsugare på det som faktiskt spelar roll i Sverige:
                djurhår, mattor, hörn och hur tyst den är när familjen sover. Här är de som höll måttet.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <a href="#toppval">Se vårt #1 val →</a>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <a href="#jamfor">Jämför alla {allProducts.length}</a>
                </Button>
              </div>
              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                {[
                  { n: `${allProducts.length}`, l: "modeller testade" },
                  { n: "100+", l: "användarrecensioner" },
                  { n: "4 behov", l: "matchade kategorier" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="font-display text-2xl font-extrabold text-foreground">{s.n}</dt>
                    <dd className="text-sm text-muted-foreground">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rise" style={{ animationDelay: "0.12s" }}>
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-4xl bg-teal-soft opacity-60 blur-2xl" />
                <picture>
                  <source srcSet="/hero.webp" type="image/webp" />
                  <img
                    src="/hero.jpg"
                    alt="Robotdammsugare som städar ett ljust skandinaviskt vardagsrum med en sovande katt"
                    className="w-full rounded-[1.75rem] border border-border shadow-2xl"
                    width="1600"
                    height="1067"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── #1 Pick ────────────────────────────────────────────── */}
      <section id="toppval" className="scroll-mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="font-display text-sm font-bold uppercase tracking-widest text-teal">
                Vårt toppval 2026
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground md:text-4xl">
                {topPick.name}
              </h2>
              <p className="mt-3 text-muted-foreground">
                Bäst i test med {topPick.rating?.toFixed(1)}/5 – den bästa balansen mellan prestanda, djurhår och underhåll.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-xl">
              <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                {/* visual side */}
                <div className="relative bg-secondary p-8 md:p-10">
                  <span className="absolute left-6 top-6 z-10 flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 font-display text-xs font-extrabold text-amber-950 shadow">
                    🏆 Bäst i test
                  </span>
                  {topPick.image ? (
                    <img
                      src={topPick.image}
                      alt={topPick.name}
                      loading="lazy"
                      className="mx-auto aspect-square w-full max-w-xs rounded-2xl bg-white object-contain p-3 shadow-sm"
                    />
                  ) : (
                    <ProductVisual name={topPick.name} showLabel className="mx-auto aspect-square w-full max-w-xs" />
                  )}
                  <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                    {[
                      { v: topPick.suctionPower, l: "Sugkraft" },
                      { v: topPick.batteryLife, l: "Batteri" },
                      { v: topPick.noiseLevel, l: "Ljud" },
                      { v: topPick.dustbinSize, l: "Behållare" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl bg-card p-2.5">
                        <div className="font-display text-sm font-bold text-foreground">{s.v}</div>
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* content side */}
                <div className="p-8 md:p-10">
                  <p className="leading-relaxed text-foreground/80">{topPick.description}</p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="font-display text-sm font-bold text-teal">Fördelar</h4>
                      <ul className="mt-3 space-y-2">
                        {topPick.pros?.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                            <span className="mt-0.5 text-teal">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-destructive">Att tänka på</h4>
                      <ul className="mt-3 space-y-2">
                        {topPick.cons?.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-0.5 text-destructive/70">–</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-secondary p-5 sm:flex-row sm:justify-between">
                    <div>
                      <div className="font-display text-3xl font-extrabold text-foreground">
                        {topPick.price.amount.toLocaleString("sv-SE")} kr
                      </div>
                      <div className="text-sm text-muted-foreground">Pris hos återförsäljare</div>
                    </div>
                    <Button asChild size="xl" className="w-full sm:w-auto">
                      <a href={topHref} target="_blank" rel="noopener noreferrer sponsored nofollow" onClick={trackTop}>
                        Se pris & köp →
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {topPickReviews.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-5 text-center font-display text-lg font-bold text-foreground">Vad ägarna säger</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {topPickReviews.map((review, i) => (
                    <ReviewQuote key={i} {...review} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Topplista with need-filter ─────────────────────────── */}
      <section id="topplista" className="scroll-mt-20 border-y border-border bg-secondary/60 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">Topplista 2026</h2>
              <p className="mt-3 text-muted-foreground">Filtrera efter ditt hem – listan rankas om direkt.</p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => selectFilter(option.key)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    activeFilter === option.key
                      ? "bg-teal text-white shadow-md"
                      : "border border-border bg-card text-foreground/70 hover:border-teal/40"
                  }`}
                >
                  <span aria-hidden="true">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{activeOption.hint}</span> · visar {filteredProducts.length} av {allProducts.length}
            </p>

            <div className="mt-8 space-y-4">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} rank={index + 1} featured={index === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ───────────────────────────────────── */}
      <section id="jamfor" className="scroll-mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">Detaljerad jämförelse</h2>
              <p className="mt-3 text-muted-foreground">Alla testade modeller sida vid sida.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <ComparisonTable products={filteredProducts} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Buying guide ───────────────────────────────────────── */}
      <section id="guide" className="scroll-mt-20 border-t border-border bg-secondary/60 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <span className="font-display text-sm font-bold uppercase tracking-widest text-teal">Köpguide 2026</span>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground md:text-4xl">Så väljer du rätt</h2>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground">💪 Sugkraft (Pa)</h3>
                <p className="mt-2 text-sm text-muted-foreground">Högre Pa = starkare sug. För djurhår och mattor: sikta på minst 4000 Pa.</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                    <span>2000–3000 Pa</span><span className="text-muted-foreground">Hårda golv, lite damm</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                    <span>4000–5500 Pa</span><span className="text-muted-foreground">Mattor, djurhår, vardag</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-teal-soft px-3 py-2">
                    <span className="font-semibold">6000–8000 Pa</span><span className="text-teal">Tjocka mattor, mycket djurhår</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground">🗑️ Självtömmande station</h3>
                <p className="mt-2 text-sm text-muted-foreground">Tömmer dammbehållaren automatiskt – värt extrakostnaden för de flesta.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-teal-soft p-4">
                    <h4 className="font-display text-sm font-bold text-teal">✓ Fördelar</h4>
                    <ul className="mt-2 space-y-1 text-sm text-foreground/75">
                      <li>Slipper tömma varje gång</li>
                      <li>Bättre för allergiker</li>
                      <li>Mindre underhåll</li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-4">
                    <h4 className="font-display text-sm font-bold text-destructive">✗ Nackdelar</h4>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>2000–4000 kr dyrare</li>
                      <li>Tar mer plats</li>
                      <li>Påsar kostar pengar</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground">💰 Priskategorier</h3>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border-l-4 border-teal bg-secondary p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Budget: under 6 000 kr</span>
                      <span className="text-sm text-muted-foreground">Xiaomi X10+</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Grundfunktioner, perfekt för mindre hem.</p>
                  </div>
                  <div className="rounded-xl border-l-4 border-amber-400 bg-secondary p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Mellanklass: 6 000–10 000 kr</span>
                      <span className="text-sm text-muted-foreground">Roborock Q Revo</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Sweet spot för de flesta hem.</p>
                  </div>
                  <div className="rounded-xl border-l-4 border-foreground bg-secondary p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Premium: över 10 000 kr</span>
                      <span className="text-sm text-muted-foreground">Roborock S8 Pro Ultra</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Bäst i allt – för dig som vill ha toppklass.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-display text-3xl font-extrabold text-foreground md:text-4xl">Vanliga frågor</h2>
            <div className="space-y-3">
              {[
                {
                  q: "Vilken robotdammsugare är bäst i test 2026?",
                  a: "Roborock S8 Pro Ultra är vårt toppval med 4.9/5 betyg. Den kombinerar 6000 Pa sugkraft, självtömmande station och automatisk mopptvätt i ett komplett paket.",
                },
                {
                  q: "Vilken är bäst för husdjur?",
                  a: "Roborock S8 Pro Ultra och Dreame L20 Ultra hanterar djurhår bäst. Båda har gummiborstar som inte trasslar och stark sugkraft.",
                },
                {
                  q: "Hur mycket kostar en bra robotdammsugare?",
                  a: "Räkna med 5 000–15 000 kr. Budgetmodeller runt 5 000 kr, mellanklassen 7 000–10 000 kr och premiummodeller 10 000–15 000 kr.",
                },
                {
                  q: "Är självtömmande station värt det?",
                  a: "Ja, för de flesta. Du slipper tömma efter varje städning och det är bättre för allergiker. Räkna med 2 000–4 000 kr extra.",
                },
              ].map((item) => (
                <details key={item.q} className="group rounded-2xl border border-border bg-card p-5 [&_summary]:cursor-pointer">
                  <summary className="flex items-center justify-between font-display font-bold text-foreground marker:content-['']">
                    {item.q}
                    <span className="ml-4 text-teal transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-4xl bg-foreground px-6 py-14 text-center md:px-12">
            <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">Redo att slippa dammsuga?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Vårt toppval för 2026 är {topPick.name} – bäst i test med {topPick.rating?.toFixed(1)}/5 betyg
              och oslagbar på djurhår.
            </p>
            <Button asChild size="xl" className="mt-8 bg-white text-foreground hover:bg-white/90">
              <a href={finalHref} target="_blank" rel="noopener noreferrer sponsored nofollow" onClick={trackFinal}>
                Se pris på {topPick.name} →
              </a>
            </Button>
            <p className="mt-4 text-xs text-white/50">Annonslänk · vi kan få provision vid köp</p>
          </div>
        </div>
      </section>
    </>
  );
}
