# Build Instructions: Combined Rewards Intelligence + Points Value Advisor

Generated: 2026-03-17
Branch: realmm13/install-gstack
Repo: macphers/churn (workspace: churn)

## What You're Building

A credit card rewards tracking platform with two pages sharing a program database:

1. **index.html** (Rewards Tracker) — users add loyalty accounts, see balances in dollar values
2. **value.html** (Value Advisor) — personalized recommendations for how to use points
3. **programs.js** (NEW) — shared program database both pages consume

All files live in `output/`. Pure HTML/CSS/JS, no frameworks, no build step. Data persists in localStorage.

## Current State of the Codebase

### output/index.html (655 lines)
Rewards tracker. Schema v2 with `SCHEMA_VERSION=2`, `STORAGE_KEY='churn_data'`.

Key existing functions:
- `render()` — main render, dispatches to renderDashboard/renderAccounts/renderBenefits/renderProfile
- `saveAccount()` — saves account to localStorage
- `openAccountModal()` — opens add/edit modal
- `migrateData()` — currently handles v1→v2
- `defaultData()` — returns `{ _version: 2, accounts: [], benefits: [], profile: {...} }`

Current account schema (v2):
```js
{ id, program, type, balance, currency, accountNumber, lastUpdated, notes }
```

Design system (CSS custom properties — MUST preserve):
```css
:root {
  --bg: #0c0d12; --surface: #16181f; --surface-2: #1e2028; --border: #282a36;
  --text: #f0f0f3; --text-muted: #6b6e80; --accent: #3b82f6; --accent-light: #60a5fa;
  --accent-glow: rgba(59,130,246,0.2); --danger: #ff4d6a; --success: #34d399;
  --warning: #fbbf24; --airline-color: #38bdf8; --hotel-color: #c084fc;
  --card-color: #fb923c; --other-color: #6b6e80; --radius: 14px; --radius-sm: 8px;
}
```

Existing accessibility features (DO NOT remove):
- `color-scheme: dark` on `<html>`
- `*:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`
- `@media (prefers-reduced-motion: reduce)` disabling animations

### output/value.html (815 lines)
Points Value Advisor. Reads `churn_data` from localStorage (read-only).

Key existing structures:
- `VALUATIONS` constant (lines 165-370) — 16 programs with fallbackOptions, transferPartners, expirationRules. **This gets extracted to programs.js.**
- `readRewardsData()` — reads churn_data from localStorage
- `readPrefs()` — currently returns `{ interestedInTravel: true }`. **Gets DEFAULT_PREFS merge.**
- `getValuations(account)` — basic CPP valuation. **Gets replaced by WTP-aware engine.**
- `calcLeftOnTable(account)` — gap between best and cash back
- `checkExpiration(account)` — expiration warning system
- `writeAgentResults(data, prefs)` — AI agent structured JSON output. **Gets extended.**
- `render()` — 250-line monolith. **Gets refactored into composable functions.**
- `esc(str)` — XSS protection. **Keep this.**
- `formatDollars(n)`, `formatPoints(n)` — formatting helpers. **Keep these.**

### output/tests/test.html (350 lines)
49 existing tests covering sanitization, validation, import/export, schema migration v1→v2, account repair, benefit repair. Test framework is simple inline `assert()`/`assertEqual()` functions.

## Implementation Plan — 6 Phases

Execute these in order. Commit after each phase.

---

### Phase 1: Create output/programs.js

Create a new file `output/programs.js` that exposes `window.PROGRAMS`.

**What to do:**
1. Extract the `VALUATIONS` constant from value.html (lines 165-370) into programs.js
2. Rename to `PROGRAMS` (but keep the same data structure for programs and expirationRules)
3. Add to each program:
   - `slug` — kebab-case identifier (e.g., "chase-ur", "amex-mr", "delta-sm")
   - `currency` — "points" or "miles"
   - `cpp` — best-case cents-per-point (editorial consensus). Use these values:
     - Chase UR: 2.0, Amex MR: 2.0, Capital One: 1.85, Citi TY: 1.8, Bilt: 2.0
     - Delta: 1.3, United: 1.4, AA: 1.5, Southwest: 1.4, Alaska: 1.8, JetBlue: 1.3
     - Marriott: 0.9, Hilton: 0.6, Hyatt: 2.0, IHG: 0.6, Wyndham: 1.1
