import { Suspense, use, useState } from "react";
import { PeriodSelector } from "./components/PeriodSelector";
import { CompareSelector } from "./components/CompareSelector";
import { SummaryCards } from "./components/SummaryCards";
import { PropertiesTable } from "./components/PropertiesTable";
import { ProfitHero } from "./components/ProfitHero";
import type { Period, CompareMode, SitesResponse } from "./types";

const API_BASE = "/api";

function getParams(): { period: Period; compareMode: CompareMode } {
  const params = new URLSearchParams(window.location.search);
  const period = (params.get("period") as Period) || "mtd";
  const compareMode = (params.get("compare") as CompareMode) || "mom";
  return { period, compareMode };
}

function setParams(period: Period, compareMode: CompareMode) {
  const url = new URL(window.location.href);
  url.searchParams.set("period", period);
  url.searchParams.set("compare", compareMode);
  window.history.pushState({}, "", url);
  window.location.reload();
}

const cache = new Map<string, Promise<SitesResponse>>();

function fetchSites(period: Period): Promise<SitesResponse> {
  const key = period;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`${API_BASE}/sites?period=${period}`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch sites");
        return res.json();
      })
    );
  }
  return cache.get(key)!;
}

function Dashboard({ period, compareMode }: { period: Period; compareMode: CompareMode }) {
  const data = use(fetchSites(period));

  return (
    <>
      <ProfitHero
        sites={data.sites}
        totals={data.totals}
        compareMode={compareMode}
        period={data.period}
      />
      <SummaryCards totals={data.totals} compareMode={compareMode} />
      {data.sites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="text-sm text-muted-foreground">No sites found for this period</p>
        </div>
      ) : (
        <PropertiesTable sites={data.sites} compareMode={compareMode} />
      )}
    </>
  );
}

function RefreshButton() {
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    try {
      await fetch(`${API_BASE}/cache/clear`, { method: "POST" });
    } finally {
      window.location.reload();
    }
  }

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary disabled:opacity-50"
    >
      <svg
        className={`h-4 w-4 text-muted-foreground ${busy ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {busy ? "Refreshing…" : "Refresh"}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="mb-6 h-36 animate-pulse rounded-2xl bg-slate-200" />
      <SummaryCards
        totals={{
          clicks: 0,
          impressions: 0,
          revenue: 0,
          pendingRevenue: 0,
          avgRpc: 0,
          avgPosition: 0,
          changes: {
            mom: { clicks: 0, impressions: 0, revenue: 0, clicksPercent: 0, impressionsPercent: 0, revenuePercent: 0 },
            yoy: { clicks: 0, impressions: 0, revenue: 0, clicksPercent: 0, impressionsPercent: 0, revenuePercent: 0 },
          },
        }}
        compareMode="mom"
        loading
      />
      <PropertiesTable sites={[]} compareMode="mom" loading />
    </>
  );
}

export default function App() {
  const { period, compareMode } = getParams();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-violet-600 shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-semibold text-foreground">Affiliate Portfolio</h1>
              <p className="text-xs text-muted-foreground">Revenue operations</p>
            </div>
          </div>
          <RefreshButton />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PeriodSelector value={period} onChange={(p) => setParams(p, compareMode)} />
          <CompareSelector value={compareMode} onChange={(mode) => setParams(period, mode)} />
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <Dashboard period={period} compareMode={compareMode} />
        </Suspense>
      </main>
    </div>
  );
}
