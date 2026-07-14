# Sports Minigame Hub

A collection of football (soccer) trivia and reflex minigames built with React, TypeScript, and Supabase. Play solo, earn XP, and climb the leaderboard.

## Games

- ⚡ **Reflex Rush** — Test your reaction time
- 🎯 **Match Call** — Predict match outcomes from stats
- 🧠 **Tactics Daily** — Guess the football tactic from clues (one puzzle/day)
- 📖 **True or False** — Fact-check football statements
- 🗺️ **Career Path** — Name players from their club career history
- 🔤 **Football A-Z** — Name a player for each letter against the clock
- ❓ **Football Jeopardy** — Pick categories and answer football trivia
- 🛤️ **Trivia Path** — Answer multiple-choice questions along a path
- 🎮 **Tic-Tac-Toe Grid** — Fill a 3×3 grid by naming players matching row/column criteria (Classic or Marathon mode)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| State | Zustand |
| Animation | Framer Motion |
| Backend | Supabase (auth, database, Row Level Security) |
| Linting | Oxlint |

## How to Run Locally

```bash
# 1. Clone the repo
git clone <repo-url>
cd sports-minigame-hub

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase project credentials

# 4. Run the dev server
npm run dev

# 5. Build for production
npm run build
```

## Database

The Supabase schema is in `supabase-schema.sql`. Run it in your Supabase SQL editor to create the required tables, indexes, triggers, and Row Level Security policies.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous (public) API key |
