import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
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
  const persona = await db.query.personas.findFirst({
    where: and(eq(personas.id, id), eq(personas.userId, session.user.id)),
  });

  if (!persona) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(persona);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.query.personas.findFirst({
    where: and(eq(personas.id, id), eq(personas.userId, session.user.id)),
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(personas)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(personas.id, id), eq(personas.userId, session.user.id)))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.query.personas.findFirst({
    where: and(eq(personas.id, id), eq(personas.userId, session.user.id)),
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.isPrebuilt === "true") {
    return NextResponse.json({ error: "Cannot delete prebuilt personas" }, { status: 403 });
  }

  await db
    .delete(personas)
    .where(and(eq(personas.id, id), eq(personas.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
