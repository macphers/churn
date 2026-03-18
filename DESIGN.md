# Design System — Churn

## Product Context
- **What this is:** A personal dashboard for tracking credit card points, miles, and benefits across all travel loyalty programs
- **Who it's for:** People with 3+ travel credit cards who want to stop leaving value on the table — from casual cardholders to dedicated points optimizers
- **Space/industry:** Personal finance / travel rewards. Peers: MaxRewards, AwardWallet, CardPointers, The Points Guy app
- **Project type:** Web app (pure HTML/CSS/JS, no framework, localStorage-backed)

## Aesthetic Direction
- **Direction:** Luxury/Refined — warm financial confidence, not cold fintech blue
- **Decoration level:** Intentional — subtle surface texture via warm grays and layered surfaces, not flat white
- **Mood:** Premium and trustworthy, like a leather-bound travel journal. Calm enough to check daily, distinctive enough to feel like *your* tool. The warmth says "personal"; the structure says "precise."
- **Reference sites:** Mercury (warm parchment surfaces, restrained palette), Wealthsimple (editorial typography, emotional intelligence). Deliberately NOT: MaxRewards/CardPointers/AwardWallet (generic blue SaaS templates)

## Typography
- **Display/Hero:** Fraunces (variable, optical-size serif) — warm, characterful, unmistakable. Italic weight on hero numbers (point balances) creates a luxury-magazine feel. Serif headlines in fintech is a deliberate risk that gives Churn instant visual distinction.
- **Body:** Satoshi — geometric sans-serif with excellent readability. Clean and modern without being generic. Loaded from Fontshare.
- **UI/Labels:** Satoshi 600 (semibold) for labels, Satoshi 700 for emphasis
- **Data/Tables:** Geist Mono — purpose-built for data alignment with tabular-nums support. Use for balances, dates, account numbers, and any numeric data that needs to align in columns.
- **Code:** Geist Mono
- **Loading:**
  - Fraunces: Google Fonts `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600;1,9..144,700&display=swap`
  - Satoshi: Fontshare `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap`
  - Geist Mono: Google Fonts `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap`
- **Scale:**
  - Hero: clamp(48px, 8vw, 80px) — Fraunces 700
  - H1: 32px — Fraunces 700
  - H2: 24px — Fraunces 600
  - H3: 18px — Satoshi 700
  - Body: 16px / 15px — Satoshi 400–500
  - Small: 14px — Satoshi 500
  - Caption: 13px — Satoshi 600
  - Eyebrow: 12px — Satoshi 700, uppercase, letter-spacing 0.08em
  - Mono label: 11px — Geist Mono 500, uppercase, letter-spacing 0.1em
  - Mono caption: 10px — Geist Mono 500, uppercase, letter-spacing 0.08em

## Color
- **Approach:** Restrained — gold accent + warm neutrals. Color is rare and meaningful. No blue anywhere in the brand; every competitor uses blue, our gold is the differentiator.
- **Primary (Gold):** `#8B5E10` — the brand color. Thematically perfect: points = value = gold. Used for accent text, active states, CTAs, and category indicators for credit cards.
- **Primary hover:** `#6B4A0C`
- **Decorative gold:** `#C4841D` — lighter variant for decorative elements and small-text accessibility in dark mode
- **Accent glow:** `rgba(139, 94, 16, 0.10)` — focus rings, selected states, hover backgrounds

### Neutrals (warm)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| bg | `#F5F2ED` (parchment) | `#0F0E0C` | Page background |
| surface | `#FFFFFF` | `#1A1815` | Cards, panels |
| surface-2 | `#FAF8F5` | `#141210` | Inset areas, expanded sections |
| border | `#E8E4DF` | `#2A2723` | Default borders |
| border-strong | `#D5D0CA` | `#3A3632` | Input borders, dividers |
| text | `#1A1A1A` | `#E8E4DF` | Primary text |
| text-muted | `#6B6560` | `#9B9590` | Secondary text |
| text-dim | `#9B9590` | `#6B6560` | Tertiary text, timestamps |

