import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { providers } from "../config/content";

/**
 * Provider overview used on /jamfor and /forsakringsbolag. Prices are shown as
 * clearly-labelled illustrative ranges (see content.ts / JOURNAL truthfulness
 * guardrail) — the real number always comes from the live quote tool.
 */
export function ProviderTable({ linkToCompany = false }: { linkToCompany?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {providers.map((p) => (
        <div
          key={p.id}
          className="flex flex-col rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
            <span className="rounded-full bg-[var(--color-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
              ca {p.priceRange[0]}–{p.priceRange[1]} kr/mån*
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{p.blurb}</p>
          <ul className="mt-3 space-y-1.5">
            {p.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
            <Link
              to="/"
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Se ditt pris
            </Link>
            {linkToCompany && (
              <Link
                to={`/forsakringsbolag/${p.slug}`}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Om {p.name}
              </Link>
            )}
          </div>
        </div>
      ))}
      <p className="sm:col-span-2 text-xs text-[var(--color-text-subtle)]">
        *Vägledande månadsspann för en typisk halvförsäkring — inte en offert. Ditt
        faktiska pris beror på bil, ålder, ort och körsträcka och visas i jämförelsen.
      </p>
    </div>
  );
}