4. Add `surcharges`, `flexibility`, `availability`, `cabinType` to each transfer partner:
   ```js
   { partner: "World of Hyatt", ratio: "1:1", bestCpp: 2.2,
     sweetSpot: "Category 1-4 hotels...",
     surcharges: "low", flexibility: "high", availability: "high",
     cabinType: "hotel" }
   ```
   Use your judgment for surcharge/flexibility/availability ratings based on common knowledge of each partner.
5. Add `cards` array to each flexible program:
   ```js
   cards: [
     { name: "Sapphire Preferred", annualFee: 95,
       earnRates: { dining: 3, travel: 2, groceries: 1, gas: 1,
                    streaming: 3, onlineShopping: 1, other: 1 } },
     // ...
   ]
   ```
   Include the 2-4 most popular cards per flexible program. Airline/hotel programs get `cards: []`.

**Card data to include (key cards per program):**

Chase UR:
- Sapphire Preferred ($95): dining 3, travel 2, streaming 3, other 1
- Sapphire Reserve ($550): dining 3, travel 3, streaming 3, other 1
- Freedom Unlimited ($0): dining 3, travel 1, other 1.5
- Freedom Flex ($0): dining 3, travel 1, drugstores 3, other 1

Amex MR:
- Gold ($250): dining 4, groceries 4, travel 3, other 1
- Platinum ($695): travel 5, flights 5, other 1
- Green ($150): dining 3, travel 3, transit 3, other 1

Capital One:
- Venture X ($395): travel 2, other 2
- Venture ($95): travel 2, other 2
- Savor ($95): dining 4, entertainment 4, groceries 3, streaming 4, other 1

Citi TY:
- Premier ($95): travel 3, dining 3, groceries 3, gas 3, other 1
- Double Cash ($0): other 2

Bilt:
- Bilt Mastercard ($0): dining 3, travel 2, rent 1, other 1

**Earn rate categories (7):** dining, travel, groceries, gas, streaming, onlineShopping, other

---

### Phase 2: Modify output/index.html — Schema v3 + Program Picker + Dollar Values

**2a. Add shared nav bar (top of body):**
```html
<nav style="...">
  <span>Churn</span>
  <a href="index.html" class="active">Tracker</a>
  <a href="value.html">Advisor</a>
</nav>
```
Thin bar, surface background, active tab has accent underline. Style with existing CSS vars.

**2b. Add `<script src="programs.js">` before the main `<script>` tag.**

**2c. Schema v3 migration:**
- Update `SCHEMA_VERSION` to 3
- In `migrateData()`, add v2→v3 migration:
  ```js
  if (d._version < 3) {
    d._version = 3;
    d.accounts.forEach(a => {
      if (!a.programSlug) a.programSlug = null;
      if (a.cpp === undefined) a.cpp = 1.0;
      if (!a.cards) a.cards = [];
    });
  }
  ```
- Update `defaultData()` to return `_version: 3`

**2d. Program picker in Add Account modal:**
Replace the current text input for "program" with a searchable dropdown:
- List all programs from `PROGRAMS.programs` + "Custom" option at bottom
- Accessible: `role="combobox"`, `aria-expanded`, keyboard searchable (type to filter)
- On program select: auto-fill `programSlug`, `cpp`, `currency`, `type` from PROGRAMS
- "Custom" shows manual fields for cpp, currency, type
- Mobile (<768px): modal becomes full-screen bottom sheet with drag handle, sticky Save

**2e. Cards sub-section in modal:**
- Below balance field, collapsible "Cards" section (collapsed by default)
- If known program selected: show checkboxes for each card from `PROGRAMS.programs[name].cards`
- User can check which cards they have
- "Add custom card" option for cards not in DB
- Each checked card shows earn rates (read-only from DB) and annual fee

