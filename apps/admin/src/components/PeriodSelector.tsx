import { cn } from "@affiliate/ui";
import type { Period } from "../types";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "mtd", label: "Month to date" },
  { value: "lm", label: "Last month" },
  { value: "ytd", label: "Year to date" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            value === period.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
