import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allPersonas = await db.query.personas.findMany({
    where: eq(personas.userId, session.user.id),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return NextResponse.json(allPersonas);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    industry,
    difficulty,
    emoji,
    description,
    backstory,
    hiddenObjective,
    mood,
    urgency,
    technicalKnowledge,
    patience,
    personalityTraits,
  } = body;

  if (!name || !description || !backstory || !hiddenObjective) {
    return NextResponse.json(
      { error: "Name, description, backstory, and hidden objective are required" },
      { status: 400 }
    );
  }

  const [persona] = await db
    .insert(personas)
    .values({
      userId: session.user.id,
      name,
      industry: industry || "telecom",
      difficulty: difficulty || "beginner",
      emoji: emoji || "👤",
      description,
      backstory,
      hiddenObjective,
      mood: mood || "neutral",
      urgency: urgency || 5,
      technicalKnowledge: technicalKnowledge || 5,
      patience: patience || 5,
      personalityTraits: personalityTraits || {
        agreeableness: 50,
        patience: 50,
        trust: 50,
        stress: 50,
        empathy: 50,
        assertiveness: 50,
      },
    })
    .returning();

  return NextResponse.json(persona, { status: 201 });
}
