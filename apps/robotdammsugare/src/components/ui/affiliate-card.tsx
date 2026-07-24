import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { PriceTag } from "@/components/ui/price-tag";
import { ProsCons } from "@/components/ui/pros-cons";
import { CTAButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

export interface AffiliateProduct {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  image?: string;
  rating?: number;
  price: {
    amount: number;
    currency?: string;
    period?: string;
    originalAmount?: number;
  };
  pros?: string[];
  cons?: string[];
  trackingUrl: string;
  badge?: string;
  features?: string[];
}

interface AffiliateCardProps {
  product: AffiliateProduct;
  rank?: number;
  showProsCons?: boolean;
  className?: string;
}

export function AffiliateCard({ product, rank, showProsCons = true, className }: AffiliateCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {rank && (
        <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
          #{rank}
        </div>
      )}
      {product.badge && (
        <Badge variant="success" className="absolute right-4 top-4">
          {product.badge}
        </Badge>
      )}

      <CardHeader className={cn("flex flex-row items-center gap-4", rank && "pl-12")}>
        {product.logo && (
          <img src={product.logo} alt={`${product.name} logo`} className="h-12 w-12 rounded-lg object-contain" />
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          {product.rating && <Rating value={product.rating} size="sm" />}
        </div>
        <PriceTag
          amount={product.price.amount}
          currency={product.price.currency}
          period={product.price.period}
          originalAmount={product.price.originalAmount}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        {product.description && <p className="text-muted-foreground">{product.description}</p>}

        {product.image && (
          <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />
        )}

        {product.features && product.features.length > 0 && (
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {showProsCons && product.pros && product.cons && <ProsCons pros={product.pros} cons={product.cons} />}
      </CardContent>

      <CardFooter>
        <CTAButton href={product.trackingUrl} trackingId={product.id} placement="card" size="lg" className="w-full">
          Besök {product.name}
        </CTAButton>
      </CardFooter>
    </Card>
  );
}
