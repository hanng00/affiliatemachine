import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { SEOHead, canonicalUrl } from "@affiliate/seo";
import { useTrackActivation } from "@affiliate/analytics";
import { ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteResults } from "../components/QuoteResults";
import { fetchSearchById, type StoredSearchResult } from "../api/quotes";
import { siteConfig } from "../config/site";

interface ProviderStatus {
  id: string;
  name: string;
  status: "loading" | "success" | "error";
}

export default function SearchPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<StoredSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const trackActivation = useTrackActivation("quotes_shown");

  const fetchResults = useCallback(async () => {
    if (!id) {
      setError("Ingen sökning angiven");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchSearchById(id);
      setResult(data);

      // Activation = real quotes rendered (value reached), not merely requested.
      // Session-guarded, so firing inside the 1s poll loop counts at most once.
      if (data.quotes.length > 0) {
        const cheapest = Math.min(
          ...data.quotes.flatMap((q) => q.packages.map((p) => p.monthlyPrice))
        );
        trackActivation(Number.isFinite(cheapest) ? cheapest : undefined);
      }
      
      // Update provider statuses based on results
      if (data.providers) {
        const statuses: ProviderStatus[] = data.providers.map((p) => {
          const hasQuote = data.quotes.some((q) => q.provider === p.id);
          const hasError = data.errors.some((e) => e.provider === p.id);
          return {
            id: p.id,
            name: p.name,
            status: hasQuote ? "success" : hasError ? "error" : "loading",
          };
        });
        setProviderStatuses(statuses);
      }

      // If still loading, poll again
      if (data.status === "loading") {
        setTimeout(fetchResults, 1000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte hämta sökningen");
      setLoading(false);
    }
  }, [id, trackActivation]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Tick an elapsed-seconds counter while the search is still running, so the
  // 30-45s scrape *feels* like progress rather than a frozen spinner (the #1
  // reason a slow-but-working tool reads as "broken").
  const isComplete = result?.status === "complete";
  useEffect(() => {
    if (isComplete) return;
    const started = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(t);
  }, [isComplete]);

  if (loading && !result && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sökningen hittades inte
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Sökningen kan ha gått ut eller så finns den inte."}
          </p>
          <Button asChild>
            <Link to="/">Gör en ny sökning</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = result?.createdAt
    ? new Date(result.createdAt).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <>
      <SEOHead
        title={
          result?.request?.regno
            ? `Bilförsäkring för ${result.request.regno} | ${siteConfig.brand}`
            : `Laddar sökning... | ${siteConfig.brand}`
        }
        description={`Jämför bilförsäkringar${result?.request?.regno ? ` för ${result.request.regno}` : ""}. Se priser från Sveriges försäkringsbolag.`}
        canonical={id ? canonicalUrl(siteConfig.domain, `/s/${id}`) : undefined}
        noIndex
        siteName={siteConfig.name}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ny sökning
            </Link>
          </Button>

          {/* Header with vehicle info */}
          {result && (
            <div className="mb-6 p-4 bg-white rounded-xl border">
              <div className="flex items-center justify-between">
                <div>
                  {result.quotes.length > 0 ? (
                    <>
                      <h1 className="text-xl font-bold text-gray-900">
                        {result.quotes[0].vehicleInfo.make}{" "}
                        {result.quotes[0].vehicleInfo.model}
                      </h1>
                      <p className="text-gray-600">
                        Reg.nr: {result.request.regno}
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-xl font-bold text-gray-900">
                        {result.request.regno}
                      </h1>
                      <p className="text-gray-600">Hämtar fordonsinfo...</p>
                    </>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  {isComplete && <p>Sökning från {formattedDate}</p>}
                  {result.quotes[0]?.customerName && (
                    <p className="text-gray-600">
                      Priser för: {result.quotes[0].customerName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading state with provider progress */}
          {!isComplete && providerStatuses.length > 0 && (
            <div className="mb-6 p-6 bg-white rounded-xl border">
              <div className="flex items-center gap-3 mb-1">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Hämtar priser från försäkringsbolag...
                </h2>
              </div>
              <p className="mb-4 ml-8 text-sm text-gray-500">
                Vi hämtar dina priser live hos bolagen — det tar oftast 30–45
                sekunder. Du kan lämna sidan öppen{elapsed > 0 ? ` (${elapsed} s)` : ""}.
              </p>
              <div className="space-y-3">
                {providerStatuses.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700 font-medium">
                      {provider.name}
                    </span>
                    <span className="flex items-center gap-2">
                      {provider.status === "loading" && (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-500">Hämtar...</span>
                        </>
                      )}
                      {provider.status === "success" && (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Klar</span>
                        </>
                      )}
                      {provider.status === "error" && (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">Misslyckades</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show results as they arrive */}
          {result && result.quotes.length > 0 && (
            <QuoteResults quotes={result.quotes} errors={result.errors} />
          )}

          {/* Show message if no quotes yet */}
          {result && result.quotes.length === 0 && !isComplete && (
            <div className="text-center py-12 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="font-medium text-gray-700">Väntar på första offerten...</p>
              <p className="mt-1 text-sm">
                Priserna hämtas live och dyker upp här efter hand{elapsed > 0 ? ` · ${elapsed} s` : ""}.
              </p>
            </div>
          )}

          {/* Footer info when complete */}
          {isComplete && result && (
            <>
              <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Om priserna</h3>
                <p className="text-sm text-gray-600">
                  Priserna hämtades {formattedDate} baserat på dina uppgifter. Det
                  slutgiltiga priset kan variera något beroende på ytterligare
                  faktorer som bostadsort och eventuell skadehistorik. Klicka på
                  "Gå till [bolag]" för att slutföra din ansökan.
                </p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Dela denna jämförelse:
                </p>
                <code className="text-xs bg-gray-100 px-3 py-2 rounded-lg text-gray-700">
                  {window.location.href}
                </code>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
