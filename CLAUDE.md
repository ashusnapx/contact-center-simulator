# Project Memory

## Design System: Hand-Drawn Style

ALL UI/UX follows this design system. No exceptions.

### Core Principles
- **No straight lines**: irregular border-radius on everything (wobbly, organic)
- **Authentic texture**: paper grain, dot patterns, backgrounds
- **Playful rotation**: small transforms (-2deg to 2deg) on elements
- **Hard offset shadows**: solid `4px 4px 0px 0px #2d2d2d` — NO blur
- **Handwritten fonts**: Kalam (headings, 700), Patrick Hand (body, 400)
- **Scribbled decorations**: dashed lines, arrows, tape, thumbtacks
- **Limited palette**: pencil black, paper white, correction red, post-it yellow
- **Intentional messiness**: overlap, asymmetry, spontaneous feel

### Colors
| Token | Value | Use |
|-------|-------|-----|
| Background | `#fdfbf7` | Page bg (warm paper) |
| Foreground | `#2d2d2d` | Text (soft pencil, never pure black) |
| Muted | `#e5e0d8` | Borders, disabled, placeholders |
| Accent | `#ff4d4d` | CTA, highlights (red correction marker) |
| Border | `#2d2d2d` | Borders (pencil lead) |
| Secondary Accent | `#2d5da1` | Links, focus states (blue ballpoint) |
| Post-it Yellow | `#fff9c4` | Feature cards, sticky notes |

### Typography
- Headings: `Kalam` weight 700 — thick felt-tip marker feel
- Body: `Patrick Hand` weight 400 — legible handwritten
- Scale: Large and dramatic. Vary heading sizes for emphasis.

### Border Radius (CRITICAL)
Standard `rounded-*` classes forbidden. Use irregular values:
```
border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; /* wobbly */
border-radius: 15px 225px 15px 255px / 225px 15px 255px 15px; /* wobblyMd */
```

### Shadows
- Standard: `box-shadow: 4px 4px 0px 0px #2d2d2d;`
- Emphasized: `box-shadow: 8px 8px 0px 0px #2d2d2d;`
- Hover: reduce to `2px 2px` (lifting effect)
- Active: no shadow (press flat)

### Buttons
- Wobbly oval, white bg, 3px black border, Patrick Hand font
- Hover: red bg `#ff4d4d`, white text, shadow shrinks, translate +2px
- Active: shadow gone, translate +4px (press flat)
- Secondary: muted bg `#e5e0d8`, hovers to blue `#2d5da1`

### Cards
- White bg, wobbly border, subtle depth shadow
- Decorations: tape strip, thumbtack, post-it yellow variant
- Hover: slight rotation (`hover:rotate-1`)
- Speech bubbles for testimonials

### Inputs
- Full box with wobbly borders (not underline)
- Patrick Hand font, white bg
- Focus: blue border `#2d5da1`, blue ring

### Layout
- Max-width: `max-w-5xl`
- Grid: responsive Tailwind (`md:grid-cols-2/3`)
- Apply rotations to cards/images for irregularity
- Section padding: `py-20`
- Gap: `gap-8`
- Icons: lucide-react, stroke-width 2.5-3

### Responsive
- Mobile-first, stack on small screens
- Hide decorative elements on mobile (`hidden md:block`)
- Maintain wobbly borders + handwritten fonts at all sizes
- Touch targets: min `h-12` (48px)

### Animations
- Hover jiggle: `hover:rotate-1` or `hover:-rotate-2`
- Transition: `transition-transform duration-100`
- Gentle bounce for decorative elements (3s)

---

## Product: VaaniVerse — AI Contact Centre Flight Simulator

### Vision
World's first AI Contact Centre Flight Simulator. Virtual contact centre where agents learn by doing, fail safely, improve continuously, become production-ready before talking to real customers.

### Core Problem
Traditional training (PowerPoint → Trainer Roleplay → Few Mock Calls → LIVE CUSTOMERS) is repetitive, subjective, lacks edge-case training, emotional realism, and pressure simulation.

### What We Build
AI Contact Centre Simulator — simulates the ENTIRE job, not just one conversation.

### Product Architecture
```
Customer → Voice (Vaani) → CRM + Knowledge Base + Policies + Compliance + Emotion + Memory + Time Pressure + Supervisor + Noise → Trainee Agent → AI Coach + Analytics
```

### Core Features (20)
1. **AI Customer Engine** — unlimited unique personas (age, accent, mood, personality, patience, technical knowledge, urgency, stress)
2. **Dynamic Emotional Engine** — emotions evolve during call (happy → confused → angry → relieved)
3. **Customer Memory** — remembers interruptions, promises, repeated questions, tone
4. **CRM Simulator** — navigate profiles, order history, tickets, invoices, refund status
5. **Knowledge Base** — trainee searches company docs, answers don't come auto
6. **Compliance Engine** — identity verification, GDPR, PCI, policy violations, missing disclosures
7. **Background Environment** — crying baby, traffic, poor network, office noise, typing
8. **Time Pressure** — "I have one minute", flight boarding, tests concise communication
9. **AI Supervisor** — post-call explains mistakes, strengths, alternatives (not just score)
10. **Replay Mode** — jump to any timestamp, retry that section until mastered
11. **AI QA Dashboard** — 14 dimensions with timestamps (empathy, listening, confidence, ownership, call control, compliance, resolution, communication, dead air, interruptions, filler words, professionalism, tone, escalation handling)
12. **Personality Generator** — hidden traits (agreeableness 32%, patience 81%, trust 24%, stress 72%)
13. **Hidden Objectives** — customer never tells full story (visible: "internet slow" / hidden: wants refund, discount, considering cancellation)
14. **Difficulty Levels** — Beginner → Intermediate → Advanced → Expert → Nightmare (interruptions, shouting, sarcasm, threats, emotional manipulation)
15. **Accent Engine** — Indian, American, British, Australian, Filipino, Middle Eastern, African, European
16. **Industry Packs** — Banking, Telecom, Insurance, Healthcare, SaaS, E-commerce, Travel, Logistics, Retail
17. **AI Scenario Generator** — upload SOP/PDF/policy → auto-generates personas, conversations, edge cases, quizzes
18. **Career Mode** — gamified (Level 1 → Junior Agent → Senior → Escalation Specialist → Team Lead → Supervisor), XP, badges, streaks, rankings
19. **Live Performance Prediction** — CSAT, QA Score, FCR, Escalation Rate, AHT, Readiness Score
20. **AI Hiring Mode** — candidates complete AI calls, recruiters get objective reports

