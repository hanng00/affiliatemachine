/**
 * Gjensidige form configuration - valid options for their API.
 * Source: https://cdn.gjensidige.no/claims-sweden/sweden-core/maps/webshop-se/car/...
 */

export interface FormOption {
  label: string;
  value: string;
  default?: boolean;
}

export interface YearlyKmOption extends FormOption {
  maxKm: number;
}

export const YEARLY_KM_OPTIONS: YearlyKmOption[] = [
  { label: "0 - 1 000 mil", value: "10", maxKm: 10000, default: true },
  { label: "1 001 - 1 400 mil", value: "14", maxKm: 14000 },
  { label: "1 401 - 1 600 mil", value: "16", maxKm: 16000 },
  { label: "1 601 - 2 000 mil", value: "20", maxKm: 20000 },
  { label: "2 001 - 2 600 mil", value: "26", maxKm: 26000 },
  { label: "2 601 - 3 000 mil", value: "30", maxKm: 30000 },
  { label: "Mer än 3 000 mil", value: "98", maxKm: Infinity },
];

export const DELKASKO_DEDUCTIBLE_OPTIONS: FormOption[] = [
  { label: "1 800 kr", value: "1", default: true },
  { label: "3 000 kr", value: "3" },
  { label: "5 000 kr", value: "5" },
];

export const VAGNSKADA_DEDUCTIBLE_OPTIONS: FormOption[] = [
  { label: "4 000 kr", value: "4", default: true },
  { label: "7 000 kr", value: "7" },
  { label: "10 000 kr", value: "10" },
];

export const DRIVER_UNDER_24_OPTIONS: FormOption[] = [
  { label: "Nej", value: "1" },
  { label: "Ja", value: "2" },
];

/**
 * Maps user's yearly km (in actual km) to Gjensidige's value.
 */
export function mapYearlyKm(kmPerYear: number): string {
  // Convert km to "mil" (Swedish miles = 10km)
  const mil = kmPerYear / 10;
  
  for (const opt of YEARLY_KM_OPTIONS) {
    if (mil <= opt.maxKm / 10) {
      return opt.value;
    }
  }
  return "98"; // More than 30,000 mil
}

/**
 * Maps our deductible preference to Gjensidige's vagnskada self-risk value.
 */
export function mapVagnskadaDeductible(pref: "low" | "medium" | "high"): string {
  switch (pref) {
    case "low":
      return "4";  // 4,000 kr
    case "medium":
      return "7";  // 7,000 kr
    case "high":
      return "10"; // 10,000 kr
  }
}

/**
 * Maps our deductible preference to Gjensidige's delkasko self-risk value.
 */
export function mapDelkaskoDeductible(pref: "low" | "medium" | "high"): string {
  switch (pref) {
    case "low":
      return "1"; // 1,800 kr
    case "medium":
      return "3"; // 3,000 kr
    case "high":
      return "5"; // 5,000 kr
  }
}

/**
 * Maps boolean to Gjensidige's driverUnder24 value.
 */
export function mapDriverUnder24(hasYoungDriver: boolean): string {
  return hasYoungDriver ? "2" : "1";
}
