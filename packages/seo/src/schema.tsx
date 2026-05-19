export interface WebsiteSchema {
  type: "WebSite";
  name: string;
  url: string;
  description?: string;
}

export interface ArticleSchema {
  type: "Article";
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export interface ProductSchema {
  type: "Product";
  name: string;
  description: string;
  image?: string;
  brand?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: "InStock" | "OutOfStock";
    url?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface FAQSchema {
  type: "FAQPage";
  questions: { question: string; answer: string }[];
}

export interface BreadcrumbSchema {
  type: "BreadcrumbList";
  items: { name: string; url: string }[];
}

export type SchemaType = WebsiteSchema | ArticleSchema | ProductSchema | FAQSchema | BreadcrumbSchema;

export function generateSchema(schema: SchemaType): string {
  let jsonLd: Record<string, unknown>;

  switch (schema.type) {
    case "WebSite":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: schema.name,
        url: schema.url,
        description: schema.description,
      };
      break;

    case "Article":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: schema.headline,
        description: schema.description,
        author: { "@type": "Person", name: schema.author },
        datePublished: schema.datePublished,
        dateModified: schema.dateModified || schema.datePublished,
        image: schema.image,
      };
      break;

    case "Product":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: schema.name,
        description: schema.description,
        image: schema.image,
        brand: schema.brand ? { "@type": "Brand", name: schema.brand } : undefined,
        offers: schema.offers
          ? {
              "@type": "Offer",
              price: schema.offers.price,
              priceCurrency: schema.offers.priceCurrency,
              availability: schema.offers.availability
                ? `https://schema.org/${schema.offers.availability}`
                : undefined,
              url: schema.offers.url,
            }
          : undefined,
        aggregateRating: schema.aggregateRating
          ? {
              "@type": "AggregateRating",
              ratingValue: schema.aggregateRating.ratingValue,
              reviewCount: schema.aggregateRating.reviewCount,
            }
          : undefined,
      };
      break;

    case "FAQPage":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: schema.questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      };
      break;

    case "BreadcrumbList":
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: schema.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      break;
  }

  return JSON.stringify(jsonLd);
}

export function SchemaScript({ schema }: { schema: SchemaType }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateSchema(schema) }} />;
}
