import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const VAANI_BASE_URL = process.env.VAANI_BASE_URL || "https://api.vaanivoice.ai";
const VAANI_API_KEY = process.env.VAANI_API_KEY;
const VAANI_AGENT_ID = process.env.VAANI_AGENT_ID;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!VAANI_API_KEY || !VAANI_AGENT_ID) {
    return NextResponse.json(
      { error: "Vaani API not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${VAANI_BASE_URL}/api/trigger-call/`, {
      method: "POST",
      headers: {
        "X-API-Key": VAANI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: VAANI_AGENT_ID,
        medium: "webrtc",
        primary_language: "en",
        secondary_language: "en",
        welcome_message: body.welcomeMessage || "Hello! I need help with my issue.",
        welcome_interruptible: true,
        bg_noise_enabled: false,
        voice_speed: 1.0,
        metadata: {
          user_id: session.user.id,
          simulation_id: body.simulationId || "",
          persona_name: body.personaName || "",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Vaani API error:", res.status, err);
      return NextResponse.json(
        { error: `Vaani API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      token: data.token,
      roomName: data.room_name,
      connectionUrl: data.connection_url,
      liveCaptionsUrl: data.live_captions_url,
      agentName: data.agent_name,
    });
  } catch (err) {
    console.error("Voice session error:", err);
    return NextResponse.json(
      { error: "Failed to create voice session" },
      { status: 500 }
    );
  }
}
