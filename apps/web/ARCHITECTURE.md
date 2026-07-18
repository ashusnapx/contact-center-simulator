# VaaniVerse MVP — Architecture Document

**Version:** 1.0
**Phase:** MVP (Phase 1)
**Date:** 2026-07-18

---

## 1. Design Decisions & Rationale

### Why not a monorepo split yet

MVP lives in `apps/web` as a single Next.js app. Database, AI engines, API routes — all co-located. When scale demands it, extract to `packages/database`, `services/qa-engine`, etc. Premature extraction = premature complexity.

### Why not tRPC for MVP

Server Actions + standard fetch keep velocity high. tRPC adds setup cost with no payoff at MVP stage. Add it in Phase 2 when client-server contract stabilizes.

### Why Zustand over Redux

Fewer boilerplate lines. Built-in immer support. No providers needed. Perfect for real-time simulation state (active call, emotion timeline, transcript segments).

### Why Drizzle over Prisma

SQL-first. No codegen step. Better performance. Type inference from schema directly. Works with PostgreSQL 17 + pgvector for future embedding needs.

---

## 2. Folder Structure

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx                    # Auth layout (centered card)
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # Dashboard shell (sidebar + topbar)
│   │   ├── page.tsx                      # Dashboard home / overview
│   │   ├── simulations/
│   │   │   ├── page.tsx                  # List all simulations
│   │   │   ├── new/page.tsx              # Start new simulation
│   │   │   └── [id]/
│   │   │       ├── page.tsx              # Active call view
│   │   │       └── replay/page.tsx       # Call replay + review
│   │   ├── analytics/
│   │   │   └── page.tsx                  # Analytics dashboard
│   │   ├── personas/
│   │   │   └── page.tsx                  # Persona browser
│   │   └── settings/
│   │       └── page.tsx                  # User settings
│   ├── api/
│   │   ├── auth/[...all]/route.ts        # Clerk handler
│   │   ├── simulations/
│   │   │   ├── route.ts                  # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts              # GET (single), PATCH, DELETE
│   │   │       ├── call/
│   │   │       │   └── route.ts          # POST (trigger Vaani call)
│   │   │       ├── transcript/
│   │   │       │   └── route.ts          # GET (fetch from Vaani)
│   │   │       └── qa/
│   │   │           └── route.ts          # GET (run QA scoring)
│   │   ├── personas/
│   │   │   ├── route.ts                  # GET (list), POST (generate)
│   │   │   └── [id]/route.ts            # GET, PATCH, DELETE
│   │   ├── emotions/
│   │   │   └── [simulationId]/route.ts  # GET emotion timeline
│   │   └── webhooks/
│   │       └── vaani/
│   │           └── route.ts             # Vaani event callbacks
│   ├── layout.tsx                        # Root layout (fonts, providers)
│   ├── page.tsx                          # Landing page (existing)
│   └── globals.css                       # Hand-drawn design system
├── components/
│   ├── ui/                               # Design system primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── sidebar.tsx
│   │   └── progress.tsx
│   ├── simulation/                       # Call simulation components
│   │   ├── call-interface.tsx            # Main call UI (waveform, timer, controls)
│   │   ├── transcript-panel.tsx          # Live transcript display
│   │   ├── emotion-indicator.tsx         # Real-time emotion gauge
│   │   ├── qa-scorecard.tsx              # 14-dimension scorecard
│   │   ├── call-controls.tsx             # Mute, end, hold buttons
│   │   └── persona-card.tsx              # Customer persona display
│   ├── replay/                           # Call replay components
│   │   ├── replay-player.tsx             # Timeline + playback controls
│   │   ├── transcript-scroller.tsx       # Clickable transcript segments
│   │   └── emotion-timeline.tsx          # Emotion chart over time
│   ├── analytics/                        # Dashboard charts/tables
│   │   ├── performance-card.tsx
│   │   ├── qa-trends-chart.tsx
│   │   ├── emotion-distribution.tsx
│   │   └── metrics-grid.tsx
│   └── landing/                          # Existing marketing components
│       ├── Hero.tsx
│       └── ... (existing)
├── lib/
│   ├── db/
│   │   ├── index.ts                      # Drizzle client singleton
│   │   ├── schema/
│   │   │   ├── index.ts                  # Re-exports all tables
│   │   │   ├── users.ts                  # Users table
│   │   │   ├── simulations.ts            # Simulations table
│   │   │   ├── personas.ts               # AI personas table
│   │   │   ├── transcripts.ts            # Transcript segments table
│   │   │   ├── emotions.ts               # Emotion timeline table
│   │   │   ├── qa-scores.ts              # QA evaluation results table
│   │   │   └── call-events.ts            # Raw call events (analytics)
│   │   └── migrations/                   # Drizzle migration files
│   ├── ai/
│   │   ├── persona-engine.ts             # Persona generation + trait calculation
│   │   ├── emotion-engine.ts             # Emotion state machine
│   │   ├── qa-engine.ts                  # 14-dimension QA scoring
│   │   ├── prompts/
│   │   │   ├── persona-generation.ts     # System prompts for persona creation
│   │   │   ├── emotion-analysis.ts       # Emotion detection prompts
│   │   │   ├── qa-scoring.ts             # QA evaluation prompts
│   │   │   └── summary.ts               # Call summary prompts
│   │   └── providers/
│   │       ├── llm-provider.ts           # LLMProvider interface
│   │       └── openai-provider.ts        # OpenAI implementation
│   ├── vaani/
│   │   ├── client.ts                     # Vaani API HTTP client
│   │   ├── types.ts                      # Vaani API type definitions
│   │   ├── webrtc.ts                     # WebRTC session management
│   │   └── captions.ts                   # Live captions WebSocket handler
│   ├── hooks/
│   │   ├── use-call.ts                   # Active call state + controls
│   │   ├── use-transcript.ts             # Live transcript streaming
│   │   ├── use-emotions.ts              # Emotion polling/streaming
│   │   └── use-replay.ts                # Replay playback state
│   ├── stores/
│   │   ├── simulation-store.ts           # Zustand: active simulation state
│   │   ├── transcript-store.ts           # Zustand: transcript segments
│   │   └── ui-store.ts                   # Zustand: sidebar, modals, toasts
│   └── utils.ts                          # cn() helper (existing)
├── types/
│   ├── simulation.ts                     # Shared simulation types
│   ├── persona.ts                        # Persona + trait types
│   ├── emotion.ts                        # Emotion state types
│   ├── qa.ts                             # QA dimension types
│   └── api.ts                            # API request/response types
├── public/
│   └── ... (existing assets)
├── middleware.ts                          # Clerk auth middleware
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts                    # (if needed beyond globals.css)
└── package.json
```

---

## 3. Database Schema (PostgreSQL + Drizzle ORM)

### 3.1 Users

```typescript
// lib/db/schema/users.ts
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("trainee"), // trainee | supervisor | admin
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 3.2 Personas

