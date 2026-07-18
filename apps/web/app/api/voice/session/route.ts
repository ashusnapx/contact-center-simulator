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

const DIFFICULTY_PRESETS: Record<string, Record<string, unknown>> = {
  beginner: {
    bg_noise_enabled: false,
    filler_words_frequency: 0,
    max_call_duration: 10,
    patience_with_user_entries: 3,
    idle_call_hangup_timeout: 60,
    guardrail_level: "basic",
    eagerness: "slow",
  },
  intermediate: {
    bg_noise_enabled: true,
    bg_noise_volume: 30,
    bg_noise_sound: "office",
    filler_words_frequency: 0.2,
    filler_words_list: ["um", "uh", "like", "you know"],
    max_call_duration: 15,
    patience_with_user_entries: 2,
    idle_call_hangup_timeout: 45,
    guardrail_level: "medium",
    eagerness: "balanced",
  },
  advanced: {
    bg_noise_enabled: true,
    bg_noise_volume: 50,
    bg_noise_sound: "cafe",
    filler_words_frequency: 0.3,
    filler_words_list: ["um", "uh", "like", "you know", "actually", "basically"],
    max_call_duration: 15,
    patience_with_user_entries: 1,
    idle_call_hangup_timeout: 30,
    guardrail_level: "medium",
    eagerness: "fast",
  },
  expert: {
    bg_noise_enabled: true,
    bg_noise_volume: 70,
    bg_noise_sound: "street",
    filler_words_frequency: 0.4,
    filler_words_list: ["um", "uh", "like", "you know", "actually", "basically", "right"],
    max_call_duration: 10,
    patience_with_user_entries: 0,
    idle_call_hangup_timeout: 20,
    guardrail_level: "strict",
    eagerness: "fast",
  },
  nightmare: {
    bg_noise_enabled: true,
    bg_noise_volume: 80,
    bg_noise_sound: "street",
    filler_words_frequency: 0.5,
    filler_words_list: ["um", "uh", "like", "you know", "actually", "basically", "right", "look"],
    max_call_duration: 10,
    patience_with_user_entries: 0,
    idle_call_hangup_timeout: 15,
    guardrail_level: "strict",
    eagerness: "fast",
  },
};

function buildSystemPrompt(personaData: Record<string, unknown>, difficulty: string): string {
  const name = (personaData.name as string) || "Customer";
  const backstory = (personaData.backstory as string) || (personaData.description as string) || "You have an issue with your service.";
  const hiddenObj = (personaData.hiddenObjective as string) || "";
  const mood = (personaData.mood as string) || "neutral";

  let prompt = `You are ${name}, a customer calling about an issue.

CHARACTER:
${backstory}

Your current mood: ${mood}
Your difficulty level: ${difficulty}

RULES:
- Stay in character at ALL times
- Speak in Hinglish (mix of Hindi and English) naturally, like a real Indian customer
- Never break character or mention you are an AI
- React emotionally based on your mood — if frustrated, show it; if confused, ask clarifying questions`;

  if (difficulty === "beginner" || difficulty === "intermediate") {
    prompt += `\n- Be relatively patient and cooperative. Answer the agent's questions.`;
  } else if (difficulty === "advanced") {
    prompt += `\n- Push back if the agent is vague. Ask for specifics. Don't accept "24 hours" as an answer if you've already waited that long.`;
  } else if (difficulty === "expert") {
    prompt += `\n- Be demanding. Interrupt if the agent is slow. Ask to speak to a supervisor if not satisfied. Threaten to file a complaint.`;
  } else if (difficulty === "nightmare") {
    prompt += `\n- Be extremely difficult. Interrupt constantly. Change the subject. Get emotional. Demand immediate resolution. Hang up if not satisfied within 2 minutes.`;
  }

  prompt += `\n- Keep responses conversational (1-3 sentences typically)
- Use natural Indian customer expressions: "arre", "yaar", "matlab", "theek hai", etc.`;

  if (hiddenObj) {
    prompt += `\n\nHIDDEN OBJECTIVE: ${hiddenObj}\nDo NOT reveal this objective directly. Work towards it subtly through the conversation.`;
  }

  prompt += `\n\nWhen the call starts, describe your problem naturally. The agent will respond to help you.`;

  return prompt;
}

