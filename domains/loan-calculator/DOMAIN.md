# Domain: loan-calculator

> Pure consumer-loan math for the rantekollen (Räntekollen) site. A list of the
> user's unsecured debts (amount + rate) → total debt, weighted-average rate,
> annual interest, the yearly cost of the **abolished ränteavdrag**, and the
> saving from consolidating into one cheaper loan. No I/O, no UI, no network —
> deterministic functions over published public assumptions.

## Why this is a domain (not app code)

A self-contained business capability: the same `calculateLoan()` could power the
rantekollen site, an admin estimate, or a future budgeting tool. Apps compose it;
it knows nothing about React, sliders, or analytics.

## Surface

- `calculateLoan(debts, assumptions?) → LoanResult` — the one entry point.
- `annuityMonthlyPayment(principal, annualRatePct, termYears)` — the standard annuity formula.
- `debtTypes` — the four unsecured debt types + a typical sourced rate for each (overridable).
- `defaultAssumptions` — conservative target rate, term, and the removed 30 % deduction.
- `formatSek`, `formatPct` — sv-SE display helpers.

## The two numbers (and why they're honest)

1. **Lost deduction / year** = `currentAnnualInterest × removedDeductionRate` (default 0.30).
   Until inkomstår 2024 you got a 30 % skattereduktion on interest on lån utan säkerhet;
   2025 it was 15 %; from **1 Jan 2026 it is 0**. That delta is a real, dated cost increase
   with no rate change. Source: Skatteverket "Avdrag för ränteutgifter".
2. **Consolidation saving** = current weighted interest − interest at a conservative target
   rate, plus the annuity monthly-payment delta over the term. Förmedlare (Sambla/Lendo/
   Advisa, 2026) publish rates from ~4.5 %; we default the target to 7.5 % so the saving is
   never overstated.

## The assumptions (all sourced, all overridable)

- Typical per-type rates (privatlån ~9 %, kreditkort ~19 %, snabblån ~21 %, delbetalning
  ~16 %) used only when the user doesn't know their own; räntetak is 22 % (FI, since 2025-03).
- Target consolidation rate 7.5 %, term 8 years — conservative defaults.
- Removed deduction rate 0.30 (the pre-2025 world); pass 0.15 to model vs. 2025.

These are **estimates, not quotes**. The binding rate always comes from the bank/förmedlare
after a credit check — the consuming app must never present output as a firm offer (truth
guardrail, marknadsföringslagen).

## Tests

`bun test domains/loan-calculator/` — covers empty/zero debts, balance-weighted averaging,
the 30 % lost-deduction arithmetic, a realistic multi-debt juggler, the "already cheap →
don't consolidate" case, the annuity formula (incl. 0 % straight amortization), term
sensitivity, and the overridable 15 % (2025) deduction rate.

## Decision Log

**(initial): surface the lost deduction as the hero, not just consolidation**
The 2026 ränteavdrag removal is the dated demand catalyst, so `lostDeductionPerYear` is a
first-class output computed straight from the user's own interest — quantified, sourced, and
independent of whether they choose to consolidate.

**(initial): conservative target rate (7.5 %) over the förmedlare floor (~4.5 %)**
Understating the saving keeps us safely inside the truth guardrail; the real (often better)
rate is set by the bank.
