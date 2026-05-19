import { useEffect, useState } from "react";
import { fetchSiteMetrics } from "../api";
import { MetricCard } from "./MetricCard";
import type { Site, Period, CompareMode, SiteMetrics } from "../types";

interface SiteCardProps {
  site: Site;
  period: Period;
  compareMode: CompareMode;
}

export function SiteCard({ site, period, compareMode }: SiteCardProps) {
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSiteMetrics(site.id, period)
      .then((data) => {
        setMetrics(data.metrics);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [site.id, period]);

  const formatCurrency = (value: number) =>
    `${value.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK`;

  const formatRpc = (value: number) =>
    `${value.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK`;

  const formatCurrencyChange = (value: number) =>
    value >= 0
      ? `+${value.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK`
      : `${value.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SEK`;

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{site.name}</h2>
            <p className="text-sm text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{site.name}</h2>
            <p className="text-sm text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        <p className="text-destructive">Failed to load metrics</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{site.name}</h2>
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {site.domain}
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {site.ga4Id && (
            <span className="bg-muted px-2 py-1 rounded">GA4</span>
          )}
          {site.gtmId && (
            <span className="bg-muted px-2 py-1 rounded">GTM</span>
          )}
          {site.adtractionProgramId && (
            <span className="bg-muted px-2 py-1 rounded">Adtraction</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total clicks"
          value={metrics.clicks.toLocaleString("sv-SE")}
          momChange={metrics.changes.mom.clicks}
          yoyChange={metrics.changes.yoy.clicks}
          compareMode={compareMode}
        />
        <MetricCard
          label="Total impressions"
          value={metrics.impressions.toLocaleString("sv-SE")}
          momChange={metrics.changes.mom.impressions}
          yoyChange={metrics.changes.yoy.impressions}
          compareMode={compareMode}
        />
        <MetricCard
          label="Total revenue"
          value={formatCurrency(metrics.revenue)}
          momChange={metrics.changes.mom.revenue}
          yoyChange={metrics.changes.yoy.revenue}
          compareMode={compareMode}
          formatChange={formatCurrencyChange}
        />
        <MetricCard
          label="Avg. RPC"
          value={formatRpc(metrics.rpc)}
          momChange={0}
          yoyChange={0}
          compareMode={compareMode}
          formatChange={() => "—"}
        />
      </div>
    </div>
  );
}
