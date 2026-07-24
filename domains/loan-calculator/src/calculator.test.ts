import { expect, test } from "bun:test";
import {
  calculateLoan,
  annuityMonthlyPayment,
  defaultAssumptions,
  type Debt,
} from "./calculator";

test("no debts yields an all-zero result", () => {
  const r = calculateLoan([]);
  expect(r.totalDebt).toBe(0);
  expect(r.weightedCurrentRate).toBe(0);
  expect(r.currentAnnualInterest).toBe(0);
  expect(r.lostDeductionPerYear).toBe(0);
  expect(r.monthlySaving).toBe(0);
  expect(r.worthConsolidating).toBe(false);
});

test("zero-amount debts are ignored", () => {
  const r = calculateLoan([{ amount: 0, rate: 20 }]);
  expect(r.totalDebt).toBe(0);
  expect(r.currentAnnualInterest).toBe(0);
});

test("weighted average rate reflects balance, not a simple mean", () => {
  // 90 000 @ 10% + 10 000 @ 20% → weighted 11%, not the 15% simple mean.
  const debts: Debt[] = [
    { amount: 90_000, rate: 10 },
    { amount: 10_000, rate: 20 },
  ];
  const r = calculateLoan(debts);
  expect(r.totalDebt).toBe(100_000);
  expect(r.weightedCurrentRate).toBeCloseTo(11, 2);
  expect(r.currentAnnualInterest).toBe(11_000);
});

test("lost deduction is 30% of current interest by default (the 2026 change)", () => {
  const r = calculateLoan([{ amount: 100_000, rate: 15 }]);
  // 15 000 interest/year; old 30% skattereduktion = 4 500 now lost.
  expect(r.currentAnnualInterest).toBe(15_000);
  expect(r.lostDeductionPerYear).toBe(4_500);
});

test("a typical multi-debt juggler sees a real consolidation saving", () => {
  const debts: Debt[] = [
    { amount: 60_000, rate: 9 },   // privatlån
    { amount: 35_000, rate: 19 },  // kreditkort
    { amount: 15_000, rate: 21 },  // smslån
  ];
  const r = calculateLoan(debts);
  expect(r.totalDebt).toBe(110_000);
  // Weighted rate well above the 7.5% target → consolidation helps.
  expect(r.weightedCurrentRate).toBeGreaterThan(7.5);
  expect(r.worthConsolidating).toBe(true);
  expect(r.annualInterestSaving).toBeGreaterThan(0);
  expect(r.monthlySaving).toBeGreaterThan(0);
});

test("when current rate is already below target, consolidation does not help", () => {
  const r = calculateLoan([{ amount: 100_000, rate: 5 }]);
  expect(r.worthConsolidating).toBe(false);
  expect(r.annualInterestSaving).toBeLessThan(0);
});

test("annuity payment matches the closed-form formula", () => {
  // 100 000 @ 7.5% over 8 years (96 months) ≈ 1 391 kr/month.
  const m = annuityMonthlyPayment(100_000, 7.5, 8);
  expect(m).toBeGreaterThan(1_350);
  expect(m).toBeLessThan(1_430);
});

test("annuity handles a 0% rate as straight amortization", () => {
  const m = annuityMonthlyPayment(96_000, 0, 8);
  expect(m).toBeCloseTo(1_000, 0); // 96 000 / 96 months
});

test("a longer term lowers the monthly payment but is still positive", () => {
  const short = annuityMonthlyPayment(100_000, 7.5, 3);
  const long = annuityMonthlyPayment(100_000, 7.5, 12);
  expect(long).toBeLessThan(short);
  expect(long).toBeGreaterThan(0);
});

test("assumptions are overridable (e.g. the 2025 half-year 15% deduction)", () => {
  const r = calculateLoan([{ amount: 100_000, rate: 15 }], {
    ...defaultAssumptions,
    removedDeductionRate: 0.15,
  });
  expect(r.lostDeductionPerYear).toBe(2_250); // 15 000 × 0.15
});
