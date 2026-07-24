import { InsuranceProvider, type ProviderConfigurations } from "../../core/Provider";
import type { QuoteRequest, QuoteResult } from "../../types";
import { fetchGjensidigeQuote, fetchGjensidigeConfigurations } from "./client";
import { mapGjensidigeResponse, mapGjensidigeConfigurations } from "./mapper";

export class GjensidigeProvider extends InsuranceProvider {
  readonly id = "gjensidige";
  readonly name = "Gjensidige";
  readonly logoUrl = "https://www.gjensidige.se/assets/images/logo.svg";
  readonly websiteUrl = "https://www.gjensidige.se";

  private configurationsCache: ProviderConfigurations | null = null;
  private configurationsCacheTime: number = 0;
  private readonly CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

  async getConfigurations(): Promise<ProviderConfigurations> {
    const now = Date.now();
    if (
      this.configurationsCache &&
      now - this.configurationsCacheTime < this.CACHE_TTL_MS
    ) {
      return this.configurationsCache;
    }

    const rawConfigs = await fetchGjensidigeConfigurations();
    this.configurationsCache = mapGjensidigeConfigurations(rawConfigs);
    this.configurationsCacheTime = now;

    return this.configurationsCache;
  }

  async getQuote(request: QuoteRequest): Promise<QuoteResult> {
    try {
      const [response, configurations] = await Promise.all([
        fetchGjensidigeQuote(request),
        this.getConfigurations().catch(() => undefined),
      ]);

      if (response.calculationStatus.error) {
        return {
          success: false,
          error: {
            provider: this.id,
            error:
              response.calculationStatus.errorMessage ||
              "Calculation failed",
            code: "CALCULATION_ERROR",
          },
        };
      }

      return {
        success: true,
        data: mapGjensidigeResponse(response, configurations),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          provider: this.id,
          error: err instanceof Error ? err.message : "Unknown error",
          code: "FETCH_ERROR",
        },
      };
    }
  }
}
