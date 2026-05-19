import { useState } from "react";
import { Check, ExternalLink, Star, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { Button, Card, CardContent, Badge } from "@affiliate/ui";
import type { InsuranceQuote, CoverageType } from "../types/insurance";
import { coverageTypes } from "../types/insurance";
import { formatCurrency } from "../lib/insurance-calculator";

interface InsuranceQuotesProps {
  quotes: InsuranceQuote[];
  selectedCoverage: CoverageType;
  onCoverageChange: (coverage: CoverageType) => void;
}

export function InsuranceQuotes({
  quotes,
  selectedCoverage,
  onCoverageChange,
}: InsuranceQuotesProps) {
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  const cheapestPrice = Math.min(...quotes.map((q) => q.monthlyPrice));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Välj försäkringstyp</h2>
          <p className="text-gray-600 mt-1">Jämför priser från {quotes.length} försäkringsbolag</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coverageTypes.map((coverage) => (
          <button
            key={coverage.type}
            onClick={() => onCoverageChange(coverage.type)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedCoverage === coverage.type
                ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{coverage.name}</h3>
              {selectedCoverage === coverage.type && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{coverage.description}</p>
            <ul className="space-y-1">
              {coverage.includes.slice(0, 3).map((item, i) => (
                <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  {item}
                </li>
              ))}
              {coverage.includes.length > 3 && (
                <li className="text-xs text-blue-600">+{coverage.includes.length - 3} mer</li>
              )}
            </ul>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Sorterat efter lägsta pris. Klicka för att se detaljer.</span>
        </div>

        {quotes.map((quote, index) => {
          const isExpanded = expandedQuote === quote.provider.id;
          const isCheapest = quote.monthlyPrice === cheapestPrice;
          const savings = quote.monthlyPrice - cheapestPrice;

          return (
            <Card
              key={quote.provider.id}
              className={`overflow-hidden transition-all ${
                isCheapest ? "ring-2 ring-green-500 shadow-lg" : "shadow"
              }`}
            >
              <CardContent className="p-0">
                <div
                  className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedQuote(isExpanded ? null : quote.provider.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 shrink-0">
                        <span className="text-2xl font-bold" style={{ color: quote.provider.color }}>
                          {quote.provider.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{quote.provider.name}</h3>
                          {isCheapest && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Lägst pris
                            </Badge>
                          )}
                          {index === 0 && !isCheapest && (
                            <Badge variant="secondary">Rekommenderas</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{quote.provider.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({quote.provider.reviewCount.toLocaleString("sv-SE")} omdömen)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(quote.monthlyPrice)}
                          <span className="text-sm font-normal text-gray-500">/mån</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(quote.yearlyPrice)}/år
                        </div>
                        {savings > 0 && (
                          <div className="text-xs text-orange-600">
                            +{formatCurrency(savings)}/mån vs billigast
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          <a href={quote.affiliateUrl} target="_blank" rel="noopener noreferrer">
                            Gå till {quote.provider.name}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Ingår i försäkringen</h4>
                        <ul className="space-y-2">
                          {quote.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Prisdetaljer</h4>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Månadspremie</dt>
                            <dd className="font-medium">{formatCurrency(quote.monthlyPrice)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Årspremie</dt>
                            <dd className="font-medium">{formatCurrency(quote.yearlyPrice)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Självrisk</dt>
                            <dd className="font-medium">
                              {quote.deductible > 0 ? formatCurrency(quote.deductible) : "–"}
                            </dd>
                          </div>
                        </dl>
                        <p className="text-xs text-gray-500 mt-4">
                          * Priserna är uppskattningar baserade på fordonsdata. Slutgiltigt pris kan
                          variera beroende på personliga faktorer som ålder, körsträcka och
                          skadehistorik.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
