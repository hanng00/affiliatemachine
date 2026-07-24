import { cn, formatPrice } from "@/lib/utils";

interface PriceTagProps {
  amount: number;
  currency?: string;
  period?: string;
  originalAmount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({
  amount,
  currency = "SEK",
  period,
  originalAmount,
  size = "md",
  className,
}: PriceTagProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const hasDiscount = originalAmount && originalAmount > amount;
  const discountPercent = hasDiscount ? Math.round((1 - amount / originalAmount) * 100) : 0;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">{formatPrice(originalAmount, currency)}</span>
      )}
      <span className={cn("font-bold", sizes[size])}>{formatPrice(amount, currency)}</span>
      {period && <span className="text-sm text-muted-foreground">/{period}</span>}
      {hasDiscount && (
        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