**2f. Dollar values on dashboard:**
- Hero: show `$X,XXX` as primary number (sum of `account.balance * account.cpp / 100` across all accounts)
- Points total becomes subtitle
- Each account card: show "85,000 pts ≈ $1,700" inline (using that account's cpp)
- "Open Value Advisor →" link below the chart

**2g. Account card detail expansion:**
- When clicking an account card, show expanded view with:
  - Transfer partners (if program is in PROGRAMS and has transferPartners)
  - Cards with earn rates
  - Annual fee total and net value calculation

---

### Phase 3: Modify output/value.html — Scoring Engine

**3a. Switch to programs.js:**
- Add `<script src="programs.js">` before main `<script>`
- Remove the inline `VALUATIONS` constant (lines 165-370)
- Update all references from `VALUATIONS` to `PROGRAMS`
- `VALUATIONS.programs` → `PROGRAMS.programs`
- `VALUATIONS.expirationRules` → `PROGRAMS.expirationRules`
- `VALUATIONS.lastUpdated` → `PROGRAMS.lastUpdated`

**3b. Add DEFAULT_PREFS constant:**
```js
const DEFAULT_PREFS = {
  mode: 'max_value',
  interestedInTravel: true,
  cabinPref: 'economy',
  hotelPref: 'midrange',
  complexityTolerance: 'medium',
  wtpCaps: {
    economy: 500, premiumEconomy: 1000, business: 2500, first: 5000,
    budgetHotel: 150, midrangeHotel: 300, luxuryHotel: 600, resort: 800
  }
};
```

**3c. Update readPrefs():**
```js
function readPrefs() {
  try {
    const raw = localStorage.getItem('valueAdvisorPrefs');
    const stored = raw ? JSON.parse(raw) : {};
    // Deep merge with defaults — handles upgrades seamlessly
    return {
      ...DEFAULT_PREFS,
      ...stored,
      wtpCaps: { ...DEFAULT_PREFS.wtpCaps, ...(stored.wtpCaps || {}) }
    };
  } catch (e) {
    return { ...DEFAULT_PREFS };
  }
}
```

**3d. Implement scoring engines:**

```js
// Cap raw travel value by personal willingness to pay
function applyWTP(rawDollarValue, cabinType, prefs) {
  const cap = prefs.wtpCaps[cabinType] || prefs.wtpCaps.economy;
  return Math.min(rawDollarValue, cap);
}

// Honest CPP accounting for surcharges and hidden costs
function calcNetCpp(balance, bestCpp, surchargeData) {
  // surchargeData: { surcharges: "low"|"medium"|"high", flexibility, availability }
  const surchargeMultiplier = { low: 1.0, medium: 0.85, high: 0.7 };
  const availabilityMultiplier = { high: 1.0, medium: 0.9, low: 0.75 };
  const mult = (surchargeMultiplier[surchargeData.surcharges] || 1.0)
             * (availabilityMultiplier[surchargeData.availability] || 1.0);
  return bestCpp * mult;
}

// Bang-for-buck multi-factor scoring
function scoreBFB(option, floor, prefs, mode) {
  const valueOverFloor = option.dollarValue - floor.dollarValue;
  const cashSaved = option.dollarValue; // how much cash this saves

  // Preference fit: bonus for matching cabin/hotel prefs
  let prefFit = 0;
  if (option.cabinType) {
    if (option.cabinType === prefs.cabinPref) prefFit += 20;
    if (option.cabinType === prefs.hotelPref) prefFit += 20;
  }

  // Ease: simple redemptions score higher
  const easeScore = option.type === 'transfer_partner' ? 0 : 30;

  // Penalties
  let penalties = 0;
  if (option.surcharges === 'high') penalties += 25;
  if (option.flexibility === 'low') penalties += 15;
  if (option.availability === 'low') penalties += 20;

  return valueOverFloor + (cashSaved * 0.1) + prefFit + easeScore - penalties;
}

// Re-weight scores per user mode
function rankByMode(scoredOptions, mode) {
  const weights = {
    max_value:    { value: 1.0, cash: 0.2, ease: 0.1, pref: 0.3 },
    min_cash:     { value: 0.3, cash: 1.0, ease: 0.2, pref: 0.1 },
    simple:       { value: 0.2, cash: 0.3, ease: 1.0, pref: 0.1 },
    travel_now:   { value: 0.8, cash: 0.3, ease: 0.5, pref: 0.5 },
    no_travel:    { value: 0.5, cash: 0.8, ease: 0.8, pref: 0.1 },
    expiring:     { value: 0.4, cash: 0.4, ease: 0.6, pref: 0.1 },
    luxury:       { value: 1.0, cash: 0.1, ease: 0.1, pref: 0.8 }
  };
  const w = weights[mode] || weights.max_value;

  return scoredOptions
    .map(o => ({ ...o, modeScore: o.bfbScore * w.value + o.cashSaved * w.cash
                                 + o.easeScore * w.ease + o.prefFit * w.pref }))
    .sort((a, b) => b.modeScore - a.modeScore);
}
```

**3e. Compute-once enriched accounts array:**
Build once per render(), all render functions read pre-computed data:
```js
function enrichAccounts(accounts, prefs) {
  return accounts.filter(a => (a.balance || 0) > 0).map(account => {
    const prog = PROGRAMS.programs[account.program];
    const valuations = getValuations(account); // existing function, updated
    const leftOnTable = calcLeftOnTable(account);
    const expiration = checkExpiration(account);

    // Score all options with BFB
    const floor = valuations.bestFallback;
    const scoredOptions = valuations.allOptions.map(opt => ({
      ...opt,
      bfbScore: scoreBFB(opt, floor, prefs, prefs.mode),
      cashSaved: opt.dollarValue,
      easeScore: opt.type === 'transfer_partner' ? 0 : 30,
      prefFit: 0 // computed in scoreBFB
    }));
    const ranked = rankByMode(scoredOptions, prefs.mode);

    return { account, prog, valuations, leftOnTable, expiration, scoredOptions, ranked };
  });
}
```

**3f. Refactor render() into composable functions:**
```js
function render() {
  const app = document.getElementById('app');
  const data = readRewardsData();
  const prefs = readPrefs();
  const household = readHousehold(); // new

  // Error/empty states (keep existing logic)
  if (data === 'corrupted') { /* existing */ return; }
  if (!data || !data.accounts || data.accounts.length === 0) { /* warm nudge */ return; }

  const enriched = enrichAccounts(data.accounts, prefs);
  const hhEnriched = household ? enrichAccounts(household.accounts, prefs) : [];
  const allEnriched = [...enriched, ...hhEnriched];

  const agentResults = writeAgentResults(data, prefs); // extended

  let html = '';
  html += renderNav();          // shared nav bar
  html += renderHero(allEnriched, prefs);
  html += renderModeSelector(prefs);
  html += renderLeftOnTable(allEnriched, prefs);
  html += renderExpirations(allEnriched);
  html += renderRecCards(allEnriched, prefs);
  html += renderAccountDetails(allEnriched, prefs);
  html += renderSweets(allEnriched, prefs);
  html += renderSettings(prefs);
  html += renderHousehold(household, prefs);
  html += renderFreshness();

  app.innerHTML = html;
  bindEvents(prefs); // attach all event listeners
}
```

---

### Phase 4: Modify output/value.html — UI Features

**4a. Shared nav bar:**
Same nav as index.html but "Advisor" is active.

**4b. Mode selector UI:**
Horizontally scrollable pill bar below hero:
```
[⚡ Max Value] [💰 Min Cash] [✅ Simple] [✈️ Travel Now] [🏠 No Travel] [⏰ Expiring] [✨ Luxury]
```
- `role="tablist"` container, each pill is `role="tab"`
- Arrow-key navigation (left/right moves focus)
- Active pill gets accent background
- Scrollable on mobile (overflow-x: auto, hide scrollbar with CSS)
- On mode change: `savePrefs()` then `render()`

**4c. WTP Settings form:**
Inside the collapsible Settings section at bottom:
- Header "Willingness to Pay" with subtext explaining the concept
- 8 numeric inputs in 2-column grid (desktop) / 1-column (mobile):
  - Economy, Premium Economy, Business, First Class
  - Budget Hotel, Midrange Hotel, Luxury Hotel, Resort
- Each input: `<label>` with `for`, `inputmode="decimal"`, prefixed with "$"
- On change: save to prefs, re-render
- "Reset to defaults" link

**4d. Additional settings:**
- Cabin preference: radio buttons (economy, premium economy, business, first)
- Hotel preference: radio buttons (budget, midrange, luxury, resort)
- Complexity tolerance: radio buttons (low, medium, high)
- Travel interest toggle (existing, keep)

**4e. Household management:**
- Inside Settings section, below WTP
- "Player Two" header with "Add" button
- Reads/writes separate localStorage key: `churn_household`
- Same format as churn_data: `{ accounts: [...] }`
- Mini add-account form (reuses program picker pattern)
- Combined totals shown in hero when household has accounts
- "Remove player two" option

**4f. Decision-first recommendation cards:**
Replace the existing 3-card rec section with 4 visually distinct cards:

1. **Best Overall** — FEATURED (larger card), gold/amber accent (`--warning` color), star icon
   - Highest BFB score from ranked options
   - Shows: program, option type, estimated value, value vs fallback %, confidence, one-line why

2. **Best Simple Option** — green accent (`--success`), checkmark icon
   - Highest-scoring non-transfer option
   - Filter: `option.type !== 'transfer_partner'`

3. **Best Non-Travel Option** — blue accent (`--accent`), dollar sign icon
   - Highest-scoring cash-like option
   - Filter: `option.type === 'cash_back' || option.type === 'gift_cards' || option.type === 'pay_with_points'`

4. **Worth Saving** — muted gray (`--text-muted`), clock icon
   - Heuristic: if no expiry risk AND best option within 15% of floor → "Worth waiting"
   - Two visual states:
     - **Wait**: muted card, message "Worth waiting — your best option is only X% above floor value."
     - **Use now**: accent card, message "Strong opportunity — act on this."

Layout: 2×2 grid on desktop (`grid-template-columns: 1fr 1fr`), single column on mobile. Best Overall spans full width or is visibly larger.

Each card shows:
- Card label + icon
- Estimated dollar value (large)
- "X% over fallback" or "vs $Y cash back"
- Points required + program name
- Confidence indicator (high/medium/low based on availability rating)
- One-line explanation

**4g. Empty state for value.html (no accounts):**
When `readRewardsData()` returns null/empty, show:
```html
<div class="empty-state">
  <div class="emoji">💡</div>
  <h3>What is the Value Advisor?</h3>
  <p>This tool analyzes your rewards accounts and tells you the smartest way
     to use your points — whether that's transferring to travel partners,
     cashing out, or waiting for a better opportunity.</p>
  <p style="margin-top: 16px">
    <a href="index.html">Add your accounts in the Rewards Tracker →</a>
  </p>
</div>
```

---

### Phase 5: Tests

**5a. Modify output/tests/test.html — add ~15 tests for index.html changes:**

Add these tests after the existing 49:

Schema v3 migration tests:
- 50: migrateData v2→v3 adds programSlug, cpp, cards
- 51: migrateData v3 data unchanged
- 52: migrateData v1 data gets all the way to v3

Program picker tests (test against PROGRAMS data):
- 53: PROGRAMS has lastUpdated field
- 54: PROGRAMS has at least 16 programs
- 55: Each program has slug, type, currency, cpp
- 56: Flexible programs have fallbackOptions
- 57: Flexible programs have transferPartners
- 58: Flexible programs have cards with earnRates
- 59: Each card has name, annualFee, earnRates with 7 categories
- 60: Program picker auto-fill: selecting "Chase Ultimate Rewards" returns correct cpp/type/currency

Earn rate tests:
- 61: earnRates has all 7 categories (dining, travel, groceries, gas, streaming, onlineShopping, other)
- 62: earnRates values are numbers >= 0
- 63: annualFee is a non-negative number

Dollar value calculation:
- 64: 85000 pts at 2.0 cpp = $1,700

Include `<script src="../programs.js">` at top of test.html to access PROGRAMS.

**5b. Create output/tests/value-test.html — 28 tests for value.html changes:**

Use the same test harness pattern (assert/assertEqual). Include `<script src="../programs.js">`.

Copy the scoring engine functions into the test file (or include them from a shared source).

Tests to write:

WTP tests:
- 1: applyWTP caps value at economy default ($500)
- 2: applyWTP caps value at business default ($2,500)
- 3: applyWTP passes through values below cap
- 4: applyWTP uses economy as fallback for unknown cabin type

calcNetCpp tests:
- 5: Low surcharges = no penalty (multiplier 1.0)
- 6: High surcharges reduce CPP by 30%
- 7: Low availability reduces CPP by 25%
- 8: Combined high surcharge + low availability = ~0.525x

scoreBFB tests:
- 9: Transfer partner scores lower ease than cash back
- 10: High surcharges incur penalty
- 11: Option matching cabin pref gets bonus
- 12: Value over floor contributes to score
- 13: Zero balance produces zero score

rankByMode tests:
- 14: max_value mode ranks highest value first
- 15: simple mode ranks non-transfer options higher
- 16: no_travel mode filters appropriately
- 17: min_cash mode prioritizes cash options

DEFAULT_PREFS tests:
- 18: readPrefs returns defaults when nothing stored
- 19: readPrefs merges stored with defaults (missing fields filled in)
- 20: readPrefs handles corrupted JSON gracefully

Enrichment tests:
- 21: enrichAccounts filters zero-balance accounts
- 22: enrichAccounts includes valuations for each account
- 23: enrichAccounts includes BFB scores

Household tests:
- 24: readHousehold returns null when no data
- 25: readHousehold returns parsed data when present
- 26: Household accounts are separate from main accounts

Worth Saving heuristic:
- 27: Within 15% of floor + no expiry = "wait"
- 28: Above 15% of floor = "use now"

---

### Phase 6: Final Verification

After all phases complete:
1. Open index.html in browser, verify:
   - Schema migration works (existing localStorage data upgrades)
   - Program picker searchable and auto-fills
   - Dollar values shown on dashboard and cards
   - Nav bar links to value.html
2. Open value.html, verify:
   - Reads from programs.js (no inline VALUATIONS)
   - Mode selector changes recommendations
   - WTP settings save and affect scoring
   - Recommendation cards show 4 types with visual differentiation
   - Empty state shows warm nudge if no accounts
   - Nav bar links back to index.html
3. Run test.html — all 64+ tests pass
4. Run value-test.html — all 28 tests pass

---

## Critical Implementation Notes

1. **XSS Protection**: Use the existing `esc()` function for ALL user-generated content in innerHTML. Never insert raw user strings.

2. **localStorage keys**:
   - `churn_data` — main rewards data (index.html writes, value.html reads)
   - `valueAdvisorPrefs` — value advisor preferences
   - `valueAdvisorResults` — AI agent structured output
   - `churn_household` — player two accounts (NEW)

3. **No frameworks**. Pure HTML/CSS/JS. No React, no Vue, no build step.

4. **Preserve existing features**. index.html has: accounts, benefits, profile, tabs, export/import, undo delete, storage meter, inline balance editing. Don't break any of it.

5. **CSS custom properties**: All new styling MUST use the existing CSS variables. New accent colors for rec cards: use `--warning` (gold), `--success` (green), `--accent` (blue), `--text-muted` (gray).

6. **Font**: Inter (already loaded via Google Fonts). Body 15px, headings use font-weight 700/800.

7. **Cards**: 14px border-radius, 1px solid var(--border), var(--surface) background.

8. **Animations**: Use existing `fadeInUp` keyframe with `animate-in` class. Respect `prefers-reduced-motion`.

9. **The storage event listener** in value.html currently listens for `rewardsData` key changes — update it to listen for `churn_data` (the actual key used).

10. **Commit after each phase** with a descriptive message summarizing what changed.

## File Dependency Order

```
programs.js  (no dependencies — pure data)
    │
    ├── index.html  (reads PROGRAMS for picker + cpp values)
    │       │
    │       └── writes churn_data to localStorage
    │
    └── value.html  (reads PROGRAMS for scoring engine)
            │
            ├── reads churn_data from localStorage
            ├── reads/writes valueAdvisorPrefs
            ├── reads/writes churn_household
            └── writes valueAdvisorResults
```
