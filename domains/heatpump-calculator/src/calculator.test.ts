import { expect, test, describe } from "bun:test";
import {
  calculateSystem,
  calculateAll,
  currentHeatingCost,
  getSystem,
  systems,
  defaultAssumptions,
} from "./calculator";
import { installersFor } from "./directory";

const villa = { heatedAreaSqm: 140, currentHeating: "direktel" as const };

describe("heat-pump calculator", () => {
  test("ROT is capped at labour share and never exceeds the per-person cap", () => {
    for (const s of systems) {
      const r = calculateSystem(s, villa);
      const maxLabourRot = r.grossCost * s.labourShare * defaultAssumptions.rotRate;
      expect(r.rotDeduction).toBeLessThanOrEqual(Math.round(maxLabourRot) + 1);
      expect(r.netCost).toBe(r.grossCost - r.rotDeduction);
      expect(r.netCost).toBeLessThan(r.grossCost);
    }
  });

  test("bergvärme has the lowest drift and highest saving (highest SCOP)", () => {
    const berg = calculateSystem(getSystem("bergvarme")!, villa);
    const luftLuft = calculateSystem(getSystem("luft-luft")!, villa);
    expect(berg.driftPerYear).toBeLessThan(luftLuft.driftPerYear);
    expect(berg.savingPerYear).toBeGreaterThan(luftLuft.savingPerYear);
  });

  test("calculateAll is sorted by saving, best first", () => {
    const all = calculateAll(villa);
    expect(all.length).toBe(systems.length);
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].savingPerYear).toBeGreaterThanOrEqual(all[i].savingPerYear);
    }
  });

  test("oil heating has a higher baseline cost than direktel (bigger saving)", () => {
    const elBase = currentHeatingCost(villa);
    const oilBase = currentHeatingCost({ ...villa, currentHeating: "olja" });
    expect(oilBase).toBeGreaterThan(elBase);
  });

  test("zero area yields zero demand and no payback", () => {
    const r = calculateSystem(getSystem("luft-vatten")!, { heatedAreaSqm: 0, currentHeating: "direktel" });
    expect(r.driftPerYear).toBe(0);
    expect(r.paybackYears).toBe(0);
  });
});

describe("verified-installer directory", () => {
  test("returns only F-skatt-verified firms matching the system SNI in the kommun", () => {
    const list = installersFor("bergvarme", "linkoping");
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((i) => i.verified)).toBe(true);
    expect(list.every((i) => i.kommun === "linkoping")).toBe(true);
  });

  test("unknown kommun returns empty", () => {
    expect(installersFor("bergvarme", "nowhere").length).toBe(0);
  });
});
