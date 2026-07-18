import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getApiKeys } from "@/lib/api-keys";
import type { TranscriptEntry, EmotionSnapshot } from "@/lib/db/schema";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

function buildSystemPrompt(persona: Record<string, unknown>, personalityTraits: Record<string, number>) {
  return `You are ${persona.name}, a real customer calling support. NOT an AI. You are the CUSTOMER.

Problem: ${persona.backstory}
Hidden goal (don't reveal): ${persona.hiddenObjective}
Mood: ${persona.mood}

1-2 sentences max. Use contractions. Never say you are AI. Respond as the customer only.`;
}

function getCurrentEmotion(mood: string, stress: number, patience: number): { valence: number; arousal: number } {
  const moodMap: Record<string, { valence: number; arousal: number }> = {
    neutral: { valence: 0, arousal: 0.3 },
    angry: { valence: -0.8, arousal: 0.9 },
    frustrated: { valence: -0.6, arousal: 0.7 },
    confused: { valence: -0.3, arousal: 0.5 },
    impatient: { valence: -0.4, arousal: 0.8 },
    happy: { valence: 0.7, arousal: 0.5 },
    worried: { valence: -0.4, arousal: 0.6 },
    sarcastic: { valence: -0.2, arousal: 0.4 },
    polite: { valence: 0.3, arousal: 0.3 },
    demanding: { valence: -0.5, arousal: 0.8 },
  };

  const base = moodMap[mood] || moodMap.neutral;
  return {
    valence: base.valence,
    arousal: base.arousal * (stress / 100),
  };
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
  const { message } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Get simulation
  const sim = await db.query.simulations.findFirst({
    where: and(eq(simulations.id, id), eq(simulations.userId, session.user.id)),
  });

  if (!sim) {
    return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
  }

  if (sim.status !== "active") {
    return NextResponse.json({ error: "Simulation is not active" }, { status: 400 });
  }

  // Get persona
  const persona = await db.query.personas.findFirst({
    where: eq(personas.id, sim.personaId!),
  });

  if (!persona) {
    return NextResponse.json({ error: "Persona not found" }, { status: 404 });
  }

  const traits = (persona.personalityTraits as Record<string, number>) || {};
  const transcript = (sim.transcript as TranscriptEntry[]) || [];
  const emotionTimeline = (sim.emotionTimeline as EmotionSnapshot[]) || [];

  // Add agent message to transcript
  const agentEntry: TranscriptEntry = {
    role: "agent",
    content: message.trim(),
    timestamp: new Date().toISOString(),
  };

  transcript.push(agentEntry);

  // Build conversation history for LLM
  const messages = [
    { role: "system", content: buildSystemPrompt(persona, traits) },
    ...transcript.map((entry) => ({
      role: entry.role === "customer" ? "user" : "assistant",
      content: entry.content,
    })),
  ];

  // Call LLM (Gemini via settings or env)
  const keys = await getApiKeys(session.user.id);
  const apiKey = keys.geminiApiKey;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured. Add it in Settings." },
      { status: 500 }
    );
  }

  try {
    // Build Gemini format messages
    const systemPrompt = messages[0]?.content || "";
    const conversationHistory = messages.slice(1);

    // Convert to Gemini format
    // Gemini requires first message to be from user, not model
    let contents = conversationHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // If first message is from model (agent spoke first), prepend a user prompt
    if (contents.length > 0 && contents[0].role === "model") {
      contents = [
        { role: "user", parts: [{ text: "Hello?" }] },
        ...contents,
      ];
    }

    const llmRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!llmRes.ok) {
      const err = await llmRes.text();
      console.error("LLM error:", err);
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }

    const data = await llmRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("[Chat] Raw text:", JSON.stringify(rawText)?.substring(0, 200));
    const customerResponse = rawText || "I'm not sure what to say.";

    // Add customer response to transcript
    const customerEntry: TranscriptEntry = {
      role: "customer",
      content: customerResponse,
      timestamp: new Date().toISOString(),
      emotion: persona.mood,
    };

    transcript.push(customerEntry);

    // Add emotion snapshot
    const emotion = getCurrentEmotion(persona.mood, traits.stress || 50, traits.patience || 50);
    emotionTimeline.push({
      timestamp: new Date().toISOString(),
      emotion: persona.mood,
      valence: emotion.valence,
      arousal: emotion.arousal,
    });

    // Update simulation
    await db
      .update(simulations)
      .set({
        transcript,
        emotionTimeline,
      })
      .where(eq(simulations.id, id));

    return NextResponse.json({
      message: customerResponse,
      emotion: persona.mood,
      transcriptLength: transcript.length,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
