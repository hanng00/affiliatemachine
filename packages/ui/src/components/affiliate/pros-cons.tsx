import { Check, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ProsConsProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export function ProsCons({ pros, cons, className }: ProsConsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <div className="space-y-2">
        <h4 className="font-semibold text-green-700">Fördelar</h4>
        <ul className="space-y-1">
          {pros.map((pro, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="font-semibold text-red-700">Nackdelar</h4>
        <ul className="space-y-1">
          {cons.map((con, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