function buildGreeting(personaData: Record<string, unknown>): string {
  const mood = (personaData.mood as string) || "neutral";

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

  const difficulty = (body.difficulty as string) || (personaData?.difficulty as string) || "intermediate";
  const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.intermediate;

  const bgNoiseEnabled = (body.bgNoiseEnabled as boolean) ?? (preset.bg_noise_enabled as boolean);
  const bgNoiseVolume = (body.bgNoiseVolume as number) ?? (preset.bg_noise_volume as number) ?? 50;
  const bgNoiseSound = (body.bgNoiseSound as string) ?? (preset.bg_noise_sound as string) ?? "office";
  const fillerWordsFrequency = (body.fillerWordsFrequency as number) ?? (preset.filler_words_frequency as number) ?? 0.2;
  const fillerWordsList = (body.fillerWordsList as string[]) ?? (preset.filler_words_list as string[]) ?? [];
  const maxCallDuration = (body.maxCallDuration as number) ?? (preset.max_call_duration as number) ?? 15;
  const idleCallHangupTimeout = (body.idleCallHangupTimeout as number) ?? (preset.idle_call_hangup_timeout as number) ?? 30;
  const guardrailLevel = (body.guardrailLevel as string) ?? (preset.guardrail_level as string) ?? "medium";
  const eagerness = (body.eagerness as string) ?? (preset.eagerness as string) ?? "balanced";

  const systemPrompt = personaData ? buildSystemPrompt(personaData, difficulty) : "You are a customer calling about an issue. Speak in Hinglish. Describe your problem.";
  const greetingMessage = personaData ? buildGreeting(personaData) : "Hello? Mujhe aapki madad chahiye.";

  try {
    const requestBody: Record<string, unknown> = {
      agent_id: keys.vaaniAgentId,
      medium: "webrtc",
      voice_gender: voiceGender,
      voice: voiceGender,
      bg_noise_enabled: bgNoiseEnabled,
      bg_noise_volume: bgNoiseVolume,
      voice_speed: eagerness === "fast" ? 1.2 : eagerness === "slow" ? 0.8 : 1.0,
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
        difficulty,
      },
      modify_agent: {
        persona: {
          identity: {
            system_prompt: systemPrompt,
            greeting_message: {
              agent_message: greetingMessage,
              agent_speech_delay: eagerness === "fast" ? 0 : 1,
              user_speech_delay: eagerness === "fast" ? 1 : 2,
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
        experience: {
          filler_words: {
            enabled: fillerWordsFrequency > 0,
            filler_words_frequency: fillerWordsFrequency,
            filler_words_list: fillerWordsList,
          },
          eagerness_to_speak: eagerness,
          patience_with_user_entries: preset.patience_with_user_entries as number,
          idle_conversation_settings: {
            pulse_check: true,
            end_conversation_on_idle: true,
            idle_call_hangup_timeout: idleCallHangupTimeout,
            idle_call_warning_timeout: Math.floor(idleCallHangupTimeout / 2),
            messages: [
              "Hello? Are you still there?",
              "Excuse me, I need help please.",
              "Hello? Koi hai?",
            ],
          },
          settings: {
            end_call: {
              enabled: true,
              phrase: "goodbye",
              timeout: 10,
            },
            call_settings: {
              max_call_duration: maxCallDuration,
            },
          },
        },
        training: {
          know_how: {
            guardrails: {
              level: guardrailLevel as "basic" | "medium" | "strict",
            },
          },
        },
        analysis: {
          evaluations: {
            conversation_evaluation: {
              enabled: true,
              prompt: "Rate the agent's performance on empathy, problem resolution, communication clarity, and professionalism from 1-10. Provide specific feedback.",
            },
          },
        },
      },
    };

    console.log("[Voice Session] Config:", JSON.stringify({
      voiceGender,
      personaName: personaData?.name,
      difficulty,
      bgNoise: bgNoiseEnabled ? `${bgNoiseSound} @${bgNoiseVolume}%` : "off",
      fillerWords: `${fillerWordsFrequency * 100}%`,
      maxDuration: `${maxCallDuration}min`,
      idleTimeout: `${idleCallHangupTimeout}s`,
      guardrails: guardrailLevel,
      eagerness,
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

    const callId = data.call_id || data.room_name;
    try {
      await db
        .update(simulations)
        .set({ startedAt: new Date(), callId })
        .where(eq(simulations.id, simulationId));
    } catch {
      // ignore
    }

    return NextResponse.json({
      token: data.token,
      roomName: data.room_name,
      connectionUrl: data.connection_url,
      liveCaptionsUrl: data.live_captions_url,
      agentName: data.agent_name,
      personaName: personaData?.name || "Customer",
      voiceGender,
      callId,
      config: {
        bgNoise: bgNoiseEnabled ? `${bgNoiseSound} @${bgNoiseVolume}%` : "off",
        fillerWords: `${Math.round(fillerWordsFrequency * 100)}%`,
        maxDuration: maxCallDuration,
        guardrails: guardrailLevel,
        eagerness,
      },
    });
  } catch (err) {
    console.error("Voice session error:", err);
    return NextResponse.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}
