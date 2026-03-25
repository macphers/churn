# Churn — Personal Credit Card Rewards Tracker

## Vision
A personal dashboard for tracking credit card points, miles, and benefits across all travel loyalty programs. Designed to be both a human-friendly UI and an AI-agent-readable data source for booking trips with points.

## What It Does

### Core Features (v1)
1. **Rewards Account Tracker** — Add and manage loyalty program accounts (airlines, hotels, credit cards) with current point/mile balances
2. **Account Details Storage** — Store frequent flier numbers, hotel rewards numbers, and credit card program IDs for quick reference
3. **Benefits Tracker** — Track per-card perks (lounge access, free night certs, travel credits, Global Entry credit, etc.) and their expiration/renewal dates
4. **Points Summary Dashboard** — At-a-glance view of total points across all programs, organized by type (airline, hotel, flexible currency)
5. **Manual Balance Updates** — Edit balances as they change; track last-updated date per account

### Shipped Since v1
- **Value Advisor** (value.html) — personalized redemption recommendations with scoring engine, WTP caps, and household support
- **Wallet** (wallet.html) — category-based card picker that ranks the cards you actually hold using the shared rewards engine
- **Trip Planner** (trips.html) — shows bookable flights and hotels based on your balances and transfer paths
- **Transfer partner mapping** — built into programs.js with ratios, sweet spots, and path resolution
- **Points expiration tracking** — staleness badges, activity dates, and expiration warnings across all views
- **Earn rate tracking** — per-card earn rates stored in programs.js for all major cards

### Future Features
- Combined balance aggregation across transfer paths in Trip Planner
- Transfer bonus ingestion for time-limited promotions
- Screenshot AI import for balance sync
- Chrome extension for auto-sync from loyalty program websites
- Redemption journal for tracking past bookings and learning real WTP thresholds

## AI Agent Interface
The app stores all data in a structured JSON format in localStorage. An AI agent can:
- Read the full rewards portfolio via a well-documented schema
- Understand which programs the user belongs to, current balances, and available benefits
- Use this data to query external APIs for award availability and trip planning

### Data Schema (localStorage)
```json
{
  "accounts": [
    {
      "id": "uuid",
      "type": "airline | hotel | credit_card | other",
      "program": "Chase Ultimate Rewards",
      "accountNumber": "xxxx-1234",
      "balance": 85000,
      "currency": "points | miles",
      "lastUpdated": "2026-03-17",
      "notes": ""
    }
  ],
  "benefits": [
    {
      "id": "uuid",
      "cardId": "account-uuid",
      "name": "TSA PreCheck / Global Entry Credit",
      "value": "$100",
      "renewalDate": "2027-01-01",
      "used": false,
      "notes": ""
    }
  ],
  "profile": {
    "homeAirport": "SFO",
    "preferredAlliances": ["oneworld", "Star Alliance"],
    "travelPreferences": {
      "regions": ["Asia", "Europe"],
      "classPreference": "business"
    }
  }
}
```

## Constraints
- Pure HTML/CSS/JS — no frameworks, no build step
- All data stored in localStorage (no backend)
- Must work well on mobile (responsive, touch-friendly)
- Minimal file count (currently 4 pages + shared data files)
- Clean, modern UI — dark mode preferred

## Pages / Views
1. **Rewards Tracker** (index.html) — dashboard with accounts, benefits, profile, balance refresh, advisor verdict banner
2. **Wallet** (wallet.html) — ranks the best attached card for a spend category and shows the gap to the runner-up
3. **Value Advisor** (value.html) — scoring engine with WTP caps, recommendation cards, household support, expiration tracking
4. **Trip Planner** (trips.html) — resolver engine showing bookable flights/hotels from your points via sweet spots and transfer paths

## Non-Goals (v1)
- No backend or authentication
- No real-time API integrations
- No multi-user support
