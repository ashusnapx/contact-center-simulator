import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getApiKeys } from "@/lib/api-keys";

const VAANI_BASE_URL = "https://api.vaanivoice.ai";

type TranscriptEntry = {
  role: "customer" | "agent";
  content: string;
  timestamp: string;
};

function parseTranscript(raw: string): TranscriptEntry[] {
  const lines = raw.split("\n").filter((l) => l.trim());
  const entries: TranscriptEntry[] = [];
  let currentSpeaker: "customer" | "agent" | null = null;
  let currentContent = "";

  for (const line of lines) {
    const trimmed = line.trim();
    // Handle timestamp format: [HH:MM:SS] AGENT: text or [HH:MM:SS] USER: text
    const agentMatch = trimmed.match(/(?:\[.*?\]\s*)?AGENT:\s*(.*)/i);
    const userMatch = trimmed.match(/(?:\[.*?\]\s*)?USER:\s*(.*)/i);

    if (agentMatch) {
      if (currentSpeaker && currentContent.trim()) {
        entries.push({
          role: currentSpeaker,
          content: currentContent.trim(),
          timestamp: new Date().toISOString(),
        });
      }
      currentSpeaker = "agent";
      currentContent = agentMatch[1] || "";
    } else if (userMatch) {
      if (currentSpeaker && currentContent.trim()) {
        entries.push({
          role: currentSpeaker,
          content: currentContent.trim(),
          timestamp: new Date().toISOString(),
        });
      }
      currentSpeaker = "customer";
      currentContent = userMatch[1] || "";
    } else {
      currentContent += " " + trimmed;
    }
  }

  if (currentSpeaker && currentContent.trim()) {
    entries.push({
      role: currentSpeaker,
      content: currentContent.trim(),
      timestamp: new Date().toISOString(),
    });
  }

  return entries;
}

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
      { error: "No call ID found for this simulation" },
      { status: 400 }
    );
  }

  // Retry up to 3 times with delays (Vaani needs time to process)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const transcriptRes = await fetch(
        `${VAANI_BASE_URL}/api/transcript/${sim.callId}`,
        {
          headers: { "X-API-Key": keys.vaaniApiKey },
        }
      );

      const transcriptData = await transcriptRes.json();
      const rawTranscript = transcriptData.transcript || "";

      if (rawTranscript && !rawTranscript.includes("not available") && !rawTranscript.includes("Error")) {
        const parsed = parseTranscript(rawTranscript);

        if (parsed.length > 0) {
          await db
            .update(simulations)
            .set({ transcript: parsed as never })
            .where(eq(simulations.id, id));

          return NextResponse.json({ transcript: parsed, raw: rawTranscript });
        }
      }

      // Not ready yet — wait and retry
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error("Transcript fetch attempt", attempt + 1, "failed:", err);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  return NextResponse.json(
    { error: "Transcript not yet available. Try again later." },
    { status: 404 }
  );
}
