import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sim = await db.query.simulations.findFirst({
    where: and(eq(simulations.id, id), eq(simulations.userId, session.user.id)),
  });

  if (!sim) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Manually fetch persona
  let personaData = null;
  if (sim.personaId) {
    personaData = await db.query.personas.findFirst({
      where: eq(personas.id, sim.personaId),
    });
  }

  return NextResponse.json({ ...sim, persona: personaData });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.query.simulations.findFirst({
    where: and(eq(simulations.id, id), eq(simulations.userId, session.user.id)),
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(simulations)
    .set(body)
    .where(and(eq(simulations.id, id), eq(simulations.userId, session.user.id)))
    .returning();

  return NextResponse.json(updated);
}