```typescript
// lib/db/schema/personas.ts
import {
  pgTable,
  text,
  varchar,
  jsonb,
  integer,
  boolean,
  timestamp,
  real,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const personas = pgTable("personas", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  industry: varchar("industry", { length: 100 }).notNull(), // banking | telecom | insurance | healthcare | saas | ecommerce | travel
  difficulty: varchar("difficulty", { length: 50 })
    .notNull()
    .default("beginner"), // beginner | intermediate | advanced | expert | nightmare

  // Demographics
  age: integer("age"),
  accent: varchar("accent", { length: 50 }), // indian | american | british | australian | filipino | middle_eastern | african | european
  occupation: varchar("occupation", { length: 100 }),

  // Personality traits (hidden from trainee, revealed post-call)
  personality: jsonb("personality").notNull().default({}),
  // Shape: { agreeableness: 0-100, patience: 0-100, trust: 0-100, stress: 0-100, technical_knowledge: 0-100, urgency: 0-100 }

  // Behavioral parameters
  initialMood: varchar("initial_mood", { length: 50 })
    .notNull()
    .default("neutral"), // happy | neutral | frustrated | angry | confused
  maxPatience: integer("max_patience").notNull().default(80), // 0-100, determines escalation timing
  interruptionFrequency: real("interruption_frequency").notNull().default(0.2), // 0-1, how often they interrupt
  verbosity: real("verbosity").notNull().default(0.5), // 0-1, how much they talk
  sarcasmLevel: real("sarcasm_level").notNull().default(0.1), // 0-1

  // Hidden objectives (revealed post-call)
  hiddenObjectives: jsonb("hidden_objectives").notNull().default([]),
  // Shape: [{ objective: string, probability: number, trigger: string }]

  // System prompt for the AI customer
  systemPrompt: text("system_prompt").notNull(),

  isBuiltIn: boolean("is_built_in").notNull().default(false),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 3.3 Simulations

```typescript
// lib/db/schema/simulations.ts
import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  jsonb,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { personas } from "./personas";

export const simulations = pgTable("simulations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  personaId: text("persona_id")
    .notNull()
    .references(() => personas.id),

  // Vaani integration
  vaaniCallId: varchar("vaani_call_id", { length: 255 }),
  vaaniRoomName: varchar("vaani_room_name", { length: 255 }),

  // Status
  status: varchar("status", { length: 50 }).notNull().default("created"),
  // created | connecting | active | paused | ended | scored

  // Timing
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),

  // Scenario context
  scenarioDescription: text("scenario_description"),
  difficulty: varchar("difficulty", { length: 50 })
    .notNull()
    .default("beginner"),

  // Pre-call setup (what trainee sees)
  briefing: jsonb("briefing").notNull().default({}),
  // Shape: { customerName: string, issueSummary: string, context: string }

  // Post-call results
  overallScore: real("overall_score"), // 0-100
  qaScores: jsonb("qa_scores"), // Full 14-dimension result (denormalized for fast reads)
  summary: text("summary"),
  recommendations: jsonb("recommendations"),
  // Shape: [{ dimension: string, score: number, feedback: string, evidence: string[] }]

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 3.4 Transcript Segments

```typescript
// lib/db/schema/transcripts.ts
import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { simulations } from "./simulations";

export const transcriptSegments = pgTable("transcript_segments", {
  id: text("id").primaryKey(), // Vaani segment ID
  simulationId: text("simulation_id")
    .notNull()
    .references(() => simulations.id, { onDelete: "cascade" }),

  speaker: varchar("speaker", { length: 50 }).notNull(), // customer | agent
  text: text("text").notNull(),
  startTime: real("start_time").notNull(), // seconds from call start
  endTime: real("end_time"),
  isFinal: boolean("is_final").notNull().default(true),

  // Optional NLP enrichment (added post-call)
  sentiment: varchar("sentiment", { length: 20 }), // positive | negative | neutral
  emotion: varchar("emotion", { length: 50 }), // dominant emotion at this moment
  keywords: text("keywords").array(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 3.5 Emotion Timeline

```typescript
// lib/db/schema/emotions.ts
import {
  pgTable,
  text,
  varchar,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { simulations } from "./simulations";

export const emotionTimeline = pgTable("emotion_timeline", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  simulationId: text("simulation_id")
    .notNull()
    .references(() => simulations.id, { onDelete: "cascade" }),

  timestamp: real("timestamp").notNull(), // seconds from call start
  emotion: varchar("emotion", { length: 50 }).notNull(),
  // happy | confused | frustrated | angry | neutral | relieved | anxious | disappointed

  intensity: real("intensity").notNull(), // 0-1
  valence: real("valence").notNull(), // -1 (negative) to 1 (positive)
  arousal: real("arousal").notNull(), // 0 (calm) to 1 (excited)

  trigger: varchar("trigger", { length: 100 }), // what caused this emotion change
  context: jsonb("context"), // surrounding transcript segments

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 3.6 QA Scores

```typescript
// lib/db/schema/qa-scores.ts
import {
  pgTable,
  text,
  varchar,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { simulations } from "./simulations";

export const qaScores = pgTable("qa_scores", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  simulationId: text("simulation_id")
    .notNull()
    .references(() => simulations.id, { onDelete: "cascade" }),

  dimension: varchar("dimension", { length: 100 }).notNull(),
  // empathy | listening | confidence | ownership | call_control | compliance |
  // resolution | communication | dead_air | interruptions | filler_words |
  // professionalism | tone | escalation_handling

  score: real("score").notNull(), // 0-100
  maxScore: real("max_score").notNull().default(100),

  feedback: text("feedback").notNull(),
  evidence: jsonb("evidence").notNull().default([]),
  // Shape: [{ timestamp: number, speaker: string, text: string, issue: string }]

  suggestions: jsonb("suggestions").notNull().default([]),
  // Shape: ["Try rephrasing as...", "Consider acknowledging..."]

  evaluatedAt: timestamp("evaluated_at").notNull().defaultNow(),
});
```

### 3.7 Call Events (Analytics)

```typescript
// lib/db/schema/call-events.ts
import {
  pgTable,
  text,
  varchar,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { simulations } from "./simulations";

export const callEvents = pgTable("call_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  simulationId: text("simulation_id")
    .notNull()
    .references(() => simulations.id, { onDelete: "cascade" }),

  eventType: varchar("event_type", { length: 100 }).notNull(),
  // transcript_segment | emotion_shift | agent_silence | agent_interruption |
  // compliance_flag | escalation | hold | transfer | resolution

  timestamp: real("timestamp").notNull(),
  data: jsonb("data").notNull().default({}),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

---

## 4. Vaani API Client Abstraction

```typescript
// lib/vaani/types.ts
export interface VaaniConfig {
  apiKey: string;
  baseUrl: string;
}

export interface TriggerCallRequest {
  medium: "webrtc";
  metadata?: Record<string, string>;
}

export interface TriggerCallResponse {
  token: string;
  room_name: string;
  connection_url: string;
  live_captions_url: string;
  call_id: string;
}

export interface TranscriptSegment {
  speaker: string;
  text: string;
  timestamp: number;
  is_final: boolean;
}

export interface CallDetails {
  call_id: string;
  transcript: TranscriptSegment[];
  entities: Record<string, unknown>;
  conversation_eval: Record<string, unknown>;
  summary: string;
  duration_seconds: number;
}

export interface VaaniModifyAgentRequest {
  persona?: string;
  training?: string;
  experience?: string;
  analysis?: string;
}
```

```typescript
// lib/vaani/client.ts
import type {
  VaaniConfig,
  TriggerCallRequest,
  TriggerCallResponse,
  CallDetails,
  VaaniModifyAgentRequest,
} from "./types";

export class VaaniClient {
  private config: VaaniConfig;

  constructor(config: VaaniConfig) {
    this.config = config;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "X-API-Key": this.config.apiKey,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new VaaniApiError(response.status, error, path);
    }

    return response.json() as Promise<T>;
  }

  async triggerCall(request: TriggerCallRequest): Promise<TriggerCallResponse> {
    return this.request<TriggerCallResponse>(
      "POST",
      "/api/trigger-call/",
      request,
    );
  }

  async getCallDetails(callId: string): Promise<CallDetails> {
    return this.request<CallDetails>("GET", `/api/call_details/${callId}`);
  }

  async getTranscript(callId: string): Promise<string> {
    return this.request<string>("GET", `/api/transcript/${callId}`);
  }

  async getAudioStream(callId: string): Promise<ReadableStream<Uint8Array>> {
    const url = `${this.config.baseUrl}/api/stream/${callId}`;
    const response = await fetch(url, {
      headers: { "X-API-Key": this.config.apiKey },
    });

    if (!response.ok) {
      throw new VaaniApiError(
        response.status,
        "Failed to stream audio",
        callId,
      );
    }

    return response.body!;
  }

  async modifyAgent(
    callId: string,
    request: VaaniModifyAgentRequest,
  ): Promise<void> {
    await this.request<void>("POST", `/api/modify_agent/${callId}`, request);
  }

  getCaptionsUrl(callId: string): string {
    return `${this.config.baseUrl.replace("http", "ws")}/api/captions/${callId}`;
  }
}

export class VaaniApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public path: string,
  ) {
    super(`Vaani API ${status} on ${path}: ${message}`);
    this.name = "VaaniApiError";
  }
}

