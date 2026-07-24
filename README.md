# Affiliate Machine

A monorepo for rapidly deploying Swedish affiliate sites. Ship fast, measure RPC, double down on winners.

## Stack

- **Runtime**: Bun (workspaces)
- **Framework**: Vite + React + React Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend** (where needed): Cloudflare Workers + Hono
- **Analytics**: Google Analytics 4 + GTM
- **Hosting**: Cloudflare Pages

## Structure

```
affiliatemachine/
├── apps/                       # Runnable sites (compose domains + shared, no business logic)
│   ├── admin/                  # Internal analytics dashboard (Worker + D1)
│   ├── bilforsakringar/        # Car insurance comparison (Worker + insurance domain)
│   ├── elsparkcyklar/          # Electric scooter affiliate site (static)
│   └── robotdammsugare/        # Robot vacuum affiliate site (static)
├── domains/                    # Self-contained business capabilities
│   └── insurance-providers/    # Multi-provider car insurance quoting
├── packages/                   # Shared infrastructure (no business rules)
│   ├── ui/                     # shadcn/ui primitives + layout
│   ├── analytics/              # GA4 + GTM helpers
│   ├── seo/                    # Meta tags, schema, sitemap
│   └── mdx/                    # MDX components and provider
└── package.json                # Workspace root
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the system overview and links to per-app (`APP.md`) and per-domain (`DOMAIN.md`) documentation.

## Getting Started

```bash
# Install dependencies
bun install

# Run a specific app (dev server)
bun run --cwd apps/elsparkcyklar dev

# Build a specific app
bun run --cwd apps/elsparkcyklar build
```

## Creating a New Site

1. Copy an existing app folder:
   ```bash
   cp -r apps/elsparkcyklar apps/new-site
   ```
2. Update `apps/new-site/package.json` with the new name.
3. Update `apps/new-site/src/config/site.ts` with site details.
4. Update `apps/new-site/src/config/affiliates.ts` with products.
5. Install and run:
   ```bash
   bun install
   bun run --cwd apps/new-site dev
   ```

## Deployment

Each app deploys independently to Cloudflare Pages. Root convenience scripts:

```bash
bun run deploy:elsparkcyklar
bun run deploy:robotdammsugare
bun run deploy:bilforsakringar          # Pages
bun run deploy:bilforsakringar-worker   # Cloudflare Worker (quote API)
bun run deploy:admin                     # Worker (SPA + API + D1)
```

## Key Metrics

Track these for each site:

- **RPC** (Revenue Per Click) — primary metric
- **CTR** (Click-Through Rate)
- **Traffic** (from Search Console)
- **Cost** (domain + any ads)
- **Profit** = Revenue − Cost
