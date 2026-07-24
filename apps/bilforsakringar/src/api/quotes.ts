import { API_BASE_URL } from "../config/api";

export interface QuoteRequest {
  regno: string;
  personnummer: string;
  yearlyKm?: number;
  driverUnder24?: boolean;
  deductible?: "low" | "medium" | "high";
}

export interface VehicleInfo {
  make: string;
  model: string;
  year?: number;
}

export interface CoverageDescription {
  title: string;
  details: string;
}

export interface Coverage {
  id: string;
  name: string;
  descriptions: CoverageDescription[];
}

export interface PackageConfiguration {
  type: "trafik" | "halv" | "hel";
  code: string;
  name: string;
  description: string;
  includedCoverages: Coverage[];
  excludedCoverages: Coverage[];
}

export interface InsurancePackage {
  type: "trafik" | "halv" | "hel";
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  configuration?: PackageConfiguration;
}

export interface AdditionalPackage {
  name: string;
  monthlyPrice: number;
  currency: string;
}

export interface QuoteResponse {
  provider: string;
  providerName: string;
  vehicleInfo: VehicleInfo;
  customerName?: string;
  packages: InsurancePackage[];
  additionalPackages?: AdditionalPackage[];
  recommendedPackage?: "trafik" | "halv" | "hel";
  discountPercentage?: number;
  fetchedAt: string;
}

export interface QuoteError {
  provider: string;
  error: string;
  code?: string;
}

export interface QuotesResult {
  success: true;
  id: string;
  quotes: QuoteResponse[];
  errors: QuoteError[];
  request: {
    regno: string;
    yearlyKm: number;
    driverUnder24: boolean;
    deductible: string;
  };
}

export interface StoredSearchResult {
  success: true;
  id: string;
  createdAt: string;
  status: "loading" | "complete";
  providers: Provider[];
  quotes: QuoteResponse[];
  errors: QuoteError[];
  request: {
    regno: string;
    yearlyKm: number;
    driverUnder24: boolean;
    deductible: string;
  };
}

export interface Provider {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface StreamInitEvent {
  id: string;
  providerCount: number;
  providers: Provider[];
}

export interface StreamCompleteEvent {
  id: string;
  totalQuotes: number;
  totalErrors: number;
}

export interface StreamCallbacks {
  onInit: (data: StreamInitEvent) => void;
  onQuote: (quote: QuoteResponse) => void;
  onError: (error: QuoteError) => void;
  onComplete: (data: StreamCompleteEvent) => void;
}

export async function fetchQuotesStreaming(
  request: QuoteRequest,
  callbacks: StreamCallbacks
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/quote/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      regno: request.regno.toUpperCase().replace(/\s/g, ""),
      personnummer: request.personnummer.replace(/[^0-9]/g, ""),
      yearlyKm: request.yearlyKm ?? 10,
      driverUnder24: request.driverUnder24 ?? false,
      deductible: request.deductible ?? "medium",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to fetch quotes");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        continue;
      }
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          // Determine event type from the data structure
          if ("providerCount" in parsed) {
            callbacks.onInit(parsed);
          } else if ("totalQuotes" in parsed) {
            callbacks.onComplete(parsed);
          } else if ("provider" in parsed && "error" in parsed && !("packages" in parsed)) {
            callbacks.onError(parsed);
          } else if ("packages" in parsed) {
            callbacks.onQuote(parsed);
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

export async function fetchQuotes(request: QuoteRequest): Promise<QuotesResult> {
  const response = await fetch(`${API_BASE_URL}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      regno: request.regno.toUpperCase().replace(/\s/g, ""),
      personnummer: request.personnummer.replace(/[^0-9]/g, ""),
      yearlyKm: request.yearlyKm ?? 10,
      driverUnder24: request.driverUnder24 ?? false,
      deductible: request.deductible ?? "medium",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to fetch quotes");
  }

  return response.json();
}

export async function fetchSearchById(id: string): Promise<StoredSearchResult> {
  const response = await fetch(`${API_BASE_URL}/search/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Search not found");
  }

  return response.json();
}

export async function fetchProviders(): Promise<Provider[]> {
  const response = await fetch(`${API_BASE_URL}/providers`);
  if (!response.ok) {
    throw new Error("Failed to fetch providers");
  }
  const data = await response.json();
  return data.providers;
}
