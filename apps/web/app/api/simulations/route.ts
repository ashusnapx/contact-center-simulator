import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sims = await db.query.simulations.findMany({
    where: eq(simulations.userId, session.user.id),
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });

  return NextResponse.json(sims);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { personaId } = await req.json();

  if (!personaId) {
    return NextResponse.json({ error: "Persona is required" }, { status: 400 });
  }

  // Verify persona exists and belongs to user
  const persona = await db.query.personas.findFirst({
    where: eq(personas.id, personaId),
  });

  if (!persona) {
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });
  }

  const [sim] = await db
    .insert(simulations)
    .values({
      userId: session.user.id,
      personaId,
      status: "active",
      startedAt: new Date(),
    })
    .returning();

  return NextResponse.json(sim, { status: 201 });
}
