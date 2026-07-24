# Domain: insurance-providers

> Fetches live Swedish car-insurance quotes from multiple providers behind one uniform interface. Given a registration number + personnummer, returns normalized package prices (trafik / halv / hel) per provider.

Package: `@affiliate/insurance-providers`. Consumed by `apps/bilforsakringar` (Worker).

## Contracts (`src/types.ts`)

The boundary is intentionally small:

- `QuoteRequest` (Zod) — `regno`, `personnummer`, `yearlyKm`, `driverUnder24`, `deductible`, optional `captchaToken`.
- `QuoteResult` — discriminated union: `{ success: true, data: QuoteResponse }` or `{ success: false, error: QuoteError }`.
- `QuoteResponse` — normalized shape every provider maps into: `packages[]` (typed `trafik | halv | hel`, monthly/yearly price), optional `additionalPackages`, `vehicleInfo`, `recommendedPackage`.

All provider-specific response shapes are mapped into these contracts. Callers never see provider-native formats.

## Structure

```
src/
├── index.ts                 # Public API + registers all providers on import
├── types.ts                 # Shared contracts (the boundary)
├── core/
│   ├── Provider.ts          # abstract InsuranceProvider (id, name, getQuote, getConfigurations)
│   └── ProviderRegistry.ts  # register/get + getQuoteFromAll / streamQuotes / getQuoteFrom
├── providers/
│   ├── if/                  # client, mapper, types, form-config, session (+ README)
│   ├── gjensidige/
│   └── trygghansa/
└── utils/browser-fetch.ts   # shared HTTP helper
```

Each provider folder follows the same layout: `client` (HTTP calls), `mapper` (native → `QuoteResponse`), `types` (native Zod schemas), `form-config` (endpoint IDs/constants), and where required `session` (auth/handshake).

## Golden Path

```
registry.getQuoteFromAll(request)
  → for each provider: provider.getQuote(request)
      → client fetches provider API
      → mapper normalizes to QuoteResponse
  → Promise.allSettled → QuoteResult[] (failures isolated per provider)
```

`streamQuotes(request, onResult)` is the SSE-friendly variant: emits each provider result as it lands instead of waiting for all.

## Adding a Provider

1. Create `src/providers/<name>/` with `client`, `mapper`, `types`, `form-config`.
2. Extend `InsuranceProvider`; implement `getQuote` (return `QuoteResult`) and `getConfigurations`.
3. Register it in `src/index.ts`.

The registry's `Promise.allSettled` isolates failures, so a broken provider never takes down the others.

## Notes & Constraints

- **IF** requires a reCAPTCHA token and uses a browser session; in `bilforsakringar` it runs via the Cloudflare Browser binding. See `providers/if/README.md`.
- Validation is Zod end-to-end: requests in, provider responses parsed before mapping.

## Decision Log

**2026-05-29: Promoted from `packages/` to `domains/`**
This package enforces business rules (quoting, package classification, provider handshakes), which the PHILOSOPHY assigns to domains, not shared infrastructure.

**(prior): Registry pattern with per-provider folders**
Uniform `InsuranceProvider` interface + registry keeps providers swappable and failures isolated (`Promise.allSettled`). Each provider self-contains its client/mapper/types so adding one touches a single folder.
