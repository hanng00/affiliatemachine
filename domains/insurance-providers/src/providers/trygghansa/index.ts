import { InsuranceProvider, type ProviderConfigurations } from "../../core/Provider";
import type { QuoteRequest, QuoteResult } from "../../types";
import { fetchTryggHansaQuote } from "./client";
import { mapTryggHansaResponse } from "./mapper";

export class TryggHansaProvider extends InsuranceProvider {
  readonly id = "trygghansa";
  readonly name = "Trygg-Hansa";
  readonly logoUrl = "https://www.trygghansa.se/globalassets/bilder/logotyper/trygghansa-logo.svg";
  readonly websiteUrl = "https://www.trygghansa.se";

  async getConfigurations(): Promise<ProviderConfigurations> {
    // Trygg-Hansa doesn't have a separate configurations endpoint
    // The coverage details are embedded in the calculation response
    return {
      packages: [],
      additionalPackages: [],
    };
  }

  async getQuote(request: QuoteRequest): Promise<QuoteResult> {
    try {
      const { validation, calculation } = await fetchTryggHansaQuote(request);

      return {
        success: true,
        data: mapTryggHansaResponse(validation, calculation),
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
