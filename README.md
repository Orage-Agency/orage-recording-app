# Orage Recording App

iPad-optimized web app for recording video ads on shoot day.

Built for [Orage](https://flow.orage.agency) — used to pick scripts, view shot directions, edit on the fly, and check off recorded videos.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- File-based JSON storage (no database in v1)
- Deployed to Vercel

## Views

- `/` — Library (15 scripts, filterable)
- `/script/[id]` — Recording view with READ/EDIT modes
- `/hooks` — 50 verbal hooks bank (5 formulas)
- `/pre-hooks` — 5 pre-hook scenarios
- `/performance` — Performance dashboard
- `/trends`, `/pillars`, `/winners`, `/calendar` — v2 placeholders

## Run locally

```bash
npm install
npm run dev
```

## Edit brand

All brand variables are in [`/lib/brand.ts`](./lib/brand.ts) and CSS variables in [`/app/globals.css`](./app/globals.css).
