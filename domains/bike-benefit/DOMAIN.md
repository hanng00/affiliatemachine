# Domain: bike-benefit

> Pure förmånscykel math for the bästaelcykeln site. Bike price + term + marginal
> tax → taxable benefit value (förmånsvärde), monthly net cost, and total saving vs.
> paying cash. No I/O, no UI, no network — deterministic functions over published
> Swedish public assumptions (Skatteverket, Riksgälden).

## Why this is a domain (not app code)

Self-contained business capability: the same `calculateBenefit()` could power the
bästaelcykeln site, an employer-facing tool, or an admin estimate. Apps compose it;
it knows nothing about React or analytics.

## Surface

- `calculateBenefit(input, assumptions?) → BenefitResult` — the one entry point.
- `annualBenefitValue(marketValue, assumptions?)` — the Skatteverket förmånsvärde.
- `defaultAssumptions` — sourced Swedish defaults for inkomstår 2026 (overridable).
- `marginalTaxLevels`, `termsMonths` — UI selectors.
- `formatSek`, `formatPercent` — sv-SE display helpers.

## The assumptions (all sourced, all overridable)

- **Skattefritt förmånsvärde**: upp till 3 000 kr/år skattefritt; endast överskjutande
  del beskattas (11 kap. 12 a § IL, sedan 2022-01-01).
- **Värdeminskning elcykel**: 20 % av marknadsvärdet inkl. batteri per år (Skatteverkets
  ställningstagande för elcyklar).
- **Kapitalkostnad**: marknadsvärde × (statslåneräntan 30 nov året före + 1 pe). SLR
  2025-11-30 = 2,55 % → **3,55 %** för inkomstår 2026 (Riksgälden).
- **Arbetsgivaravgift**: 31,42 % (only for the employer-cost view, not the employee net).

These are estimates, **not quotes**. The binding figure (the leasing offer, the
employer's actual policy) always comes from the provider/employer — the consuming
app must never present output as a firm offer (truth guardrail). Note the model also
omits SGI/pension effects of a lower gross salary, which the page discloses in copy.

## Tests

`bun test domains/bike-benefit/` — covers empty input, the förmånsvärde formula, the
tax-free allowance threshold, marginal-tax sensitivity, employer subsidy, term length,
and accessories.

## Decision Log

**(initial): model net cost as gross deduction − marginal tax + benefit tax**
The employee swaps gross salary for the bike (saving marginal tax on the deduction) but
pays tax on the part of the förmånsvärde above 3 000 kr/year. This is the saving the
provider calculators (Bikelease, Active Benefits) show, expressed from public rules so
we stay independent and sourced rather than vendor-biased.
