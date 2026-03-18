# TODOS — Osaka/Tokyo Rewards Platform

## P2 — Transfer Bonus Ingestion
**What:** Add `transferBonuses` section to VALUATIONS with active bonuses and expiry dates. Scoring engine multiplies transfer CPP by bonus multiplier when active.
**Why:** Bonuses (e.g., Amex 30% to Hilton) dramatically change which option is best.
**Effort:** M (human: ~3 days / CC: ~20 min)
**Depends on:** Scoring engine from Points Value Advisor plan
**Added:** 2026-03-17

## P2 — "What Can I Afford?" Destination Browser
**What:** Static database of ~50-100 popular routes with point requirements. Cross-reference user balances to show achievable destinations.
**Why:** Inspires users to use points. Answers "I have 100k UR — where can I go?"
**Effort:** L (human: ~1 week / CC: ~45 min)
**Depends on:** Scoring engine, transfer partner database from Points Value Advisor plan
**Added:** 2026-03-17

## P3 — Redemption Journal
**What:** Let users log past redemptions (program, points used, what they got, actual cash value). System learns real WTP thresholds over time.
**Why:** Closes the feedback loop — advisor gets smarter with use.
**Effort:** M (human: ~4 days / CC: ~25 min)
**Depends on:** WTP model from Points Value Advisor plan
**Added:** 2026-03-17

## Deferred from osaka-v2 CEO Review (2026-03-17)
- Card application & approval tracking (5/24 status, signup bonus, minimum spend deadlines)
