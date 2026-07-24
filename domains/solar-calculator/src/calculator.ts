/**
 * Solar math — the business core of the solceller site.
 *
 * Every output is computed from the user's own drawn roof area plus published
 * Swedish public assumptions (Energimyndigheten, Skatteverket). No fabricated
 * quotes or savings: the binding quote comes from the partner installer. This
 * is the safest possible content type under the truth guardrail.
 *
 * Sources for the defaults (all editable by the caller):
 *  - Production: ~950 kWh per installed kWp/year (Swedish average; varies 800
 *    Norrland – 1100 Skåne). Energimyndigheten / 1KOMMA5°.
 *  - Panel density: ~2 m² per panel, ~0.42 kWp per modern panel → ~0.19 kWp/m²
 *    of usable roof. We size by usable area and round to whole panels.
 *  - System cost: ~17 000 kr per installed kWp (WattLab 2026 villa average).
 *  - Grönt avdrag: 15 % tax reduction on the install, max 50 000 kr/person.
 *  - Self-consumption vs. sold surplus priced separately (sold el is worth less).
 */

export interface SolarAssumptions {
  /** Annual production per installed kWp (kWh). */
  kwhPerKwpYear: number;
  /** Installed kWp per m² of usable roof. */
  kwpPerSqm: number;
  /** Turnkey system cost per installed kWp (SEK, before grönt avdrag). */
  costPerKwp: number;
  /** Grönt avdrag rate on the install. */
  greenDeductionRate: number;
  /** Max grönt avdrag per person (SEK). */
  greenDeductionMaxPerPerson: number;
  /** Number of owners sharing the deduction. */
  owners: number;
  /** Retail electricity price you avoid buying (SEK/kWh, incl. nät + skatt). */
  electricityPrice: number;
  /** Price you get paid for surplus sold to the grid (SEK/kWh). */
  sellPrice: number;
  /** Share of production used directly in the home (rest is sold). */
  selfConsumptionShare: number;
  /** Physical panel area used to convert area → whole panels (m²). */
  panelAreaSqm: number;
  /** kWp per physical panel. */
  panelKwp: number;
}

/** Conservative, sourced Swedish defaults for villa. */
export const defaultAssumptions: SolarAssumptions = {
  kwhPerKwpYear: 950,
  kwpPerSqm: 0.19,
  costPerKwp: 17_000,
  greenDeductionRate: 0.15,
  greenDeductionMaxPerPerson: 50_000,
  owners: 2,
  electricityPrice: 2.0,
  sellPrice: 0.7,
  selfConsumptionShare: 0.55,
  panelAreaSqm: 2.0,
  panelKwp: 0.42,
};

/**
 * BRF-specific assumptions (sourced: Brfpris.se, SolcellsGuide.se, 2026 data).
 *
 * Key differences from villa:
 * - Lower cost/kWp due to economies of scale (12 000–17 000 range, we use 14 000).
 * - No grönt avdrag (only for privatpersoner), but momsavdrag if IMD (handled separately).
 * - Higher self-consumption (60–80% with IMD, elevators, laundry, common lighting).
 * - More usable roof (flat roofs, fewer obstructions).
 */
export const brfAssumptions: SolarAssumptions = {
  kwhPerKwpYear: 950,
  kwpPerSqm: 0.19,
  costPerKwp: 14_000,
  greenDeductionRate: 0,
  greenDeductionMaxPerPerson: 0,
  owners: 1,
  electricityPrice: 2.0,
  sellPrice: 0.7,
  selfConsumptionShare: 0.7,
  panelAreaSqm: 2.0,
  panelKwp: 0.42,
};

/** Whether the BRF has IMD → momsavdrag (20% off gross cost). */
export function applyMomsavdrag(grossCost: number): number {
  return Math.round(grossCost * 0.2);
}

/** Regional production multipliers vs. the national ~950 kWh/kWp baseline. */
export const regions = [
  { id: "norr", label: "Norra Sverige", kwhPerKwpYear: 850 },
  { id: "mellan", label: "Mellansverige", kwhPerKwpYear: 950 },
  { id: "stockholm", label: "Stockholm/Mälardalen", kwhPerKwpYear: 1000 },
  { id: "syd", label: "Södra Sverige", kwhPerKwpYear: 1080 },
] as const;

export interface RoofInput {
  /** Drawn roof area in m² (from the map polygon). */
  roofAreaSqm: number;
  /** Share of the drawn roof actually usable for panels (shading, edges, vents). */
  usableShare?: number;
}

export interface SolarResult {
  /** Whole panels that fit the usable roof. */
  panels: number;
  /** Installed capacity (kWp). */
  kwp: number;
  /** Usable roof area after the usable-share haircut (m²). */
  usableAreaSqm: number;
  /** Estimated annual production (kWh). */
  annualKwh: number;
  /** System cost before grönt avdrag (SEK). */
  grossCost: number;
  /** Grönt avdrag applied (SEK). */
  greenDeduction: number;
  /** System cost after grönt avdrag (SEK). */
  netCost: number;
  /** Estimated first-year savings: avoided purchases + surplus sales (SEK). */
  annualSavings: number;
  /** Simple payback in years (netCost ÷ annualSavings). */
  paybackYears: number;
  /** CO2 avoided per year (kg), at the Nordic residual-mix proxy. */
  co2AvoidedKg: number;
}

const round = (n: number, dp = 0): number => {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
};

/** Nordic electricity CO2 proxy (kg CO2e per kWh avoided). Conservative. */
const CO2_PER_KWH = 0.05;

export function calculateSolar(
  input: RoofInput,
  assumptions: SolarAssumptions = defaultAssumptions
): SolarResult {
  const a = assumptions;
  const usableShare = input.usableShare ?? 0.7;
  const usableAreaSqm = Math.max(0, input.roofAreaSqm) * usableShare;

  // Size by whole panels so the result maps to a real install.
  const panels = Math.floor(usableAreaSqm / a.panelAreaSqm);
  const kwp = round(panels * a.panelKwp, 2);

  const annualKwh = round(kwp * a.kwhPerKwpYear);

  const grossCost = round(kwp * a.costPerKwp);
  const greenDeduction = round(
    Math.min(grossCost * a.greenDeductionRate, a.greenDeductionMaxPerPerson * Math.max(1, a.owners))
  );
  const netCost = round(grossCost - greenDeduction);

  const selfUsedKwh = annualKwh * a.selfConsumptionShare;
  const soldKwh = annualKwh - selfUsedKwh;
  const annualSavings = round(selfUsedKwh * a.electricityPrice + soldKwh * a.sellPrice);

  const paybackYears = annualSavings > 0 ? round(netCost / annualSavings, 1) : 0;
  const co2AvoidedKg = round(annualKwh * CO2_PER_KWH);

  return {
    panels,
    kwp,
    usableAreaSqm: round(usableAreaSqm, 1),
    annualKwh,
    grossCost,
    greenDeduction,
    netCost,
    annualSavings,
    paybackYears,
    co2AvoidedKg,
  };
}

export function formatSek(n: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatKwh(n: number): string {
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n)} kWh`;
}
