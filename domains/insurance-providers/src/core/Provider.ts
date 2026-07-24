import type { QuoteRequest, QuoteResult, PackageConfiguration, AdditionalPackageConfiguration } from "../types";

export interface ProviderConfigurations {
  packages: PackageConfiguration[];
  additionalPackages: AdditionalPackageConfiguration[];
}

export abstract class InsuranceProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly logoUrl: string;
  abstract readonly websiteUrl: string;

  abstract getQuote(request: QuoteRequest): Promise<QuoteResult>;
  
  abstract getConfigurations(): Promise<ProviderConfigurations>;

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
