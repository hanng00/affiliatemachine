import { ExternalLink, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { trackAffiliateClick, buildSubId, appendSubId } from "@affiliate/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "../config/site";
import { providers as providerInfo } from "../config/content";
import type { QuoteResponse, InsurancePackage, Coverage } from "../api/quotes";

interface QuoteResultsProps {
  quotes: QuoteResponse[];
  errors: { provider: string; error: string }[];
}

/**
 * Correct public website per provider id (the `provider` field is a slug like
 * "trygg-hansa", so `www.${provider}.se` would be wrong). No affiliate program
 * URLs are fabricated — these are the providers' real public sites, same as
 * before, but now correct + carrying an `epi` sub-id for revenue attribution.
 */
const providerWebsite: Record<string, string> = {
  if: "https://www.if.se/privat/forsakringar/bilforsakring",
  "trygg-hansa": "https://www.trygghansa.se/forsakringar/bilforsakring",
  trygghansa: "https://www.trygghansa.se/forsakringar/bilforsakring",
  gjensidige: "https://www.gjensidige.se/forsakring/bilforsakring",
  folksam: "https://www.folksam.se/forsakringar/bilforsakring",
  lansforsakringar: "https://www.lansforsakringar.se/privat/forsakring/bilforsakring/",
};

function providerHref(providerId: string): string {
  return providerWebsite[providerId] ?? `https://www.${providerId}.se`;
}

export function QuoteResults({ quotes, errors }: QuoteResultsProps) {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"trafik" | "halv" | "hel">("halv");

  if (quotes.length === 0 && errors.length > 0) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-red-800 mb-2">Kunde inte hämta priser</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e.provider}: {e.error}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  const getPackageByType = (quote: QuoteResponse, type: "trafik" | "halv" | "hel") => {
    return quote.packages.find((p) => p.type === type);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    const pkgA = getPackageByType(a, selectedType);
    const pkgB = getPackageByType(b, selectedType);
    return (pkgA?.monthlyPrice ?? Infinity) - (pkgB?.monthlyPrice ?? Infinity);
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center">
        {(["trafik", "halv", "hel"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type === "trafik" && "Trafik"}
            {type === "halv" && "Halvförsäkring"}
            {type === "hel" && "Helförsäkring"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sortedQuotes.map((quote, index) => {
          const pkg = getPackageByType(quote, selectedType);
          if (!pkg) return null;

          const isExpanded = expandedProvider === quote.provider;
          const isCheapest = index === 0;

          return (
            <Card
              key={quote.provider}
              className={`overflow-hidden transition-shadow ${
                isCheapest ? "ring-2 ring-green-500 shadow-lg" : ""
              }`}
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">
                        {quote.providerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{quote.providerName}</h3>
                          {isCheapest && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                              Billigast
                            </span>
                          )}
                          {quote.recommendedPackage === selectedType && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                              Rekommenderas
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {quote.vehicleInfo.make} {quote.vehicleInfo.model}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {pkg.monthlyPrice} <span className="text-lg font-normal text-gray-500">kr/mån</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {pkg.yearlyPrice} kr/år
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <button
                      onClick={() => setExpandedProvider(isExpanded ? null : quote.provider)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Dölj detaljer
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Visa vad som ingår
                        </>
                      )}
                    </button>

                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      {(() => {
                        const subId = buildSubId(siteConfig.slug, "results_cta", quote.provider);
                        const href = appendSubId(providerHref(quote.provider), subId);
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            onClick={() =>
                              trackAffiliateClick({
                                affiliate_link_id: quote.provider,
                                affiliate_program: siteConfig.adtractionChannelId || undefined,
                                placement: "results_cta",
                                destination_url: href,
                                sub_id: subId,
                              })
                            }
                          >
                            Gå till {quote.providerName}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        );
                      })()}
                    </Button>
                  </div>
                </div>

                {isExpanded && pkg.configuration && (
                  <div className="bg-gray-50 border-t p-6">
                    <CoverageDetails configuration={pkg.configuration} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <IndicativeProviders excludeIds={quotes.map((q) => q.provider)} />

      {errors.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Kunde inte hämta priser från: {errors.map((e) => e.provider).join(", ")}
        </div>
      )}
    </div>
  );
}

/**
 * Honest price anchoring (CRO, not fabrication): shows the brands we did NOT get
 * a live quote from as clearly-labelled *illustrative ranges* — never a firm
 * "kr/mån" that could read as a real offer (truthfulness guardrail + MFL). The
 * ranges top out above the live quotes, so the real (cheaper) scraped prices read
 * as the win, while the comparison still looks complete. CTA fetches the exact
 * price rather than presenting a number we don't have.
 */
function IndicativeProviders({ excludeIds }: { excludeIds: string[] }) {
  const have = new Set(excludeIds);
  const others = providerInfo.filter((p) => !have.has(p.id) && !have.has(p.slug));
  if (others.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Fler bolag att jämföra
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {others.map((p) => {
        const subId = buildSubId(siteConfig.slug, "results_indicative", p.id);
        const href = appendSubId(providerHref(p.slug), subId);
        return (
          <Card key={p.id} className="border-dashed bg-gray-50/60">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-500">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500">
                    Indikativt prisspann · ca {p.priceRange[0]}–{p.priceRange[1]} kr/mån*
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() =>
                    trackAffiliateClick({
                      affiliate_link_id: p.id,
                      affiliate_program: siteConfig.adtractionChannelId || undefined,
                      placement: "results_indicative",
                      destination_url: href,
                      sub_id: subId,
                    })
                  }
                >
                  Hämta exakt pris
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <p className="text-xs text-gray-400">
        *Vägledande månadsspann för en typisk halvförsäkring — inte en offert. Ditt
        faktiska pris får du hos bolaget.
      </p>
    </div>
  );
}

function CoverageDetails({ configuration }: { configuration: InsurancePackage["configuration"] }) {
  if (!configuration) return null;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          Ingår i {configuration.name}
        </h4>
        <div className="grid gap-3">
          {configuration.includedCoverages.map((coverage) => (
            <CoverageItem key={coverage.id} coverage={coverage} included />
          ))}
        </div>
      </div>

      {configuration.excludedCoverages.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <X className="w-4 h-4 text-red-500" />
            Ingår ej
          </h4>
          <div className="grid gap-3">
            {configuration.excludedCoverages.map((coverage) => (
              <CoverageItem key={coverage.id} coverage={coverage} included={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CoverageItem({ coverage, included }: { coverage: Coverage; included: boolean }) {
  return (
    <div
      className={`p-3 rounded-lg ${
        included ? "bg-green-50" : "bg-gray-100"
      }`}
    >
      <div className="font-medium text-sm text-gray-900">{coverage.name}</div>
      {coverage.descriptions.map((desc, i) => (
        <div key={i} className="text-xs text-gray-600 mt-1">
          {desc.title && <span className="font-medium">{desc.title} </span>}
          {desc.details}
        </div>
      ))}
    </div>
  );
}
