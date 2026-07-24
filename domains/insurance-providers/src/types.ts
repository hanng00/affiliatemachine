import { z } from "zod";

export const quoteRequestSchema = z.object({
  regno: z.string().min(2).max(10),
  personnummer: z.string().length(10).regex(/^\d+$/),
  yearlyKm: z.number().min(1).max(100).default(15),
  driverUnder24: z.boolean().default(false),
  deductible: z.enum(["low", "medium", "high"]).default("medium"),
  /** Required by IF – reCAPTCHA token from os-captcha-token header */
  captchaToken: z.string().optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export interface VehicleInfo {
  make: string;
  model: string;
  year?: number;
}

export type PackageType = "trafik" | "halv" | "hel";

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
  type: PackageType;
  code: string;
  name: string;
  description: string;
  includedCoverages: Coverage[];
  excludedCoverages: Coverage[];
}

export interface InsurancePackage {
  type: PackageType;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  configuration?: PackageConfiguration;
}

export interface AdditionalPackageConfiguration {
  code: string;
  name: string;
  coverages: Coverage[];
}

export interface AdditionalPackage {
  name: string;
  monthlyPrice: number;
  currency: string;
  configuration?: AdditionalPackageConfiguration;
}

export interface QuoteResponse {
  provider: string;
  providerName: string;
  vehicleInfo: VehicleInfo;
  customerName?: string;
  packages: InsurancePackage[];
  additionalPackages?: AdditionalPackage[];
  recommendedPackage?: PackageType;
  discountPercentage?: number;
  fetchedAt: Date;
  raw?: unknown;
}

export interface QuoteError {
  provider: string;
  error: string;
  code?: string;
}

export type QuoteResult =
  | { success: true; data: QuoteResponse }
  | { success: false; error: QuoteError };
