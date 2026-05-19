import { Star, StarHalf } from "lucide-react";
import { cn } from "../../lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = "md", showValue = true, className }: RatingProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={cn(sizes[size], "fill-yellow-400 text-yellow-400")} />
        ))}
        {hasHalfStar && <StarHalf className={cn(sizes[size], "fill-yellow-400 text-yellow-400")} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizes[size], "text-gray-300")} />
        ))}
      </div>
      {showValue && <span className="ml-1 text-sm font-medium text-muted-foreground">{value.toFixed(1)}</span>}
    </div>
  );
}
