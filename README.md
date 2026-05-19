# Affiliate Machine

A monorepo for rapidly deploying affiliate sites. Ship fast, measure RPC, double down on winners.

## Stack

- **Runtime**: Bun
- **Framework**: Vite + React
- **Styling**: Tailwind CSS + shadcn/ui
- **Analytics**: Google Analytics 4 + GTM
- **Hosting**: Cloudflare Pages

## Structure

```
affiliatemachine/
├── apps/                    # Individual affiliate sites
│   └── elsparkcyklar/       # Electric scooter comparison site
├── packages/
│   ├── ui/                  # Shared shadcn/ui components
│   ├── analytics/           # GA4 + GTM helpers
│   ├── seo/                 # Meta tags, schema, sitemap
│   └── mdx/                 # MDX components and provider
└── package.json             # Workspace root
```

## Getting Started

```bash
# Install dependencies
bun install

# Run a specific app
bun run --cwd apps/elsparkcyklar dev

# Build a specific app
bun run --cwd apps/elsparkcyklar build
```

## Creating a New Site

1. Copy an existing app folder:
   ```bash
   cp -r apps/elsparkcyklar apps/new-site
   ```

2. Update `apps/new-site/package.json` with new name

3. Update `apps/new-site/src/config/site.ts` with site details

4. Update `apps/new-site/src/config/affiliates.ts` with products

5. Install and run:
   ```bash
   bun install
   bun run --cwd apps/new-site dev
   ```

## Shared Packages

### @affiliate/ui

Shared UI components based on shadcn/ui:

- `Button`, `Card`, `Badge`, `Table` - Base components
- `AffiliateCard`, `ComparisonTable` - Affiliate-specific
- `Rating`, `ProsCons`, `PriceTag`, `CTAButton` - Product display
- `Header`, `Footer` - Layout components

### @affiliate/analytics

Google Analytics integration:

```tsx
import { initGA4, trackAffiliateClick } from "@affiliate/analytics";

// Initialize
initGA4({ measurementId: "G-XXXXXXXXXX" });

// Track clicks
trackAffiliateClick({
  affiliate_link_id: "product-123",
  destination_url: "https://...",
});
```

### @affiliate/seo

SEO utilities:

```tsx
import { SEOHead, SchemaScript } from "@affiliate/seo";

<SEOHead
  title="Page Title"
  description="Page description"
  canonical="https://example.com/page"
/>
```

### @affiliate/mdx

MDX support with styled components:

```tsx
import { MDXWrapper } from "@affiliate/mdx";
import Content from "./content.mdx";

<MDXWrapper>
  <Content />
</MDXWrapper>
```

## Deployment

Each app deploys independently to Cloudflare Pages:

1. Connect repo to Cloudflare Pages
2. Set build command: `bun run --cwd apps/[app-name] build`
3. Set output directory: `apps/[app-name]/dist`
4. Add custom domain

## Key Metrics

Track these for each site:

- **RPC** (Revenue Per Click) - Primary metric
- **CTR** (Click-Through Rate)
- **Traffic** (from Search Console)
- **Cost** (domain + any ads)
- **Profit** = Revenue - Cost
