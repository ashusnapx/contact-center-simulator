import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user_settings } from "@/lib/db/schema";

type ApiKeys = {
  vaaniApiKey: string;
  vaaniAgentId: string;
  geminiApiKey: string;
  openaiApiKey: string;
};

const DEFAULTS: ApiKeys = {
  vaaniApiKey: process.env.VAANI_API_KEY || "",
  vaaniAgentId: process.env.VAANI_AGENT_ID || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
};

/**
 * Get API keys for a user. Falls back to env vars if no settings saved.
 */
export async function getApiKeys(userId: string): Promise<ApiKeys> {
  const settings = await db.query.user_settings.findFirst({
    where: eq(user_settings.userId, userId),
  });

  if (!settings) return DEFAULTS;

  return {
    vaaniApiKey: settings.vaaniApiKey || DEFAULTS.vaaniApiKey,
    vaaniAgentId: settings.vaaniAgentId || DEFAULTS.vaaniAgentId,
    geminiApiKey: settings.geminiApiKey || DEFAULTS.geminiApiKey,
    openaiApiKey: settings.openaiApiKey || DEFAULTS.openaiApiKey,
  };
}
