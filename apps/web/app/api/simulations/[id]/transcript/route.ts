import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import type { TranscriptEntry, EmotionSnapshot } from "@/lib/db/schema";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { entries } = await req.json();

  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: "entries array required" }, { status: 400 });
  }

  const sim = await db.query.simulations.findFirst({
    where: and(eq(simulations.id, id), eq(simulations.userId, session.user.id)),
  });

  if (!sim) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const transcript = (sim.transcript as TranscriptEntry[]) || [];
  const emotionTimeline = (sim.emotionTimeline as EmotionSnapshot[]) || [];

  for (const entry of entries) {
    const tEntry: TranscriptEntry = {
      role: entry.role,
      content: entry.content,
      timestamp: entry.timestamp || new Date().toISOString(),
      emotion: entry.emotion,
      speakingSpeed: entry.speakingSpeed,
    };
    transcript.push(tEntry);

    // Track emotion for customer entries
    if (entry.role === "customer" && entry.emotion) {
      emotionTimeline.push({
        timestamp: tEntry.timestamp,
        emotion: entry.emotion,
        valence: entry.valence ?? 0,
        arousal: entry.arousal ?? 0.5,
      });
    }
  }

  await db
    .update(simulations)
    .set({ transcript, emotionTimeline })
    .where(eq(simulations.id, id));

  return NextResponse.json({ success: true, count: entries.length });
}

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

  return NextResponse.json({
    transcript: sim.transcript || [],
    emotionTimeline: sim.emotionTimeline || [],
  });
}