// Singleton
let vaaniClient: VaaniClient | null = null;

export function getVaaniClient(): VaaniClient {
  if (!vaaniClient) {
    vaaniClient = new VaaniClient({
      apiKey: process.env.VAANI_API_KEY!,
      baseUrl: process.env.VAANI_BASE_URL || "https://api.vaanivoice.ai",
    });
  }
  return vaaniClient;
}
```

### Provider Abstraction

```typescript
// lib/ai/providers/llm-provider.ts
export interface LLMProvider {
  chat(params: {
    system: string;
    messages: { role: "user" | "assistant"; content: string }[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<string>;

  chatJson<T>(params: {
    system: string;
    messages: { role: "user" | "assistant"; content: string }[];
    schema: unknown; // JSON Schema for structured output
    temperature?: number;
  }): Promise<T>;
}
```

```typescript
// lib/ai/providers/openai-provider.ts
import type { LLMProvider } from "./llm-provider";

export class OpenAIProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4o") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(params: Parameters<LLMProvider["chat"]>[0]): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: params.system },
          ...params.messages,
        ],
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 2048,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async chatJson<T>(
    params: Parameters<LLMProvider["chatJson"]>[0],
  ): Promise<T> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content: params.system + "\n\nRespond with valid JSON.",
          },
          ...params.messages,
        ],
        temperature: params.temperature ?? 0.3,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content) as T;
  }
}

// Factory
export function createLLMProvider(): LLMProvider {
  return new OpenAIProvider(process.env.OPENAI_API_KEY!);
}
```

---

## 5. Persona Engine Design

```typescript
// lib/ai/persona-engine.ts
import type { LLMProvider } from "./providers/llm-provider";
import { PERSONA_GENERATION_PROMPT } from "./prompts/persona-generation";
import type { CreatePersonaInput, Persona } from "@/types/persona";

export class PersonaEngine {
  constructor(private llm: LLMProvider) {}

  async generatePersona(
    input: CreatePersonaInput,
  ): Promise<CreatePersonaOutput> {
    const result = await this.llm.chatJson<GeneratedPersona>({
      system: PERSONA_GENERATION_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
      temperature: 0.9, // High creativity for unique personas
    });

    return {
      name: result.name,
      description: result.description,
      industry: input.industry,
      difficulty: input.difficulty,
      age: result.age,
      accent: result.accent,
      occupation: result.occupation,
      personality: this.calculatePersonality(result.personalityRaw),
      initialMood: result.initialMood,
      maxPatience: result.maxPatience,
      interruptionFrequency: result.interruptionFrequency,
      verbosity: result.verbosity,
      sarcasmLevel: result.sarcasmLevel,
      hiddenObjectives: result.hiddenObjectives,
      systemPrompt: result.systemPrompt,
    };
  }

