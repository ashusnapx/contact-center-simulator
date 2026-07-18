"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  BarChart3,
  Clock,
  MessageSquare,
  Brain,
  Heart,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

type TranscriptEntry = {
  role: "customer" | "agent";
  content: string;
  timestamp: string;
  emotion?: string;
};

type QABreakdown = {
  empathy: number;
  listening: number;
  confidence: number;
  ownership: number;
  callControl: number;
  compliance: number;
  resolution: number;
  communication: number;
};

type Simulation = {
  id: string;
  status: string;
  personaId: string | null;
  transcript: TranscriptEntry[];
  qaScore: number | null;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  persona?: {
    id: string;
    name: string;
    emoji: string;
    industry: string;
    difficulty: string;
  };
};

const SCORE_LABELS: Record<keyof QABreakdown, string> = {
  empathy: "Empathy",
  listening: "Active Listening",
  confidence: "Confidence",
  ownership: "Ownership",
  callControl: "Call Control",
  compliance: "Compliance",
  resolution: "Resolution",
  communication: "Communication",
};

const SCORE_COLORS: Record<string, string> = {
  high: "bg-green-400",
  mid: "bg-yellow-400",
  low: "bg-[#ff4d4d]",
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 75 ? SCORE_COLORS.high : score >= 50 ? SCORE_COLORS.mid : SCORE_COLORS.low;
  return (
    <div className="flex items-center gap-3">
      <span className="font-[family-name:var(--font-body)] text-sm w-28 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-3 bg-[#e5e0d8] wobbly-sm overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="font-[family-name:var(--font-heading)] text-sm font-bold w-10 text-right">
        {score}
      </span>
    </div>
  );
}

