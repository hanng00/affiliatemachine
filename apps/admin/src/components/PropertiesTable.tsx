import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Site, CompareMode } from "../types";

interface PropertiesTableProps {
  sites: Site[];
  compareMode: CompareMode;
  loading?: boolean;
}

function StatusDot({ status }: { status: Site["status"] }) {
  const colors: Record<Site["status"], string> = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <span
      className={cn("inline-block w-2 h-2 rounded-full shrink-0", colors[status])}
      title={status}
    />
  );
}

function MiniSparkline({
  data,
  metric = "clicks",
  width = 64,
  height = 22,
}: {
  data: number[];
  metric?: "clicks" | "impressions";
  width?: number;
  height?: number;
}) {
  const hasSignal = data && data.length > 0 && data.some((v) => v > 0);
  if (!hasSignal) {
    return <span className="text-sm text-muted-foreground/50" title="No data yet">—</span>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const coords = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 3) - 1.5;
    return [x, y] as const;
  });
  const points = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,${height} ${points} ${width},${height}`;

  const trend = data[data.length - 1] >= data[0];
  // Impressions are the fallback signal (no clicks yet) — render neutral so it's
  // visually distinct from a real clicks trend, and label it on hover.
  const isImpr = metric === "impressions";
  const stroke = isImpr ? "#94a3b8" : trend ? "#10b981" : "#ef4444";
  const gradId = `spark-${isImpr ? "impr" : trend ? "up" : "down"}`;

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      role="img"
      aria-label={isImpr ? "Impressions trend (no clicks yet)" : "Clicks trend"}
    >
      <title>{isImpr ? "Impressions (no clicks yet)" : "Clicks"} · last 30 days</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isImpr ? "2 2" : undefined}
      />
    </svg>
  );
}

function formatNumber(value: number): string {
  return value.toLocaleString("sv-SE");
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatPercentChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatRpc(value: number): string {
  return `${value.toFixed(2)} SEK`;
}

/** Google avg position as a colored badge. Lower rank = better = greener. */
function RankBadge({ position }: { position: number }) {
  if (!position || position <= 0) {
    return <span className="text-sm tabular-nums text-muted-foreground">—</span>;
  }
  const tier =
    position <= 3
      ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
      : position <= 10
        ? "bg-amber-100 text-amber-700 ring-amber-600/20"
        : "bg-muted text-muted-foreground ring-border";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset",
        tier
      )}
      title={`Average Google position: ${position.toFixed(1)}`}
    >
      #{position.toFixed(1)}
    </span>
  );
}

function LoadingRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
          <div>
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1" />
            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell><div className="h-5 w-15 bg-muted rounded animate-pulse" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-5 w-12 bg-muted rounded-full animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-14 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-10 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-10 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-10 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-14 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-14 bg-muted rounded animate-pulse ml-auto" /></TableCell>
      <TableCell className="text-right"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></TableCell>
    </TableRow>
  );
}

export function PropertiesTable({ sites, compareMode, loading }: PropertiesTableProps) {
  const sortedSites = [...sites].sort((a, b) => b.metrics.clicks - a.metrics.clicks);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Sites</h2>
          <p className="text-xs text-muted-foreground">
            {loading ? "Loading…" : `${sortedSites.length} properties · ranked by clicks`}
          </p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary/40 hover:bg-secondary/40">
            <TableHead className="h-11 text-xs uppercase tracking-wide">Property</TableHead>
            <TableHead className="h-11 w-20 text-xs uppercase tracking-wide">Trend</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Clicks</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Impr.</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Rank</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">CTR</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Activ.</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Action</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">vs Prev</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Revenue</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Cost/Mo</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">Profit</TableHead>
            <TableHead className="h-11 text-right text-xs uppercase tracking-wide">RPC</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <>
              <LoadingRow />
              <LoadingRow />
              <LoadingRow />
            </>
          )}
          {sortedSites.map((site) => {
            const changes = compareMode === "mom" ? site.metrics.changes.mom : site.metrics.changes.yoy;
            const changePercent = changes.clicksPercent;

            return (
              <TableRow key={site.id} className="border-border">
                <TableCell className="py-3">
                  <div className="flex items-center gap-2.5">
                    <StatusDot status={site.status} />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">{site.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{site.domain}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <MiniSparkline data={site.metrics.sparkline} metric={site.metrics.sparklineMetric} />
                </TableCell>
                <TableCell className="py-3 text-right font-semibold tabular-nums text-foreground">
                  {formatNumber(site.metrics.clicks)}
                </TableCell>
                <TableCell className="py-3 text-right tabular-nums text-muted-foreground">
                  {formatNumber(site.metrics.impressions)}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <RankBadge position={site.metrics.position} />
                </TableCell>
                <TableCell className="py-3 text-right tabular-nums text-muted-foreground">
                  {formatPercent(site.metrics.ctr)}
                </TableCell>
                <TableCell className="py-3 text-right">
                  {site.metrics.sessions > 0 ? (
                    <span
                      className="tabular-nums text-foreground decoration-dotted underline underline-offset-2 cursor-help"
                      title={
                        (site.activation ? `${site.activation.label}\n` : "") +
                        `${formatNumber(site.metrics.activations)} activations ÷ ${formatNumber(site.metrics.sessions)} sessions` +
                        (site.activation ? ` · event activation{kind:"${site.activation.kind}"}` : "")
                      }
                    >
                      {formatPercent(site.metrics.activationRate)}
                    </span>
                  ) : (
                    <span className="tabular-nums text-muted-foreground/50" title="No sessions yet">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3 text-right">
                  {site.metrics.activations > 0 ? (
                    <span
                      className="tabular-nums text-foreground decoration-dotted underline underline-offset-2 cursor-help"
                      title={`${formatNumber(site.metrics.clicks)} affiliate clicks ÷ ${formatNumber(site.metrics.activations)} activations`}
                    >
                      {formatPercent(site.metrics.actionRate)}
                    </span>
                  ) : (
                    <span className="tabular-nums text-muted-foreground/50" title="No activations yet">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-sm font-medium tabular-nums",
                      changePercent >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    <svg
                      className={cn("h-3 w-3", changePercent >= 0 ? "" : "rotate-180")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    {formatPercentChange(changePercent)}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="font-medium tabular-nums text-foreground">{formatCurrency(site.metrics.revenue)}</div>
                  {site.metrics.pendingRevenue > 0 && (
                    <div className="text-xs tabular-nums text-muted-foreground">
                      +{formatCurrency(site.metrics.pendingRevenue)} pending
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-3 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(site.costMonthly)}
                </TableCell>
                <TableCell className="py-3 text-right">
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      site.metrics.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {formatCurrency(site.metrics.profit)}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-right tabular-nums text-muted-foreground">
                  {formatRpc(site.metrics.rpc)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
