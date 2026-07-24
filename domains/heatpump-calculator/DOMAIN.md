# Domain: heatpump-calculator

> The business core of varmepumpsguiden: Swedish heat-pump cost/savings math +
> a legally-sourced verified-installer directory. Apps render this; they never
> hold the math or the firm data.

## What it computes (`src/calculator.ts`)

For a house (`heatedAreaSqm` + `currentHeating`) and each system type, it returns:
`grossCost` (midpoint investering) · `rotDeduction` (30 % of the labour share, capped
at 50 000 kr × owners) · `netCost` · `driftPerYear` · `savingPerYear` (vs. current
heating) · `paybackYears`. `calculateAll` returns all systems sorted best-saving-first.

**System defaults** (varmekalkyl.se 2026, Energimyndigheten):

| System | Investering (före ROT) | SCOP | Coverage | Labour share |
|--------|------------------------|------|----------|--------------|
| luft/luft | 40–70k | 2.2 | 60 % | 30 % |
| luft/vatten | 100–160k | 3.0 | 95 % | 32 % |
| bergvärme | 170–230k (m. borrning) | 3.5 | 100 % | 35 % |

Heat demand baseline: ~120 kWh/m²·år; el price 2.0 kr/kWh; current-heating cost
scaled by a per-type factor (olja 1.15, direktel 1.0, …). All assumptions are
caller-overridable and sourced — no fabricated quotes (truth guardrail). The binding
price always comes from the installer.

## The verified-installer directory (`src/directory.ts`)

`installersFor(system, kommun)` returns active **F-skatt-verified** firms whose SNI
matches the system. **No review-platform scraping** (Reco/Trustpilot/Google = ToS +
copyright + GDPR). Firms come ONLY from free official sources:

- **Bolagsverket "värdefulla datamängder" API** — name, org-nr, verksamhet, SNI, status.
- **SCB företagsregister API** (free since 2025-06) — F-skatt/moms/arbetsgivar status, ort, SNI.

`sniBySystem` maps each system to relevant SNI (43.221 VVS, 42.210 mark/borrning, …).
The current `seed` is a placeholder so spine pages render/typecheck; **production
loader** (ops tooling, not yet built) writes the verified set into KV/D1 keyed by
kommun. "verified" = active F-skatt per SCB — a factual status, not an endorsement.

## Tests

`bun test` (`src/calculator.test.ts`): ROT capping, SCOP ordering (bergvärme cheapest
to run / biggest saving), sort order, baseline-cost-by-heating-type, zero-area edge,
and directory filtering (verified + kommun + SNI match).

## Decision Log

**(2026-06-18): Firm data from free official APIs, never scraped reviews**
Legal constraint (JOURNAL 2026-06-18): non-personal firm facts (name, org-nr, SNI,
F-skatt) are free and clean via Bolagsverket+SCB; review content is copyrighted +
personal data. The directory exposes only the former. Ratings, if ever added, must
come via an official partner/affiliate widget — never scraped text.
