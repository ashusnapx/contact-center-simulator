import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// --- Personas ---

export type PersonalityTraits = {
  agreeableness: number;   // 0-100
  patience: number;        // 0-100
  trust: number;           // 0-100
  stress: number;          // 0-100
  empathy: number;         // 0-100
  assertiveness: number;   // 0-100
};

export type PersonaDifficulty = "beginner" | "intermediate" | "advanced" | "expert" | "nightmare";
export type PersonaIndustry = "banking" | "telecom" | "insurance" | "healthcare" | "saas" | "ecommerce" | "travel" | "logistics" | "retail";

export const personas = pgTable("personas", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  industry: text("industry").notNull().default("telecom"),
  difficulty: text("difficulty").notNull().default("beginner"),
  emoji: text("emoji").default("👤"),
  description: text("description").notNull(),
  backstory: text("backstory").notNull(),
  hiddenObjective: text("hidden_objective").notNull(),
  mood: text("mood").notNull().default("neutral"),
  urgency: integer("urgency").notNull().default(5),       // 1-10
  technicalKnowledge: integer("technical_knowledge").notNull().default(5), // 1-10
  patience: integer("patience_level").notNull().default(5), // 1-10
  personalityTraits: jsonb("personality_traits").$type<PersonalityTraits>().notNull().default({
    agreeableness: 50,
    patience: 50,
    trust: 50,
    stress: 50,
    empathy: 50,
    assertiveness: 50,
  }),
  isPrebuilt: text("is_prebuilt").notNull().default("false"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Persona = typeof personas.$inferSelect;
export type NewPersona = typeof personas.$inferInsert;

// --- Simulations ---

export type SimulationStatus = "pending" | "active" | "completed" | "abandoned";

export const simulations = pgTable("simulations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" }),
  personaId: text("persona_id")
    .references(() => personas.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  transcript: jsonb("transcript").$type<TranscriptEntry[]>().notNull().default([]),
  emotionTimeline: jsonb("emotion_timeline").$type<EmotionSnapshot[]>().notNull().default([]),
  qaScore: real("qa_score"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Simulation = typeof simulations.$inferSelect;
export type NewSimulation = typeof simulations.$inferInsert;

export type TranscriptEntry = {
  role: "customer" | "agent";
  content: string;
  timestamp: string;       // ISO string
  emotion?: string;        // emotion label at time of speaking
  speakingSpeed?: number;  // words per minute
};

export type EmotionSnapshot = {
  timestamp: string;
  emotion: string;
  valence: number;  // -1 to 1
  arousal: number;  // 0 to 1
};
