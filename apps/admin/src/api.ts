import type { Period, SitesResponse, SparklineResponse, SiteMetrics } from "./types";

const API_BASE = "/api";

export async function fetchSites(period: Period = "mtd"): Promise<SitesResponse> {
  const res = await fetch(`${API_BASE}/sites?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch sites");
  return res.json();
}

export async function fetchSiteSparkline(
  siteId: number,
  days: number = 30
): Promise<SparklineResponse> {
  const res = await fetch(`${API_BASE}/sites/${siteId}/metrics?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch sparkline data");
  return res.json();
}

export async function fetchSiteMetrics(
  siteId: number,
  period: Period
): Promise<{ metrics: SiteMetrics }> {
  const res = await fetch(`${API_BASE}/sites/${siteId}?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch site metrics");
  return res.json();
}