  private calculatePersonality(
    raw: Record<string, number>,
  ): PersonaPersonality {
    // Normalize raw scores to 0-100 and calculate derived traits
    const agreeableness = clamp(raw.agreeableness ?? 50, 0, 100);
    const patience = clamp(raw.patience ?? 50, 0, 100);
    const trust = clamp(raw.trust ?? 50, 0, 100);
    const stress = clamp(raw.stress ?? 50, 0, 100);

    // Derived traits
    const conflictProne = 100 - agreeableness; // Low agreeableness = high conflict
    const escalationRisk = Math.round((stress + (100 - patience)) / 2);

    return {
      agreeableness,
      patience,
      trust,
      stress,
      conflictProne,
      escalationRisk,
      technicalKnowledge: clamp(raw.technicalKnowledge ?? 50, 0, 100),
      urgency: clamp(raw.urgency ?? 50, 0, 100),
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

// Input: what the trainee selects
interface CreatePersonaInput {
  industry: string;
  difficulty: string;
  scenario?: string;
  ageRange?: [number, number];
  accentPreference?: string;
  mood?: string;
}

// Output: stored in DB, used by Vaani
interface CreatePersonaOutput {
  name: string;
  description: string;
  industry: string;
  difficulty: string;
  age: number;
  accent: string;
  occupation: string;
  personality: PersonaPersonality;
  initialMood: string;
  maxPatience: number;
  interruptionFrequency: number;
  verbosity: number;
  sarcasmLevel: number;
  hiddenObjectives: HiddenObjective[];
  systemPrompt: string;
}

interface HiddenObjective {
  objective: string;
  probability: number;
  trigger: string;
  revealed: boolean;
}

interface PersonaPersonality {
  agreeableness: number;
  patience: number;
  trust: number;
  stress: number;
  conflictProne: number;
  escalationRisk: number;
  technicalKnowledge: number;
  urgency: number;
}
```

### Persona Generation Prompt

```typescript
// lib/ai/prompts/persona-generation.ts
export const PERSONA_GENERATION_PROMPT = `You are a persona generator for an AI contact centre flight simulator.

Generate a unique, realistic customer persona based on the provided parameters.
The persona must feel like a real person — not a caricature.

IMPORTANT RULES:
- Hidden objectives must be realistic (e.g., wants refund, considering cancellation, seeking discount)
- Personality traits must be internally consistent (high stress + low patience = easily agitated)
- The system prompt you generate will be used to control an LLM playing this customer
- Include specific details (name, age, recent order number, specific complaint)
- Make them memorable but not cartoonish

Output a JSON object with these exact fields:
{
  "name": "string",
  "description": "2-3 sentence summary",
  "age": number,
  "accent": "indian|american|british|australian|filipino|middle_eastern|african|european",
  "occupation": "string",
  "personalityRaw": {
    "agreeableness": number (0-100),
    "patience": number (0-100),
    "trust": number (0-100),
    "stress": number (0-100),
    "technicalKnowledge": number (0-100),
    "urgency": number (0-100)
  },
  "initialMood": "happy|neutral|frustrated|angry|confused",
  "maxPatience": number (20-95, lower = less patient),
  "interruptionFrequency": number (0-1),
  "verbosity": number (0-1),
  "sarcasmLevel": number (0-1),
  "hiddenObjectives": [
    {
      "objective": "what they actually want",
      "probability": number (0-1),
      "trigger": "what makes them reveal this"
    }
  ],
  "systemPrompt": "Detailed system prompt for the AI customer, including backstory, communication style, triggers, and escalation pattern"
}`;
```

---

## 6. Emotion Engine Design

```typescript
// lib/ai/emotion-engine.ts
import type { LLMProvider } from "./providers/llm-provider";
import type { TranscriptSegment } from "@/lib/vaani/types";
import type { EmotionState, EmotionShift } from "@/types/emotion";

const EMOTION_HIERARCHY: Record<string, string[]> = {
  // Emotions that can transition to each other
  happy: ["confused", "neutral", "relieved"],
  neutral: ["confused", "frustrated", "happy", "anxious"],
  confused: ["frustrated", "neutral", "anxious"],
  frustrated: ["angry", "confused", "relieved"],
  angry: ["frustrated", "neutral"],
  anxious: ["confused", "frustrated", "relieved"],
  relieved: ["happy", "neutral"],
  disappointed: ["frustrated", "angry", "neutral"],
};

export class EmotionEngine {
  // Track emotional state across the call
  private state: EmotionState;
  private history: EmotionShift[];

  constructor(
    private llm: LLMProvider,
    initialMood: string,
    personality: { patience: number; stress: number; agreeableness: number },
  ) {
    this.state = {
      emotion: initialMood,
      intensity: moodToIntensity(initialMood),
      valence: moodToValence(initialMood),
      arousal: moodToArousal(initialMood),
    };
    this.history = [
      {
        timestamp: 0,
        emotion: this.state.emotion,
        intensity: this.state.intensity,
        valence: this.state.valence,
        arousal: this.state.arousal,
        trigger: "call_start",
        context: null,
      },
    ];
  }

  // Called for each new transcript segment
  async analyze(
    segment: TranscriptSegment,
    personality: { patience: number; stress: number; agreeableness: number },
  ): Promise<EmotionShift | null> {
    // Fast heuristic analysis (no LLM call for obvious shifts)
    const heuristicResult = this.heuristicAnalysis(segment, personality);
    if (heuristicResult.confidence > 0.8) {
      return this.applyShift(heuristicResult.shift, segment);
    }

    // LLM-based analysis for ambiguous cases
    const llmResult = await this.llmAnalysis(segment, personality);
    return this.applyShift(llmResult, segment);
  }

  private heuristicAnalysis(
    segment: TranscriptSegment,
    personality: { patience: number; stress: number; agreeableness: number },
  ): { shift: EmotionShift; confidence: number } {
    const text = segment.text.toLowerCase();
    const speaker = segment.speaker;

    // Agent positive words → customer more positive
    if (speaker === "agent") {
      if (containsAny(text, ["sorry", "apologize", "understand", "help"])) {
        if (
          this.state.emotion === "angry" ||
          this.state.emotion === "frustrated"
        ) {
          return {
            shift: {
              emotion:
                this.state.emotion === "angry" ? "frustrated" : "neutral",
              intensity: Math.max(0.3, this.state.intensity - 0.2),
              valence: this.state.valence + 0.2,
              arousal: this.state.arousal - 0.1,
              trigger: "agent_empathy",
            },
            confidence: 0.75,
          };
        }
      }
    }

    // Customer negative words → escalation
    if (speaker === "customer") {
      if (
        containsAny(text, ["unacceptable", "terrible", "worst", "never again"])
      ) {
        const escalation = personality.stress > 70 ? 0.3 : 0.15;
        return {
          shift: {
            emotion: "angry",
            intensity: Math.min(1, this.state.intensity + escalation),
            valence: Math.max(-1, this.state.valence - 0.3),
            arousal: Math.min(1, this.state.arousal + 0.2),
            trigger: "negative_language",
          },
          confidence: 0.85,
        };
      }
    }

    return {
      shift: {
        ...this.state,
        emotion: this.state.emotion,
        trigger: "no_change",
      },
      confidence: 0.5,
    };
  }

  private async llmAnalysis(
    segment: TranscriptSegment,
    personality: { patience: number; stress: number; agreeableness: number },
  ): Promise<EmotionShift> {
    const result = await this.llm.chatJson<{
      emotion: string;
      intensity: number;
      valence: number;
      arousal: number;
      trigger: string;
    }>({
      system: `Analyze the customer's emotional state in this contact centre call.

Current emotional state: ${JSON.stringify(this.state)}
Customer personality: patience=${personality.patience}, stress=${personality.stress}, agreeableness=${personality.agreeableness}

Rules:
- Emotions evolve gradually (no sudden jumps without trigger)
- Agent empathy can de-escalate
- Repeated issues escalate
- Silence/confusion can indicate frustration building

Output: { emotion, intensity (0-1), valence (-1 to 1), arousal (0-1), trigger }`,
      messages: [
        {
          role: "user",
          content: `Speaker: ${segment.speaker}\nText: "${segment.text}"\nTimestamp: ${segment.timestamp}s`,
        },
      ],
      temperature: 0.2,
    });

    return {
      emotion: result.emotion,
      intensity: clamp(result.intensity, 0, 1),
      valence: clamp(result.valence, -1, 1),
      arousal: clamp(result.arousal, 0, 1),
      trigger: result.trigger,
    };
  }

  private applyShift(
    shift: EmotionShift,
    segment: TranscriptSegment,
  ): EmotionShift {
    if (shift.emotion === this.state.emotion && shift.trigger === "no_change") {
      return { ...shift, context: null };
    }

    // Apply smoothing (emotions don't jump instantly)
    const smoothFactor = 0.3;
    const smoothed: EmotionShift = {
      emotion: shift.emotion,
      intensity: lerp(this.state.intensity, shift.intensity, smoothFactor),
      valence: lerp(this.state.valence, shift.valence, smoothFactor),
      arousal: lerp(this.state.arousal, shift.arousal, smoothFactor),
      trigger: shift.trigger,
      context: {
        speaker: segment.speaker,
        text: segment.text,
        timestamp: segment.timestamp,
      },
    };

    // Update state
    this.state = {
      emotion: smoothed.emotion,
      intensity: smoothed.intensity,
      valence: smoothed.valence,
      arousal: smoothed.arousal,
    };

    this.history.push({
      ...smoothed,
      timestamp: segment.timestamp,
    });

    return smoothed;
  }

  getHistory(): EmotionShift[] {
    return [...this.history];
  }

  getCurrentState(): EmotionState {
    return { ...this.state };
  }
}

// Helpers
function moodToIntensity(mood: string): number {
  const map: Record<string, number> = {
    happy: 0.6,
    neutral: 0.3,
    confused: 0.5,
    frustrated: 0.7,
    angry: 0.9,
    anxious: 0.6,
    relieved: 0.4,
    disappointed: 0.6,
  };
  return map[mood] ?? 0.5;
}

function moodToValence(mood: string): number {
  const map: Record<string, number> = {
    happy: 0.7,
    neutral: 0,
    confused: -0.2,
    frustrated: -0.6,
    angry: -0.9,
    anxious: -0.4,
    relieved: 0.5,
    disappointed: -0.5,
  };
  return map[mood] ?? 0;
}

function moodToArousal(mood: string): number {
  const map: Record<string, number> = {
    happy: 0.6,
    neutral: 0.2,
    confused: 0.5,
    frustrated: 0.7,
    angry: 0.9,
    anxious: 0.7,
    relieved: 0.3,
    disappointed: 0.4,
  };
  return map[mood] ?? 0.4;
}

function containsAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
```

---

## 7. QA Scoring Engine Design

```typescript
// lib/ai/qa-engine.ts
import type { LLMProvider } from "./providers/llm-provider";
import type { TranscriptSegment } from "@/lib/vaani/types";
import type { EmotionShift } from "@/types/emotion";
import type { QADimension, QAResult, QAEvidence } from "@/types/qa";

// The 14 QA dimensions
export const QA_DIMENSIONS: QADimension[] = [
  {
    id: "empathy",
    name: "Empathy",
    description: "Acknowledged customer feelings, showed understanding",
    weight: 10,
  },
  {
    id: "listening",
    name: "Active Listening",
    description: "Responded to what customer actually said, didn't redirect",
    weight: 8,
  },
  {
    id: "confidence",
    name: "Confidence",
    description: "Spoke with authority, didn't over-apologize or sound unsure",
    weight: 7,
  },
  {
    id: "ownership",
    name: "Ownership",
    description: "Toook responsibility, didn't blame others or deflect",
    weight: 9,
  },
  {
    id: "call_control",
    name: "Call Control",
    description: "Guided conversation, set expectations, managed flow",
    weight: 8,
  },
  {
    id: "compliance",
    name: "Compliance",
    description:
      "Followed procedures, verified identity, disclosed required info",
    weight: 10,
  },
  {
    id: "resolution",
    name: "Resolution",
    description: "Actually solved the problem or provided clear next steps",
    weight: 10,
  },
  {
    id: "communication",
    name: "Communication",
    description: "Clear language, no jargon, appropriate pace",
    weight: 7,
  },
  {
    id: "dead_air",
    name: "Dead Air Management",
    description: "Minimized silence, narrated actions, kept customer informed",
    weight: 6,
  },
  {
    id: "interruptions",
    name: "Interruption Handling",
    description: "Didn't interrupt customer, handled interruptions gracefully",
    weight: 7,
  },
  {
    id: "filler_words",
    name: "Filler Words",
    description: "Minimal um/uh/like, professional speech patterns",
    weight: 5,
  },
  {
    id: "professionalism",
    name: "Professionalism",
    description: "Appropriate tone, language, demeanor throughout",
    weight: 8,
  },
  {
    id: "tone",
    name: "Tone Match",
    description: "Matched customer energy — warm when needed, firm when needed",
    weight: 7,
  },
  {
    id: "escalation_handling",
    name: "Escalation Handling",
    description: "De-escalated appropriately, knew when to escalate",
    weight: 8,
  },
];

export class QAEngine {
  constructor(private llm: LLMProvider) {}

  async evaluate(params: {
    transcript: TranscriptSegment[];
    emotions: EmotionShift[];
    simulationDuration: number;
    personaPersonality: Record<string, number>;
  }): Promise<QAResult> {
    const dimensionScores = await Promise.all(
      QA_DIMENSIONS.map((dim) => this.scoreDimension(dim, params)),
    );

    // Weighted average
    const totalWeight = dimensionScores.reduce(
      (sum, d) => sum + d.dimension.weight,
      0,
    );
    const weightedSum = dimensionScores.reduce(
      (sum, d) => sum + (d.score / d.dimension.weight) * d.dimension.weight,
      0,
    );
    const overallScore = Math.round((weightedSum / totalWeight) * 100);

    return {
      overallScore,
      dimensions: dimensionScores,
      evaluatedAt: new Date(),
    };
  }

  private async scoreDimension(
    dimension: QADimension,
    params: {
      transcript: TranscriptSegment[];
      emotions: EmotionShift[];
      simulationDuration: number;
      personaPersonality: Record<string, number>;
    },
  ): Promise<QAResult["dimensions"][0]> {
    const evidence = this.findEvidence(dimension.id, params.transcript);

    const result = await this.llm.chatJson<{
      score: number;
      feedback: string;
      suggestions: string[];
    }>({
      system: `You are a QA evaluator for a contact centre call.

Dimension: ${dimension.name}
Description: ${dimension.description}
Weight: ${dimension.weight}/10

Score 0-100 based on:
- How well the agent performed on this specific dimension
- Evidence from the transcript (quote exact lines)
- Consider the customer's personality (high stress = harder to manage)

Be specific. Reference timestamps. No vague praise.

Output: { score (0-100), feedback (2-3 sentences), suggestions (array of specific improvements) }`,
      messages: [
        {
          role: "user",
          content: `Transcript:\n${params.transcript.map((s) => `[${s.timestamp.toFixed(1)}s] ${s.speaker}: ${s.text}`).join("\n")}

Emotion timeline:\n${params.emotions.map((e) => `[${e.timestamp.toFixed(1)}s] ${e.emotion} (${(e.intensity * 100).toFixed(0)}%)`).join("\n")}

Duration: ${params.simulationDuration}s
Customer personality: ${JSON.stringify(params.personaPersonality)}`,
        },
      ],
      temperature: 0.2,
    });

    return {
      dimension,
      score: clamp(result.score, 0, 100),
      feedback: result.feedback,
      evidence,
      suggestions: result.suggestions,
    };
  }

  private findEvidence(
    dimensionId: string,
    transcript: TranscriptSegment[],
  ): QAEvidence[] {
    // Map dimension IDs to transcript patterns
    const patterns: Record<string, (s: TranscriptSegment) => boolean> = {
      empathy: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["understand", "sorry", "feel", "frustrating"]),
      listening: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["you mentioned", "you said", "I hear"]),
      confidence: (s) =>
        s.speaker === "agent" &&
        !containsAny(s.text, ["um", "uh", "I think maybe", "I'm not sure"]),
      ownership: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["I'll", "let me", "I can", "I will"]),
      call_control: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["let me", "first", "next", "I'll need"]),
      compliance: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["verify", "confirm", "security", "policy"]),
      resolution: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["resolved", "fixed", "done", "completed"]),
      dead_air: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["one moment", "looking into", "checking"]),
      interruptions: (s) =>
        s.speaker === "customer" &&
        containsAny(s.text, ["you're not listening", "let me finish"]),
      filler_words: (s) =>
        s.speaker === "agent" && /\b(um|uh|like|you know)\b/i.test(s.text),
      professionalism: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, ["thank you", "appreciate", "pleasure"]),
      tone: (s) => s.speaker === "agent" && s.text.length > 20,
      escalation_handling: (s) =>
        s.speaker === "agent" &&
        containsAny(s.text, [
          "escalate",
          "manager",
          "supervisor",
          "let me get",
        ]),
    };

    const matcher = patterns[dimensionId] ?? (() => false);
    return transcript
      .filter(matcher)
      .slice(0, 5) // Max 5 evidence items
      .map((s) => ({
        timestamp: s.timestamp,
        speaker: s.speaker,
        text: s.text,
        issue: dimensionId,
      }));
  }
}

