import { cn } from "@/lib/utils";
import type { CompareMode } from "../types";

interface CompareSelectorProps {
  value: CompareMode;
  onChange: (mode: CompareMode) => void;
}

export function CompareSelector({ value, onChange }: CompareSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("mom")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
          value === "mom"
            ? "bg-warning text-white"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        vs prev period
      </button>
      <button
        onClick={() => onChange("yoy")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
          value === "yoy"
            ? "bg-warning text-white"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        vs year ago
      </button>
    </div>
  );
}
