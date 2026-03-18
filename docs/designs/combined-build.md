# Combined Build: Rewards Intelligence + Points Value Advisor
Generated on 2026-03-17
Branch: realmm13/install-gstack
Merges: rewards-intelligence.md + points-value-advisor.md

## Overview
Single implementation pass that upgrades both index.html (rewards tracker) and
value.html (value advisor) with a shared program database.

## Files

```
output/
├── programs.js      [NEW]  — shared program database (16 programs, CPP,
│                             transfer partners, earn rates, surcharges,
│                             expiration rules, card definitions)
├── index.html       [MODIFY] — rewards tracker (schema v3, program picker,
│                               dollar values, earn rates)
├── value.html       [MODIFY] — value advisor (WTP, scoring, modes,
│                               household, decision-first cards)
└── tests/
    ├── test.html    [MODIFY] — index.html tests (add schema v3 migration,
    │                           program picker, earn rate tests)
    └── value-test.html [NEW] — value.html tests (28 tests for scoring,
                                WTP, modes, household)
```

## Shared: programs.js

Single source of truth for all program data. Both HTML files include via
`<script src="programs.js">`.

```js
// programs.js exposes: window.PROGRAMS
const PROGRAMS = {
  lastUpdated: "2026-03-17",
  programs: {
    "Chase Ultimate Rewards": {
      slug: "chase-ur",
      type: "flexible",          // flexible | airline | hotel
      currency: "points",
      cpp: 2.0,                  // best-case CPP (editorial consensus)
      fallbackOptions: [
        { type: "cash_back", cpp: 1.0, label: "Cash back" },
        { type: "travel_portal", cpp: 1.25, label: "Chase Travel portal" },
        ...
      ],
      transferPartners: [
        { partner: "World of Hyatt", ratio: "1:1", bestCpp: 2.2,
          sweetSpot: "...",
          surcharges: "low", flexibility: "high", availability: "high",
          cabinType: "hotel" },
        { partner: "British Airways Avios", ratio: "1:1", bestCpp: 1.6,
          sweetSpot: "...",
          surcharges: "high", flexibility: "medium", availability: "medium",
          cabinType: "economy" },
        ...
      ],
      cards: [
        { name: "Sapphire Preferred", annualFee: 95,
          earnRates: { dining: 3, travel: 2, groceries: 1, gas: 1,
                       streaming: 3, onlineShopping: 1, other: 1 } },
        { name: "Freedom Unlimited", annualFee: 0,
          earnRates: { dining: 3, travel: 1, groceries: 1, gas: 1,
                       streaming: 1, onlineShopping: 1, other: 1.5 } },
        ...
      ]
    },
    // ... 15 more programs
  },
  expirationRules: { ... }  // existing from value.html
};
```

## index.html Changes (osaka-v2 rewards intelligence)

### Schema v3 Migration
```
account: {
  id, programSlug, program, type, balance, currency,
  cpp,              // from PROGRAMS DB, user-editable
  accountNumber, lastUpdated, notes,
  cards: [{
    name,           // "Sapphire Preferred"
    annualFee,      // 95
    earnRates: { dining, travel, groceries, gas, streaming, onlineShopping, other }
  }]
}
```
Migration v2→v3: existing accounts get `programSlug: null`, `cpp: 1.0`, `cards: []`.

### Add Account Form
Progressive disclosure in one modal:
1. Program picker (searchable dropdown from PROGRAMS + "Custom")
2. Auto-filled fields (cpp, currency, type) from PROGRAMS
3. Balance + account number
4. Cards sub-section (checkboxes from PROGRAMS.cards, add custom)
5. Notes

### Dashboard
- Hero shows dollar value as primary number ("$3,145")
- Points Distribution chart shows dollar values
- Inline dollar value on every account card ("85,000 pts ≈ $1,700")
- Link to Value Advisor

### Features
- Transfer partner graph display on account detail
- Earn rate tracking per card (7 categories)
- Annual fee display and net value calculation

## value.html Changes (tokyo-v2 value advisor)

### Refactor
- Remove inline VALUATIONS constant → read from shared programs.js
- Refactor render() into composable functions
- Compute-once enriched accounts array

### New Engines
- applyWTP(rawValue, cabinType, prefs) — personal willingness-to-pay cap
- calcNetCpp(balance, bestCpp, surchargeData) — honest CPP with hidden costs
- scoreBFB(option, floor, prefs, mode) — bang-for-buck multi-factor scoring
- rankByMode(scoredOptions, mode) — re-weight scores per user mode

### New Features
- 7 user modes (max value, min cash, simple, travel now, no travel, expiring, luxury)
- User settings (cabin pref, hotel pref, WTP caps per cabin class, complexity)
- Household/player-two support (separate localStorage key: osaka_household)
- Decision-first recommendation cards (Best Overall, Best Simple, Best Non-Travel, Worth Saving)
- Surcharge/hidden cost modeling (inline in PROGRAMS per transfer partner)

### Data
- DEFAULT_PREFS constant with all fields — readPrefs() merges with defaults
- readHousehold() reads osaka_household key
- writeAgentResults() extended with BFB scores, mode, WTP adjustments

## Implementation Order

