/**
 * Heat-pump math — the business core of värmepumpsguiden.
 *
 * Every output is computed from the user's own house inputs (heated area,
 * current heating type) plus published Swedish public assumptions. We never
 * fabricate a quote: the binding price always comes from the installer. This is
 * the safest content type under the truth guardrail — and the computed depth
 * (investering + ROT + driftskostnad + besparing + återbetalning per system) is
 * the anti-thin moat that survives Google's scaled-content update.
 *
 * Sources for the defaults (all editable by the caller; researched 2026-06-18):
 *  - System prices, SCOP, drift: varmekalkyl.se 2026, Energimyndigheten.
 *      luft/luft   investering 40–70k, SCOP ~2.2 (covers ~60% of need)
 *      luft/vatten investering 100–160k, SCOP ~3.0
 *      bergvärme   investering 170–230k (incl. borrning), SCOP ~3.5
 *  - ROT-avdrag: 30 % tax reduction on the LABOUR cost only, max 50 000 kr/person
 *    and year (Skatteverket). Labour share differs by system (bergvärme borrning
 *    is labour-heavy → ~35%; air pumps ~30%).
 *  - Current heating cost baseline: direktel reference ~29 700 kr/yr for a typical
 *    villa (varmekalkyl). Oil/older systems cost more; scaled by heated area.
 */

export type SystemId = "luft-luft" | "luft-vatten" | "bergvarme";
export type HeatingId = "direktel" | "olja" | "fjarrvarme" | "vedpanna" | "annan";

export interface HeatPumpSystem {
  id: SystemId;
  /** Display name, e.g. "Bergvärme". */
  name: string;
  /** One-line description shown on system cards. */
  blurb: string;
  /** Turnkey investering range before ROT (SEK), for a typical villa. */
  investeringRange: [number, number];
  /** Labour share of the total — the ROT-eligible portion. */
  labourShare: number;
  /** Seasonal coefficient of performance (heat out ÷ el in). */
  scop: number;
  /** Share of the home's heat demand this system can realistically cover. */
  coverageShare: number;
  /** Expected service life (years). */
  lifeYears: number;
}

/** Sourced Swedish system defaults (varmekalkyl.se 2026). */
export const systems: HeatPumpSystem[] = [
  {
    id: "luft-luft",
    name: "Luft/luft-värmepump",
    blurb:
      "Billigast i inköp. Värmer luften via inomhusdelar – passar öppna planlösningar och som komplement till annan värme.",
    investeringRange: [40_000, 70_000],
    labourShare: 0.3,
    scop: 2.2,
    coverageShare: 0.6,
    lifeYears: 17,
  },
  {
    id: "luft-vatten",
    name: "Luft/vatten-värmepump",
    blurb:
      "Ansluts till vattenburet system och täcker både värme och varmvatten. Bra balans mellan pris och besparing.",
    investeringRange: [100_000, 160_000],
    labourShare: 0.32,
    scop: 3.0,
    coverageShare: 0.95,
    lifeYears: 18,
  },
  {
    id: "bergvarme",
    name: "Bergvärme",
    blurb:
      "Störst besparing och längst livslängd. Hämtar lagrad solvärme ur berget via borrhål – kräver borrning men ger lägst driftskostnad.",
    investeringRange: [170_000, 230_000],
    labourShare: 0.35,
    scop: 3.5,
    coverageShare: 1.0,
    lifeYears: 22,
  },
];

export interface HeatPumpAssumptions {
  /** ROT rate on the labour cost. */
  rotRate: number;
  /** Max ROT per person and year (SEK). */
  rotMaxPerPerson: number;
  /** Owners sharing the ROT-avdrag. */
  owners: number;
  /** Retail electricity price incl. nät + skatt (SEK/kWh). */
  electricityPrice: number;
  /** Annual heat demand per heated m² for a typical Swedish villa (kWh/m²). */
  heatDemandPerSqm: number;
}

