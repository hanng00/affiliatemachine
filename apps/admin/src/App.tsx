import { useState, useEffect } from "react";
import { fetchSites } from "./api";
import { PeriodSelector } from "./components/PeriodSelector";
import { CompareSelector } from "./components/CompareSelector";
import { SiteCard } from "./components/SiteCard";
import type { Site, Period, CompareMode } from "./types";

export default function App() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("mtd");
  const [compareMode, setCompareMode] = useState<CompareMode>("mom");

  useEffect(() => {
    fetchSites()
      .then((data) => {
        setSites(data.sites);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-foreground">
                Affiliate Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <CompareSelector value={compareMode} onChange={setCompareMode} />
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && sites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sites found</p>
          </div>
        )}

        <div className="space-y-6">
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              period={period}
              compareMode={compareMode}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
