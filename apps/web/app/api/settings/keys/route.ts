import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user_settings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

function maskKey(key: string | null): string | null {
  if (!key) return null;
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await db.query.user_settings.findFirst({
    where: eq(user_settings.userId, session.user.id),
  });

  if (!settings) {
    return NextResponse.json({
      vaaniApiKey: null,
      vaaniAgentId: null,
      geminiApiKey: null,
      openaiApiKey: null,
    });
  }

  return NextResponse.json({
    vaaniApiKey: maskKey(settings.vaaniApiKey),
    vaaniAgentId: settings.vaaniAgentId,
    geminiApiKey: maskKey(settings.geminiApiKey),
    openaiApiKey: maskKey(settings.openaiApiKey),
  });
}
