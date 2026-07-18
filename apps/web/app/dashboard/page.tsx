import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { personas, simulations } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { Play, BarChart3, Users, Clock, Trophy, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [personaCount] = await db
    .select({ value: count() })
    .from(personas)
    .where(eq(personas.userId, session.user.id));

  const [simCount] = await db
    .select({ value: count() })
    .from(simulations)
    .where(eq(simulations.userId, session.user.id));

  const recentSims = await db.query.simulations.findMany({
    where: eq(simulations.userId, session.user.id),
    orderBy: (s, { desc }) => [desc(s.createdAt)],
    limit: 5,
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold">
          Welcome back, {session.user?.name?.split(" ")[0] || "Agent"}!
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/60 mt-2">
          Ready for your next simulation?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Link
          href="/dashboard/simulations/new"
          className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard hover:-rotate-1 transition-transform group"
        >
          <div className="w-12 h-12 bg-[#ff4d4d] border-2 border-[#2d2d2d] flex items-center justify-center text-white wobbly-sm shadow-hard-sm mb-4 group-hover:shadow-hard">
            <Play size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1">
            New Simulation
          </h3>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 text-sm">
            Start a training call with an AI customer
          </p>
        </Link>

        <Link
          href="/dashboard/personas"
          className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-6 wobbly-sm shadow-hard hover:rotate-1 transition-transform group"
        >
          <div className="w-12 h-12 bg-[#2d5da1] border-2 border-[#2d2d2d] flex items-center justify-center text-white wobbly-sm shadow-hard-sm mb-4 group-hover:shadow-hard">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1">
            Personas
          </h3>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 text-sm">
            {personaCount?.value || 0} personas created
          </p>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard -rotate-1 hover:rotate-0 transition-transform group"
        >
          <div className="w-12 h-12 bg-[#2d2d2d] border-2 border-[#2d2d2d] flex items-center justify-center text-white wobbly-sm shadow-hard-sm mb-4 group-hover:shadow-hard">
            <BarChart3 size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1">
            Analytics
          </h3>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 text-sm">
            View performance metrics
          </p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center">
          <div className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#ff4d4d]">
            {simCount?.value || 0}
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
            Simulations
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center rotate-1">
          <div className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#2d5da1]">
            {personaCount?.value || 0}
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
            Personas
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center -rotate-1">
          <div className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[#2d2d2d]">
            0%
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
            Avg QA Score
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4 flex items-center gap-2">
          <Clock size={22} /> Recent Simulations
        </h2>

        {recentSims.length === 0 ? (
          <div className="text-center py-8">
            <Zap size={40} className="mx-auto text-[#2d2d2d]/20 mb-3" />
            <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/50 text-lg">
              No simulations yet. Start your first one!
            </p>
            <Link
              href="/dashboard/simulations/new"
              className="btn-hand px-6 py-2 mt-4 inline-flex items-center gap-2"
            >
              <Play size={18} />
              Start Simulation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSims.map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between p-3 bg-[#fdfbf7] border border-[#e5e0d8] wobbly-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      sim.status === "completed"
                        ? "bg-green-500"
                        : sim.status === "active"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  />
                  <span className="font-[family-name:var(--font-body)]">
                    Simulation
                  </span>
                  {sim.qaScore != null && (
                    <span className="font-[family-name:var(--font-body)] text-sm font-bold text-[#2d5da1]">
                      Score: {Math.round(sim.qaScore)}%
                    </span>
                  )}
                </div>
                <span className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
                  {new Date(sim.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