```
Phase 1: programs.js                          [CC: ~15 min]
  Extract VALUATIONS from value.html into programs.js
  Add card definitions and earn rates
  Add surcharge fields to transfer partners

Phase 2: index.html schema v3 + program picker [CC: ~30 min]
  Schema migration v2→v3
  Program picker dropdown from PROGRAMS
  Auto-fill CPP, type, currency on program select
  Cards sub-section with earn rates
  Dollar values on dashboard and account cards

Phase 3: value.html scoring engine             [CC: ~25 min]
  Switch from inline VALUATIONS to programs.js
  Implement applyWTP, calcNetCpp, scoreBFB, rankByMode
  Compute-once enriched accounts array
  Composable render functions

Phase 4: value.html UI features                [CC: ~20 min]
  Mode selector UI
  WTP settings form
  Household management
  Decision-first recommendation cards
  Worth Saving heuristic

Phase 5: Tests                                 [CC: ~15 min]
  index.html: schema v3 migration, program picker, earn rates (~15 tests)
  value.html: scoring, WTP, modes, household (~28 tests)

Phase 6: QA + design review                   [CC: ~30 min]
```

Total estimated: ~2.5 hours CC time

## Design Decisions (from Design Review)

### Shared Navigation
Thin top nav bar on both pages: app name + two tab links (Tracker | Advisor).
Active page highlighted. Same component on both pages so they feel like one product.

### Screen Hierarchy

**index.html Dashboard:**
```
[1] Hero: total dollar value ("$3,145") — largest text, primary focus
[2] Points Distribution chart — dollar values shown
[3] "Open Value Advisor →" link — secondary CTA
[4] Account cards grouped by type — each shows "85,000 pts ≈ $1,700"
```

**index.html Add Account Modal:**
```
Progressive disclosure — one modal, top to bottom:
[1] Program picker (searchable combobox, role="combobox", aria-expanded)
[2] Auto-filled fields (cpp, currency, type)
[3] Balance + account number
[4] Cards sub-section (collapsed by default, expand to see checkboxes)
[5] Notes
[6] Save button (sticky at bottom on mobile)

Mobile (<768px): full-screen bottom sheet with drag handle, sticky Save.
Desktop: centered modal with backdrop.
```

**value.html:**
```
[1] Hero: aggregate dollar value + delta from floor
[2] Mode selector: horizontally scrollable pill bar (7 modes)
    - Each pill has subtle icon + label
    - Arrow-key navigation (role="tablist")
    - Default: "Max Value"
[3] Left on Table section — per-account comparison bars
[4] Expiration warnings — accounts with expiry risk
[5] Recommendation cards — 2×2 grid desktop, single column mobile
    - Best Overall: FEATURED (larger), gold/amber accent, star icon
    - Best Simple: green accent, checkmark icon
    - Best Non-Travel: blue accent, dollar sign icon
    - Worth Saving: muted gray, clock icon
[6] By Account — expandable detail per account
[7] Sweet spots — transfer partner opportunities
[8] Settings — collapsible section at bottom
    - WTP caps (8 numeric inputs, 2-col desktop / 1-col mobile)
    - Cabin/hotel preferences
    - Complexity tolerance
    - Household management (reuses program picker)
[9] Freshness footer — data age indicator
```

### Interaction States

```
FEATURE                      | EMPTY STATE                         | ERROR STATE
-----------------------------|-------------------------------------|---------------------------
index.html Dashboard hero    | "$0" + "Add your first account" CTA | —
index.html Account list      | Warm message + "Add Account" CTA    | —
index.html Schema migration  | Spinner + "Upgrading…"              | "Migration failed, data
                             |                                     |  preserved" with retry
value.html (no accounts)     | Centered card: "Add your rewards    | —
                             | accounts first" + link to Tracker   |
                             | + brief "what this tool does" text  |
value.html Rec cards         | "Not enough data to recommend" +    | "Scoring unavailable,
                             | link to add accounts                | showing raw values"
value.html Household         | "Add player two" CTA + explanation  | —
value.html WTP settings      | DEFAULT_PREFS pre-filled            | —
```

### Recommendation Card States

**Worth Saving card** has two visual states:
- **"Wait"**: muted card, message "Worth waiting — your best option is only X%
  above floor value. Points don't expire, so patience costs nothing."
- **"Use now"**: urgent card with accent, message "Strong opportunity — act on
  this. [Top recommendation details]."

### Responsive Behavior
- **Add Account modal**: full-screen bottom sheet below 768px (drag handle, sticky Save)
- **Rec cards**: 2×2 grid → single column stack on mobile; Best Overall stays featured
- **Mode selector**: horizontally scrollable pill bar — native swipe on mobile
- **WTP settings**: 2-column grid → single column on mobile
- **Account cards**: single column below 768px

### Accessibility
- Mode selector: `role="tablist"` with `role="tab"` per pill, arrow-key nav
- Program picker: `role="combobox"` with `aria-expanded`, keyboard searchable
- WTP inputs: `<label>` with `for`, `inputmode="decimal"`
- Rec cards: `aria-label` per card describing recommendation type
- All interactive elements: 44px minimum touch targets
- Color accents on rec cards always paired with icons (no color-only encoding)
- Existing: `color-scheme: dark`, `focus-visible` outline, `prefers-reduced-motion`

### Design System (existing, inherit)
- Background: #0c0d12, Surface: #16181f, Accent: #3b82f6
- Font: Inter, body 15px, headings semibold
- Cards: 14px border-radius, 1px border rgba(255,255,255,0.06)
- Spacing: 8px base scale
- New accent colors for rec cards: gold/amber, green, blue, muted gray

## Key Decisions (from CEO + Eng reviews)
1. Shared programs.js — DRY, single source of truth
2. Surcharge data inline in program database — co-located, no sync bugs
3. Household in separate localStorage key — decoupled from index.html
4. WTP caps per cabin class (~8 settings) — simple, covers 90%
5. Compute-once pattern — DRY, clean render functions
6. Worth Saving uses simple heuristic — no expiry + marginal value = wait
7. DEFAULT_PREFS merge on read — handles upgrades seamlessly