function containsAny(text: string, words: string[]): boolean {
  return words.some((w) => text.toLowerCase().includes(w.toLowerCase()));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
```

---

## 8. Call Replay System Design

The replay system is a **client-side state machine** that reconstructs the call from stored data. No re-streaming from Vaani — replay from our DB.

### Data Flow

```
DB (transcripts + emotions + QA scores)
    ↓
Server Action: getSimulationReplay(id)
    ↓
Client: ReplayStore (Zustand)
    ↓
Components: ReplayPlayer, TranscriptScroller, EmotionTimeline
```

### Replay Store

```typescript
// lib/stores/replay-store.ts
import { create } from "zustand";
import type { TranscriptSegment } from "@/lib/vaani/types";
import type { EmotionShift } from "@/types/emotion";
import type { QAResult } from "@/types/qa";

interface ReplayState {
  // Data
  transcript: TranscriptSegment[];
  emotions: EmotionShift[];
  qaResult: QAResult | null;
  totalDuration: number;

  // Playback
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number; // 0.5, 1, 1.5, 2

  // Actions
  load: (data: {
    transcript: TranscriptSegment[];
    emotions: EmotionShift[];
    qaResult: QAResult;
    totalDuration: number;
  }) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setSpeed: (speed: number) => void;
  tick: (deltaMs: number) => void;
  jumpToSegment: (segmentIndex: number) => void;

  // Derived
  getVisibleTranscript: () => TranscriptSegment[];
  getCurrentEmotion: () => EmotionShift | null;
  getVisibleQAEvidence: () => QAEvidence[];
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  transcript: [],
  emotions: [],
  qaResult: null,
  totalDuration: 0,
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,

  load: (data) =>
    set({
      transcript: data.transcript,
      emotions: data.emotions,
      qaResult: data.qaResult,
      totalDuration: data.totalDuration,
      currentTime: 0,
      isPlaying: false,
    }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  seek: (time) =>
    set({ currentTime: Math.max(0, Math.min(time, get().totalDuration)) }),
  setSpeed: (speed) => set({ playbackSpeed: speed }),

  tick: (deltaMs) => {
    const state = get();
    if (!state.isPlaying) return;

    const newTime = state.currentTime + (deltaMs / 1000) * state.playbackSpeed;
    if (newTime >= state.totalDuration) {
      set({ currentTime: state.totalDuration, isPlaying: false });
    } else {
      set({ currentTime: newTime });
    }
  },

  jumpToSegment: (segmentIndex) => {
    const segment = get().transcript[segmentIndex];
    if (segment) {
      set({ currentTime: segment.timestamp });
    }
  },

  getVisibleTranscript: () => {
    const { transcript, currentTime } = get();
    return transcript.filter((s) => s.timestamp <= currentTime);
  },

  getCurrentEmotion: () => {
    const { emotions, currentTime } = get();
    let current: EmotionShift | null = null;
    for (const e of emotions) {
      if (e.timestamp <= currentTime) current = e;
      else break;
    }
    return current;
  },

  getVisibleQAEvidence: () => {
    const { qaResult, currentTime } = get();
    if (!qaResult) return [];
    return qaResult.dimensions.flatMap((d) =>
      d.evidence.filter((e) => e.timestamp <= currentTime),
    );
  },
}));
```

### Replay Player Component

```typescript
// components/replay/replay-player.tsx
"use client";

