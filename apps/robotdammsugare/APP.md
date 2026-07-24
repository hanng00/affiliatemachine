# App: robotdammsugare

> Robot-vacuum affiliate site (robotdammsugare.se): tests, comparisons, buying guide. Static — no Worker.

## Composition

- **React Router** (`BrowserRouter`) under a shared `Layout`:
  - `/` → `pages/index` (the only live route)
- Config:
  - `src/config/site.ts` — name/domain, SEO meta, og image, nav/footer links (GTM/GA4 empty).
  - `src/config/affiliates.ts` — robot-vacuum catalog (Roborock, Dreame, iRobot…) with vacuum-specific fields, a `userReviews` map, and filter helpers. **This file is the content source.**
- Consumes `@affiliate/ui`, `@affiliate/mdx`, `@affiliate/analytics`, `@affiliate/seo`. Local shadcn primitives under `src/components/ui/`.

## Build / Deploy

Static Vite build → Cloudflare Pages. `deploy` = `vite build && npx wrangler pages deploy dist --project-name=robotdammsugare --branch=production`. No Worker. (`--branch=production` is required: the Pages project's production branch is `production`; without the flag wrangler uses the local git branch `main`, which Cloudflare files as a Preview and never updates the live domain.)

## Known Gaps

`site.ts` nav references `/jamfor`, `/guide`, `/husdjur`, `/lagenheter`, but those page files were removed and are not routed. Only `/` is live. Trust `App.tsx`.

## Decision Log

**(initial): Content lives in `config/affiliates.ts`**
Single typed data file drives product rendering; adding a vacuum is a one-file edit.
