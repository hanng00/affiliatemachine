import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = "md", showValue = true, className }: RatingProps) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className={cn(sizes[size], "text-yellow-400")}>★</span>
        ))}
        {hasHalfStar && <span className={cn(sizes[size], "text-yellow-400")}>★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className={cn(sizes[size], "text-gray-300")}>★</span>
        ))}
      </div>
      {showValue && <span className="ml-1 text-sm font-medium text-muted-foreground">{value.toFixed(1)}</span>}
    </div>
  );
}
