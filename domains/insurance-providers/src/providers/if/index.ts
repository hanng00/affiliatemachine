/**
 * If motor quote provider.
 *
 * Requires reCAPTCHA for initQuotation — see README.md for the full flow,
 * captcha reverse-engineering notes, and Browser Run integration.
 */
import { InsuranceProvider, type ProviderConfigurations } from "../../core/Provider";
import type { QuoteRequest, QuoteResult } from "../../types";
import { fetchIfQuote } from "./client";
import { mapIfResponse } from "./mapper";

export class IfProvider extends InsuranceProvider {
  readonly id = "if";
  readonly name = "If";
  readonly logoUrl = "https://www.if.se/content/dam/if/logo-if.svg";
  readonly websiteUrl = "https://www.if.se";

  async getConfigurations(): Promise<ProviderConfigurations> {
    return { packages: [], additionalPackages: [] };
  }

  async getQuote(request: QuoteRequest): Promise<QuoteResult> {
    try {
      const { price } = await fetchIfQuote(request);

      const packages = mapIfResponse(price).packages;
      if (packages.length === 0) {
        return {
          success: false,
          error: {
            provider: this.id,
            error: "No insurance packages returned",
            code: "NO_PACKAGES",
          },
        };
      }

      return {
        success: true,
        data: mapIfResponse(price),
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
