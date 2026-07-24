import { Check } from "lucide-react";
import { coverageTypes } from "../config/content";

/** Trafik vs Halv vs Hel — the factual coverage comparison the head queries want. */
export function CoverageComparison() {
  const allFeatures = Array.from(
    new Set(coverageTypes.flatMap((c) => c.includes))
  );

  return (
    <div className="overflow-x-auto rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)]">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-5 py-4 font-semibold text-foreground">Vad ingår?</th>
            {coverageTypes.map((c) => (
              <th key={c.type} className="px-5 py-4 text-center">
                <div className="font-display font-bold text-foreground">{c.name}</div>
                <div className="mt-1 inline-block rounded-full bg-[var(--color-secondary)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                  {c.short}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature) => (
            <tr key={feature} className="border-b border-[var(--color-border-subtle)] last:border-0">
              <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{feature}</td>
              {coverageTypes.map((c) => (
                <td key={c.type} className="px-5 py-3.5 text-center">
                  {c.includes.includes(feature) ? (
                    <Check className="mx-auto h-5 w-5 text-[var(--color-success)]" aria-label="Ingår" />
                  ) : (
                    <span className="text-[var(--color-text-subtle)]" aria-label="Ingår ej">
                      –
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
