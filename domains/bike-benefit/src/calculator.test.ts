import { expect, test } from "bun:test";
import {
  calculateBenefit,
  annualBenefitValue,
  defaultAssumptions,
} from "./calculator";

test("zero price yields an empty, cost-free benefit", () => {
  const r = calculateBenefit({ bikePrice: 0 });
  expect(r.marketValue).toBe(0);
  expect(r.netCostTotal).toBe(0);
  expect(r.cashCostTotal).toBe(0);
  expect(r.savingTotal).toBe(0);
  expect(r.savingShare).toBe(0);
});

test("annual benefit value follows the Skatteverket method (20% + 3.55%)", () => {
  // 16 000 kr e-bike → 20% depreciation + 3.55% capital = 3 200 + 568 = 3 768.
  expect(annualBenefitValue(16_000)).toBe(3_768);
});

test("a förmånsvärde under the allowance is fully tax-free", () => {
  // 12 000 kr → 2 400 + 426 = 2 826 < 3 000 → taxable part is 0.
  const r = calculateBenefit({ bikePrice: 12_000 });
  expect(r.annualBenefitValueGross).toBe(2_826);
  expect(r.annualBenefitValueTaxable).toBe(0);
});

test("benefit-bike is cheaper than cash and saving rises with marginal tax", () => {
  const lowTax = calculateBenefit({ bikePrice: 25_000, marginalTaxRate: 0.32 });
  const highTax = calculateBenefit({ bikePrice: 25_000, marginalTaxRate: 0.52 });
  expect(lowTax.netCostTotal).toBeLessThan(lowTax.cashCostTotal);
  expect(highTax.netCostTotal).toBeLessThan(highTax.cashCostTotal);
  // Higher marginal tax → bigger discount.
  expect(highTax.savingShare).toBeGreaterThan(lowTax.savingShare);
  // Plausible Swedish range: roughly a third to two-thirds off.
  expect(highTax.savingShare).toBeGreaterThan(0.3);
  expect(highTax.savingShare).toBeLessThan(0.7);
});

test("an employer subsidy lowers the employee's net cost", () => {
  const noSub = calculateBenefit({ bikePrice: 20_000, employerSubsidyShare: 0 });
  const halfSub = calculateBenefit({ bikePrice: 20_000, employerSubsidyShare: 0.5 });
  expect(halfSub.netCostTotal).toBeLessThan(noSub.netCostTotal);
  expect(halfSub.grossDeductionMonthly).toBeLessThan(noSub.grossDeductionMonthly);
});

test("a longer term lowers the monthly gross deduction", () => {
  const short = calculateBenefit({ bikePrice: 24_000, termMonths: 24 });
  const long = calculateBenefit({ bikePrice: 24_000, termMonths: 36 });
  expect(long.grossDeductionMonthly).toBeLessThan(short.grossDeductionMonthly);
});

test("accessories are included in the market value and benefit base", () => {
  const withAcc = calculateBenefit({ bikePrice: 20_000, accessories: 2_000 });
  const without = calculateBenefit({ bikePrice: 20_000 });
  expect(withAcc.marketValue).toBe(22_000);
  expect(withAcc.annualBenefitValueGross).toBe(
    annualBenefitValue(22_000, defaultAssumptions)
  );
  expect(withAcc.cashCostTotal).toBeGreaterThan(without.cashCostTotal);
});
