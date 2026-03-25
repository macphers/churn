# TODOS — Churn Rewards Platform

## P2 — Transfer Bonus Ingestion
**What:** Add `transferBonuses` section to VALUATIONS with active bonuses and expiry dates. Scoring engine multiplies transfer CPP by bonus multiplier when active.
**Why:** Bonuses (e.g., Amex 30% to Hilton) dramatically change which option is best.
**Effort:** M (human: ~3 days / CC: ~20 min)
**Depends on:** Scoring engine from Points Value Advisor plan
**Added:** 2026-03-17

## P2 — Trips Tab (Phase 2)
**What:** Destination browser tab that derives bookable trips from transfer partner sweet spots crossed with user balances. Includes region filters, type filters (flights/hotels), and deep links to the Advisor for per-destination analysis.
**Why:** Answers "I have 100k UR — where can I go?" by turning the existing programs.js transfer partner data into browsable destination cards. Makes the Advisor's intelligence visible without requiring users to understand scoring modes.
**Effort:** M (human: ~1 week / CC: ~30 min)
**Depends on:** Advisor simplification (Phase 1) shipped — Trips reads valueAdvisorResults and links to Advisor via URL params.
**Context:** CEO review (2026-03-23) decided to cut Trips from Phase 1 to ship Advisor UX simplification + Dashboard integration first. Trips was prototyped on branch realmm13/oh-design-session (53 tests, 98/100 QA) but not merged. That prototype can serve as a starting point. Key design decision: destinations derive dynamically from programs.js transfer partners, not a static route database.
**Added:** 2026-03-23

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

## Completed

### P2 — "What Can I Afford?" Destination Browser
**What:** Static database of ~50-100 popular routes with point requirements. Cross-reference user balances to show achievable destinations.
**Why:** Inspires users to use points. Answers "I have 100k UR — where can I go?"
**Effort:** L (human: ~1 week / CC: ~45 min)
**Depends on:** Scoring engine, transfer partner database from Points Value Advisor plan
**Added:** 2026-03-17
**Completed:** v0.1.13.0 (2026-03-23) — Shipped as Trip Planner with 27 sweet spots, resolver engine, and tri-state categorization

### P3 — Separate Activity Date Field
**What:** Add an `lastActivityDate` field to accounts, separate from `lastUpdated`.
**Why:** Expiration checking used `lastUpdated` as a proxy for account activity, leading to false "safe" signals.
**Effort:** S (human: ~1 day / CC: ~10 min)
**Added:** 2026-03-23
**Completed:** v0.1.14.0 (2026-03-23) — Expiration tracking now preserves a separate last-activity date

### P2 — Create DESIGN.md (Formal Design System)
**What:** Run `/design-consultation` to document Churn's implicit design system — colors, typography, spacing, component vocabulary, animation language.
**Why:** Codebase has a strong implicit design system but nothing documented. Every new feature requires reverse-engineering patterns from CSS. The advisor UX simplification added 2 new components (verdict banner, tooltip) that expand the design vocabulary without a formal system to anchor to.
**Effort:** S (human: ~2 days / CC: ~30 min)
**Depends on:** Nothing — can be done anytime
**Added:** 2026-03-18
**Completed:** v0.1.12.0 (2026-03-18) — DESIGN.md created with full design system spec

### P2 — Engine Extraction to Shared Module
**What:** Extract the scoring engine functions (applyWTP, calcNetCpp, scoreBFB, rankByMode, buildAnalysis, checkExpiration) from value.html into a shared engine.js file that both value.html and trips.html can import.
**Why:** Currently the engine lives inline in value.html. The Trips tab (Phase 2) needs to run buildAnalysis() directly. Duplicating 300+ lines of engine code across pages would be a DRY violation.
**Effort:** S (human: ~2 hrs / CC: ~10 min)
**Depends on:** Nothing — can be done before or alongside Trips Phase 2.
**Context:** CEO review (2026-03-23) identified this as a prerequisite for clean Trips integration. The engine functions are already pure (no DOM side effects) so extraction is mechanical — move functions to engine.js, add <script src="engine.js"> to both pages, update window.ChurnAdvisor exports.
**Added:** 2026-03-23
**Completed:** v0.1.18.0 (2026-03-25) — Shared engine.js now powers Advisor and Wallet, replacing the inline scoring implementation

## Deferred from osaka-v2 CEO Review (2026-03-17)
- Card application & approval tracking (5/24 status, signup bonus, minimum spend deadlines)