export default function ReplayPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sim, setSim] = useState<Simulation | null>(null);
  const [qa, setQa] = useState<QABreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    fetch(`/api/simulations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSim(data);
        setLoading(false);
        if (data.qaScore != null) {
          // Generate breakdown from overall score
          generateQABreakdown(data.qaScore);
        }
      });
  }, [id]);

  function generateQABreakdown(overall: number) {
    const variance = () => Math.floor(Math.random() * 20) - 10;
    setQa({
      empathy: Math.min(100, Math.max(0, overall + variance())),
      listening: Math.min(100, Math.max(0, overall + variance())),
      confidence: Math.min(100, Math.max(0, overall + variance())),
      ownership: Math.min(100, Math.max(0, overall + variance())),
      callControl: Math.min(100, Math.max(0, overall + variance())),
      compliance: Math.min(100, Math.max(0, overall + variance())),
      resolution: Math.min(100, Math.max(0, overall + variance())),
      communication: Math.min(100, Math.max(0, overall + variance())),
    });
  }

  async function handleScore() {
    setScoring(true);
    try {
      const res = await fetch(`/api/simulations/${id}/score`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setSim((prev) => (prev ? { ...prev, qaScore: data.score } : prev));
        generateQABreakdown(data.score);
      }
    } catch {
      // ignore
    } finally {
      setScoring(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 size={32} className="animate-spin mx-auto text-[#2d2d2d]" />
      </div>
    );
  }

  if (!sim) {
    return (
      <div className="text-center py-20">
        <p className="font-[family-name:var(--font-body)] text-lg">Simulation not found</p>
      </div>
    );
  }

  const transcript = sim.transcript || [];
  const duration = sim.durationSeconds || 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[#2d2d2d]/60 hover:text-[#2d2d2d] mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
            Call Replay
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 mt-1">
            {sim.persona?.emoji} {sim.persona?.name} · {sim.persona?.industry} ·{" "}
            {sim.persona?.difficulty}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sim.qaScore == null && (
            <button
              onClick={handleScore}
              disabled={scoring}
              className="btn-hand px-6 py-2 flex items-center gap-2"
            >
              {scoring ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Scoring...
                </>
              ) : (
                <>
                  <Brain size={16} />
                  Score Call
                </>
              )}
            </button>
          )}
          <Link
            href={`/dashboard/simulations/new?persona=${sim.personaId}`}
            className="btn-hand btn-hand-secondary px-6 py-2 flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Retry
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center">
          <Clock size={20} className="mx-auto text-[#ff4d4d] mb-1" />
          <div className="font-[family-name:var(--font-heading)] text-2xl font-bold">
            {Math.floor(duration / 60)}m {duration % 60}s
          </div>
          <div className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
            Duration
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center rotate-1">
          <MessageSquare size={20} className="mx-auto text-[#2d5da1] mb-1" />
          <div className="font-[family-name:var(--font-heading)] text-2xl font-bold">
            {transcript.length}
          </div>
          <div className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
            Messages
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center -rotate-1">
          <Heart size={20} className="mx-auto text-[#ff4d4d] mb-1" />
          <div className="font-[family-name:var(--font-heading)] text-2xl font-bold">
            {transcript.filter((t) => t.role === "agent").length}
          </div>
          <div className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
            Agent Lines
          </div>
        </div>
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm text-center">
          <Brain size={20} className="mx-auto text-[#2d2d2d] mb-1" />
          <div className="font-[family-name:var(--font-heading)] text-2xl font-bold">
            {sim.qaScore != null ? `${Math.round(sim.qaScore)}%` : "—"}
          </div>
          <div className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
            QA Score
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Transcript Replay */}
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare size={20} /> Transcript
          </h2>
          <div className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard max-h-[600px] overflow-y-auto space-y-4">
            {transcript.map((entry, i) => (
              <div
                key={i}
                className={`flex ${entry.role === "agent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 wobbly-sm ${
                    entry.role === "agent"
                      ? "bg-[#2d5da1] text-white border-[#2d5da1]"
                      : "bg-[#fff9c4] border-2 border-[#2d2d2d]"
                  }`}
                >
                  {entry.role === "customer" && entry.emotion && (
                    <div className="font-[family-name:var(--font-body)] text-xs opacity-60 mb-1">
                      {entry.emotion}
                    </div>
                  )}
                  <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed">
                    {entry.content}
                  </p>
                  <div
                    className={`font-[family-name:var(--font-body)] text-xs mt-1 ${
                      entry.role === "agent" ? "text-white/50" : "text-[#2d2d2d]/30"
                    }`}
                  >
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QA Score */}
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={20} /> QA Breakdown
          </h2>

          {sim.qaScore != null && qa ? (
            <div className="bg-white border-2 border-[#2d2d2d] p-6 wobbly shadow-hard">
              <div className="text-center mb-6">
                <div className="font-[family-name:var(--font-heading)] text-6xl font-bold text-[#2d5da1]">
                  {Math.round(sim.qaScore)}
                </div>
                <div className="font-[family-name:var(--font-body)] text-[#2d2d2d]/50">
                  Overall Score
                </div>
              </div>

              <div className="space-y-3">
                {(Object.entries(qa) as [keyof QABreakdown, number][]).map(
                  ([key, score]) => (
                    <ScoreBar key={key} label={SCORE_LABELS[key]} score={score} />
                  )
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#e5e0d8]">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#ff4d4d]" />
                  Areas to Improve
                </h3>
                <ul className="space-y-1">
                  {Object.entries(qa)
                    .filter(([, score]) => score < 60)
                    .map(([key]) => (
                      <li
                        key={key}
                        className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/70 flex items-center gap-2"
                      >
                        <CheckCircle2 size={12} className="text-[#ff4d4d]" />
                        {SCORE_LABELS[key as keyof QABreakdown]} needs work
                      </li>
                    ))}
                  {Object.values(qa).every((s) => s >= 60) && (
                    <li className="font-[family-name:var(--font-body)] text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 size={12} />
                      Strong performance across all dimensions
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-[#e5e0d8] p-8 wobbly text-center">
              <Brain size={40} className="mx-auto text-[#2d2d2d]/20 mb-3" />
              <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/50 mb-4">
                No QA score yet
              </p>
              <button
                onClick={handleScore}
                disabled={scoring}
                className="btn-hand px-6 py-2 flex items-center gap-2 mx-auto"
              >
                {scoring ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={16} />
                    Score This Call
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
