# Churn

Churn is a local-first rewards portfolio for people who actively manage credit cards, airline miles, hotel points, and transferable currencies.

It helps you answer a simple question: what is my rewards portfolio actually worth right now?

The app is designed for personal use, fast iteration, and eventual AI-assisted trip-planning workflows. Today it gives you a clean browser-based dashboard for balances, benefits, and value. Over time it can become the structured source of truth for more advanced redemption and travel intelligence.

## What the app does

Current product capabilities include:

- Tracking loyalty accounts across airlines, hotels, and flexible bank programs
- Storing balances, account metadata, and benefit details in a local-first model
- Estimating cash-equivalent value for rewards balances
- Providing a separate Value Advisor view for redemption guidance
- Trip Planner showing which flights and hotels your points can unlock right now
- Keeping everything browser-local with no required backend

The product is intentionally simple:

- Pure HTML/CSS/JS
- No framework
- No build step
- No database
- Browser storage via `localStorage`

## Quick start

### Requirements

- Node.js 22+
- npm 10+

No `npm install` step is required for basic local product development because the app server uses only Node built-ins.

### Run Churn locally

Use a fixed port so the browser keeps the same `localStorage` origin:

```bash
npm run dev -- --port 43110
```

Then open:

```text
http://127.0.0.1:43110/
```

Useful variants:

```bash
npm run dev:open -- --port 43110
npm run dev
```

Behavior:

- `npm run dev -- --port 43110` is strict and will fail if `43110` is already in use
- `npm run dev` will auto-find the next open port starting at `3000`

## Data and persistence

Churn is local-first.

- User data is stored in browser `localStorage`
- The current storage key is `churn_data`
- Data is scoped to the exact origin, including the port

That means these are different storage buckets:

- `http://127.0.0.1:43110/`
- `http://127.0.0.1:3000/`
- `http://localhost:43110/`

If you want stable local data while developing, keep using the same URL consistently.

## Repository layout

```text
.
├── output/
│   ├── index.html             # Rewards Tracker
│   ├── value.html             # Value Advisor
│   ├── trips.html             # Trip Planner
│   ├── shared.css             # Shared design tokens (colors, typography)
│   ├── programs.js            # Shared reward-program data
│   ├── sweetSpots.json        # Curated flight/hotel redemptions
│   └── tests/                 # Browser-side validation pages
├── scripts/
│   └── churn-dev-server.mjs   # Local dev server for the app
├── serve.sh                   # Quick-start local server
├── Start Churn.command         # macOS double-click launcher
├── docs/                      # Product and design notes
├── product-spec.md            # Product direction and scope
└── README.md
```

## Product architecture

The user-facing app is intentionally static and browser-native.

- `output/index.html` is the main rewards tracker
- `output/value.html` is the advisor view
- `output/trips.html` is the trip planner (what can I book with my points?)
- `output/shared.css` is the shared design token stylesheet (colors, typography)
- `output/programs.js` contains shared reward-program metadata
- `output/sweetSpots.json` contains curated flight and hotel sweet spots
- State persists locally and is shared across views through browser storage

This makes the app easy to:

- Run locally
- Ship as a static site
- Iterate on without tooling overhead
- Extend with richer rewards intelligence over time

## Development workflow

For product work:

1. Run `npm run dev -- --port 43110`
2. Edit files in `output/`
3. Refresh the browser
4. Keep the same origin if you want to preserve local test data

The product lives in `output/`. In practice, that is where most UI and feature work should happen.

## Testing

Current testing is lightweight and practical:

- `output/tests/test.html` — Tracker tests (schema migration, import/export, account management)
- `output/tests/value-test.html` — Advisor tests (scoring engine, WTP, household, recommendations)
- `output/tests/trips-test.html` — Trip Planner tests (resolver engine, filters, rendering)
- Local manual verification on a fixed port

The repo is optimized for fast iteration first.

## Deployment

The Churn app is static, which makes deployment straightforward.

The app is deployed to GitHub Pages via a workflow in `.github/workflows/pages.yml`. Every push to `master` publishes the `output/` directory.

Other deployment targets that work:

- Vercel
- Netlify
- Any static host that can serve `output/`

Recommended approach:

- Use `npm run dev -- --port 43110` for local development
- Push to `master` for automatic GitHub Pages deployment
- Or deploy `output/` to any static host for a shareable preview

## Current constraints

By design, the current app does not include:

- A backend
- Multi-user sync
- Authentication
- Cross-device persistence
- Real-time external loyalty integrations

That keeps the product fast, portable, and easy to reason about while the UX and rewards model continue to evolve.

## Roadmap direction

Planned and implied future work includes:

- Combined balance aggregation across transfer paths in Trip Planner
- Transfer bonus ingestion for time-limited promotions
- Points expiration intelligence
- Richer valuation logic
- Hosted preview deployments for easier sharing

## Design system

The visual design system is documented in [DESIGN.md](DESIGN.md) — colors, typography, spacing, and motion. All CSS values should reference DESIGN.md as the source of truth.

## Inspiration

This repository takes inspiration from product-minded, operator-friendly repos like `gstack`, but Churn is focused on a very different problem: building a durable, local-first rewards product rather than a general-purpose software factory.
