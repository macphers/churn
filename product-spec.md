# Osaka — Personal Credit Card Rewards Tracker

## Vision
A personal dashboard for tracking credit card points, miles, and benefits across all travel loyalty programs. Designed to be both a human-friendly UI and an AI-agent-readable data source for booking trips with points.

## What It Does

### Core Features (v1)
1. **Rewards Account Tracker** — Add and manage loyalty program accounts (airlines, hotels, credit cards) with current point/mile balances
2. **Account Details Storage** — Store frequent flier numbers, hotel rewards numbers, and credit card program IDs for quick reference
3. **Benefits Tracker** — Track per-card perks (lounge access, free night certs, travel credits, Global Entry credit, etc.) and their expiration/renewal dates
4. **Points Summary Dashboard** — At-a-glance view of total points across all programs, organized by type (airline, hotel, flexible currency)
5. **Manual Balance Updates** — Edit balances as they change; track last-updated date per account

### Future Features (v2+)
- Trip booking assessment: AI agent reads your balances and cross-references award availability APIs to suggest what trips you can book with points
- Trip recommendations: proactive suggestions based on your point balances and travel preferences
- Points expiration alerts
- Transfer partner mapping (e.g., Chase UR → Hyatt, United, etc.)
- Earn rate tracking per card per spend category

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
- Single `index.html` file (or minimal file count)
- Clean, modern UI — dark mode preferred

## Pages / Views
1. **Dashboard** — summary of all accounts and total points by type
2. **Accounts** — list/add/edit/delete loyalty accounts
3. **Benefits** — list/add/edit/delete card benefits, with used/unused status
4. **Profile** — travel preferences for AI agent context (home airport, preferred airlines, etc.)

## Non-Goals (v1)
- No backend or authentication
- No real-time API integrations
- No multi-user support
