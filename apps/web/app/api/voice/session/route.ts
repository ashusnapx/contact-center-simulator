import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getApiKeys } from "@/lib/api-keys";

const VAANI_BASE_URL = "https://api.vaanivoice.ai";

const MALE_EMOJIS = ["👨", "👴", "🧑", "👨‍💼", "👨‍🔧"];
const FEMALE_EMOJIS = ["👩", "👵", "👩‍💼", "👩‍🔧"];

function detectGender(emoji: string | null): string {
  if (!emoji) return "female";
  if (MALE_EMOJIS.some((e) => emoji.includes(e))) return "male";
  if (FEMALE_EMOJIS.some((e) => emoji.includes(e))) return "female";
  return "female";
}

function buildSystemPrompt(personaData: Record<string, unknown>): string {
  const name = (personaData.name as string) || "Customer";
  const backstory = (personaData.backstory as string) || (personaData.description as string) || "You have an issue with your service.";
  const hiddenObj = (personaData.hiddenObjective as string) || "";
  const mood = (personaData.mood as string) || "neutral";
  const difficulty = (personaData.difficulty as string) || "intermediate";

  let prompt = `You are ${name}, a customer calling about an issue.

CHARACTER:
${backstory}

Your current mood: ${mood}
Your difficulty level: ${difficulty}

RULES:
- Stay in character at ALL times
- Speak in Hinglish (mix of Hindi and English) naturally, like a real Indian customer
- Never break character or mention you are an AI
- React emotionally based on your mood — if frustrated, show it; if confused, ask clarifying questions
- If the agent is rude or unhelpful, push back appropriately for your difficulty level
- If the agent resolves your issue satisfactorily, express relief and gratitude
- Keep responses conversational (1-3 sentences typically)
- Use natural Indian customer expressions: "arre", "yaar", "matlab", "theek hai", etc.`;

  if (hiddenObj) {
    prompt += `\n\nHIDDEN OBJECTIVE: ${hiddenObj}\nDo NOT reveal this objective directly. Work towards it subtly through the conversation.`;
  }

  prompt += `\n\nWhen the call starts, describe your problem naturally. The agent will respond to help you.`;

  return prompt;
}

function buildGreeting(personaData: Record<string, unknown>): string {
  const mood = (personaData.mood as string) || "neutral";
  const name = (personaData.name as string) || "";

  if (mood === "frustrated" || mood === "angry") {
    return "Hello? Mujhe bahut gussa aa raha hai. Mera paisa kat gaya lekin transaction pending dikha raha hai. Mujhe abhi help chahiye.";
  } else if (mood === "confused") {
    return "Hello? Mujhe samajh nahi aa raha kya ho raha hai. Mera account se paisa kat gaya lekin kuch samajh nahi aa raha.";
  } else if (mood === "anxious") {
    return "Hello? Main bahut pareshan hoon. Mera payment stuck ho gaya hai aur mujhe bahut tension ho rahi hai.";
  } else if (mood === "neutral") {
    return "Hello? Mujhe aapki madad chahiye. Mera ek transaction ka issue hai.";
  } else {
    return "Hello? Mujhe aapki zaroorat hai. Please jaldi help kijiye.";
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await getApiKeys(session.user.id);

  if (!keys.vaaniApiKey || !keys.vaaniAgentId) {
    return NextResponse.json(
      { error: "Vaani API not configured. Add keys in Settings." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const simulationId = body.simulationId;

  if (!simulationId) {
    return NextResponse.json({ error: "simulationId required" }, { status: 400 });
  }

  const sim = await db.query.simulations.findFirst({
    where: eq(simulations.id, simulationId),
  });

  if (!sim) {
    return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
  }

  let personaData: Record<string, unknown> | null = null;

  if (sim.personaId) {
    const persona = await db.query.personas.findFirst({
      where: eq(personas.id, sim.personaId),
    });
    if (persona) {
      personaData = persona as unknown as Record<string, unknown>;
    }
  }

  const voiceGender = personaData
    ? detectGender(personaData.emoji as string | null)
    : "female";

  const systemPrompt = personaData ? buildSystemPrompt(personaData) : "You are a customer calling about an issue. Speak in Hinglish. Describe your problem.";
  const greetingMessage = personaData ? buildGreeting(personaData) : "Hello? Mujhe aapki madad chahiye.";

  try {
    const requestBody: Record<string, unknown> = {
      agent_id: keys.vaaniAgentId,
      medium: "webrtc",
      voice_gender: voiceGender,
      voice: voiceGender,
      bg_noise_enabled: false,
      voice_speed: 1.0,
      primary_language: "hi",
      secondary_language: "en",
      welcome_message: greetingMessage,
      welcome_interruptible: true,
      metadata: {
        caller_name: (personaData?.name as string) || "Customer",
        caller_gender: voiceGender,
        mood: (personaData?.mood as string) || "neutral",
        scenario_description: (personaData?.backstory as string) || "",
        hidden_objective: (personaData?.hiddenObjective as string) || "",
      },
      modify_agent: {
        persona: {
          identity: {
            system_prompt: systemPrompt,
            greeting_message: {
              agent_message: greetingMessage,
              agent_speech_delay: 0,
              user_speech_delay: 2,
              interruptible: true,
              let_user_speak_first: false,
            },
          },
          senses_capabilities: {
            language: "hi",
            auto_detect: true,
            mouth: {
              primary: {
                voice_name: voiceGender === "male" ? "male" : "female",
              },
            },
          },
        },
      },
    };

    console.log("[Voice Session] Request:", JSON.stringify({
      voiceGender,
      personaName: personaData?.name,
      mood: personaData?.mood,
      systemPromptLength: systemPrompt.length,
      greeting: greetingMessage,
    }, null, 2));

    const res = await fetch(`${VAANI_BASE_URL}/api/trigger-call/`, {
      method: "POST",
      headers: {
        "X-API-Key": keys.vaaniApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Vaani API error:", res.status, err);
      return NextResponse.json(
        { error: `Vaani API error: ${res.status}: ${err}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    console.log("[Voice Session] Response:", JSON.stringify({
      room_name: data.room_name,
      agent_name: data.agent_name,
      has_live_captions: !!data.live_captions_url,
    }, null, 2));

    // Store call_id/room_name in simulation for later transcript fetch
    const callId = data.call_id || data.room_name;
    try {
      await db
        .update(simulations)
        .set({ startedAt: new Date(), callId })
        .where(eq(simulations.id, simulationId));
    } catch {
      // ignore — non-critical
    }

    return NextResponse.json({
      token: data.token,
      roomName: data.room_name,
      connectionUrl: data.connection_url,
      liveCaptionsUrl: data.live_captions_url,
      agentName: data.agent_name,
      personaName: personaData?.name || "Customer",
      voiceGender,
      callId: data.call_id || data.room_name,
    });
  } catch (err) {
    console.error("Voice session error:", err);
    return NextResponse.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}
