import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

const PREBUILT_PERSONAS = [
  {
    name: "Mrs. Priya Sharma",
    emoji: "👩",
    industry: "telecom",
    difficulty: "beginner",
    description: "Middle-aged woman whose internet has been slow for 3 days. Polite but frustrated.",
    backstory: "Priya works from home as a freelance graphic designer. Her internet has been dropping every hour, causing her to miss client deadlines. She's called twice already but was told to 'restart the router'. She's at her wit's end but remains polite because she knows the agent is just doing their job.",
    hiddenObjective: "Wants a refund for the month AND a temporary mobile hotspot while the issue is fixed. Will accept a discount if refund is denied.",
    mood: "frustrated",
    urgency: 7,
    technicalKnowledge: 4,
    patience: 6,
    personalityTraits: { agreeableness: 75, patience: 60, trust: 40, stress: 65, empathy: 70, assertiveness: 30 },
  },
  {
    name: "Mr. James Thompson",
    emoji: "👴",
    industry: "banking",
    difficulty: "advanced",
    description: "Retired bank customer who received a suspicious transaction alert. Angry and distrustful.",
    backstory: "James has been with the bank for 35 years. He just received an alert for ₹47,000 he didn't authorize. He's panicking about his life savings and feels the bank has failed him. He's tech-averse and gets confused by jargon. He'll interrupt frequently and raise his voice.",
    hiddenObjective: "Wants the transaction reversed immediately AND compensation for the stress. Considering moving all his money to another bank.",
    mood: "angry",
    urgency: 9,
    technicalKnowledge: 2,
    patience: 3,
    personalityTraits: { agreeableness: 25, patience: 20, trust: 15, stress: 90, empathy: 40, assertiveness: 85 },
  },
  {
    name: "Ms. Sarah Chen",
    emoji: "👩‍💼",
    industry: "saas",
    difficulty: "intermediate",
    description: "Startup founder whose SaaS dashboard is down during a critical product demo. Calm but firm.",
    backstory: "Sarah runs a 12-person startup. Her team depends on your platform for client-facing demos. The dashboard has been loading for 15 minutes. She has a prospect waiting on Zoom. She won't shout but she's extremely direct and expects immediate action.",
    hiddenObjective: "Needs the issue fixed within 5 minutes. Wants a credit for the downtime AND a direct escalation contact for future emergencies.",
    mood: "impatient",
    urgency: 10,
    technicalKnowledge: 8,
    patience: 4,
    personalityTraits: { agreeableness: 50, patience: 30, trust: 45, stress: 75, empathy: 35, assertiveness: 80 },
  },
  {
    name: "Mr. Ahmed Al-Rashid",
    emoji: "👨",
    industry: "insurance",
    difficulty: "expert",
    description: "Businessman filing a car insurance claim after an accident. Knows the policy inside out.",
    backstory: "Ahmed is a lawyer who had a minor fender bender. His car is repairable but he's claiming total loss. He knows every clause in his policy and will catch any mistakes the agent makes. He's calm, methodical, and will use technical language to try to get a higher payout.",
    hiddenObjective: "Wants a total loss payout of ₹8.5 lakhs. Knows the car's market value is ₹6 lakhs. Will negotiate aggressively and threaten legal action.",
    mood: "demanding",
    urgency: 6,
    technicalKnowledge: 9,
    patience: 5,
    personalityTraits: { agreeableness: 20, patience: 40, trust: 10, stress: 50, empathy: 25, assertiveness: 95 },
  },
  {
    name: "Mrs. Fatima Khan",
    emoji: "👵",
    industry: "healthcare",
    difficulty: "nightmare",
    description: "Elderly patient whose prescription refill was denied. Emotional, crying, brings up family.",
    backstory: "Fatima is 72 and depends on her blood pressure medication. The insurance denied her refill saying it's 'too early'. She's scared because she has 2 pills left. She'll cry, mention her grandchildren, and guilt-trip the agent. She doesn't understand insurance jargon.",
    hiddenObjective: "Needs emergency override for medication. Also wants to file a complaint about the denial process. Will threaten to go to the media if not helped.",
    mood: "worried",
    urgency: 10,
    technicalKnowledge: 1,
    patience: 2,
    personalityTraits: { agreeableness: 60, patience: 15, trust: 30, stress: 95, empathy: 80, assertiveness: 55 },
  },
];

async function main() {
  console.log("Seeding prebuilt personas...\n");

  // Find admin user
  const admin = await db.query.users.findFirst({
    where: eq(schema.users.email, "admin@vaaniverse.ai"),
  });

  if (!admin) {
    console.error("Admin user not found. Run: npm run seed");
    process.exit(1);
  }

  // Check existing
  const existing = await db.query.personas.findMany({
    where: eq(schema.personas.isPrebuilt, "true"),
  });

  if (existing.length > 0) {
    console.log(`${existing.length} prebuilt personas already exist. Skipping.`);
    process.exit(0);
  }

  for (const p of PREBUILT_PERSONAS) {
    await db.insert(schema.personas).values({
      ...p,
      userId: admin.id,
      isPrebuilt: "true",
    });
    console.log(`  Created: ${p.emoji} ${p.name} (${p.industry}, ${p.difficulty})`);
  }

  console.log(`\nDone! ${PREBUILT_PERSONAS.length} personas seeded.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
