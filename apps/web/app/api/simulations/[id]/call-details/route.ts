import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getApiKeys } from "@/lib/api-keys";

const VAANI_BASE_URL = "https://api.vaanivoice.ai";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const keys = await getApiKeys(session.user.id);

  if (!keys.vaaniApiKey) {
    return NextResponse.json(
      { error: "Vaani API key not configured" },
      { status: 500 }
    );
  }

  const sim = await db.query.simulations.findFirst({
    where: eq(simulations.id, id),
  });

  if (!sim) {
    return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
  }

  if (!sim.callId) {
    return NextResponse.json(
      { error: "No call ID found" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${VAANI_BASE_URL}/api/call_details/${sim.callId}`,
      {
        headers: { "X-API-Key": keys.vaaniApiKey },
      }
    );

    const data = await res.json();

    return NextResponse.json({
      summary: data.summary || null,
      entities: data.entity || {},
      evaluation: data.conversation_eval || {},
      evalTag: data.call_eval_tag || null,
      recordingUrl: `https://api.vaanivoice.ai/api/stream/${sim.callId}`,
    });
  } catch (err) {
    console.error("Failed to fetch call details:", err);
    return NextResponse.json(
      { error: "Failed to fetch call details" },
      { status: 500 }
    );
  }
}
