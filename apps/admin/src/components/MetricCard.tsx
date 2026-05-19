import { cn } from "@affiliate/ui";
import type { CompareMode } from "../types";

interface MetricCardProps {
  label: string;
  value: string;
  momChange?: number;
  yoyChange?: number;
  compareMode: CompareMode;
  formatChange?: (value: number) => string;
}

export function MetricCard({
  label,
  value,
  momChange = 0,
  yoyChange = 0,
  compareMode,
  formatChange = (v) => (v >= 0 ? `+${v.toLocaleString("sv-SE")}` : v.toLocaleString("sv-SE")),
}: MetricCardProps) {
  const change = compareMode === "mom" ? momChange : yoyChange;
  const changeLabel = compareMode === "mom" ? "M/M" : "Y/Y";
  const isPositive = change >= 0;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
            isPositive
              ? "bg-success-light text-success"
              : "bg-red-50 text-destructive"
          )}
        >
          {changeLabel}: {formatChange(change)}
        </span>
      </div>
    </div>
  );
}
