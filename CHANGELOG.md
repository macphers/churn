# Changelog

All notable changes to this project will be documented in this file.

## [0.1.15.0] - 2026-03-24

### Added
- Shared theme stylesheet (`output/shared.css`) so Tracker, Advisor, and Trips all consume one source of truth for core color and typography tokens
- Advisor trip bridge cards that map each account to current sweet spots from the Trips dataset, including direct-balance and transfer-path matches
- 24 browser test assertions covering tracker-side recommendation migration, non-destructive sidecar imports, advisor trip bridge rendering, and fetch-failure degradation

### Changed
- Moved advisor recommendation settings and household balance management into the Profile tab so the Advisor page now focuses on verdict, recommendations, and by-account guidance
- Advisor account cards now show inline expiration badges and tint trip bridge cards for at-risk balances

### Fixed
- Export/import now round-trips `valueAdvisorPrefs` and `churn_household` sidecar data without wiping newer settings when importing an older backup
- Profile edits now preserve legacy advisor preference objects instead of rewriting them with `surfaceMode: "auto"`

## [0.1.14.0] - 2026-03-23

### Added
- Advisor verdict banner on the Tracker dashboard with one-click jump back to the Value Advisor
- Expiration tracking now preserves a separate last-activity date so balance refreshes no longer reset inactivity estimates
- 7 updated browser test assertions covering advisor cache invalidation, last-activity handling, and the new tracker/advisor integration paths

### Changed
- Value Advisor now surfaces 3 user-facing recommendation styles instead of 7 internal scoring modes
- Advisor layout now leads with a verdict hero, plain-English recommendation cards, and clearer score labels
- Tracker hides stale advisor verdicts when balances change instead of showing cached guidance from an older portfolio

### Fixed
- Dashboard expiration badges now follow account activity dates instead of piggybacking on the last balance refresh timestamp
- Advisor expiration logic now prefers explicit activity dates when they exist

## [0.1.13.0] - 2026-03-23

### Added
- Trip Planner page (trips.html) — shows what flights and hotels your points can unlock
- Resolver engine categorizes 27 sweet spots into Book Now / Almost There / Not Enough based on account balances and transfer paths
- Sweet spots database (sweetSpots.json) with 15 flights and 12 hotels across 6 regions
- Filter by type (flights/hotels), region, and free-text search
- Transfer path receipts showing source program, ratio, and available points
- Dark mode support matching existing design system
- Mobile responsive layout at 375px
- 53 new test assertions for resolver engine, rendering, and filters (trips-test.html)
- "Trips" nav link on Tracker and Advisor pages

### Fixed
- Button padding on Advisor nav bar aligned with Tracker (11px 16px)

## [0.1.12.0] - 2026-03-18

### Added
- First-run welcome hero with setup checklist on Tracker page for new users
- Empty state CTAs across Tracker sections (accounts, benefits) to guide onboarding
- Inlined all CSS into each page for zero-dependency static deployment

### Changed
- Rewrote user-facing copy across Tracker and Advisor for clarity — replaced jargon (BFB, WTP, cpp) with plain English
- Advisor section headers simplified: "Left on table" → "Unrealized value", "Floor lift" → "Value over floor"
- Household and settings copy rewritten for accessibility to non-experts

### Fixed
- Uniform nav bar layout across Tracker and Advisor pages with centered links
- Form field alignment in add account modal — helper text no longer pushes paired fields
- Redundant "Back to tracker" link removed from Advisor header to reduce visual noise
- Nav refresh button hover state now visible on light background

### Removed
- External styles.css — styles are now inlined per page

## [0.1.11.0] - 2026-03-18

### Added
- Confirm dialog for account deletion to prevent accidental data loss
- 33 new test assertions covering account deletion cascade, benefit management, profile operations, data import/export, and custom card persistence (92 tracker tests total)

### Changed
- Replaced regex-based HTML sanitizer with DOMParser for stronger XSS protection and standards compliance

### Fixed
- XSS sanitization now uses browser's built-in HTML parser instead of regex pattern matching

## [0.1.10.0] - 2026-03-18

### Added
- Smart Balance Refresh: per-account staleness tracking with program-type thresholds (14d for airlines/hotels, 30d for flexible currencies)
- Refresh checklist modal with inline balance editing, sorted stale-first
- Login URLs for all 15 loyalty programs (Chase, Amex, Delta, United, Marriott, etc.) linking directly to account dashboards
- Staleness dots and explicit text labels ("Stale · 3w ago") on account cards
- Hero CTA chip showing count of accounts needing refresh
- Nav bar refresh icon with warning state when stale accounts exist
- Session-persistent check state in refresh modal (via sessionStorage)
- 25 new test assertions covering staleness logic, boundary cases, login URLs, and rendered output (66 total)
- 3 new TODOS: Screenshot AI Import (P2), Chrome Extension Auto-Sync (P3), DESIGN.md creation (P3)

### Fixed
- Escape key on refresh modal now properly triggers dashboard re-render
- Restored `role="progressbar"` and ARIA attributes on storage meter
- Restored `role="img"` and `aria-label` on chart card
