import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getApiKeys } from "@/lib/api-keys";

const VAANI_BASE_URL = "https://api.vaanivoice.ai";

export async function GET(
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
    return NextResponse.json({ error: "Vaani API key not configured" }, { status: 500 });
  }

  const sim = await db.query.simulations.findFirst({
    where: eq(simulations.id, id),
  });

  if (!sim?.callId) {
    return NextResponse.json({ error: "No call found" }, { status: 404 });
  }

  try {
    const res = await fetch(
      `${VAANI_BASE_URL}/api/stream/${sim.callId}`,
      {
        headers: { "X-API-Key": keys.vaaniApiKey },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Recording not available" }, { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "audio/ogg";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": body.byteLength.toString(),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    console.error("Failed to fetch recording:", err);
    return NextResponse.json({ error: "Failed to fetch recording" }, { status: 500 });
  }
}
