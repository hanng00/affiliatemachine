# App: elsparkcyklar

> Electric-scooter affiliate site (elsparkcyklar.se): tests, comparisons, buying guide, and Swedish road-rules. Static — no Worker.

(See `README.md` for how-to-run/contribute. This file is internal composition detail.)

## Composition

- **React Router** (`BrowserRouter`) under a shared `Layout`:
  - `/` → `pages/index`
  - `/regler` → `pages/regler` (road rules)
- Config:
  - `src/config/site.ts` — name/domain, GTM/GA4 IDs, SEO meta, nav/footer links.
  - `src/config/affiliates.ts` — product catalog (Segway, Xiaomi, E-Wheels…) with specs, pros/cons, tracking URLs, and category/road-legal helpers. **This file is the content source.**
- Consumes `@affiliate/ui`, `@affiliate/mdx`, `@affiliate/analytics`, `@affiliate/seo`.

## Build / Deploy

Static Vite build → Cloudflare Pages. `deploy` = `vite build && npx wrangler pages deploy dist --project-name=elsparkcyklar`. No Worker.

## Known Gaps

`pages/jamfor.tsx` exists on disk but is not registered in `App.tsx`.

## Decision Log

**(initial): Content lives in `config/affiliates.ts`**
Single typed data file drives product rendering, keeping a new product a one-file edit.
