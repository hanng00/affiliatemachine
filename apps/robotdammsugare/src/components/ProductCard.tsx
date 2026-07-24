import { useTrackClick, buildSubId, appendSubId } from "@affiliate/analytics";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/ProductVisual";
import { siteConfig } from "@/config/site";
import type { RobotVacuumProduct } from "@/config/affiliates";

interface ProductCardProps {
  product: RobotVacuumProduct;
  rank?: number;
  featured?: boolean;
  placement?: string;
}

const MEDALS: Record<number, { label: string; ring: string; chip: string }> = {
  1: { label: "1", ring: "ring-amber-300", chip: "bg-amber-400 text-amber-950" },
  2: { label: "2", ring: "ring-slate-300", chip: "bg-slate-300 text-slate-800" },
  3: { label: "3", ring: "ring-orange-300", chip: "bg-orange-300 text-orange-950" },
};

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-base font-bold leading-none text-foreground">{value}</span>
      <span className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

export function ProductCard({ product, rank, featured = false, placement = "product_card" }: ProductCardProps) {
  const subId = buildSubId(siteConfig.slug, placement, product.id);
  const href = appendSubId(product.trackingUrl, subId);
  const trackBuy = useTrackClick({
    linkId: product.id,
    program: "adtraction",
    placement,
    destinationUrl: href,
    subId,
  });

  const medal = rank ? MEDALS[rank] : undefined;

  return (
    <div
      className={`group relative rounded-3xl bg-card p-5 transition-all duration-300 sm:p-6 ${
        featured
          ? "ring-2 ring-teal shadow-[0_20px_50px_-20px_rgba(14,124,114,0.45)]"
          : "border border-border hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        {/* Visual + rank */}
        <div className="relative shrink-0 self-center sm:self-auto">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`h-28 w-28 rounded-2xl bg-white object-contain p-1.5 ${
                medal ? `ring-4 ring-offset-2 ring-offset-card ${medal.ring}` : "border border-border"
              }`}
            />
          ) : (
            <ProductVisual
              name={product.name}
              showLabel
              className={`h-28 w-28 ${medal ? `ring-4 ring-offset-2 ring-offset-card ${medal.ring}` : ""}`}
            />
          )}
          {medal && (
            <span
              className={`absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-extrabold shadow-md ${medal.chip}`}
            >
              {medal.label}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-bold text-foreground">{product.name}</h3>
            {product.badge && (
              <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-xs font-semibold text-teal">
                {product.badge}
              </span>
            )}
            {product.petFriendly && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                🐾 Djurhår
              </span>
            )}
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            {product.suctionPower && <Spec label="Sugkraft" value={product.suctionPower} />}
            {product.batteryLife && <Spec label="Batteri" value={product.batteryLife} />}
            <Spec label="Mopp" value={product.hasMopping ? "Ja" : "Nej"} />
            <Spec label="Självtömm." value={product.hasSelfEmpty ? "Ja" : "Nej"} />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:w-[160px]">
          <div className="text-center sm:text-right">
            {product.rating && (
              <div className="flex items-center justify-center gap-1 sm:justify-end">
                <span className="text-sm text-amber-500">★</span>
                <span className="text-sm font-semibold text-foreground">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">/5</span>
              </div>
            )}
            <div className="font-display text-2xl font-extrabold text-foreground">
              {product.price.amount.toLocaleString("sv-SE")}&nbsp;kr
            </div>
          </div>
          <Button asChild size="lg" className="w-full">
            <a href={href} target="_blank" rel="noopener noreferrer sponsored nofollow" onClick={trackBuy}>
              Se pris →
            </a>
          </Button>
          <span className="text-center text-[11px] text-muted-foreground sm:text-right">Hos återförsäljare</span>
        </div>
      </div>
    </div>
  );
}
