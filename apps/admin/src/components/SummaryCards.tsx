import { cn } from "@affiliate/ui";
import type { Totals, CompareMode } from "../types";

interface SummaryCardsProps {
  totals: Totals;
  compareMode: CompareMode;
  loading?: boolean;
}

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString("sv-SE");
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

interface CardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  loading?: boolean;
}

function Card({ label, value, change, changeLabel, loading }: CardProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse" />
        <div className="h-8 bg-muted rounded w-32 mb-3 animate-pulse" />
        <div className="h-5 bg-muted rounded w-20 animate-pulse" />
      </div>
    );
  }

  const isPositive = change >= 0;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
            isPositive ? "bg-success-light text-success" : "bg-red-50 text-destructive"
          )}
        >
          {changeLabel}: {formatPercent(change)}
        </span>
      </div>
    </div>
  );
}

export function SummaryCards({ totals, compareMode, loading }: SummaryCardsProps) {
  const changeLabel = compareMode === "mom" ? "M/M" : "Y/Y";
  const changes = compareMode === "mom" ? totals.changes.mom : totals.changes.yoy;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card
        label="Total Clicks"
        value={formatNumber(totals.clicks)}
        change={changes.clicksPercent}
        changeLabel={changeLabel}
        loading={loading}
      />
      <Card
        label="Total Impressions"
        value={formatNumber(totals.impressions)}
        change={changes.impressionsPercent}
        changeLabel={changeLabel}
        loading={loading}
      />
      <Card
        label="Total Revenue"
        value={formatCurrency(totals.revenue)}
        change={changes.revenuePercent}
        changeLabel={changeLabel}
        loading={loading}
      />
      <Card
        label="Avg. RPC"
        value={`${totals.avgRpc.toFixed(2)} SEK`}
        change={0}
        changeLabel={changeLabel}
        loading={loading}
      />
    </div>
  );
}
