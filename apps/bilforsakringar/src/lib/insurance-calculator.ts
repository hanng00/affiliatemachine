import type { Vehicle, InsuranceQuote, CoverageType } from "../types/insurance";
import { insuranceProviders } from "../types/insurance";

interface PriceFactors {
  basePrice: number;
  ageFactor: number;
  powerFactor: number;
  mileageFactor: number;
  ownersFactor: number;
}

function calculatePriceFactors(vehicle: Vehicle): PriceFactors {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicle.vehicleYear;

  const ageFactor = vehicleAge <= 2 ? 1.3 : vehicleAge <= 5 ? 1.1 : vehicleAge <= 10 ? 1.0 : 0.85;

  const powerHp = vehicle.powerHp || 100;
  const powerFactor = powerHp <= 100 ? 0.9 : powerHp <= 150 ? 1.0 : powerHp <= 200 ? 1.15 : 1.35;

  const mileage = vehicle.mileage || 15000;
  const mileageFactor = mileage <= 10000 ? 0.9 : mileage <= 20000 ? 1.0 : mileage <= 30000 ? 1.1 : 1.2;

  const owners = vehicle.numberOfOwners || 1;
  const ownersFactor = owners <= 2 ? 1.0 : owners <= 4 ? 1.05 : 1.1;

  const makeMultipliers: Record<string, number> = {
    volvo: 0.95,
    saab: 1.0,
    volkswagen: 1.0,
    toyota: 0.9,
    skoda: 0.95,
    bmw: 1.2,
    audi: 1.15,
    mercedes: 1.2,
    porsche: 1.5,
    tesla: 1.3,
  };

  const makeLower = vehicle.make.toLowerCase();
  const makeMultiplier = makeMultipliers[makeLower] || 1.0;

  const basePrice = 250 * makeMultiplier;

  return {
    basePrice,
    ageFactor,
    powerFactor,
    mileageFactor,
    ownersFactor,
  };
}

const providerPriceMultipliers: Record<string, Record<CoverageType, number>> = {
  folksam: { trafik: 1.0, halv: 1.02, hel: 1.0 },
  if: { trafik: 0.98, halv: 1.0, hel: 1.03 },
  "trygg-hansa": { trafik: 1.02, halv: 0.98, hel: 1.01 },
  lansforsakringar: { trafik: 1.01, halv: 1.01, hel: 0.97 },
  gjensidige: { trafik: 0.95, halv: 0.96, hel: 0.98 },
  "dina-forsakringar": { trafik: 0.97, halv: 0.99, hel: 1.02 },
};

const coverageBaseMultipliers: Record<CoverageType, number> = {
  trafik: 1.0,
  halv: 2.2,
  hel: 3.5,
};

const providerFeatures: Record<string, Record<CoverageType, string[]>> = {
  folksam: {
    trafik: ["Personskadeskydd", "24/7 skadeservice"],
    halv: ["Stöldskydd", "Brandskydd", "Glasskydd", "Bärgning 24/7", "Rättsskydd"],
    hel: ["Vagnskadeskydd", "Hyrbil i 45 dagar", "Nybilsvärde i 3 år", "Maskinskada tillval"],
  },
  if: {
    trafik: ["Personskadeskydd", "Snabb skadehantering"],
    halv: ["Stöldskydd", "Brandskydd", "Glasskydd utan självrisk", "Bärgning", "Rättsskydd"],
    hel: ["Vagnskadeskydd", "Hyrbil i 30 dagar", "Nybilsvärde i 2 år", "Allriskskydd tillval"],
  },
  "trygg-hansa": {
    trafik: ["Personskadeskydd", "Personlig rådgivare"],
    halv: ["Stöldskydd", "Brandskydd", "Glasskydd", "Bärgning", "Rättsskydd upp till 300 000 kr"],
    hel: ["Vagnskadeskydd", "Hyrbil i 60 dagar", "Nybilsvärde i 3 år", "Krisförsäkring"],
  },
  lansforsakringar: {
    trafik: ["Personskadeskydd", "Lokal service"],
    halv: ["Stöldskydd", "Brandskydd", "Glasskydd", "Bärgning", "Rättsskydd"],
    hel: ["Vagnskadeskydd", "Hyrbil i 45 dagar", "Nybilsvärde i 4 år", "Drulle-skydd tillval"],
  },
  gjensidige: {
    trafik: ["Personskadeskydd", "Låg premie"],
    halv: ["Stöldskydd", "Brandskydd", "Glasskydd", "Bärgning", "Rättsskydd"],
    hel: ["Vagnskadeskydd", "Hyrbil i 30 dagar", "Nybilsvärde i 2 år"],
  },
  "dina-forsakringar": {
    trafik: ["Personskadeskydd", "Personlig kontakt"],
    halv: ["Stöldskydd", "Brandskydd", "Glasskydd", "Bärgning", "Rättsskydd"],
    hel: ["Vagnskadeskydd", "Hyrbil i 45 dagar", "Nybilsvärde i 3 år", "Lokal skadehantering"],
  },
};

export function estimateInsuranceQuotes(
  vehicle: Vehicle,
  coverageType: CoverageType
): InsuranceQuote[] {
  const factors = calculatePriceFactors(vehicle);
  const baseFactor =
    factors.ageFactor * factors.powerFactor * factors.mileageFactor * factors.ownersFactor;

  const quotes: InsuranceQuote[] = insuranceProviders.map((provider) => {
    const providerMultiplier = providerPriceMultipliers[provider.id]?.[coverageType] || 1.0;
    const coverageMultiplier = coverageBaseMultipliers[coverageType];

    const randomVariation = 0.95 + Math.random() * 0.1;

    const monthlyPrice = Math.round(
      factors.basePrice * baseFactor * coverageMultiplier * providerMultiplier * randomVariation
    );

    const yearlyPrice = Math.round(monthlyPrice * 12 * 0.95);

    const deductibles: Record<CoverageType, number> = {
      trafik: 0,
      halv: 3000,
      hel: 4500,
    };

    return {
      provider,
      coverageType,
      monthlyPrice,
      yearlyPrice,
      deductible: deductibles[coverageType],
      features: providerFeatures[provider.id]?.[coverageType] || [],
      affiliateUrl: `${provider.affiliateUrl}?utm_source=bilforsakringar&utm_medium=affiliate&regno=${vehicle.regno}`,
    };
  });

  return quotes.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
