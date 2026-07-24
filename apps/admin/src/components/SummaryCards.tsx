import type React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Totals, CompareMode } from "../types";

interface SummaryCardsProps {
  totals: Totals;
  compareMode: CompareMode;
  loading?: boolean;
}

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString("sv-SE");
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function MetricCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="h-3.5 bg-muted rounded w-24 mb-3 animate-pulse" />
      <div className="h-8 bg-muted rounded w-28 mb-3 animate-pulse" />
      <div className="h-4 bg-muted rounded w-20 animate-pulse" />
    </Card>
  );
}

type Accent = "blue" | "violet" | "emerald" | "amber" | "rose";

const accent: Record<Accent, { bar: string; iconBg: string; iconText: string }> = {
  blue: { bar: "bg-blue-500", iconBg: "bg-blue-50", iconText: "text-blue-600" },
  violet: { bar: "bg-violet-500", iconBg: "bg-violet-50", iconText: "text-violet-600" },
  emerald: { bar: "bg-emerald-500", iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  amber: { bar: "bg-amber-500", iconBg: "bg-amber-50", iconText: "text-amber-600" },
  rose: { bar: "bg-rose-500", iconBg: "bg-rose-50", iconText: "text-rose-600" },
};

function MetricCard({
  label,
  value,
  change,
  changeLabel,
  accent: accentKey,
  icon,
  hint,
  goodWhenDown,
  showChange = true,
}: {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  accent: Accent;
  icon: React.ReactNode;
  hint?: string;
  goodWhenDown?: boolean;
  showChange?: boolean;
}) {
  // For rank, a *negative* change (moved toward #1) is good.
  const improved = goodWhenDown ? change <= 0 : change >= 0;
  const flat = change === 0;
  const a = accent[accentKey];

  return (
    <Card className="relative overflow-hidden p-5 transition-shadow hover:shadow-md">
      <span className={cn("absolute inset-y-0 left-0 w-1", a.bar)} aria-hidden />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", a.iconBg, a.iconText)}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        {showChange && !flat ? (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold",
              improved ? "text-emerald-600" : "text-rose-600"
            )}
          >
            <svg
              className={cn("mr-0.5 h-3 w-3", change > 0 ? "" : "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            {goodWhenDown ? formatPercent(-Math.abs(change)) : formatPercent(change)} {changeLabel}
          </span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">{hint ?? `Flat ${changeLabel}`}</span>
        )}
      </div>
    </Card>
  );
}

function formatRank(value: number): string {
  return value > 0 ? `#${value.toFixed(1)}` : "—";
}

const icons = {
  impressions: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  clicks: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
  ),
  ctr: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  rank: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  ),
  rpc: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function SummaryCards({ totals, compareMode, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  const changeLabel = compareMode === "mom" ? "M/M" : "Y/Y";
  const changes = compareMode === "mom" ? totals.changes.mom : totals.changes.yoy;

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
      <MetricCard
        label="Impressions"
        value={formatNumber(totals.impressions)}
        change={changes.impressionsPercent}
        changeLabel={changeLabel}
        accent="violet"
        icon={icons.impressions}
      />
      <MetricCard
        label="Clicks"
        value={formatNumber(totals.clicks)}
        change={changes.clicksPercent}
        changeLabel={changeLabel}
        accent="blue"
        icon={icons.clicks}
      />
      <MetricCard
        label="CTR"
        value={`${totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : "0.00"}%`}
        change={0}
        changeLabel={changeLabel}
        accent="emerald"
        icon={icons.ctr}
        showChange={false}
        hint="Clicks ÷ impressions"
      />
      <MetricCard
        label="Avg. Google Rank"
        value={formatRank(totals.avgPosition)}
        change={0}
        changeLabel={changeLabel}
        accent="amber"
        icon={icons.rank}
        goodWhenDown
        showChange={false}
        hint={totals.avgPosition > 0 ? "Across all impressions" : "No impressions yet"}
      />
      <MetricCard
        label="Avg. RPC"
        value={`${totals.avgRpc.toFixed(2)} SEK`}
        change={0}
        changeLabel={changeLabel}
        accent="rose"
        icon={icons.rpc}
        showChange={false}
        hint="Revenue per click"
      />
    </div>
  );
}
