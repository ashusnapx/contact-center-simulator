import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { personas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import {
  Plus,
  Brain,
  Zap,
  Shield,
  Heart,
  Target,
  Trash2,
  ChevronRight,
} from "lucide-react";

const INDUSTRY_LABELS: Record<string, string> = {
  banking: "Banking",
  telecom: "Telecom",
  insurance: "Insurance",
  healthcare: "Healthcare",
  saas: "SaaS",
  ecommerce: "E-commerce",
  travel: "Travel",
  logistics: "Logistics",
  retail: "Retail",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 border-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-300",
  advanced: "bg-orange-100 text-orange-800 border-orange-300",
  expert: "bg-red-100 text-red-800 border-red-300",
  nightmare: "bg-purple-100 text-purple-800 border-purple-300",
};

function TraitBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/60 w-20">
        {label}
      </span>
      <div className="flex-1 h-2 bg-[#e5e0d8] wobbly-sm overflow-hidden">
        <div
          className="h-full bg-[#2d5da1] transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/40 w-6 text-right">
        {value}
      </span>
    </div>
  );
}

export default async function PersonasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userPersonas = await db.query.personas.findMany({
    where: eq(personas.userId, session.user.id),
    orderBy: (p, { desc }) => [desc(p.isPrebuilt), desc(p.createdAt)],
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold">
            Customer Personas
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/60 mt-2">
            Create and manage AI customers for your simulations
          </p>
        </div>
        <Link
          href="/dashboard/personas/new"
          className="btn-hand px-6 py-3 text-lg flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={2.5} />
          New Persona
        </Link>
      </div>

      {userPersonas.length === 0 ? (
        <div className="bg-white border-2 border-[#2d2d2d] p-12 wobbly shadow-hard text-center">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2">
            No personas yet
          </h2>
          <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/60 mb-6">
            Create your first AI customer persona to start training
          </p>
          <Link
            href="/dashboard/personas/new"
            className="btn-hand px-8 py-3 text-lg inline-flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Persona
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {userPersonas.map((p) => {
            const traits = (p.personalityTraits as Record<string, number>) || {};
            return (
              <div
                key={p.id}
                className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard relative group hover:rotate-1 transition-transform"
              >
                {p.isPrebuilt === "true" && (
                  <div className="absolute -top-3 -right-3 bg-[#2d5da1] text-white font-[family-name:var(--font-body)] text-xs px-3 py-1 wobbly-sm border border-[#2d2d2d]">
                    Pre-built
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold truncate">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
                        {INDUSTRY_LABELS[p.industry] || p.industry}
                      </span>
                      <span className="text-[#2d2d2d]/30">·</span>
                      <span
                        className={`font-[family-name:var(--font-body)] text-xs px-2 py-0.5 border ${DIFFICULTY_COLORS[p.difficulty] || DIFFICULTY_COLORS.beginner}`}
                      >
                        {p.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/70 mb-4 line-clamp-2">
                  {p.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  <TraitBar label="Agreeable" value={traits.agreeableness || 50} />
                  <TraitBar label="Patience" value={traits.patience || 50} />
                  <TraitBar label="Trust" value={traits.trust || 50} />
                  <TraitBar label="Stress" value={traits.stress || 50} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#e5e0d8]">
                  <div className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50 flex items-center gap-1">
                      <Target size={12} /> Urgency: {p.urgency}/10
                    </span>
                    <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50 flex items-center gap-1">
                      <Brain size={12} /> Tech: {p.technicalKnowledge}/10
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.isPrebuilt !== "true" && (
                      <form
                        action={async () => {
                          "use server";
                          await db
                            .delete(personas)
                            .where(eq(personas.id, p.id));
                        }}
                      >
                        <button
                          type="submit"
                          className="p-2 text-[#2d2d2d]/40 hover:text-[#ff4d4d] transition-colors"
                          title="Delete persona"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/dashboard/simulations/new?persona=${p.id}`}
                      className="btn-hand px-4 py-1.5 text-sm flex items-center gap-1"
                    >
                      Simulate
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