import { useEffect, useRef } from "react";
import { useReplayStore } from "@/lib/stores/replay-store";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

export function ReplayPlayer() {
  const {
    isPlaying, currentTime, totalDuration, playbackSpeed,
    play, pause, seek, setSpeed, tick,
  } = useReplayStore();
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      tick(delta);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, tick]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="wobbly bg-white shadow-hard p-4">
      {/* Progress bar */}
      <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct * totalDuration);
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-accent transition-all"
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-3">
        <span className="font-body text-sm">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>

        <div className="flex items-center gap-2">
          <button onClick={() => seek(Math.max(0, currentTime - 10))} className="btn-hand p-2">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => seek(Math.max(0, currentTime - 5))} className="btn-hand p-2">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={isPlaying ? pause : play} className="btn-hand p-3">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={() => seek(Math.min(totalDuration, currentTime + 5))} className="btn-hand p-2">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed controls */}
        <div className="flex gap-1">
          {[0.5, 1, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => setSpeed(speed)}
              className={`btn-hand px-2 py-1 text-xs ${playbackSpeed === speed ? "bg-accent text-white" : ""}`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 9. API Routes Structure

### Simulation Lifecycle

```
POST /api/simulations              → Create simulation (generate persona, create Vaani session)
GET  /api/simulations              → List user's simulations (paginated)
GET  /api/simulations/[id]         → Get simulation details
PATCH /api/simulations/[id]        → Update simulation metadata
DELETE /api/simulations/[id]       → Soft delete

POST /api/simulations/[id]/call    → Trigger Vaani WebRTC call
GET  /api/simulations/[id]/call    → Get call status + Vaani session info

GET  /api/simulations/[id]/transcript  → Get transcript segments
GET  /api/simulations/[id]/emotions    → Get emotion timeline
POST /api/simulations/[id]/qa          → Run QA scoring (triggers async evaluation)
GET  /api/simulations/[id]/qa          → Get QA results
```

### Server Actions (used by client components)

```typescript
// lib/actions/simulation-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import {
  simulations,
  personas,
  transcriptSegments,
  emotionTimeline,
  qaScores,
} from "@/lib/db/schema";
import { getVaaniClient } from "@/lib/vaani/client";
import { PersonaEngine } from "@/lib/ai/persona-engine";
import { EmotionEngine } from "@/lib/ai/emotion-engine";
import { QAEngine } from "@/lib/ai/qa-engine";
import { createLLMProvider } from "@/lib/ai/providers/openai-provider";
import { eq, and, desc } from "drizzle-orm";

export async function createSimulation(input: {
  personaId?: string;
  industry?: string;
  difficulty?: string;
  scenario?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get or create persona
  let persona;
  if (input.personaId) {
    [persona] = await db
      .select()
      .from(personas)
      .where(eq(personas.id, input.personaId));
  } else {
    const engine = new PersonaEngine(createLLMProvider());
    const generated = await engine.generatePersona({
      industry: input.industry ?? "telecom",
      difficulty: input.difficulty ?? "beginner",
      scenario: input.scenario,
    });
    [persona] = await db
      .insert(personas)
      .values({
        ...generated,
        isBuiltIn: false,
      })
      .returning();
  }

  // Create simulation record
  const [simulation] = await db
    .insert(simulations)
    .values({
      userId: userId,
      personaId: persona.id,
      difficulty: input.difficulty ?? "beginner",
      scenarioDescription: input.scenario,
      briefing: {
        customerName: persona.name,
        issueSummary: persona.description,
        context: input.scenario,
      },
    })
    .returning();

  return simulation;
}

export async function triggerCall(simulationId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify ownership
  const [simulation] = await db
    .select()
    .from(simulations)
    .where(
      and(eq(simulations.id, simulationId), eq(simulations.userId, userId)),
    );

  if (!simulation) throw new Error("Simulation not found");

  // Trigger Vaani call
  const vaani = getVaaniClient();
  const result = await vaani.triggerCall({ medium: "webrtc" });

  // Update simulation with Vaani details
  await db
    .update(simulations)
    .set({
      vaaniCallId: result.call_id,
      vaaniRoomName: result.room_name,
      status: "connecting",
      startedAt: new Date(),
    })
    .where(eq(simulations.id, simulationId));

  // Modify Vaani agent with persona
  const [persona] = await db
    .select()
    .from(personas)
    .where(eq(personas.id, simulation.personaId));

  if (persona) {
    await vaani.modifyAgent(result.call_id, {
      persona: persona.systemPrompt,
      training: `Industry: ${persona.industry}. Handle this customer professionally.`,
      experience: `Difficulty: ${simulation.difficulty}`,
    });
  }

  return {
    callId: result.call_id,
    token: result.token,
    roomName: result.room_name,
    connectionUrl: result.connection_url,
    captionsUrl: result.live_captions_url,
  };
}

export async function endCall(simulationId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [simulation] = await db
    .select()
    .from(simulations)
    .where(
      and(eq(simulations.id, simulationId), eq(simulations.userId, userId)),
    );

  if (!simulation) throw new Error("Simulation not found");

  const duration =
    simulation.startedAt ?
      Math.floor((Date.now() - simulation.startedAt.getTime()) / 1000)
    : 0;

  // Update simulation status
  await db
    .update(simulations)
    .set({
      status: "ended",
      endedAt: new Date(),
      durationSeconds: duration,
    })
    .where(eq(simulations.id, simulationId));

  // Fetch final data from Vaani
  if (simulation.vaaniCallId) {
    const vaani = getVaaniClient();
    const details = await vaani.getCallDetails(simulation.vaaniCallId);

    // Store transcript segments
    if (details.transcript?.length) {
      await db.insert(transcriptSegments).values(
        details.transcript.map((seg) => ({
          id: `${simulationId}-${seg.timestamp}`,
          simulationId,
          speaker: seg.speaker,
          text: seg.text,
          startTime: seg.timestamp,
          isFinal: seg.is_final,
        })),
      );
    }
  }

  return { success: true };
}

export async function runQAScoring(simulationId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [simulation] = await db
    .select()
    .from(simulations)
    .where(
      and(eq(simulations.id, simulationId), eq(simulations.userId, userId)),
    );

  if (!simulation) throw new Error("Simulation not found");

  // Fetch transcript and emotions
  const transcript = await db
    .select()
    .from(transcriptSegments)
    .where(eq(transcriptSegments.simulationId, simulationId))
    .orderBy(transcriptSegments.startTime);

  const emotions = await db
    .select()
    .from(emotionTimeline)
    .where(eq(emotionTimeline.simulationId, simulationId))
    .orderBy(emotionTimeline.timestamp);

  // Get persona personality
  const [persona] = await db
    .select()
    .from(personas)
    .where(eq(personas.id, simulation.personaId));

  // Run QA evaluation
  const qaEngine = new QAEngine(createLLMProvider());
  const result = await qaEngine.evaluate({
    transcript: transcript.map((t) => ({
      speaker: t.speaker,
      text: t.text,
      timestamp: t.startTime,
      is_final: t.isFinal,
    })),
    emotions: emotions.map((e) => ({
      timestamp: e.timestamp,
      emotion: e.emotion,
      intensity: e.intensity,
      valence: e.valence,
      arousal: e.arousal,
      trigger: e.trigger,
      context: null,
    })),
    simulationDuration: simulation.durationSeconds ?? 0,
    personaPersonality: (persona?.personality as Record<string, number>) ?? {},
  });

  // Store QA scores
  await db.insert(qaScores).values(
    result.dimensions.map((d) => ({
      simulationId,
      dimension: d.dimension.id,
      score: d.score,
      feedback: d.feedback,
      evidence: d.evidence,
      suggestions: d.suggestions,
    })),
  );

  // Update simulation with overall score
  await db
    .update(simulations)
    .set({
      overallScore: result.overallScore,
      qaScores: result,
      status: "scored",
    })
    .where(eq(simulations.id, simulationId));

  return result;
}
```

---

## 10. Frontend Page/App Structure

### Route Map

```
/                           → Landing page (existing)
/login                      → Clerk login
/signup                     → Clerk signup
/dashboard                  → Overview (recent simulations, quick start)
/dashboard/simulations      → All simulations list
/dashboard/simulations/new  → New simulation setup (persona selection)
/dashboard/simulations/[id] → Active call interface
/dashboard/simulations/[id]/replay → Call replay + review
/dashboard/analytics        → Performance analytics
/dashboard/personas         → Persona browser/creator
/dashboard/settings         → User settings
```

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── ClerkProvider
├── Toaster (sonner)
└── <html> + <body>

├── (auth)/layout.tsx           → Centered card, no sidebar
│   └── login/signup
│
└── (dashboard)/layout.tsx      → Sidebar + topbar
    ├── Sidebar
    │   ├── Logo
    │   ├── Nav links (Dashboard, Simulations, Analytics, Personas, Settings)
    │   └── User avatar (Clerk)
    ├── Topbar
    │   ├── Page title
    │   ├── Notifications
    │   └── Quick actions
    └── <main>{children}</main>
```

### Active Call Interface

```
/dashboard/simulations/[id]/page.tsx
├── CallHeader (persona name, difficulty badge, timer)
├── Two-column layout:
│   ├── Left (60%): CallInterface
│   │   ├── AudioVisualizer (waveform)
│   │   ├── CallControls (mute, end, hold)
│   │   ├── EmotionIndicator (real-time gauge)
│   │   └── TranscriptPanel (live scrolling)
│   └── Right (40%): SidePanel
│       ├── PersonaCard (current traits)
│       ├── QAHints (live scoring preview)
│       └── ScenarioNotes (briefing reference)
```

---

## 11. State Management

### Zustand Stores

| Store              | Scope             | State                                                 |
| ------------------ | ----------------- | ----------------------------------------------------- |
| `simulation-store` | Active simulation | `simulationId`, `status`, `persona`, `callState`      |
| `transcript-store` | Live transcript   | `segments[]`, `addSegment()`, `clear()`               |
| `replay-store`     | Replay mode       | `currentTime`, `isPlaying`, `playbackSpeed`, `seek()` |
| `ui-store`         | Global UI         | `sidebarOpen`, `activeModal`, `toasts`                |

### Data Fetching Strategy

- **Server Components** for initial page data (dashboard overview, simulation list)
- **Server Actions** for mutations (create simulation, trigger call, end call)
- **Client-side polling** during active call (transcript every 500ms via SWR/React Query)
- **WebSocket** for live captions (Vaani captions URL → `transcript-store`)
- **Zustand** for ephemeral UI state (not persisted, resets on page load)

### Call State Machine

```
created → connecting → active → ended → scored
           ↓                    ↓
         (error)             (timeout)
           ↓                    ↓
         failed              ended
```

Status transitions are enforced in server actions and validated client-side before UI updates.

---

## 12. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/vaaniverse

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# Vaani
VAANI_API_KEY=...
VAANI_BASE_URL=https://api.vaanivoice.ai

# LLM
OPENAI_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 13. Implementation Order

### Sprint 1: Foundation (Week 1)

1. Install dependencies (drizzle-orm, @clerk/nextjs, zustand, sonner)
2. Set up database schema + migrations
3. Set up Clerk auth (middleware, login/signup pages)
4. Create dashboard layout (sidebar, topbar)
5. Build design system UI primitives (button, card, input, badge)

### Sprint 2: Simulation Core (Week 2)

1. Vaani client (`lib/vaani/client.ts`)
2. Persona engine + generation prompts
3. Create simulation server action
4. New simulation page (persona selection)
5. Active call page (WebRTC integration)

### Sprint 3: Real-time (Week 3)

1. Live transcript WebSocket handler
2. Transcript store + display
3. Emotion engine integration
4. Emotion indicator component
5. Call controls (mute, end)

### Sprint 4: Evaluation (Week 4)

1. QA scoring engine
2. Post-call scoring flow
3. QA scorecard display
4. Replay player + timeline
5. Emotion timeline chart

### Sprint 5: Analytics + Polish (Week 5)

1. Analytics dashboard (performance cards, trends)
2. Simulation list + filtering
3. Error handling + loading states
4. Testing (Vitest unit + Playwright e2e)
5. Deployment (Vercel)

---

## 14. Key Technical Decisions

| Decision   | Choice                | Rationale                                                 |
| ---------- | --------------------- | --------------------------------------------------------- |
| ORM        | Drizzle               | SQL-first, no codegen, type inference from schema         |
| Auth       | Clerk                 | Enterprise SSO, RBAC, audit logs — no custom auth         |
| State      | Zustand               | Minimal boilerplate, no providers, built-in immer         |
| Forms      | React Hook Form + Zod | Type-safe validation, minimal re-renders                  |
| Animations | Framer Motion         | Already installed, matches hand-drawn feel                |
| Charts     | Recharts              | Simple, composable, good for analytics                    |
| Tables     | TanStack Table        | Headless, composable, good for data grids                 |
| Deployment | Vercel                | Zero-config Next.js, preview deploys                      |
| Database   | PostgreSQL 17         | JSONB for flexible fields, pgvector for future embeddings |
| Cache      | Redis                 | Session state, rate limiting, leaderboard (Phase 2)       |

---

## 15. SOLID Compliance Checklist

- [x] **S** — Each class has one reason to change (PersonaEngine ≠ EmotionEngine ≠ QAEngine)
- [x] **O** — Open for extension (LLMProvider interface allows swapping providers)
- [x] **L** — Any LLMProvider implementation is substitutable
- [x] **I** — Small, focused interfaces (LLMProvider has 2 methods, not 20)
- [x] **D** — High-level modules depend on abstractions (LLMProvider), not concretions (OpenAIProvider)
