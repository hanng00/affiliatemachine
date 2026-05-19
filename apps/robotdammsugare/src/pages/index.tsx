import { SEOHead } from "@affiliate/seo";
import { ComparisonTable, Button } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { getAllAffiliates, getAffiliate, getReviewsForProduct, type RobotVacuumProduct } from "../config/affiliates";

function ProductCard({ product, rank, featured = false }: { product: RobotVacuumProduct; rank?: number; featured?: boolean }) {
  return (
    <div className={`group relative rounded-2xl bg-white p-6 transition-all ${featured ? "border-2 border-gray-900 shadow-xl" : "border border-gray-200 hover:border-gray-300 hover:shadow-lg"}`}>
      {rank && (
        <div className="absolute -top-3 left-6">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${rank === 1 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
            {rank === 1 ? "Bäst i test" : `#${rank}`}
          </span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-32 w-32 rounded-xl object-cover bg-gray-50 mx-auto sm:mx-0"
            loading="lazy"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {product.features?.slice(0, 4).map((feature, i) => (
              <span key={i} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 sm:min-w-[140px]">
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-900">
              {product.price.amount.toLocaleString("sv-SE")} kr
            </div>
            <div className="text-sm text-gray-500">
              {product.rating}/5 betyg
            </div>
          </div>
          <Button asChild size="default">
            <a href={product.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
              Se pris
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuickPickCard({ product, label, sublabel }: { product: RobotVacuumProduct; label: string; sublabel: string }) {
  return (
    <Link to={`#${product.id}`} className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-16 w-16 rounded-lg object-cover bg-gray-50 shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
          <div className="mt-1 font-semibold text-gray-900 truncate">{product.name}</div>
          <div className="mt-1 text-sm text-gray-500">{sublabel}</div>
        </div>
        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

function ReviewQuote({ text, author, location, source }: { text: string; author: string; location: string; source: string }) {
  return (
    <blockquote className="rounded-xl bg-gray-50 p-6">
      <p className="text-gray-700 leading-relaxed">"{text}"</p>
      <footer className="mt-4 text-sm text-gray-500">
        {author}, {location} <span className="text-gray-400">via {source}</span>
      </footer>
    </blockquote>
  );
}

export default function HomePage() {
  const topPick = getAffiliate("roborockS8ProUltra");
  const allProducts = getAllAffiliates();
  const topPickReviews = getReviewsForProduct("roborock-s8-pro-ultra");

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

  return (
    <>
      <SEOHead
        title={siteConfig.title}
        description={siteConfig.description}
        siteName={siteConfig.name}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Oberoende tester · Uppdaterad maj 2026
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Bästa robotdammsugarna 2026
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Vi har testat och jämfört marknadens bästa robotdammsugare. 
              Hitta rätt modell för ditt hem – oavsett budget.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <a href="#topplista">Se topplistan</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/jamfor">Jämför modeller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Vårt toppval</p>
              <h2 className="mt-2 text-3xl font-semibold text-gray-900">{topPick.name}</h2>
            </div>
            
            <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <img 
                  src={topPick.image} 
                  alt={topPick.name}
                  className="h-48 w-48 rounded-2xl object-cover bg-gray-100"
                />
                <div className="flex-1 text-center md:text-left">
                  <p className="text-gray-600 leading-relaxed">{topPick.description}</p>
                  
                  <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                    {topPick.features?.map((feature, i) => (
                      <span key={i} className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <div className="text-3xl font-semibold text-gray-900">
                      {topPick.price.amount.toLocaleString("sv-SE")} kr
                    </div>
                    <Button asChild size="lg">
                      <a href={topPick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                        Se pris hos återförsäljare
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Pros/Cons */}
              <div className="mt-10 grid gap-6 md:grid-cols-2 pt-10 border-t border-gray-100">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Fördelar</h4>
                  <ul className="space-y-2">
                    {topPick.pros?.map((pro, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <svg className="h-5 w-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Nackdelar</h4>
                  <ul className="space-y-2">
                    {topPick.cons?.map((con, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <svg className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Reviews */}
            {topPickReviews.length > 0 && (
              <div className="mt-12">
                <h3 className="text-center text-lg font-semibold text-gray-900 mb-6">Vad användare säger</h3>
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

      {/* Quick Picks */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Snabbval efter behov</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <QuickPickCard 
                product={topPick} 
                label="Bäst i test" 
                sublabel={`${topPick.price.amount.toLocaleString("sv-SE")} kr`}
              />
              <QuickPickCard 
                product={getAffiliate("xiaomiX10Plus")} 
                label="Bäst budget" 
                sublabel="Mest för pengarna"
              />
              <QuickPickCard 
                product={getAffiliate("dreameL20Ultra")} 
                label="Bäst för stora hem" 
                sublabel="260 min batteritid"
              />
              <QuickPickCard 
                product={getAffiliate("irobotRoombaj7Plus")} 
                label="Bäst hinderdetektering" 
                sublabel="Undviker allt på golvet"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full Product List */}
      <section id="topplista" className="border-t border-gray-100 bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900">Alla testade modeller</h2>
              <p className="mt-2 text-gray-600">Rankade efter prestanda, funktioner och värde</p>
            </div>
            <div className="space-y-4">
              {allProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  rank={index + 1}
                  featured={index === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Detaljerad jämförelse</h2>
            <ComparisonTable products={allProducts} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Vanliga frågor</h2>
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-6">
                <h3 className="font-semibold text-gray-900">Vilken robotdammsugare är bäst i test 2026?</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Roborock S8 Pro Ultra är vårt toppval med 4.9/5 betyg. Den kombinerar 6000 Pa sugkraft, 
                  självtömmande station och automatisk mopptvätt i ett komplett paket.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6">
                <h3 className="font-semibold text-gray-900">Vilken robotdammsugare är bäst för husdjur?</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Roborock S8 Pro Ultra och Dreame L20 Ultra hanterar djurhår bäst. 
                  Båda har gummiborstar som inte trasslar och stark sugkraft.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6">
                <h3 className="font-semibold text-gray-900">Hur mycket kostar en bra robotdammsugare?</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Räkna med 5 000–15 000 kr. Budgetmodeller kostar runt 5 000 kr, 
                  mellanklassen 7 000–10 000 kr, och premiummodeller 10 000–15 000 kr.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Redo att välja?
            </h2>
            <p className="mt-4 text-gray-400">
              Jämför alla modeller sida vid sida och hitta den perfekta för ditt hem.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link to="/jamfor">Jämför alla modeller</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
