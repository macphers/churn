# Churn

Churn is a local-first rewards portfolio for people who actively manage credit cards, airline miles, hotel points, and transferable currencies.

It gives you a clean personal dashboard for balances, benefits, and redemption value today, while structuring that data so AI agents can reason about points, loyalty programs, and future trip planning workflows.

This repository contains two connected systems:

1. The Churn app itself, a pure HTML/CSS/JS product in `output/`
2. Pattaya, an autonomous build-and-review pipeline with a local control surface called Mission Control

If you only care about using or iterating on the app, start with `npm run dev`.

## What Churn does

Churn is designed to answer a simple question: what is my travel rewards portfolio actually worth right now?

Current product capabilities include:

- Tracking loyalty accounts across airlines, hotels, and flexible bank programs
- Storing balances, account metadata, and benefit details in a local-first data model
- Estimating cash-equivalent value for rewards balances
- Surfacing a separate Value Advisor view for redemption guidance
- Keeping everything browser-local with no required backend

The app is intentionally simple to run:

- Pure HTML/CSS/JS
- No framework
- No build step
- No database
- Browser storage via `localStorage`

## Why this repo looks unusual

This is not just an app repo.

The app lives alongside the tooling used to generate, critique, score, and iterate on it. The repo includes the product output, the product spec, the autonomous pipeline prompts, and the local operator UI used to run and compare parallel build attempts.

That split matters:

- `npm run dev` is for the Churn product
- `npm run dev:tool` is for Mission Control and the Pattaya pipeline

## Quick start

### Requirements

- Node.js 22+
- npm 10+
- Python 3

No `npm install` step is required for basic local product development because the app server uses only Node built-ins.

### Run the Churn app locally

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

### Run Mission Control locally

Mission Control is the local UI for Pattaya configuration, pipeline monitoring, scoring, diffing, and result review.

```bash
npm run dev:tool
```

This is separate from the product app on purpose.

## Data model and persistence

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
├── output/                    # Shippable Churn app
│   ├── index.html             # Rewards Tracker
│   ├── value.html             # Value Advisor
│   ├── programs.js            # Shared program data
│   └── tests/                 # Browser-side validation pages
├── scripts/
│   ├── churn-dev-server.mjs   # npm-run local server for the app
│   ├── setup-server.py        # Mission Control / Pattaya server
│   ├── open-local.py          # Local browser launcher helper
│   └── send-email.py          # Result delivery for pipeline runs
├── pipeline/                  # Pattaya phase prompts, styles, scoring
├── docs/                      # Build notes and design docs
├── product-spec.md            # Product source of truth
├── CLAUDE.md                  # Pattaya orchestration instructions
└── README.md
```

## Churn product architecture

The user-facing app is intentionally static and browser-native.

- `output/index.html` is the main rewards tracker
- `output/value.html` is the advisor view
- `output/programs.js` contains shared reward-program metadata
- State persists locally and is shared across views through browser storage

The product is optimized for:

- Personal use
- Fast local iteration
- Easy static deployment
- AI-readable structured data for future agent workflows

## Pattaya and Mission Control

Pattaya is the autonomous development pipeline in this repo.

It takes a product spec, spawns parallel implementation runs, moves them through plan/build/review/QA/fix/score phases, and promotes the best result back into `output/`.

Mission Control is the local operator UI that sits on top of that system. It handles:

- Pipeline configuration
- Email delivery configuration
- Run monitoring
- Round comparisons
- Diff inspection
- Winner selection and publish helpers

If you are here to work on the Churn app itself, you can ignore most of this and stay inside `output/` plus `npm run dev`.

## Development workflow

For product work:

1. Run `npm run dev -- --port 43110`
2. Edit files in `output/`
3. Refresh the browser
4. Keep the same origin if you want to preserve local test data

For pipeline work:

1. Run `npm run dev:tool`
2. Open Mission Control
3. Configure the pipeline
4. Run the autonomous build/review loop

## Testing

Current testing is lightweight and practical:

- Browser test pages in `output/tests/`
- Server and pipeline validation scripts in `tests/`
- Manual local verification via fixed-port app runs

The repo is set up for fast iteration first, with pipeline QA layered on top.

## Deployment

The Churn app is easy to deploy because it is static.

Good deployment targets:

- Vercel
- GitHub Pages
- Netlify
- Any static host that can serve `output/`

Recommended split:

- Deploy `output/` if you want a shareable product preview
- Keep Mission Control local unless you intentionally want to expose internal pipeline tooling

In other words: Vercel is a good fit for the product app, but it is not a substitute for a sane local development workflow.

## Current constraints

By design, the current app does not include:

- A backend
- Multi-user sync
- Authentication
- Cross-device persistence
- Real-time external loyalty integrations

That keeps the product fast, portable, and easy to reason about while the UX and reward model continue to evolve.

## Roadmap direction

Planned and implied future work includes:

- Better trip-planning and redemption recommendation flows
- Transfer partner reasoning
- Points expiration intelligence
- Richer valuation logic
- Potential hosted preview deployments for easier sharing

## Inspiration

This repo borrows some of its ambition and operator-oriented framing from `gstack`, but it is focused on a different problem:

- `gstack` is a general-purpose software factory
- Churn is a rewards product repo with its own embedded factory

The goal here is not just to ship a UI. It is to make the repo itself a durable operating environment for building, evaluating, and evolving that UI.
