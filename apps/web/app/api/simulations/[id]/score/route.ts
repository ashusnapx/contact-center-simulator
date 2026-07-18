import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getApiKeys } from "@/lib/api-keys";
import type { TranscriptEntry } from "@/lib/db/schema";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

export async function POST(
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

  const transcript = (sim.transcript as TranscriptEntry[]) || [];

  if (transcript.length < 2) {
    return NextResponse.json(
      { error: "Not enough conversation to score" },
      { status: 400 }
    );
  }

  const persona = await db.query.personas.findFirst({
    where: eq(personas.id, sim.personaId!),
  });

  const keys = await getApiKeys(session.user.id);
  const apiKey = keys.geminiApiKey;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured. Add it in Settings." },
      { status: 500 }
    );
  }

  const conversationText = transcript
    .map((t) => `${t.role === "customer" ? "Customer" : "Agent"}: ${t.content}`)
    .join("\n");

  const scoringPrompt = `You are an expert contact centre QA evaluator. Score this call transcript on 8 dimensions (0-100 each).

CUSTOMER CONTEXT:
Name: ${persona?.name || "Unknown"}
Industry: ${persona?.industry || "Unknown"}
Difficulty: ${persona?.difficulty || "beginner"}
Hidden Objective: ${persona?.hiddenObjective || "Unknown"}

TRANSCRIPT:
${conversationText}

Evaluate the AGENT on these 8 dimensions:
1. empathy (0-100): Did the agent show understanding and emotional intelligence?
2. listening (0-100): Did the agent listen actively and respond to what was said?
3. confidence (0-100): Was the agent professional, clear, and authoritative?
4. ownership (0-100): Did the agent take responsibility for the issue?
5. callControl (0-100): Did the agent manage the conversation flow?
6. compliance (0-100): Did the agent follow proper procedures?
7. resolution (0-100): Did the agent work toward a solution?
8. communication (0-100): Was the agent clear, concise, and professional?

Return ONLY a JSON object with these 8 fields. No other text.
{"empathy":X,"listening":X,"confidence":X,"ownership":X,"callControl":X,"compliance":X,"resolution":X,"communication":X}`;

  try {
    const llmRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: "You are an expert contact centre QA evaluator. Return only valid JSON." }] },
        contents: [{ role: "user", parts: [{ text: scoringPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!llmRes.ok) {
      return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
    }

    const data = await llmRes.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Parse the JSON response
    const scoresMatch = content.match(/\{[\s\S]*?\}/);
    const scores = scoresMatch ? JSON.parse(scoresMatch[0]) : {};

    const values = Object.values(scores) as number[];
    const avg = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

    await db
      .update(simulations)
      .set({ qaScore: avg, qaBreakdown: scores })
      .where(eq(simulations.id, id));

    return NextResponse.json({ score: avg, breakdown: scores });
  } catch (err) {
    console.error("Scoring error:", err);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
