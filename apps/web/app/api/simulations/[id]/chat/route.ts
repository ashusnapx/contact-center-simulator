import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import type { TranscriptEntry, EmotionSnapshot } from "@/lib/db/schema";

const LLM_API_URL = "https://api.openai.com/v1/chat/completions";

function buildSystemPrompt(persona: Record<string, unknown>, personalityTraits: Record<string, number>) {
  return `You are role-playing as a customer in a contact centre simulation. Stay in character at all times.

CUSTOMER PROFILE:
Name: ${persona.name}
Industry: ${persona.industry}
Mood: ${persona.mood}
Urgency: ${persona.urgency}/10
Technical Knowledge: ${persona.technicalKnowledge}/10
Difficulty: ${persona.difficulty}

BACKSTORY:
${persona.backstory}

HIDDEN OBJECTIVE (DO NOT reveal this directly — the agent must discover it through questioning):
${persona.hiddenObjective}

PERSONALITY TRAITS (scale 0-100):
- Agreeableness: ${personalityTraits.agreeableness}%
- Patience: ${personalityTraits.patience}%
- Trust: ${personalityTraits.trust}%
- Stress: ${personalityTraits.stress}%
- Empathy: ${personalityTraits.empathy}%
- Assertiveness: ${personalityTraits.assertiveness}%

BEHAVIOR RULES:
- Respond as this customer would — in first person, staying in character
- Express emotions that match your mood and personality
- React to the agent's tone, empathy, and competence
- If the agent is rude or dismissive, get more upset
- If the agent is empathetic and helpful, gradually calm down
- Never break character or reveal you are an AI
- Keep responses short and natural (1-3 sentences typically)
- Use colloquial language, contractions, and natural speech patterns
- Include emotional expressions (sighs, frustration, gratitude, etc.)
- If the agent asks about your hidden objective, be evasive or hint at it without stating it directly
- React to silence or dead air with impatience if urgency is high

IMPORTANT: Respond ONLY with the customer's dialogue. Do not include narration, stage directions, or meta-commentary.`;
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

  // Call LLM
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const llmRes = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!llmRes.ok) {
      const err = await llmRes.text();
      console.error("LLM error:", err);
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }

    const data = await llmRes.json();
    const customerResponse = data.choices[0]?.message?.content || "I'm not sure what to say.";

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
