import type {
  IfPriceResponse,
  IfMainProduct,
  IfProductPrice,
} from "./types";
import { IF_MAIN_PRODUCT_IDS } from "./types";
import type {
  QuoteResponse,
  InsurancePackage,
  PackageType,
  AdditionalPackage,
  PackageConfiguration,
  Coverage,
} from "../../types";

const COVERAGE_BY_TYPE: Record<PackageType, Coverage[]> = {
  trafik: [
    coverage("trafik", "Trafikförsäkring", "Ersätter skador du orsakar andra i trafiken"),
    coverage("trafikskatt", "Trafikskatt", "Trafikskatt ingår i premien"),
    coverage("krishjalp", "Krishjälp", "Psykologstöd vid olycka"),
  ],
  halv: [
    coverage("trafik", "Trafikförsäkring", "Ersätter skador du orsakar andra i trafiken"),
    coverage("glas", "Glasskador", "Reparation eller byte av rutor"),
    coverage("stold", "Stöldskydd", "Ersättning vid stöld eller inbrott"),
    coverage("brand", "Brandskydd", "Ersättning vid brand"),
    coverage("rattsskydd", "Rättsskydd", "Juridisk hjälp vid tvist"),
    coverage("bargning", "Bärgning", "Assistans och bärgning vid haveri"),
  ],
  hel: [
    coverage("trafik", "Trafikförsäkring", "Ersätter skador du orsakar andra i trafiken"),
    coverage("glas", "Glasskador", "Reparation eller byte av rutor"),
    coverage("stold", "Stöldskydd", "Ersättning vid stöld eller inbrott"),
    coverage("brand", "Brandskydd", "Ersättning vid brand"),
    coverage("vagnskada", "Vagnskada", "Skador på din egen bil"),
    coverage("rattsskydd", "Rättsskydd", "Juridisk hjälp vid tvist"),
    coverage("bargning", "Bärgning", "Assistans och bärgning vid haveri"),
  ],
};

function coverage(id: string, name: string, details: string): Coverage {
  return {
    id,
    name,
    descriptions: [{ title: name, details }],
  };
}

function mapProductIdToType(productId: number): PackageType | null {
  switch (productId) {
    case IF_MAIN_PRODUCT_IDS.trafik:
      return "trafik";
    case IF_MAIN_PRODUCT_IDS.halv:
      return "halv";
    case IF_MAIN_PRODUCT_IDS.hel:
      return "hel";
    default:
      return null;
  }
}

function buildConfiguration(type: PackageType, product: IfMainProduct): PackageConfiguration {
  const included = COVERAGE_BY_TYPE[type];
  const allHelCoverages = COVERAGE_BY_TYPE.hel.map((c) => c.id);
  const includedIds = new Set(included.map((c) => c.id));
  const excluded = COVERAGE_BY_TYPE.hel.filter((c) => !includedIds.has(c.id));

  return {
    type,
    code: String(product.id),
    name: product.displayName || product.name,
    description: packageDescription(type),
    includedCoverages: included,
    excludedCoverages: excluded.length > 0 ? excluded : [],
  };
}

function packageDescription(type: PackageType): string {
  switch (type) {
    case "trafik":
      return "Grundläggande försäkring som täcker skador du orsakar andra i trafiken.";
    case "halv":
      return "Inkluderar trafik plus skydd mot stöld, brand, glas och räddning.";
    case "hel":
      return "Komplett skydd som även täcker skador på din egen bil.";
  }
}

function parseVehicleFromDescription(description?: string): { make: string; model: string } {
  if (!description || description.length <= 7) {
    return { make: "Unknown", model: description || "Unknown" };
  }

  const parts = description.trim().split(/\s+/);
  return {
    make: parts[0] || "Unknown",
    model: parts.slice(1).join(" ") || "Unknown",
  };
}

function getDiscountPercentage(price: IfPriceResponse): number | undefined {
  for (const item of price.productPrices?.items ?? []) {
    const discount = item.priceInformation?.discountsInfos?.find(
      (d) => d.percentage && d.percentage > 0
    );
    if (discount?.percentage) return discount.percentage;
  }
  return undefined;
}

function getRecommendedPackage(products: IfMainProduct[]): PackageType | undefined {
  const recommended = products.find((p) => p.recommended);
  if (!recommended) return "halv";
  return mapProductIdToType(recommended.id) ?? "halv";
}

function mapMainPackages(
  price: IfPriceResponse
): InsurancePackage[] {
  const mainProducts = price.mainProducts?.items ?? [];
  const pricesById = new Map<number, IfProductPrice>(
    (price.productPrices?.items ?? []).map((p) => [p.productId, p])
  );

  const packages: InsurancePackage[] = [];

  for (const product of mainProducts) {
    const type = mapProductIdToType(product.id);
    if (!type) continue;

    const productPrice = pricesById.get(product.id);
    if (!productPrice) continue;

    packages.push({
      type,
      name: product.displayName || product.name,
      monthlyPrice: productPrice.monthlyPremium,
      yearlyPrice: productPrice.annualPremium,
      currency: productPrice.currency || "SEK",
      configuration: buildConfiguration(type, product),
    });
  }

  return packages;
}

function mapAddOns(price: IfPriceResponse): AdditionalPackage[] {
  return (price.addOns ?? []).map((addon) => ({
    name: addon.name,
    monthlyPrice: addon.monthlyPremium,
    currency: "SEK",
  }));
}

export function mapIfResponse(price: IfPriceResponse): QuoteResponse {
  const vehicleInfo = parseVehicleFromDescription(price.insuredObjectDescription);
  const mainProducts = price.mainProducts?.items ?? [];

  return {
    provider: "if",
    providerName: "If",
    vehicleInfo,
    packages: mapMainPackages(price),
    additionalPackages: mapAddOns(price),
    recommendedPackage: getRecommendedPackage(mainProducts),
    discountPercentage: getDiscountPercentage(price),
    fetchedAt: new Date(),
    raw: price,
  };
}
