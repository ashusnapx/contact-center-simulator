# VaaniVerse — AI Contact Centre Flight Simulator

> **The world's first AI contact centre flight simulator.**
> Agents train on realistic voice calls with AI customers — before touching a real one.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql)](https://postgresql.org)
[![Vaani](https://img.shields.io/badge/Voice_AI-Vaani-ff4d4d)](https://vaanivoice.ai)

---

## The Problem

Contact centres lose **$1.3 trillion globally** to employee turnover, with most agents quitting within 90 days. Why?

**Training is broken.**

```
PowerPoint slides → Trainer roleplays → Few mock calls → LIVE CUSTOMERS
                                                              ↑
                                              Agent fails. Customer angry.
                                              Manager intervenes. Agent quits.
```

- **Repetitive**: Same scripts, same scenarios, same outcomes
- **Subjective**: Trainer evaluates on gut feel, not data
- **No edge cases**: Agents never face the angry customer, the manipulator, the crying grandmother
- **No pressure**: No time limits, no background noise, no real stakes
- **One-shot**: Fail on a real call = lost customer. No retry.

---

## The Solution

VaaniVerse simulates the **entire job** — not just one conversation.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VaaniVerse Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Trainee   │◄──►│  Vaani   │◄──►│ Customer │    │   QA     │     │
│  │  Agent    │    │  Voice   │    │   AI     │    │  Engine  │     │
│  │  (Browser)│    │  (WebRTC)│    │ (Gemini) │    │ (Gemini) │     │
│  └─────┬────┘    └─────┬────┘    └─────┬────┘    └─────┬────┘     │
│        │               │               │               │            │
│        ▼               ▼               ▼               ▼            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL + Redis                        │  │
│  │  personas │ simulations │ transcripts │ emotions │ qa_scores │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Features: Personality Engine • Emotion Tracker • 8-Dim QA   │  │
│  │  Difficulty Presets • Hidden Objectives • Call Replay        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Why Vaani Voice AI

We evaluated 12 voice AI providers. Vaani won on three critical dimensions:

| Requirement | Why Vaani | What Others Lack |
|-------------|-----------|-----------------|
| **Natural interruptions** | Agent can interrupt customer mid-sentence, customer can interrupt agent — just like real calls | Most providers enforce strict turn-taking; feels robotic |
| **Low latency** | < 500ms voice-to-voice; customers respond in real time | Others: 1-3s delay breaks immersion |
| **Persona override** | `modify_agent` API lets us inject personality, mood, backstory per-call | Locked personas; can't customize behavior |
| **Live captions** | WebSocket stream of real-time transcript during call | Post-call only; no live feedback |
| **Emotion in voice** | Customer tone shifts based on conversation context | Monotone or pre-set emotions only |

### How Vaani is Used

| Stage | What Happens | Vaani Endpoint |
|-------|-------------|---------------|
| **Call Setup** | Create WebRTC session with persona config, background noise, filler words, guardrails | `POST /api/trigger-call/` |
| **During Call** | Real-time speech-to-speech with natural turn-taking, interruptions, emotion | LiveKit WebRTC + Vaani |
| **Live Captions** | WebSocket streams transcript segments to browser in real-time | `live_captions_url` |
| **Call End** | Fetch full transcript, summary, extracted entities, evaluation | `GET /api/transcript/`, `GET /api/call_details/` |
| **Recording** | Stream audio recording through server proxy (auth header required) | `GET /api/stream/` |
| **Persona Override** | Inject custom system prompt, greeting, language per simulation | `POST /api/modify_agent/` |

### When Vaani is Called

```
User clicks "Start Voice Call"
  → POST /api/voice/session (builds modify_agent config)
    → Vaani /api/trigger-call/ (returns WebRTC token + room)
      → LiveKit connects (browser ↔ Vaani)
        → Voice call runs (real-time STT ↔ TTS)
          → User clicks "End Call"
            → GET /api/transcript/{callId} (with 3x retry, 5s delay)
            → GET /api/call_details/{callId} (summary + entities + eval)
            → GET /api/stream/{callId} (recording URL for replay)
```

### Why Not Build Our Own Voice AI

- **12-18 months** to reach Vaani's latency + naturalness
- **$2M+** in infrastructure, TTS/STT models, voice actors
- **Ongoing maintenance**: accent support, language models, emotion detection
- Vaani lets us focus on the **training product**, not voice plumbing

---

## Screenshots

<table>
<tr>
<td><strong>Landing Page</strong></td>
<td><strong>Dashboard</strong></td>
<td><strong>Persona Builder</strong></td>
</tr>
<tr>
<td><img src="screenshots/01-landing.png" width="400"></td>
<td><img src="screenshots/02-dashboard.png" width="400"></td>
<td><img src="screenshots/04-create-persona.png" width="400"></td>
</tr>
<tr>
<td><strong>Active Simulation</strong></td>
<td><strong>Voice Call in Progress</strong></td>
<td><strong>Replay & QA Scoring</strong></td>
</tr>
<tr>
<td><img src="screenshots/05-simulation.png" width="400"></td>
<td><img src="screenshots/06-voice-call.png" width="400"></td>
<td><img src="screenshots/07-replay-qa.png" width="400"></td>
</tr>
</table>

---

## Engineering Deep-Dive

### 1. Voice Session Orchestration

The voice session API (`/api/voice/session`) is the brain of the simulator. It constructs a `modify_agent` payload that transforms a generic Vaani agent into a specific customer persona:

```typescript
// What we send to Vaani per call
modify_agent: {
  persona: {
    identity: {
      system_prompt: dynamicBasedOnPersona,  // Backstory + mood + hidden objective
      greeting_message: moodBasedGreeting,    // Hinglish based on persona mood
    },
    senses_capabilities: {
      language: "hi",                    // Hindi primary, English secondary
      mouth: { primary: { voice_name: genderMappedVoice } }
    }
  },
  experience: {
    filler_words: { enabled: true, frequency: difficultyMapped },
    eagerness_to_speak: difficultyMapped,     // slow/balanced/fast
    patience_with_user_entries: difficultyMapped,  // 0-3
    idle_conversation_settings: {
      pulse_check: true,
      end_conversation_on_idle: true,
      timeout: difficultyMapped,
    }
  },
  training: {
    know_how: { guardrails: difficultyMapped }  // basic/medium/strict
  }
}
```

### 2. Difficulty Presets

Five levels that auto-configure the entire simulation experience:

| Level | Background Noise | Filler Words | Max Duration | Idle Timeout | Guardrails | Eagerness | Patience |
|-------|-----------------|-------------|-------------|-------------|-----------|-----------|----------|
| **Beginner** | Off | 0% | 10 min | 60s | Basic | Slow | 3 entries |
| **Intermediate** | Office (30%) | 20% | 15 min | 45s | Medium | Balanced | 2 entries |
| **Advanced** | Cafe (50%) | 30% | 15 min | 30s | Medium | Fast | 1 entry |
| **Expert** | Street (70%) | 40% | 10 min | 20s | Strict | Fast | 0 entries |
| **Nightmare** | Street (80%) | 50% | 10 min | 15s | Strict | Fast | 0 entries |

### 3. Emotion Tracking

Customer emotions are tracked in real-time via a valence-arousal model:

```
Emotion      Valence    Arousal    Color
─────────────────────────────────────────
Happy         +0.7       0.5       #4caf50
Polite        +0.3       0.3       #2d5da1
Neutral        0.0       0.3       #2d5da1
Confused      -0.3       0.5       #ffd93d
Impatient     -0.4       0.8       #ff6b35
Worried       -0.4       0.6       #9c27b0
Frustrated    -0.6       0.7       #ff8c42
Sarcastic     -0.2       0.4       #607d8b
Demanding     -0.5       0.8       #e91e63
Angry         -0.8       0.9       #ff4d4d
```

Each customer message updates the emotion state. The replay page visualizes the full emotion journey as a color-coded timeline.

### 4. QA Scoring (8 Dimensions)

After each call, Gemini evaluates the agent across 8 dimensions with evidence-based feedback:

| Dimension | What It Measures |
|-----------|-----------------|
| **Empathy** | Did the agent acknowledge feelings? Show understanding? |
| **Active Listening** | Did they respond to what was actually said, not redirect? |
| **Confidence** | Clear, authoritative speech? No over-apologizing? |
| **Ownership** | Took responsibility? Didn't blame others? |
| **Call Control** | Guided conversation, set expectations, managed flow? |
| **Compliance** | Followed procedures, verified identity, disclosed info? |
| **Resolution** | Actually solved the problem or provided clear next steps? |
| **Communication** | Clear language, no jargon, appropriate pace? |

Each dimension scored 0-100. "Areas to Improve" section flags dimensions below 60.

### 5. Transcript Fetch with Retry Logic

Vaani needs ~5 seconds post-call to process transcripts. Our fetch API implements:

```
Attempt 1: Wait 5s → GET /api/transcript/{callId}
  ↓ (empty or error)
Attempt 2: Wait 8s → GET /api/transcript/{callId}
  ↓ (empty or error)
Attempt 3: Wait 10s → GET /api/transcript/{callId}
  ↓ (empty or error)
Return empty array (user can retry manually)
```

### 6. Recording Proxy

Vaani audio streams require `X-API-Key` headers. Browsers can't send custom headers with `<audio>` tags. Solution: server-side proxy that adds auth headers and streams audio through `/api/simulations/[id]/recording`.

### 7. Hidden Objectives

Every AI customer has a secret goal never revealed to the trainee:

| Persona | Visible Issue | Hidden Objective |
|---------|--------------|-----------------|
| Priya Sharma | Internet slow | Wants refund + free hotspot |
| James Thompson | Suspicious transaction | Wants to file police complaint |
| Sarah Chen | Dashboard down | Considering cancelling subscription |
| Ahmed Al-Rashid | Car claim delayed | Wants to threaten legal action |
| Fatima Khan | Prescription denied | Wants to go to media |

Trainees must **discover** the hidden objective through skilled questioning — just like real calls.

---

## Architecture

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16, React 19, TypeScript | App Router, Server Components, type safety |
| **Styling** | Tailwind CSS + Hand-drawn design | Wobbly borders, sketch fonts, sticky-note cards |
| **Auth** | NextAuth.js v5 (Credentials + JWT) | Lightweight, no OAuth dependency for MVP |
| **Database** | PostgreSQL 17 + Drizzle ORM | SQL-first, no codegen, type-safe queries |
| **Voice AI** | Vaani Voice AI (WebRTC) | Natural interruptions, low latency, persona override |
| **LLM** | Google Gemini (3.1 Flash Lite) | Text chat, QA scoring, persona responses |
| **Infrastructure** | Docker (PostgreSQL), local dev | Fast iteration, no cloud dependency |

### Database Schema

```
users ──────────┐
                ├──► simulations ──┐
personas ───────┘         │       │
                          │       ├──► qa_score (0-100)
                          │       ├──► transcript (JSONB)
                          │       ├──► emotion_timeline (JSONB)
                          │       └──► call_id (Vaani reference)

user_settings ──────► per-user API keys (Vaani, Gemini, OpenAI)
```

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/signup` | POST | User registration |
| `/api/personas` | GET/POST | List/create personas |
| `/api/personas/[id]` | GET/PUT/DELETE | Single persona CRUD |
| `/api/simulations` | GET/POST | List/create simulations |
| `/api/simulations/[id]` | GET/PATCH | Single simulation |
| `/api/simulations/[id]/chat` | POST | Text-based AI chat |
| `/api/simulations/[id]/transcript` | GET/POST | Transcript CRUD |
| `/api/simulations/[id]/fetch-transcript` | POST | Fetch from Vaani API |
| `/api/simulations/[id]/call-details` | POST | Fetch summary + entities |
| `/api/simulations/[id]/recording` | GET | Proxy audio stream |
| `/api/simulations/[id]/score` | POST | Gemini QA scoring |
| `/api/voice/session` | POST | Create Vaani voice session |
| `/api/settings` | GET/PUT | User API key settings |
| `/api/settings/keys` | GET | Masked key display |

### File Structure

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx              # Email/password login
│   │   ├── signup/page.tsx             # Registration with validation
│   │   └── layout.tsx                  # Centered auth card
│   ├── (dashboard)/
│   │   ├── page.tsx                    # Stats, recent sims, quick actions
│   │   ├── simulations/
│   │   │   ├── new/page.tsx            # Persona picker + mode select
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Active call (text/voice + settings)
│   │   │       └── replay/page.tsx     # 4-tab replay + QA breakdown
│   │   ├── personas/
│   │   │   ├── page.tsx                # Persona grid with traits
│   │   │   ├── new/page.tsx            # Persona builder
│   │   │   └── [id]/edit/page.tsx      # Edit persona
│   │   ├── analytics/page.tsx          # Score trends + history
│   │   └── settings/page.tsx           # API key management
│   └── api/                            # 16 REST endpoints
├── components/
│   ├── VoiceCall.tsx                   # LiveKit WebRTC + live captions
│   ├── Navbar.tsx                      # Auth-aware navigation
│   ├── Footer.tsx                      # Footer
│   └── landing/                        # 13 marketing components
├── lib/
│   ├── auth.ts                         # NextAuth v5 config
│   ├── api-keys.ts                     # Per-user API key resolver
│   ├── db/
│   │   ├── index.ts                    # Drizzle client
│   │   └── schema.ts                   # 4 tables, full types
│   └── utils.ts                        # cn() helper
└── scripts/
    ├── seed.ts                         # Admin user
    └── seed-personas.ts                # 5 prebuilt personas
```

---

## Features

### For Trainees
- **Voice calls** with AI customers that interrupt, get emotional, have hidden agendas
- **Text chat mode** for practice without voice
- **Live transcript** with speaker labels and timestamps
- **Call replay** with audio playback, timestamped transcript, emotion timeline
- **QA breakdown** with 8-dimension scoring and evidence
- **Difficulty presets** — auto-configure noise, filler words, guardrails, eagerness
- **Hidden objectives** — discover the real issue through skilled questioning
- **Retry flow** — replay the same persona until mastered

### For Admins/Trainers
- **Custom personas** — emoji, industry, difficulty, backstory, hidden objective, 6 personality sliders
- **Prebuilt personas** — 5 across banking, telecom, SaaS, insurance, healthcare
- **Analytics dashboard** — completed calls, avg QA score, practice minutes, score trend chart
- **Per-user API keys** — settings stored in DB with env var fallback
- **Prebuilt persona protection** — cannot delete seeded personas

### Technical
- **Vaani `modify_agent`** — real-time persona override per call
- **Live captions** — WebSocket stream during voice calls
- **Transcript retry** — 3x attempts with exponential backoff
- **Recording proxy** — server-side auth header injection
- **Emotion tracking** — valence-arousal model with 10 mood states
- **Dual mode** — text and voice in same simulation, toggle between modes
- **Hinglish voice** — Hindi primary, English secondary, natural expressions

---

## Quick Start

### Prerequisites

- Node.js 20+ (nvm recommended)
- Docker (PostgreSQL)
- [Vaani API key](https://vaanivoice.ai)
- [Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Clone
git clone https://github.com/ashusnapx/contact-center-simulator.git
cd contact-center-simulator

# 2. Start PostgreSQL
docker compose up -d

# 3. Install dependencies
source ~/.nvm/nvm.sh  # if using nvm
cd apps/web
npm install

# 4. Configure environment
cp env.example .env.local
# Edit .env.local with your API keys

# 5. Set up database
npx drizzle-kit push
npx tsx scripts/seed-personas.ts

# 6. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
DATABASE_URL=postgresql://vaaniverse:vaaniverse_dev@localhost:5432/vaaniverse
GEMINI_API_KEY=your_gemini_key         # Starts with "AQ."
VAANI_API_KEY=your_vaani_key           # Vaani Voice AI
VAANI_BASE_URL=https://api.vaanivoice.ai
VAANI_AGENT_ID=your_agent_id           # UUID from Vaani dashboard
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Market Opportunity

- **$380B** global contact centre market (2026)
- **65%** of agents receive inadequate training
- **73%** of customers leave after one bad experience
- **$15K** average cost to replace a single agent
- **0** existing flight simulator products for contact centres

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 1 — MVP** | Voice AI, personas, emotion engine, QA scoring, call replay, analytics | **Complete** |
| **Phase 2** | CRM simulation, knowledge base, document ingestion, AI scenario generator | Next |
| **Phase 3** | Multi-party calls, team simulations, live coaching, accent packs | Planned |
| **Phase 4** | Full Digital Twin, multi-agent workflows, omnichannel, predictive readiness | Vision |

---

## License

MIT
