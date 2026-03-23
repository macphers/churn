# TODOS — Churn Rewards Platform

## P2 — Transfer Bonus Ingestion
**What:** Add `transferBonuses` section to VALUATIONS with active bonuses and expiry dates. Scoring engine multiplies transfer CPP by bonus multiplier when active.
**Why:** Bonuses (e.g., Amex 30% to Hilton) dramatically change which option is best.
**Effort:** M (human: ~3 days / CC: ~20 min)
**Depends on:** Scoring engine from Points Value Advisor plan
**Added:** 2026-03-17

## Completed

## P2 — "What Can I Afford?" Destination Browser
**What:** Static database of ~50-100 popular routes with point requirements. Cross-reference user balances to show achievable destinations.
**Why:** Inspires users to use points. Answers "I have 100k UR — where can I go?"
**Effort:** L (human: ~1 week / CC: ~45 min)
**Depends on:** Scoring engine, transfer partner database from Points Value Advisor plan
**Added:** 2026-03-17
**Completed:** v0.1.13.0 (2026-03-23) — Shipped as Trip Planner with 27 sweet spots, resolver engine, and tri-state categorization

## P3 — Redemption Journal
**What:** Let users log past redemptions (program, points used, what they got, actual cash value). System learns real WTP thresholds over time.
**Why:** Closes the feedback loop — advisor gets smarter with use.
**Effort:** M (human: ~4 days / CC: ~25 min)
**Depends on:** WTP model from Points Value Advisor plan
**Added:** 2026-03-17

## P2 — Screenshot AI Import (Balance Sync Phase 2)
**What:** "Snap and sync" button — user drops a screenshot of their loyalty dashboard, vision AI extracts the balance automatically.
**Why:** Removes tedium of manually typing balances while avoiding all scraping/credential problems. Natural next step after the checklist refresh flow.
**Effort:** M (human: ~1 week / CC: ~15 min)
**Depends on:** Phase 1 (staleness + checklist refresh) shipped first
**Added:** 2026-03-18

## P3 — Chrome Extension for Auto-Sync (Balance Sync Phase 3)
**What:** Chrome extension that detects when user visits a loyalty program website, reads the balance from the DOM, and syncs it to Osaka's localStorage.
**Why:** Closest thing to "real-time" balance syncing without a backend or credential storage. No legal risk since you're reading your own logged-in session.
**Effort:** XL (human: ~2-4 weeks / CC: ~1 hour)
**Depends on:** Phase 1 shipped. Start with top 5 programs (Chase, Amex, United, Delta, Marriott).
**Added:** 2026-03-18

## P2 — Create DESIGN.md (Formal Design System)
**What:** Run `/design-consultation` to document Churn's implicit design system — colors, typography, spacing, component vocabulary, animation language.
**Why:** Codebase has a strong implicit design system but nothing documented. Every new feature requires reverse-engineering patterns from CSS. The advisor UX simplification added 2 new components (verdict banner, tooltip) that expand the design vocabulary without a formal system to anchor to.
**Effort:** S (human: ~2 days / CC: ~30 min)
**Depends on:** Nothing — can be done anytime
**Added:** 2026-03-18
**Completed:** v0.1.12.0 (2026-03-18) — DESIGN.md created with full design system spec

## Deferred from osaka-v2 CEO Review (2026-03-17)
- Card application & approval tracking (5/24 status, signup bonus, minimum spend deadlines)
