import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold mb-4">
          Dashboard
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/70 mb-6">
          Welcome back, {session.user?.name || "Agent"}!
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-6 wobbly-sm">
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-2">
              Simulations
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60">
              Start a new training simulation
            </p>
            <span className="inline-block mt-3 text-sm font-bold font-[family-name:var(--font-body)] text-[#ff4d4d]">
              Coming soon →
            </span>
          </div>

          <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-6 wobbly-sm rotate-1">
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-2">
              Analytics
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60">
              View your performance metrics
            </p>
            <span className="inline-block mt-3 text-sm font-bold font-[family-name:var(--font-body)] text-[#ff4d4d]">
              Coming soon →
            </span>
          </div>

          <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-6 wobbly-sm -rotate-1">
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-2">
              Personas
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60">
              Create customer personas
            </p>
            <span className="inline-block mt-3 text-sm font-bold font-[family-name:var(--font-body)] text-[#ff4d4d]">
              Coming soon →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
