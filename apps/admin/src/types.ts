export type Period = "7d" | "30d" | "mtd" | "lm" | "ytd";
export type CompareMode = "mom" | "yoy";
export type SiteStatus = "healthy" | "warning" | "error";
export type SortField = "name" | "clicks" | "impressions" | "ctr" | "revenue" | "profit" | "rpc";
export type SortDirection = "asc" | "desc";

export interface MetricChanges {
  clicks: number;
  impressions: number;
  revenue: number;
  clicksPercent: number;
  impressionsPercent: number;
  revenuePercent: number;
}

export interface SiteMetrics {
  clicks: number;
  impressions: number;
  revenue: number;
  pendingRevenue: number;
  ctr: number;
  rpc: number;
  profit: number;
  sparkline: number[];
  changes: {
    mom: MetricChanges;
    yoy: MetricChanges;
  };
}

export interface Site {
  id: number;
  name: string;
  domain: string;
  ga4Id: string | null;
  gtmId: string | null;
  adtractionProgramId: string | null;
  costMonthly: number;
  status: SiteStatus;
  createdAt: number;
  metrics: SiteMetrics;
}

export interface Totals {
  clicks: number;
  impressions: number;
  revenue: number;
  pendingRevenue: number;
  avgRpc: number;
  changes: {
    mom: MetricChanges;
    yoy: MetricChanges;
  };
}

export interface SitesResponse {
  sites: Site[];
  totals: Totals;
  period: {
    start: string;
    end: string;
  };
}

export interface DailyMetric {
  date: string;
  clicks: number;
  impressions: number;
  revenue: number;
}

export interface SparklineResponse {
  siteId: number;
  days: number;
  metrics: DailyMetric[];
}
