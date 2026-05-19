# Elsparkcyklar

Affiliate site for comparing electric scooters in Sweden.

## Development

```bash
# From repo root
bun install
bun run --cwd apps/elsparkcyklar dev
```

## Configuration

- `src/config/site.ts` - Site metadata, Google IDs, navigation
- `src/config/affiliates.ts` - Affiliate products and tracking URLs

## Adding Content

1. Add new products to `src/config/affiliates.ts`
2. Create new pages in `src/pages/`
3. For MDX content, create files in `src/content/sv/`

## Deployment

Deploy to Cloudflare Pages:

```bash
bun run --cwd apps/elsparkcyklar build
# Output in dist/
```
