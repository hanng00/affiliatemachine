import { useState, useMemo } from "react";
import { cn } from "@affiliate/ui";
import { Sparkline } from "./Sparkline";
import type { Site, CompareMode, SortField, SortDirection } from "../types";

interface PropertiesTableProps {
  sites: Site[];
  compareMode: CompareMode;
  loading?: boolean;
}

type SortableField = SortField | "ctr" | "costMonthly";

function formatNumber(value: number): string {
  return value.toLocaleString("sv-SE");
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK`;
}

function formatPercent(value: number, includeSign = false): string {
  if (includeSign) {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  }
  return `${value.toFixed(2)}%`;
}

function formatRpc(value: number): string {
  return `${value.toFixed(2)} SEK`;
}

const statusColors: Record<string, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
};

interface SortIndicatorProps {
  field: SortableField;
  currentField: SortableField;
  direction: SortDirection;
}

function SortIndicator({ field, currentField, direction }: SortIndicatorProps) {
  if (field !== currentField) {
    return (
      <svg className="w-4 h-4 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  
  return (
    <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {direction === "asc" ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );
}

export function PropertiesTable({ sites, compareMode, loading }: PropertiesTableProps) {
  const [sortField, setSortField] = useState<SortableField>("clicks");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortableField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedSites = useMemo(() => {
    return [...sites].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortField) {
        case "name":
          return sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case "clicks":
          aVal = a.metrics.clicks;
          bVal = b.metrics.clicks;
          break;
        case "impressions":
          aVal = a.metrics.impressions;
          bVal = b.metrics.impressions;
          break;
        case "ctr":
          aVal = a.metrics.ctr;
          bVal = b.metrics.ctr;
          break;
        case "revenue":
          aVal = a.metrics.revenue;
          bVal = b.metrics.revenue;
          break;
        case "costMonthly":
          aVal = a.costMonthly;
          bVal = b.costMonthly;
          break;
        case "profit":
          aVal = a.metrics.profit;
          bVal = b.metrics.profit;
          break;
        case "rpc":
          aVal = a.metrics.rpc;
          bVal = b.metrics.rpc;
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [sites, sortField, sortDirection]);

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const columns: { key: SortableField; label: string; align?: "left" | "right" }[] = [
    { key: "name", label: "Property", align: "left" },
    { key: "clicks", label: "Trend", align: "left" },
    { key: "clicks", label: "Clicks", align: "right" },
    { key: "impressions", label: "Impressions", align: "right" },
    { key: "ctr", label: "CTR", align: "right" },
    { key: "revenue", label: "vs Prev", align: "right" },
    { key: "revenue", label: "Revenue", align: "right" },
    { key: "costMonthly", label: "Cost/Mo", align: "right" },
    { key: "profit", label: "Profit", align: "right" },
    { key: "rpc", label: "RPC", align: "right" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Property
                  <SortIndicator field="name" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Trend
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("clicks")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  Clicks
                  <SortIndicator field="clicks" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("impressions")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  Impressions
                  <SortIndicator field="impressions" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("ctr")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  CTR
                  <SortIndicator field="ctr" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  vs Prev
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("revenue")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  Revenue
                  <SortIndicator field="revenue" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("costMonthly")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  Cost/Mo
                  <SortIndicator field="costMonthly" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("profit")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  Profit
                  <SortIndicator field="profit" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("rpc")}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ml-auto"
                >
                  RPC
                  <SortIndicator field="rpc" currentField={sortField} direction={sortDirection} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSites.map((site) => {
              const changes = compareMode === "mom" ? site.metrics.changes.mom : site.metrics.changes.yoy;
              const changePercent = changes.revenuePercent;

              return (
                <tr
                  key={site.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", statusColors[site.status])} />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{site.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{site.domain}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline data={site.metrics.sparkline} width={80} height={24} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                    {formatNumber(site.metrics.clicks)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {formatNumber(site.metrics.impressions)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {formatPercent(site.metrics.ctr)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "text-sm font-medium tabular-nums",
                        changePercent >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {formatPercent(changePercent, true)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div>
                      <p className="font-medium text-foreground tabular-nums">
                        {formatCurrency(site.metrics.revenue)}
                      </p>
                      {site.metrics.pendingRevenue > 0 && (
                        <p className="text-xs text-muted-foreground tabular-nums">
                          +{formatCurrency(site.metrics.pendingRevenue)} pending
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {formatCurrency(site.costMonthly)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        site.metrics.profit >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {formatCurrency(site.metrics.profit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {formatRpc(site.metrics.rpc)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
