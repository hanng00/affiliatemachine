import type {
  TryggHansaValidationResponse,
  TryggHansaCalculationResponse,
  TryggHansaProductPackage,
} from "./types";
import type {
  QuoteResponse,
  InsurancePackage,
  PackageType,
  AdditionalPackage,
  PackageConfiguration,
  Coverage,
} from "../../types";

function mapPackageType(tryggHansaType: string): PackageType | null {
  switch (tryggHansaType) {
    case "MotoringInsurance":
      return "trafik";
    case "HalfInsurance":
      return "halv";
    case "ComprehensiveInsurance":
      return "hel";
    default:
      return null;
  }
}

function mapPackageName(type: PackageType): string {
  switch (type) {
    case "trafik":
      return "Trafikförsäkring";
    case "halv":
      return "Halvförsäkring";
    case "hel":
      return "Helförsäkring";
  }
}

function mapPackageDescription(type: PackageType): string {
  switch (type) {
    case "trafik":
      return "Grundläggande försäkring som täcker skador du orsakar andra i trafiken.";
    case "halv":
      return "Inkluderar trafik plus skydd mot stöld, brand, glas och räddning.";
    case "hel":
      return "Komplett skydd som även täcker skador på din egen bil.";
  }
}

// Map Swedish coverage names to readable descriptions
function mapCoverageElement(element: string): Coverage {
  const coverageMap: Record<string, { name: string; description: string }> = {
    "TRAFIK": { name: "Trafikförsäkring", description: "Ersätter skador du orsakar andra i trafiken" },
    "SKATTEKOSTNAD TRAFIK": { name: "Trafikskatt", description: "Trafikskatt ingår i premien" },
    "KRISHJÄLP": { name: "Krishjälp", description: "Psykologstöd vid olycka" },
    "GLASRUTOR": { name: "Glasskador", description: "Reparation eller byte av rutor" },
    "DRULLE": { name: "Drulleförsäkring", description: "Skydd mot oavsiktliga skador" },
    "RÄTTSSKYDD": { name: "Rättsskydd", description: "Juridisk hjälp vid tvist" },
    "BÄRGNING": { name: "Bärgning", description: "Assistans och bärgning vid haveri" },
    "STÖLD OCH INBROTT": { name: "Stöldskydd", description: "Ersättning vid stöld eller inbrott" },
    "BRAND": { name: "Brandskydd", description: "Ersättning vid brand" },
    "VAGNSKADA": { name: "Vagnskada", description: "Skador på din egen bil" },
    "PRIVAT VÅRD": { name: "Privat vård", description: "Tillgång till privat sjukvård" },
    "HYRBIL": { name: "Hyrbil", description: "Hyrbil under reparation" },
    "SJR.RAB 3500": { name: "Sänkt självrisk", description: "Lägre självrisk vid skada" },
    "SJR.RAB 50 PROCENT": { name: "Halverad självrisk", description: "50% lägre självrisk" },
  };

  const mapped = coverageMap[element];
  const id = element.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  
  return {
    id,
    name: mapped?.name || element,
    descriptions: [{
      title: mapped?.name || element,
      details: mapped?.description || element,
    }],
  };
}

function parseVehicleDetails(makeAndModel: string): { make: string; model: string } {
  // Format: "VOLVO F + V60 V60" -> make: "Volvo", model: "V60"
  const parts = makeAndModel.split(" ");
  const make = parts[0] ? parts[0].charAt(0) + parts[0].slice(1).toLowerCase() : "Unknown";
  
  // Try to extract model - usually after the brand code
  const modelParts = parts.slice(1).filter(p => !p.includes("+") && p.length > 1);
  const model = modelParts.length > 0 ? modelParts[modelParts.length - 1] : "Unknown";
  
  return { make, model };
}

function buildPackageConfiguration(pkg: TryggHansaProductPackage, type: PackageType): PackageConfiguration {
  const includedCoverages = pkg.baseProductElements.map(mapCoverageElement);
  
  // Determine excluded coverages based on package type
  const allCoverages = ["VAGNSKADA", "GLASRUTOR", "STÖLD OCH INBROTT", "BRAND", "BÄRGNING", "RÄTTSSKYDD", "DRULLE"];
  const excludedElements = allCoverages.filter(
    c => !pkg.baseProductElements.includes(c)
  );
  const excludedCoverages = excludedElements.map(mapCoverageElement);

  return {
    type,
    code: pkg.productPackageType,
    name: mapPackageName(type),
    description: mapPackageDescription(type),
    includedCoverages,
    excludedCoverages,
  };
}

function mapProductPackage(pkg: TryggHansaProductPackage): InsurancePackage | null {
  const type = mapPackageType(pkg.productPackageType);
  if (!type) return null;

  return {
    type,
    name: mapPackageName(type),
    monthlyPrice: pkg.premiums.totalPremiums.monthlyPremium,
    yearlyPrice: pkg.premiums.totalPremiums.yearlyPremium,
    currency: "SEK",
    configuration: buildPackageConfiguration(pkg, type),
  };
}

function mapAdditionalProducts(pkg: TryggHansaProductPackage): AdditionalPackage[] {
  return pkg.additionalProducts.map((ap) => ({
    name: mapAdditionalProductName(ap.productTypeCode),
    monthlyPrice: ap.premiums.monthlyPremium,
    currency: "SEK",
  }));
}

function mapAdditionalProductName(code: string): string {
  switch (code) {
    case "RehabilitationTraffic":
      return "Privat vård";
    case "CarRental":
      return "Hyrbil";
    case "ReducedDeductible":
      return "Sänkt självrisk";
    case "ExtensivePackage":
      return "Utökat paket";
    default:
      return code;
  }
}

function getRecommendedPackage(preselection: string | undefined): PackageType | undefined {
  if (!preselection) return undefined;
  
  if (preselection.includes("HalfInsurance")) return "halv";
  if (preselection.includes("Comprehensive")) return "hel";
  if (preselection.includes("Motoring") || preselection.includes("Traffic")) return "trafik";
  
  return "halv"; // Default recommendation
}

function getDiscountPercentage(packages: TryggHansaProductPackage[]): number | undefined {
  for (const pkg of packages) {
    if (pkg.campaign?.percentageDiscount) {
      return pkg.campaign.percentageDiscount;
    }
  }
  return undefined;
}

export function mapTryggHansaResponse(
  validation: TryggHansaValidationResponse,
  calculation: TryggHansaCalculationResponse
): QuoteResponse {
  const vehicleInfo = {
    ...parseVehicleDetails(validation.vehicle.makeAndModel),
    year: validation.vehicle.yearModel,
  };

  const packages: InsurancePackage[] = calculation.productPackages
    .map(mapProductPackage)
    .filter((pkg): pkg is InsurancePackage => pkg !== null);

  // Get additional packages from the most comprehensive package (helförsäkring)
  const comprehensivePackage = calculation.productPackages.find(
    (p) => p.productPackageType === "ComprehensiveInsurance"
  );
  const additionalPackages = comprehensivePackage
    ? mapAdditionalProducts(comprehensivePackage)
    : undefined;

  return {
    provider: "trygghansa",
    providerName: "Trygg-Hansa",
    vehicleInfo,
    customerName: validation.customer.firstName,
    packages,
    additionalPackages,
    recommendedPackage: getRecommendedPackage(calculation.packagePreselection),
    discountPercentage: getDiscountPercentage(calculation.productPackages),
    fetchedAt: new Date(),
    raw: { validation, calculation },
  };
}
