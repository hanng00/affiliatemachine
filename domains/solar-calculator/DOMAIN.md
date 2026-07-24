# Domain: solar-calculator

> Pure solar math for Swedish villa rooftops. Roof area (m²) → panels, kWp, annual
> production, system cost, grönt avdrag, savings, payback, CO₂. No I/O, no UI, no
> network — just deterministic functions over published public assumptions.

## Why this is a domain (not app code)

It's a self-contained business capability: the same `calculateSolar()` could power the
solceller site, an admin estimate, or a future energy app. Apps compose it; it knows
nothing about React, Leaflet, or analytics.

## Surface

- `calculateSolar(input, assumptions?) → SolarResult` — the one entry point.
- `defaultAssumptions` — conservative, sourced Swedish defaults (editable by the caller).
- `regions` — production multipliers (Norrland ~850 → södra Sverige ~1080 kWh/kWp).
- `formatSek`, `formatKwh` — sv-SE display helpers.

## The assumptions (all sourced, all overridable)

- ~950 kWh per installed kWp/year (Swedish average; Energimyndigheten).
- ~0.19 kWp per m² usable roof; a panel ≈ 2 m² ≈ 0.42 kWp → sized in **whole panels**.
- ~17 000 kr per installed kWp turnkey (villa average, 2026).
- Grönt avdrag: 15 % of the install, max 50 000 kr/person (Skatteverket); owners split it.
- Savings split self-consumed (retail price avoided) vs. sold surplus (lower sell price).

These are deliberately conservative estimates, **not quotes**. The binding price always
comes from the installer — the consuming app must never present output as a firm offer
(truth guardrail).

## Tests

`bun test domains/solar-calculator/` — covers empty roof, a typical 60 m² villa, grönt
avdrag arithmetic, payback range, usable-share sensitivity, and regional yield.

## Decision Log

**(initial): size by whole panels, not raw kWp**
A roof fits an integer number of ~2 m² panels. Flooring to whole panels makes the kWp,
cost and production map to a real install a homeowner could actually order.
