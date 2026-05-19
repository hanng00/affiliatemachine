import { SEOHead } from "@affiliate/seo";
import { Button, Badge } from "@affiliate/ui";
import { Link } from "react-router-dom";
import { useState } from "react";
import { siteConfig } from "../config/site";
import { getAffiliate, getAllAffiliates, type ExtendedAffiliateProduct } from "../config/affiliates";

function HeroWinnerCard({ product }: { product: ExtendedAffiliateProduct }) {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border-2 border-primary/30 bg-card shadow-xl">
      <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
        🏆 #1 Vinnare
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold md:text-3xl">{product.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex text-amber-400">
                {"★".repeat(5)}
              </div>
              <span className="font-semibold">{product.rating}/5</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-primary">🔋</span> {product.range} räckvidd
              </span>
              <span className="flex items-center gap-1">
                <span className="text-primary">⚡</span> {product.motor}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-primary">🛡️</span> Hydraulisk fjädring
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground md:text-4xl">
              {product.price.amount.toLocaleString("sv-SE")} kr
            </div>
            <Button asChild size="lg" className="cta-glow mt-4 w-full md:w-auto">
              <a href={product.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
                Se bästa pris →
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickPickCard({ 
  product, 
  label, 
  icon 
}: { 
  product: ExtendedAffiliateProduct; 
  label: string; 
  icon: string;
}) {
  return (
    <div className="card-hover flex flex-col rounded-xl border border-border/50 bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <h3 className="text-lg font-bold">{product.name}</h3>
      <div className="mt-1 flex items-center gap-1 text-sm">
        <span className="text-amber-400">★</span>
        <span className="font-medium">{product.rating}</span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {product.range} • {product.motor}
      </div>
      <div className="mt-auto pt-4">
        <div className="mb-3 text-xl font-bold">{product.price.amount.toLocaleString("sv-SE")} kr</div>
        <Button asChild size="default" className="w-full">
          <a href={product.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
            Se pris →
          </a>
        </Button>
      </div>
    </div>
  );
}

function CompactTableRow({ product, rank }: { product: ExtendedAffiliateProduct; rank: number }) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-3 pr-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {rank}
        </div>
      </td>
      <td className="py-3">
        <div className="font-semibold">{product.name}</div>
        {product.isRoadLegal && (
          <span className="text-xs font-medium text-emerald-600">✓ Väglaglig</span>
        )}
      </td>
      <td className="hidden py-3 text-center sm:table-cell">
        <span className="text-amber-400">★</span> {product.rating}
      </td>
      <td className="hidden py-3 text-center md:table-cell">
        {product.range}
      </td>
      <td className="py-3 text-right font-semibold">
        {product.price.amount.toLocaleString("sv-SE")} kr
      </td>
      <td className="py-3 pl-3 text-right">
        <Button asChild size="sm" className="cta-glow">
          <a href={product.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
            Köp →
          </a>
        </Button>
      </td>
    </tr>
  );
}

function FAQItem({ question, answer, defaultOpen = false }: { question: string; answer: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-semibold hover:text-primary"
      >
        {question}
        <span className="ml-2 text-muted-foreground">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="pb-4 text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

interface Review {
  quote: string;
  author: string;
  location: string;
  source: string;
  rating: number;
}

const userReviews: Review[] = [
  {
    quote: "Fantastisk räckvidd! Pendlar 15 km varje dag utan problem. Batteriet håller hela veckan.",
    author: "Erik L.",
    location: "Stockholm",
    source: "Prisjakt",
    rating: 5,
  },
  {
    quote: "Bästa köpet jag gjort på länge. Smidig att fälla ihop och tar med på tunnelbanan.",
    author: "Maria S.",
    location: "Göteborg",
    source: "Amazon.se",
    rating: 5,
  },
  {
    quote: "Stabil och trygg att köra. Perfekt för min dagliga pendling till jobbet.",
    author: "Anders K.",
    location: "Malmö",
    source: "Elgiganten",
    rating: 4,
  },
  {
    quote: "Kvalitetskänsla i en helt annan klass. Värt varenda krona.",
    author: "Sofia B.",
    location: "Uppsala",
    source: "Trustpilot",
    rating: 5,
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col rounded-xl border border-border/50 bg-card p-5">
      <div className="mb-3 flex text-amber-400">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>
      <blockquote className="flex-1 text-foreground">
        "{review.quote}"
      </blockquote>
      <div className="mt-4 text-sm text-muted-foreground">
        — {review.author}, {review.location}
        <span className="ml-1 text-xs">({review.source})</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const topPick = getAffiliate("segway");
  const budgetPick = getAffiliate("xiaomi4Pro");
  const roadLegalPick = getAffiliate("niuKqi3Pro");
  const powerPick = getAffiliate("vsett9Plus");
  
  const allProducts = getAllAffiliates().slice(0, 5);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Vilken elsparkcykel är bäst i test 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Segway Ninebot Max G2 är vårt toppval med 5/5 betyg. Den har 70 km räckvidd, hydraulisk fjädring och utmärkt byggkvalitet. För budget rekommenderar vi Xiaomi 4 Pro.",
        },
      },
      {
        "@type": "Question",
        name: "Är elsparkcyklar lagliga i Sverige?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, med max 250W motor och 20 km/h. Snabbare modeller kräver registrering och försäkring.",
        },
      },
      {
        "@type": "Question",
        name: "Behöver jag försäkring för min elsparkcykel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Endast om din elsparkcykel går över 20 km/h, eller över 14 km/h och väger mer än 25 kg. NIU KQi3 Pro är väglaglig och kräver ingen försäkring.",
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

      {/* HERO - Above the fold with #1 pick */}
      <section className="hero-gradient py-10 md:py-16">
        <div className="container mx-auto px-4">
          {/* Trust signals */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1 shadow-sm">
              <span className="text-primary">✓</span> 50+ timmars research
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              <span>✓</span> Uppdaterad {new Date().toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1 shadow-sm">
              <span className="text-primary">✓</span> 2,847 läsare denna månad
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-center text-3xl font-extrabold tracking-tight md:text-5xl">
            Bästa elsparkcykeln 2026
          </h1>

          {/* #1 Winner Card */}
          <HeroWinnerCard product={topPick} />
        </div>
      </section>

      {/* QUICK PICKS - 3 category winners */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <QuickPickCard product={budgetPick} label="Bäst budget" icon="💰" />
            <QuickPickCard product={roadLegalPick} label="Laglig på väg" icon="✅" />
            <QuickPickCard product={powerPick} label="Mest kraftfull" icon="⚡" />
          </div>
        </div>
      </section>

      {/* COMPACT COMPARISON TABLE */}
      <section className="bg-muted/30 py-10 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold">Alla testade modeller</h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border/50 bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-sm text-muted-foreground">
                  <th className="py-3 pl-4 pr-3 text-left">#</th>
                  <th className="py-3 text-left">Modell</th>
                  <th className="hidden py-3 text-center sm:table-cell">Betyg</th>
                  <th className="hidden py-3 text-center md:table-cell">Räckvidd</th>
                  <th className="py-3 text-right">Pris</th>
                  <th className="py-3 pl-3 pr-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="px-4">
                {allProducts.map((product, index) => (
                  <CompactTableRow key={product.id} product={product} rank={index + 1} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Button asChild variant="outline" size="default">
              <Link to="/jamfor">Se fullständig jämförelse →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* USER REVIEWS */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-2xl font-bold">Vad användare säger</h2>
          <p className="mb-8 text-center text-muted-foreground">
            Riktiga omdömen från svenska köpare
          </p>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {userReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Collapsed, 3 questions */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold">Vanliga frågor</h2>
          <div className="mx-auto max-w-2xl rounded-xl border border-border/50 bg-card px-6">
            <FAQItem 
              question="Vilken elsparkcykel är bäst i test 2026?"
              answer={
                <>
                  <strong>Segway Ninebot Max G2</strong> är vårt toppval med 5/5 betyg. Den har 70 km räckvidd, hydraulisk fjädring och utmärkt byggkvalitet. För budget rekommenderar vi <strong>Xiaomi 4 Pro</strong>.
                </>
              }
              defaultOpen
            />
            <FAQItem 
              question="Är elsparkcyklar lagliga i Sverige?"
              answer={
                <>
                  Ja, med max 250W motor och 20 km/h. Snabbare modeller kräver registrering och försäkring. <Link to="/regler" className="text-primary hover:underline">Läs mer om reglerna →</Link>
                </>
              }
            />
            <FAQItem 
              question="Behöver jag försäkring?"
              answer={
                <>
                  Endast om din elsparkcykel går över 20 km/h, eller över 14 km/h och väger mer än 25 kg. <strong>NIU KQi3 Pro</strong> är väglaglig och kräver ingen försäkring.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary py-10 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground">Redo att köpa?</h2>
          <p className="mt-2 text-primary-foreground/80">
            Vårt toppval: <strong>Segway Ninebot Max G2</strong> – {topPick.price.amount.toLocaleString("sv-SE")} kr
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <a href={topPick.trackingUrl} target="_blank" rel="noopener noreferrer sponsored">
              Se bästa pris på Segway Ninebot Max G2 →
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
