/**
 * Förmånscykel-matematik — the business core of the bästaelcykeln site.
 *
 * Computes the net cost and saving of buying an e-bike through an employer's
 * benefit-bike scheme (bruttolöneavdrag / löneväxling) versus paying cash, plus
 * the taxable benefit value (förmånsvärde) per Skatteverket's method.
 *
 * Every output is derived from the user's own inputs (bike price, term, marginal
 * tax) plus published Swedish public assumptions (Skatteverket, Riksgälden). We
 * *estimate* — the binding figure (leasing offer, the employer's actual policy)
 * comes from the provider/employer, never from us. Safest content type under the
 * truth guardrail.
 *
 * Sources for the defaults (all editable by the caller):
 *  - Skattefritt förmånsvärde: upp till 3 000 kr/år är skattefritt; endast
 *    överskjutande del beskattas. (11 kap. 12 a § IL, sedan 2022-01-01.)
 *  - Värdeminskning elcykel: 20 % av marknadsvärdet inkl. batteri per år.
 *    (Skatteverkets ställningstagande för elcyklar.)
 *  - Kapitalkostnad: marknadsvärde × (statslåneräntan 30 nov året före + 1 pe).
 *    Statslåneräntan 2025-11-30 = 2,55 % → 3,55 % för inkomstår 2026. (Riksgälden.)
 *  - Arbetsgivaravgift: 31,42 % (används för arbetsgivarens kostnadsneutralitet,
 *    inte för den anställdes nettokostnad).
 *
 * The taxable benefit reduces the gross-salary saving: the employee swaps gross
 * salary for the bike, saving marginal tax on the deduction, but pays tax on the
 * part of the förmånsvärde that exceeds the 3 000 kr/year tax-free allowance.
 */

export interface BenefitAssumptions {
  /** Annual depreciation of an e-bike's market value (incl. battery). */
  depreciationRate: number;
  /** Capital-cost rate = statslåneränta (30 Nov prior year) + 1 percentage point. */
  capitalCostRate: number;
  /** Tax-free förmånsvärde allowance per year (SEK). */
  taxFreeAllowance: number;
  /** Employer payroll tax (arbetsgivaravgift), for the employer-cost view. */
  employerTaxRate: number;
}

/** Sourced Swedish defaults for inkomstår 2026. */
export const defaultAssumptions: BenefitAssumptions = {
  depreciationRate: 0.2,
  capitalCostRate: 0.0355,
  taxFreeAllowance: 3_000,
  employerTaxRate: 0.3142,
};

/** Common Swedish marginal-tax levels, for a quick selector. */
export const marginalTaxLevels = [
  { id: "low", label: "Cirka 32 % (under brytpunkten)", rate: 0.32 },
  { id: "mid", label: "Cirka 50 % (statlig skatt)", rate: 0.5 },
  { id: "high", label: "Cirka 52 % (statlig skatt + högsta kommunalskatt)", rate: 0.52 },
] as const;

/** Available leasing terms in months. */
export const termsMonths = [24, 36] as const;

export interface BenefitInput {
  /** E-bike market price incl. VAT and battery (SEK). */
  bikePrice: number;
  /** Accessories (helmet, lock, service add-ons) included in the lease (SEK). */
  accessories?: number;
  /** Lease term in months (the period the salary deduction runs). */
  termMonths?: number;
  /** Employee marginal tax rate (0–1). */
  marginalTaxRate?: number;
  /**
   * Share of the monthly cost the employer subsidises (0–1). Most schemes are
   * fully employee-funded via gross-salary deduction (0); some employers pay part.
   */
  employerSubsidyShare?: number;
}

export interface BenefitResult {
  /** Market value used as the förmånsvärde base (bike + accessories), SEK. */
  marketValue: number;
  /** Annual taxable benefit value before the tax-free allowance (SEK). */
  annualBenefitValueGross: number;
  /** Annual taxable benefit value after the 3 000 kr allowance (SEK). */
  annualBenefitValueTaxable: number;
  /** Monthly gross-salary deduction (the lease cost the employee swaps), SEK. */
  grossDeductionMonthly: number;
  /** Monthly net cost to the employee after tax effects (SEK). */
  netCostMonthly: number;
  /** Total net cost over the whole term (SEK). */
  netCostTotal: number;
  /** What the same bike + accessories would cost paid privately in cash (SEK). */
  cashCostTotal: number;
  /** Total saving vs. cash over the term (SEK). */
  savingTotal: number;
  /** Saving as a share of the cash cost (0–1) — the headline "rabatt". */
  savingShare: number;
}

const round = (n: number, dp = 0): number => {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
};

/**
 * Förmånsvärde for an e-bike (Skatteverket method):
 *   värdeminskning (20 % av marknadsvärdet) + kapitalkostnad (marknadsvärde × räntesats).
 * Service/tillbehör utöver cykeln läggs till marknadsvärdet här (förenklat).
 */
export function annualBenefitValue(
  marketValue: number,
  a: BenefitAssumptions = defaultAssumptions
): number {
  const depreciation = marketValue * a.depreciationRate;
  const capitalCost = marketValue * a.capitalCostRate;
  return round(depreciation + capitalCost);
}

export function calculateBenefit(
  input: BenefitInput,
  assumptions: BenefitAssumptions = defaultAssumptions
): BenefitResult {
  const a = assumptions;
  const bikePrice = Math.max(0, input.bikePrice);
  const accessories = Math.max(0, input.accessories ?? 0);
  const termMonths = input.termMonths ?? 36;
  const marginalTaxRate = input.marginalTaxRate ?? 0.5;
  const employerSubsidyShare = Math.min(1, Math.max(0, input.employerSubsidyShare ?? 0));

  const marketValue = bikePrice + accessories;

  // Taxable benefit, net of the tax-free allowance (can't go below 0).
  const annualBenefitValueGross = annualBenefitValue(marketValue, a);
  const annualBenefitValueTaxable = Math.max(0, annualBenefitValueGross - a.taxFreeAllowance);

  // The employee swaps gross salary equal to the lease cost. We model the lease
  // cost as the market value spread over the term (the employer's outlay the
  // employee funds); the employee pays the employee-funded share.
  const employeeFundedValue = marketValue * (1 - employerSubsidyShare);
  const grossDeductionMonthly = round(employeeFundedValue / termMonths);

  // Net cost = gross deduction less the marginal tax saved on it, PLUS the tax
  // paid on the taxable benefit value (monthly), scaled to the employee's share.
  const taxSavedMonthly = grossDeductionMonthly * marginalTaxRate;
  const benefitTaxMonthly =
    (annualBenefitValueTaxable / 12) * marginalTaxRate * (1 - employerSubsidyShare);
  const netCostMonthly = round(grossDeductionMonthly - taxSavedMonthly + benefitTaxMonthly);

  const netCostTotal = round(netCostMonthly * termMonths);

  // Cash baseline: the employee buys the same bike + accessories with taxed money.
  const cashCostTotal = round(employeeFundedValue);
  const savingTotal = round(cashCostTotal - netCostTotal);
  const savingShare = cashCostTotal > 0 ? round(savingTotal / cashCostTotal, 3) : 0;

  return {
    marketValue: round(marketValue),
    annualBenefitValueGross,
    annualBenefitValueTaxable,
    grossDeductionMonthly,
    netCostMonthly,
    netCostTotal,
    cashCostTotal,
    savingTotal,
    savingShare,
  };
}

export function formatSek(n: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPercent(share: number): string {
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(share * 100)} %`;
}
