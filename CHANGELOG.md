# Changelog

All notable changes to this project will be documented in this file.

## [0.1.11.0] - 2026-03-18

### Added
- Confirm dialog for account deletion to prevent accidental data loss
- 33 new test assertions covering account deletion cascade, benefit management, profile operations, data import/export, and custom card persistence (92 tracker tests total)

### Changed
- Extracted shared CSS to separate styles.css stylesheet for DRY principle and easier maintenance
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
