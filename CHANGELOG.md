# Changelog

All notable changes to this project will be documented in this file.

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
