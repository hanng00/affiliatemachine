/**
 * Loan math — the business core of the rantekollen (Räntekollen) site.
 *
 * Two questions, computed from the user's own entered debts plus sourced public
 * assumptions. No fabricated quotes: the binding rate always comes from the
 * bank/förmedlare. We only estimate. This is the safest content type under the
 * truth guardrail (CLAUDE.md) and marknadsföringslagen.
 *
 *  1. What does the abolished ränteavdrag cost you now?
 *     Until inkomstår 2024 you deducted 30 % of interest on unsecured loans
 *     (skattereduktion på underskott i kapital, 30 % up to 100 000 kr). 2025 it
 *     was halved to 15 %; from 1 Jan 2026 it is 0 for lån utan säkerhet. So the
 *     extra yearly cost vs. the old full-deduction world is annualInterest × 0.30
 *     (and vs. 2025 it is annualInterest × 0.15). Source: Skatteverket,
 *     "Avdrag för ränteutgifter"; Handelsbanken 2026 summary.
 *
 *  2. What would consolidating into one cheaper loan save?
 *     Weighted-average current rate vs. a target samlingslån rate, on the total
 *     balance → interest saved per year; plus the monthly-payment delta via the
 *     standard annuity formula. Consolidation rates ~4.5–14 % (förmedlare 2026:
 *     Sambla/Lendo/Advisa list from ~4.5 %); we default to a deliberately
 *     conservative target so the saving is never overstated.
 */

export type DebtType = "privatlan" | "kreditkort" | "smslan" | "delbetalning";

export interface DebtTypeMeta {
  id: DebtType;
  label: string;
  /** Typical nominal annual rate (%) used when the user doesn't know theirs. Sourced, conservative. */
  typicalRate: number;
}

/**
 * Typical Swedish rates per debt type (2026, deliberately mid/conservative).
 * Sources: Konsumentverket/Finansinspektionen rate caps (räntetak 22 % since
 * 2025-03), förmedlare published ranges, typical card APRs. These are defaults
 * the user can override with their actual rate.
 */
export const debtTypes: DebtTypeMeta[] = [
  { id: "privatlan", label: "Privatlån / blancolån", typicalRate: 9 },
  { id: "kreditkort", label: "Kreditkort", typicalRate: 19 },
  { id: "smslan", label: "Snabblån / SMS-lån", typicalRate: 21 },
  { id: "delbetalning", label: "Delbetalning (Klarna m.fl.)", typicalRate: 16 },
];

export interface Debt {
  /** Outstanding balance (SEK). */
  amount: number;
  /** Nominal annual interest rate (%). */
  rate: number;
  type?: DebtType;
}

export interface LoanAssumptions {
  /**
   * Target nominal rate (%) for the consolidated loan. Conservative default; the
   * actual rate is set by the bank after a credit check.
   */
  targetRate: number;
  /** Repayment term for the consolidated loan (years), for the monthly-payment view. */
  termYears: number;
  /**
   * Historic deduction rate that applied to unsecured-loan interest before the
   * phase-out (0.30 = the pre-2025 30 % skattereduktion). The 2026 removal of this
   * is the extra cost we surface.
   */
  removedDeductionRate: number;
}

/** Conservative, sourced defaults. */
export const defaultAssumptions: LoanAssumptions = {
  targetRate: 7.5,
  termYears: 8,
  removedDeductionRate: 0.3,
};

export interface LoanResult {
  /** Total outstanding balance across all debts (SEK). */
  totalDebt: number;
  /** Balance-weighted average current nominal rate (%). */
  weightedCurrentRate: number;
  /** Current total annual interest cost across all debts (SEK). */
  currentAnnualInterest: number;
  /**
   * Extra yearly cost now that the ränteavdrag is gone (SEK) — what you used to
   * get back via skattereduktion and no longer do (currentAnnualInterest ×
   * removedDeductionRate).
   */
  lostDeductionPerYear: number;
  /** Annual interest at the target consolidation rate (SEK). */
  consolidatedAnnualInterest: number;
  /** Interest saved per year by consolidating (SEK). */
  annualInterestSaving: number;
  /** Current total monthly payment (interest-only proxy + the card minimums are not modeled; this is the annuity at current weighted rate over the term). */
  currentMonthlyPayment: number;
  /** Monthly payment of the single consolidated annuity loan (SEK). */
  consolidatedMonthlyPayment: number;
  /** Monthly saving from consolidating (SEK). Can be ~0 or negative if current rate is already low. */
  monthlySaving: number;
  /** Whether consolidating plausibly helps (target rate is below the weighted current rate). */
  worthConsolidating: boolean;
}

const round = (n: number, dp = 0): number => {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
};

/**
 * Standard annuity monthly payment.
 * M = P · r(1+r)^n / ((1+r)^n − 1), r = monthly rate, n = months.
 * Falls back to straight amortization when the rate is ~0.
 */
export function annuityMonthlyPayment(
  principal: number,
  annualRatePct: number,
  termYears: number
): number {
  const n = Math.max(1, Math.round(termYears * 12));
  const r = annualRatePct / 100 / 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
}

export function calculateLoan(
  debts: Debt[],
  assumptions: LoanAssumptions = defaultAssumptions
): LoanResult {
  const a = assumptions;
  const clean = debts.filter((d) => d.amount > 0);

  const totalDebt = round(clean.reduce((s, d) => s + d.amount, 0));
  const currentAnnualInterest = round(
    clean.reduce((s, d) => s + d.amount * (d.rate / 100), 0)
  );
  const weightedCurrentRate =
    totalDebt > 0 ? round((currentAnnualInterest / totalDebt) * 100, 2) : 0;

  const lostDeductionPerYear = round(currentAnnualInterest * a.removedDeductionRate);

  const consolidatedAnnualInterest = round(totalDebt * (a.targetRate / 100));
  const annualInterestSaving = round(currentAnnualInterest - consolidatedAnnualInterest);

  const currentMonthlyPayment = round(
    annuityMonthlyPayment(totalDebt, weightedCurrentRate, a.termYears)
  );
  const consolidatedMonthlyPayment = round(
    annuityMonthlyPayment(totalDebt, a.targetRate, a.termYears)
  );
  const monthlySaving = round(currentMonthlyPayment - consolidatedMonthlyPayment);

  return {
    totalDebt,
    weightedCurrentRate,
    currentAnnualInterest,
    lostDeductionPerYear,
    consolidatedAnnualInterest,
    annualInterestSaving,
    currentMonthlyPayment,
    consolidatedMonthlyPayment,
    monthlySaving,
    worthConsolidating: a.targetRate < weightedCurrentRate,
  };
}

export function formatSek(n: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPct(n: number): string {
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 2 }).format(n)} %`;
}