/** Conservative, sourced Swedish defaults. */
export const defaultAssumptions: HeatPumpAssumptions = {
  rotRate: 0.3,
  rotMaxPerPerson: 50_000,
  owners: 2,
  electricityPrice: 2.0,
  heatDemandPerSqm: 120,
};

/**
 * Current-heating cost factor vs. the direktel reference (1.0). Older/fossil
 * systems cost more to run, which raises the savings from switching.
 */
export const heatingTypes: { id: HeatingId; label: string; costFactor: number }[] = [
  { id: "direktel", label: "Direktverkande el", costFactor: 1.0 },
  { id: "olja", label: "Oljepanna", costFactor: 1.15 },
  { id: "vedpanna", label: "Ved-/pelletspanna", costFactor: 0.85 },
  { id: "fjarrvarme", label: "Fjärrvärme", costFactor: 0.9 },
  { id: "annan", label: "Annan / vet ej", costFactor: 1.0 },
];

export interface HouseInput {
  /** Heated living area (m²). */
  heatedAreaSqm: number;
  /** Current heating system (drives the baseline running cost). */
  currentHeating: HeatingId;
}

export interface SystemResult {
  system: HeatPumpSystem;
  /** Midpoint investering before ROT (SEK). */
  grossCost: number;
  /** ROT-avdrag applied (SEK). */
  rotDeduction: number;
  /** Investering after ROT (SEK). */
  netCost: number;
  /** Estimated annual running cost with this pump (SEK). */
  driftPerYear: number;
  /** Estimated annual saving vs. current heating (SEK). */
  savingPerYear: number;
  /** Simple payback in years (netCost ÷ savingPerYear). */
  paybackYears: number;
}

const round = (n: number, dp = 0): number => {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
};

/** Annual heat demand (kWh) for the house. */
export function annualHeatDemandKwh(
  input: HouseInput,
  a: HeatPumpAssumptions = defaultAssumptions
): number {
  return Math.max(0, input.heatedAreaSqm) * a.heatDemandPerSqm;
}

/** Current annual heating cost (SEK) — the baseline we save against. */
export function currentHeatingCost(
  input: HouseInput,
  a: HeatPumpAssumptions = defaultAssumptions
): number {
  const demand = annualHeatDemandKwh(input, a);
  const factor = heatingTypes.find((h) => h.id === input.currentHeating)?.costFactor ?? 1.0;
  // Baseline assumes today's heat is bought at retail el-equivalent cost.
  return round(demand * a.electricityPrice * factor);
}

export function calculateSystem(
  system: HeatPumpSystem,
  input: HouseInput,
  a: HeatPumpAssumptions = defaultAssumptions
): SystemResult {
  const grossCost = round((system.investeringRange[0] + system.investeringRange[1]) / 2);

  const rotDeduction = round(
    Math.min(
      grossCost * system.labourShare * a.rotRate,
      a.rotMaxPerPerson * Math.max(1, a.owners)
    )
  );
  const netCost = round(grossCost - rotDeduction);

  const demand = annualHeatDemandKwh(input, a);
  const covered = demand * system.coverageShare;
  const uncovered = demand - covered;

  // El used by the pump to deliver the covered heat, plus retail el for the rest.
  const pumpElKwh = covered / system.scop;
  const driftPerYear = round((pumpElKwh + uncovered) * a.electricityPrice);

  const baseline = currentHeatingCost(input, a);
  const savingPerYear = round(baseline - driftPerYear);
  const paybackYears = savingPerYear > 0 ? round(netCost / savingPerYear, 1) : 0;

  return { system, grossCost, rotDeduction, netCost, driftPerYear, savingPerYear, paybackYears };
}

/** Compute every system for the house, best saving first. */
export function calculateAll(
  input: HouseInput,
  a: HeatPumpAssumptions = defaultAssumptions
): SystemResult[] {
  return systems
    .map((s) => calculateSystem(s, input, a))
    .sort((x, y) => y.savingPerYear - x.savingPerYear);
}

export function getSystem(id: string): HeatPumpSystem | undefined {
  return systems.find((s) => s.id === id);
}

export function formatSek(n: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n);
}
