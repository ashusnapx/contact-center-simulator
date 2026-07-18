import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { simulations, personas } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import {
  BarChart3,
  Play,
  Clock,
  Trophy,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const completedSims = await db.query.simulations.findMany({
    where: eq(simulations.userId, session.user.id),
    orderBy: [desc(simulations.createdAt)],
  });

  const completed = completedSims.filter((s) => s.status === "completed");
  const scores = completed.map((s) => s.qaScore).filter((s): s is number => s != null);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const totalTime = completed.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold">
          Analytics
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/60 mt-2">
          Track your performance across all simulations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-white border-2 border-[#2d2d2d] p-5 wobbly shadow-hard text-center">
          <Play size={24} className="mx-auto text-[#ff4d4d] mb-2" />
          <div className="font-[family-name:var(--font-heading)] text-4xl font-bold">
            {completed.length}
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
            Completed Calls
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-5 wobbly shadow-hard text-center rotate-1">
          <Trophy size={24} className="mx-auto text-[#2d5da1] mb-2" />
          <div className="font-[family-name:var(--font-heading)] text-4xl font-bold text-[#2d5da1]">
            {avgScore > 0 ? `${Math.round(avgScore)}%` : "—"}
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
            Avg QA Score
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-5 wobbly shadow-hard text-center -rotate-1">
          <Clock size={24} className="mx-auto text-[#2d2d2d] mb-2" />
          <div className="font-[family-name:var(--font-heading)] text-4xl font-bold">
            {Math.floor(totalTime / 60)}m
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
            Total Practice
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-5 wobbly shadow-hard text-center">
          <TrendingUp size={24} className="mx-auto text-[#ff4d4d] mb-2" />
          <div className="font-[family-name:var(--font-heading)] text-4xl font-bold">
            {completedSims.length}
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
            Total Simulations
          </div>
        </div>
      </div>

      {/* Score Trend */}
      {scores.length > 1 && (
        <div className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Score Trend
          </h2>
          <div className="flex items-end gap-2 h-40">
            {scores.slice(-10).map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-[family-name:var(--font-body)] text-xs font-bold">
                  {Math.round(score)}
                </span>
                <div
                  className="w-full bg-[#2d5da1] wobbly-sm transition-all"
                  style={{ height: `${score}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Simulations */}
      <div className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={20} /> All Simulations
        </h2>

        {completedSims.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-[#2d2d2d]/20 mb-3" />
            <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/50 mb-4">
              No simulations yet
            </p>
            <Link
              href="/dashboard/simulations/new"
              className="btn-hand px-6 py-3 inline-flex items-center gap-2"
            >
              <Play size={18} />
              Start Your First Simulation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {completedSims.map((sim) => (
              <Link
                key={sim.id}
                href={`/dashboard/simulations/${sim.id}/replay`}
                className="flex items-center justify-between p-4 bg-[#fdfbf7] border border-[#e5e0d8] wobbly-sm hover:border-[#2d2d2d] hover:rotate-1 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      sim.status === "completed"
                        ? "bg-green-500"
                        : sim.status === "active"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <div className="font-[family-name:var(--font-heading)] font-bold">
                      Simulation
                    </div>
                    <div className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
                      {new Date(sim.createdAt).toLocaleDateString()} ·{" "}
                      {sim.durationSeconds
                        ? `${Math.floor(sim.durationSeconds / 60)}m ${sim.durationSeconds % 60}s`
                        : "In progress"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {sim.qaScore != null && (
                    <span
                      className={`font-[family-name:var(--font-heading)] text-xl font-bold ${
                        sim.qaScore >= 75
                          ? "text-green-600"
                          : sim.qaScore >= 50
                            ? "text-yellow-600"
                            : "text-[#ff4d4d]"
                      }`}
                    >
                      {Math.round(sim.qaScore)}%
                    </span>
                  )}
                  <ArrowRight
                    size={18}
                    className="text-[#2d2d2d]/30 group-hover:text-[#2d2d2d] transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
