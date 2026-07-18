import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user_settings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let settings = await db.query.user_settings.findFirst({
    where: eq(user_settings.userId, session.user.id),
  });

  if (!settings) {
    const [created] = await db
      .insert(user_settings)
      .values({ userId: session.user.id })
      .returning();
    settings = created;
  }

  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { vaaniApiKey, vaaniAgentId, geminiApiKey, openaiApiKey } = body;

  const [upserted] = await db
    .insert(user_settings)
    .values({
      userId: session.user.id,
      vaaniApiKey,
      vaaniAgentId,
      geminiApiKey,
      openaiApiKey,
    })
    .onConflictDoUpdate({
      target: user_settings.userId,
      set: {
        vaaniApiKey,
        vaaniAgentId,
        geminiApiKey,
        openaiApiKey,
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json(upserted);
}
