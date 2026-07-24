import type { InsuranceProvider } from "./Provider";
import type { QuoteRequest, QuoteResult } from "../types";

export class ProviderRegistry {
  private providers: Map<string, InsuranceProvider> = new Map();

  register(provider: InsuranceProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: string): InsuranceProvider | undefined {
    return this.providers.get(id);
  }

  getAll(): InsuranceProvider[] {
    return Array.from(this.providers.values());
  }

  async getQuoteFromAll(request: QuoteRequest): Promise<QuoteResult[]> {
    const providers = this.getAll();
    const results = await Promise.allSettled(
      providers.map((p) => p.getQuote(request))
    );

    return results.map((result, i) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        success: false as const,
        error: {
          provider: providers[i].id,
          error: result.reason?.message || "Unknown error",
        },
      };
    });
  }

  /**
   * Stream quotes as they arrive from each provider.
   * Calls onResult for each provider result as it completes.
   */
  async streamQuotes(
    request: QuoteRequest,
    onResult: (result: QuoteResult) => void
  ): Promise<void> {
    const providers = this.getAll();
    
    await Promise.allSettled(
      providers.map(async (provider) => {
        try {
          const result = await provider.getQuote(request);
          onResult(result);
        } catch (err) {
          onResult({
            success: false,
            error: {
              provider: provider.id,
              error: err instanceof Error ? err.message : "Unknown error",
            },
          });
        }
      })
    );
  }

  async getQuoteFrom(
    providerId: string,
    request: QuoteRequest
  ): Promise<QuoteResult> {
    const provider = this.get(providerId);
    if (!provider) {
      return {
        success: false,
        error: {
          provider: providerId,
          error: `Provider "${providerId}" not found`,
          code: "PROVIDER_NOT_FOUND",
        },
      };
    }
    return provider.getQuote(request);
  }
}

export const registry = new ProviderRegistry();