### Semantic
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| success | `#2D7A4F` | `#4DAF72` | Balance updated, benefit available |
| warning | `#7A5A08` | `#C49A2E` | Benefits expiring soon |
| error/danger | `#A63D40` | `#D4585B` | Delete actions, save failures |
| info | `#2563AA` | `#5A9FD4` | Tips, informational callouts |

### Category Colors
| Category | Light | Dark | Usage |
|----------|-------|------|-------|
| Airlines | `#2563AA` | `#5A9FD4` | Airline program indicators |
| Hotels | `#7C4D8A` | `#A873B8` | Hotel program indicators |
| Credit Cards | `#8B5E10` | `#8B5E10` | Card program indicators (same as brand) |
| Other | `#6B6560` | `#9B9590` | Misc program indicators |

### Dark Mode Strategy
- Same `#8B5E10` gold accent in both modes — the brand color does not shift
- Surfaces go warm-dark (not pure black): `#0F0E0C` → `#1A1815` → `#141210`
- Semantic and category colors brighten ~20% for contrast on dark surfaces
- Small accent text (eyebrows, mono labels, ≤12px) uses `#C4841D` in dark mode for WCAG AA compliance
- Buttons use `#A47214` background in dark mode (hover: `#B8860B`) for label contrast
- The goal: toggling modes should feel like the same product in a different room, not a different product

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable — financial data needs breathing room to reduce anxiety
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px)

## Layout
- **Approach:** Grid-disciplined — card-based, predictable alignment
- **Grid:** Single column, centered content
- **Max content width:** 1060px with `min()` for responsive: `width: min(1060px, calc(100vw - 40px))`
- **Border radius:**
  - xs: 4px — small UI elements (dots, tiny badges)
  - sm: 8px — buttons, inputs, alert bars, inner cards
  - md: 12px — cards, panels, main containers
  - full: 9999px — pills, avatars
- **Nav height:** 56px minimum, flex-centered
- **Nav background:** `var(--bg)` (parchment) — the nav blends into the page background, NOT white. Only cards and panels use `surface` (white).
- **Page header padding:** 40px top, 20px bottom
- **Card padding:** 24px (20px on mobile)

## Motion
- **Approach:** Minimal-functional — only transitions that aid comprehension
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(120-150ms) medium(250ms)
- **Animations:**
  - `fadeInUp`: opacity 0→1, translateY 12px→0 — page content entrance
  - `slideUp`: opacity 0→1, translateY 8px→0 — card/list item entrance
  - Hover transitions: color, background — 120-150ms ease
  - Focus ring: 0 0 0 3px var(--accent-glow)
- **Reduced motion:** Honor `prefers-reduced-motion: reduce` — disable all animations and transitions
- **No choreography.** No scroll-driven animation. No staggered entrances. Keep it fast and quiet.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-18 | Initial design system created | Created by /design-consultation based on competitive research (MaxRewards, CardPointers, AwardWallet, Mercury, Ramp) and existing codebase direction |
| 2026-03-18 | Fraunces replaces Clash Display | Clash Display is on the AI-slop font blacklist (overused in generated designs). Fraunces provides the same warmth via a variable optical-size serif, with stronger hierarchy against Satoshi body text |
| 2026-03-18 | Gold-only accent (#8B5E10), no blue | Every rewards tracker competitor uses blue. Gold is thematically perfect (points = value) and creates instant brand recognition |
| 2026-03-18 | Parchment background (#F5F2ED) | Warmer, more tactile, more human than white. Mercury validates this approach in fintech. No rewards tracker uses it. |
| 2026-03-18 | Consistent gold across light/dark modes | User feedback: accent color should not shift between modes. Same #8B5E10 in both, with targeted luminance boosts only for small text accessibility |
