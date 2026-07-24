import type { GjensidigeResponse, GjensidigePackageConfigs, GjensidigePackageConfig } from "./types";
import type {
  QuoteResponse,
  InsurancePackage,
  PackageType,
  PackageConfiguration,
  AdditionalPackageConfiguration,
  Coverage,
} from "../../types";
import type { ProviderConfigurations } from "../../core/Provider";

function mapPackageType(gjensidigeType: string): PackageType | null {
  switch (gjensidigeType) {
    case "trafikforsakring":
      return "trafik";
    case "halvforsakring":
      return "halv";
    case "helforsakring":
      return "hel";
    default:
      return null;
  }
}

function mapPackageCodeToType(code: string): PackageType | null {
  switch (code) {
    case "CAR_PACK_001":
      return "hel";
    case "CAR_PACK_002":
      return "halv";
    case "CAR_PACK_003":
      return "trafik";
    default:
      return null;
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

function mapCoverages(
  coverageList: { name: string; description: { title: string; details: string }[] }[]
): Coverage[] {
  return coverageList.map((c) => ({
    id: slugify(c.name),
    name: c.name,
    descriptions: c.description.map((d) => ({
      title: d.title,
      details: stripHtml(d.details),
    })),
  }));
}

function parseVehicleDetails(details: string): { make: string; model: string } {
  const parts = details.split(" ");
  const make = parts[0] || "Unknown";
  const model = parts.slice(1).join(" ") || "Unknown";
  return { make, model };
}

export function mapGjensidigeConfigurations(
  configs: GjensidigePackageConfigs
): ProviderConfigurations {
  const packages: PackageConfiguration[] = [];
  const additionalPackages: AdditionalPackageConfiguration[] = [];

  for (const config of configs) {
    if (config.isPlusPackage) {
      additionalPackages.push({
        code: config.packageCode,
        name: config.packageName,
        coverages: mapCoverages(config.includedCoverages.coverageList),
      });
    } else {
      const type = mapPackageCodeToType(config.packageCode);
      if (type) {
        packages.push({
          type,
          code: config.packageCode,
          name: config.packageName,
          description: config.detailText,
          includedCoverages: mapCoverages(config.includedCoverages.coverageList),
          excludedCoverages: mapCoverages(config.excludedCoverages.coverageList),
        });
      }
    }
  }

  return { packages, additionalPackages };
}

export function mapGjensidigeResponse(
  response: GjensidigeResponse,
  configurations?: ProviderConfigurations
): QuoteResponse {
  const vehicleInfo = parseVehicleDetails(response.vehicleDetails);

  const packages: InsurancePackage[] = response.packages
    .map((pkg): InsurancePackage | null => {
      const type = mapPackageType(pkg.packageType);
      if (!type) return null;

      const config = configurations?.packages.find((c) => c.type === type);

      return {
        type,
        name: pkg.packageName,
        monthlyPrice: pkg.monthlyPrice,
        yearlyPrice: pkg.monthlyPrice * 12,
        currency: pkg.currency,
        configuration: config,
      };
    })
    .filter((pkg): pkg is InsurancePackage => pkg !== null);

  const additionalPackages = response.additionalPackages?.map((pkg) => {
    const config = configurations?.additionalPackages.find(
      (c) => c.name === pkg.packageName
    );

    return {
      name: pkg.packageName,
      monthlyPrice: pkg.monthlyPrice,
      currency: pkg.currency,
      configuration: config,
    };
  });

  const recommendedPackage = mapPackageType(response.defaultPackage) || undefined;

  return {
    provider: "gjensidige",
    providerName: "Gjensidige",
    vehicleInfo,
    customerName: response.customerName,
    packages,
    additionalPackages,
    recommendedPackage,
    discountPercentage: response.discountPercentage,
    fetchedAt: new Date(),
    raw: response,
  };
}
