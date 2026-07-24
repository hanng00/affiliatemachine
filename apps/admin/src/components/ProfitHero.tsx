import { cn } from "@/lib/utils";
import type { Site, Totals, CompareMode } from "../types";

interface ProfitHeroProps {
  sites: Site[];
  totals: Totals;
  compareMode: CompareMode;
  period: { start: string; end: string };
}

function formatCurrency(value: number): string {
  return value.toLocaleString("sv-SE", { maximumFractionDigits: 0 });
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(end)}`;
}

/**
 * The north-star strip. Portfolio profit (Σ revenue − Σ cost) is the one number
 * the operator optimizes; revenue and pending sit beside it for context.
 */
export function ProfitHero({ sites, totals, compareMode, period }: ProfitHeroProps) {
  const profit = sites.reduce((acc, s) => acc + s.metrics.profit, 0);
  const cost = sites.reduce((acc, s) => acc + s.costMonthly, 0);
  const changes = compareMode === "mom" ? totals.changes.mom : totals.changes.yoy;
  const changeLabel = compareMode === "mom" ? "vs last month" : "vs last year";
  const profitable = profit >= 0;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-slate-900 px-6 py-7 text-white shadow-lg sm:px-8">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400">
            <span>Portfolio profit</span>
            <span className="text-slate-600">·</span>
            <span className="normal-case tracking-normal text-slate-400">
              {formatDateRange(period.start, period.end)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={cn(
                "text-4xl font-bold tracking-tight tabular-nums sm:text-5xl",
                profitable ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {profitable ? "" : "−"}
              {formatCurrency(Math.abs(profit))}
            </span>
            <span className="text-lg font-medium text-slate-400">SEK</span>
          </div>
          <p className="mt-1.5 text-sm text-slate-400">
            {formatCurrency(totals.revenue)} SEK revenue − {formatCurrency(cost)} SEK cost
          </p>
        </div>

        <div className="flex gap-8">
          <HeroStat
            label="Revenue"
            value={`${formatCurrency(totals.revenue)} SEK`}
            change={changes.revenuePercent}
            changeLabel={changeLabel}
          />
          <HeroStat
            label="Clicks"
            value={formatCurrency(totals.clicks)}
            change={changes.clicksPercent}
            changeLabel={changeLabel}
          />
        </div>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  change,
  changeLabel,
}: {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}) {
  const up = change >= 0;
  const flat = change === 0;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1.5 text-xl font-semibold tabular-nums text-white">{value}</p>
      <p
        className={cn(
          "mt-1 text-xs font-medium tabular-nums",
          flat ? "text-slate-500" : up ? "text-emerald-400" : "text-rose-400"
        )}
      >
        {flat ? `Flat ${changeLabel}` : `${formatPercent(change)} ${changeLabel}`}
      </p>
    </div>
  );
}