### Competitive Advantages
1. Real-time Voice (Vaani) — natural interruptions, low latency
2. Infinite Simulations — no scripted flows, every call dynamic
3. Emotion Engine — emotions evolve during conversation
4. Long-term Memory — customers remember previous interactions
5. Company-Specific Training — upload docs, AI learns processes
6. Objective Evaluation — analytics with evidence, not trainer opinions
7. Unlimited Practice — train anytime without human trainers
8. Rare Scenario Training — prepare for once-a-year situations
9. Digital Twin — realistic virtual replica of contact centre
10. Enterprise Ready — onboarding, certification, refresher, QA, hiring, coaching, promotions, compliance audits

### Roadmap
- **Phase 1 (MVP):** Voice AI (Vaani), AI personas, emotion engine, QA scoring, call replay, analytics dashboard
- **Phase 2:** CRM simulation, knowledge base, doc ingestion, scenario generator, supervisor AI
- **Phase 3:** Multi-party calls, team simulations, live coaching, accent/industry packs, hiring assessments
- **Phase 4:** Full Digital Twin, multi-agent workflows, omnichannel, predictive readiness, benchmarking

---

## Tech Stack

### Frontend
- **Next.js 16 (App Router)** + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Framer Motion** — animations
- **TanStack Query** — data fetching
- **TanStack Table** — analytics tables
- **React Hook Form + Zod** — forms + validation
- **Zustand** — state management
- **Recharts + Tremor** — charts/dashboards

### Authentication
- **Clerk** — enterprise SSO, Google/Microsoft, MFA, organizations, RBAC, audit logs

### Backend
- **Next.js Server Actions + Route Handlers** (app logic, TypeScript)
- **FastAPI (Python)** (ML, embeddings, analytics, evaluation)

### API
- **tRPC** — end-to-end type safety

### Database
- **PostgreSQL 17** + **Drizzle ORM** (SQL-first, type-safe)
- **pgvector** — embeddings (SOP, PDFs, policies, manuals)

### Cache
- **Redis** — session state, active simulations, rate limiting, conversation context, queues, leaderboard

### Voice AI
- **Vaani API** — Speech-to-Speech, interruptions, natural turn taking, low latency

### LLM Layer
- Abstraction via **LiteLLM** or custom provider router
- Customer simulation: GPT-5.5 / Gemini 2.5 Pro / Claude
- Persona generation: GPT-5.5
- Scenario generation: Claude
- QA evaluation: GPT-5.5
- Report generation: Claude
- Knowledge extraction: Gemini

### AI Framework
- **LangGraph** — long-running simulations, multi-agent workflows, memory, branching, supervisor orchestration

### Realtime
- **LiveKit** — WebRTC, audio streams, screen sharing, supervisor monitoring

### Background Jobs
- **Inngest** — report generation, PDF processing, email, embeddings, analytics aggregation

### Object Storage
- **Cloudflare R2** — recordings, PDFs, reports, transcripts (S3-compatible, lower egress)

### Search
- **Meilisearch** — scenarios, agents, customers, reports, transcripts

### Analytics DB
- **ClickHouse** — millions of call events, speaking speed, interruptions, latency

### Observability
- **OpenTelemetry** + **Grafana** + **Prometheus** + **Sentry**

### CI/CD
- **GitHub Actions** + **TurboRepo** + **Changesets** + **Renovate**

### Infrastructure
- **Vercel** (frontend + light APIs)
- **Railway / Fly.io** (Python workers, early)
- **Kubernetes (AKS/EKS/GKE)** (enterprise scale)

### Testing
- **Vitest** + **Playwright** + **React Testing Library**
- **pytest** (Python services)

---

## Architecture Principles

### Provider Abstraction (CRITICAL)
Design around interfaces, not vendors:
- `VoiceProvider` (Vaani today, others later)
- `LLMProvider` (GPT-5.5, Claude, Gemini)
- `EmbeddingProvider`
- `StorageProvider`
Prevents vendor lock-in. Enables cost/latency/quality optimization.

### Folder Structure
```
apps/
 ├── web
 ├── admin
 ├── api
packages/
 ├── ui
 ├── database
 ├── auth
 ├── ai
 ├── prompts
 ├── analytics
 ├── voice
 ├── shared
 ├── config
services/
 ├── scenario-engine
 ├── qa-engine
 ├── emotion-engine
 ├── rag-engine
 ├── report-engine
 ├── analytics-engine
 ├── ingestion-engine
infra/
 ├── docker
 ├── terraform
 ├── kubernetes
```

### AI Agent Architecture
```
Supervisor AI
    ├── Customer AI
    ├── Emotion AI
    ├── Compliance AI
    ├── Knowledge AI
    ├── QA AI
    ├── Coach AI
    ├── Analytics AI
    └── Hiring AI
```

### AI Evaluation Pipeline
Transcript → Emotion Timeline → Compliance Check → Soft Skills → Speaking Analytics → Conversation Graph → Recommendations → Final Report
