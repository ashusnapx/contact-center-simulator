# VaaniVerse — AI Contact Centre Flight Simulator

> The world's first AI contact centre flight simulator. Train agents by doing — not by watching.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql)](https://postgresql.org)

---

## Screenshots

| Landing | Dashboard | Simulation |
|---------|-----------|------------|
| ![Landing](screenshots/01-landing.png) | ![Dashboard](screenshots/02-dashboard.png) | ![Simulation](screenshots/05-simulation.png) |

| Personas | Voice Call | Replay & QA |
|----------|------------|-------------|
| ![Personas](screenshots/03-personas.png) | ![Voice Call](screenshots/06-voice-call.png) | ![Replay & QA](screenshots/07-replay-qa.png) |

---

## What is VaaniVerse?

Traditional agent training: PowerPoint → Trainer Roleplay → Few Mock Calls → LIVE CUSTOMERS.

VaaniVerse: Simulate the ENTIRE job before talking to a single real customer.

- **AI Customers** with unique personalities, moods, hidden objectives
- **Live Voice Calls** via Vaani Voice AI with natural interruptions
- **Emotion Engine** — customer emotions evolve during the call
- **QA Scoring** across 8 dimensions with evidence-based feedback
- **Call Replay** — listen back, review transcript, see emotion timeline
- **Difficulty Scaling** — Beginner to Nightmare mode

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Auth | NextAuth.js v5 (Credentials + JWT) |
| Database | PostgreSQL 17, Drizzle ORM |
| Voice AI | Vaani Voice AI (WebRTC, Speech-to-Speech) |
| LLM | Google Gemini (text chat + QA scoring) |
| Design | Hand-drawn style — wobbly borders, sketch fonts, sticky-note cards |

---

## Quick Start

### Prerequisites

- Node.js 20+ (with nvm recommended)
- Docker (for PostgreSQL)
- [Vaani API key](https://vaanivoice.ai)
- [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone and install

```bash
git clone https://github.com/your-org/vaaniverse.git
cd vaaniverse

# Start PostgreSQL
docker compose up -d

# Install dependencies
source ~/.nvm/nvm.sh   # if using nvm
cd apps/web
npm install
```

### 2. Configure environment

```bash
cp env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://vaaniverse:vaaniverse_dev@localhost:5432/vaaniverse
GEMINI_API_KEY=your_gemini_key
VAANI_API_KEY=your_vaani_key
VAANI_BASE_URL=https://api.vaanivoice.ai
VAANI_AGENT_ID=your_agent_id
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up database

```bash
npx drizzle-kit push
npx tsx scripts/seed-personas.ts   # seeds 5 built-in personas
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Features

### For Trainees
- **Realistic voice calls** with AI customers that interrupt, get emotional, have hidden agendas
- **Text chat mode** for practice without voice
- **Live transcript** during calls
- **Post-call replay** with timestamped transcript, emotion timeline, AI summary
- **QA breakdown** — empathy, listening, confidence, ownership, call control, compliance, resolution, communication
- **Difficulty presets** — auto-configure noise, filler words, max duration, guardrails

### For Admins/Trainers
- **Custom personas** — create AI customers with specific industries, moods, personality traits
- **Prebuilt personas** — 5 seeded personas across banking, telecom, travel
- **Persona generator** — emoji picker, industry/difficulty selectors, backstory builder
- **Analytics dashboard** — score trends, simulation history, performance metrics

### Technical
- **Vaani Voice AI integration** — `modify_agent` for real-time persona override
- **Transcript fetch** — REST API with retry logic (Vaani needs ~5s post-call processing)
- **Recording proxy** — streams Vaani audio through server (requires auth header)
- **Difficulty presets** — beginner/intermediate/advanced/expert/nightmare auto-configure all parameters

---

## Architecture

```
apps/web/
├── app/
│   ├── (auth)/          # Login, signup, forgot password
│   ├── (dashboard)/     # Main app — simulations, personas, analytics, settings
│   └── api/             # REST endpoints
├── components/          # VoiceCall, Navbar, Footer, UI primitives
├── lib/
│   ├── api-keys.ts      # Settings-based API key resolver
│   ├── db/              # Drizzle schema, migrations
│   └── vaani/           # Vaani API client
└── scripts/             # Seed scripts
```

### API Routes

| Endpoint | Description |
|----------|-------------|
| `POST /api/voice/session` | Create Vaani voice session with persona override |
| `GET /api/simulations/[id]/fetch-transcript` | Fetch transcript from Vaani REST API |
| `GET /api/simulations/[id]/call-details` | Fetch summary, entities, evaluation |
| `GET /api/simulations/[id]/recording` | Proxy audio stream with auth header |
| `GET/POST /api/personas` | List or create personas |
| `GET/POST /api/simulations` | List or create simulations |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google Gemini API key (starts with `AQ.`) |
| `VAANI_API_KEY` | Yes | Vaani Voice AI API key |
| `VAANI_BASE_URL` | Yes | Vaani API base URL |
| `VAANI_AGENT_ID` | Yes | Vaani agent ID for voice sessions |
| `AUTH_SECRET` | Yes | NextAuth secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Yes | App URL for auth callbacks |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |

---

## License

MIT
