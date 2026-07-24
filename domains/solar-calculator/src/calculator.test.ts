import { expect, test } from "bun:test";
import { calculateSolar, defaultAssumptions } from "./calculator";

test("zero roof area yields an empty system", () => {
  const r = calculateSolar({ roofAreaSqm: 0 });
  expect(r.panels).toBe(0);
  expect(r.kwp).toBe(0);
  expect(r.annualKwh).toBe(0);
  expect(r.netCost).toBe(0);
  expect(r.paybackYears).toBe(0);
});

test("a typical 60 m² villa roof sizes a sensible system", () => {
  // 60 m² drawn × 0.7 usable = 42 m² → 21 panels (2 m² each) → ~8.8 kWp.
  const r = calculateSolar({ roofAreaSqm: 60 });
  expect(r.panels).toBe(21);
  expect(r.kwp).toBeCloseTo(8.82, 2);
  // ~950 kWh/kWp → ~8 379 kWh/year.
  expect(r.annualKwh).toBeGreaterThan(8_000);
  expect(r.annualKwh).toBeLessThan(8_800);
});

test("grönt avdrag is 15% of gross and lowers the net cost", () => {
  const r = calculateSolar({ roofAreaSqm: 60 });
  expect(r.greenDeduction).toBe(Math.round(r.grossCost * 0.15));
  expect(r.netCost).toBe(r.grossCost - r.greenDeduction);
  expect(r.netCost).toBeLessThan(r.grossCost);
});

test("payback is positive and within a plausible Swedish range", () => {
  const r = calculateSolar({ roofAreaSqm: 60 });
  expect(r.paybackYears).toBeGreaterThan(5);
  expect(r.paybackYears).toBeLessThan(25);
});

test("usableShare override changes the panel count", () => {
  const conservative = calculateSolar({ roofAreaSqm: 100, usableShare: 0.5 });
  const generous = calculateSolar({ roofAreaSqm: 100, usableShare: 0.9 });
  expect(generous.panels).toBeGreaterThan(conservative.panels);
});

test("a higher-yield region produces more per kWp", () => {
  const base = calculateSolar({ roofAreaSqm: 60 });
  const sunny = calculateSolar(
    { roofAreaSqm: 60 },
    { ...defaultAssumptions, kwhPerKwpYear: 1080 }
  );
  expect(sunny.annualKwh).toBeGreaterThan(base.annualKwh);
});
