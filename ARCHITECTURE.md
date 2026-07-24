# Architecture

> 10,000ft: A monorepo of independent Swedish affiliate/comparison sites plus an internal analytics dashboard. Each site ships static to Cloudflare Pages; two sites add a Cloudflare Worker for dynamic data. Business logic lives in `domains/`, plumbing in `packages/`, composition in `apps/`.

## The Three Categories

Per [PHILOSOPHY.md](PHILOSOPHY.md), every package is exactly one of:

| Category | Location | Rule | Members |
|----------|----------|------|---------|
| **Apps** | `apps/*` | Compose domains + shared into a runnable site. Routing, layout, config. No business logic. | `admin`, `bilforsakringar`, `elsparkcyklar`, `robotdammsugare` |
| **Domains** | `domains/*` | Self-contained business capability. Owns its rules and contracts. | `insurance-providers` |
| **Shared** | `packages/*` | Pure technical infrastructure. Never contains business rules. Never imports from apps/domains. | `ui`, `analytics`, `seo`, `mdx` |

Imports are one-directional: `apps → domains → shared`. Shared never imports up.

## Golden Path

Two shapes of app:

**Static content site** (`elsparkcyklar`, `robotdammsugare`):
```
config/affiliates.ts (product data) → pages render via @affiliate/ui
  → @affiliate/analytics tracks affiliate-link clicks → Cloudflare Pages
```

**Dynamic comparison site** (`bilforsakringar`):
```
user enters reg no → Worker (Hono) → domains/insurance-providers registry
  → fan-out to IF / Gjensidige / TryggHansa → results cached in KV → rendered
```

`admin` is the odd one out: a single-page dashboard backed by its own Worker (Hono + D1) that aggregates portfolio metrics.

## Per-Unit Documentation

Load the relevant leaf doc when working in a unit:

- `apps/admin/APP.md`
- `apps/bilforsakringar/APP.md`
- `apps/elsparkcyklar/APP.md`
- `apps/robotdammsugare/APP.md`
- `domains/insurance-providers/DOMAIN.md`
- `packages/*` — shared infra; documented inline (obvious from code per PHILOSOPHY).

## Shared Package Map

| Package | Provides | Consumed by |
|---------|----------|-------------|
| `@affiliate/ui` | shadcn/ui primitives + layout | `elsparkcyklar`, `robotdammsugare` |
| `@affiliate/analytics` | GA4 + GTM init, `trackAffiliateClick` | content sites + `bilforsakringar` |
| `@affiliate/seo` | `SEOHead`, schema, sitemap | content sites + `bilforsakringar` |
| `@affiliate/mdx` | MDX provider + styled components | content sites |

> Note: each app increasingly vendors its own copy of shadcn primitives under `src/components/ui/` for per-site visual divergence. `@affiliate/ui` remains the source for layout and affiliate-specific components. See Decision Log.

## Deployment

Every app deploys independently to Cloudflare Pages via root `deploy:*` scripts. `bilforsakringar` and `admin` additionally deploy a Worker (`deploy:*-worker`).

## Decision Log

**2026-05-29: `insurance-providers` moved to `domains/`**
It enforces business rules (provider quoting, package mapping, form/session config), so by the PHILOSOPHY test it is a domain, not shared infrastructure. Moved out of `packages/` and added to the `domains/*` workspace glob and tsconfig paths. Shared infra (`ui`, `analytics`, `seo`, `mdx`) stays in `packages/`.

**2026-05-29: Kept shared infra in `packages/` rather than renaming to `shared/`**
`@affiliate/*` imports are path-aliased, so the folder name is cosmetic. Renaming would churn config for no functional gain. `packages/` = shared, `domains/` = business is a clear-enough split.
