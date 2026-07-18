"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Loader2,
  AlertCircle,
  Brain,
  Zap,
  Heart,
  ChevronRight,
} from "lucide-react";

type Persona = {
  id: string;
  name: string;
  emoji: string;
  industry: string;
  difficulty: string;
  description: string;
  mood: string;
  urgency: number;
  technicalKnowledge: number;
  personalityTraits: Record<string, number>;
};

function NewSimulationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPersona = searchParams.get("persona");

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedId, setSelectedId] = useState<string>(preselectedPersona || "");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/personas")
      .then((r) => r.json())
      .then((data) => {
        setPersonas(data);
        setLoading(false);
        if (preselectedPersona) setSelectedId(preselectedPersona);
      });
  }, [preselectedPersona]);

  async function handleStart() {
    if (!selectedId) return;
    setStarting(true);
    setError("");

    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId: selectedId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to start simulation");
        setStarting(false);
        return;
      }

      const sim = await res.json();
      router.push(`/dashboard/simulations/${sim.id}`);
    } catch {
      setError("Something went wrong");
      setStarting(false);
    }
  }

  const selected = personas.find((p) => p.id === selectedId);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 size={32} className="animate-spin mx-auto text-[#2d2d2d]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[#2d2d2d]/60 hover:text-[#2d2d2d] mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-2">
          New Simulation
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 mb-8">
          Choose a customer persona and start your training call
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border-2 border-[#ff4d4d] text-[#ff4d4d] px-4 py-3 font-[family-name:var(--font-body)] wobbly-sm text-sm mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {personas.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#e5e0d8] wobbly">
            <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/50 mb-4">
              No personas yet. Create one first.
            </p>
            <Link
              href="/dashboard/personas/new"
              className="btn-hand px-6 py-3 inline-flex items-center gap-2"
            >
              Create Persona
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {personas.map((p) => {
                const traits = p.personalityTraits || {};
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`text-left p-5 border-2 transition-all ${
                      selectedId === p.id
                        ? "border-[#2d5da1] bg-[#2d5da1]/5 shadow-hard"
                        : "border-[#e5e0d8] hover:border-[#2d2d2d]"
                    } wobbly-sm`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <div className="font-[family-name:var(--font-heading)] font-bold">
                          {p.name}
                        </div>
                        <div className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
                          {p.industry} · {p.difficulty} · {p.mood}
                        </div>
                      </div>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex gap-4 mt-3">
                      <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/40 flex items-center gap-1">
                        <Zap size={12} /> Urgency {p.urgency}/10
                      </span>
                      <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/40 flex items-center gap-1">
                        <Brain size={12} /> Tech {p.technicalKnowledge}/10
                      </span>
                      <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/40 flex items-center gap-1">
                        <Heart size={12} /> Stress {traits.stress || 50}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-6 wobbly-sm mb-6">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2">
                  {selected.emoji} {selected.name} — Ready to call
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/70">
                  {selected.description}
                </p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50 mt-2 italic">
                  Hidden objective: {selected.industry} customer — they won&apos;t tell you what they really want upfront
                </p>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!selectedId || starting}
              className="btn-hand px-8 py-3 text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play size={20} strokeWidth={2.5} />
                  Start Simulation
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function NewSimulationPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <Loader2 size={32} className="animate-spin mx-auto text-[#2d2d2d]" />
        </div>
      }
    >
      <NewSimulationForm />
    </Suspense>
  );
}
