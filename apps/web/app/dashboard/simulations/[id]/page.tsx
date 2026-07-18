"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Send,
  Loader2,
  Phone,
  PhoneOff,
  Clock,
  AlertCircle,
  Volume2,
  MessageSquare,
  Mic,
  Settings,
  ChevronDown,
  ChevronUp,
  Waves,
  Timer,
  Shield,
  Gauge,
  Brain,
  Music,
} from "lucide-react";

const VoiceCall = dynamic(() => import("@/components/VoiceCall"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2 text-[#2d2d2d]/50">
      <Loader2 size={16} className="animate-spin" />
      Loading voice...
    </div>
  ),
});

type TranscriptEntry = {
  role: "customer" | "agent";
  content: string;
  timestamp: string;
  emotion?: string;
};

type Simulation = {
  id: string;
  status: string;
  personaId: string;
  transcript: TranscriptEntry[];
  startedAt: string;
  persona?: {
    name: string;
    emoji: string;
    industry: string;
    difficulty: string;
    mood: string;
    description: string;
  };
};

const DIFFICULTY_PRESETS = [
  { value: "beginner", label: "Beginner", desc: "No noise, patient, cooperative", color: "bg-green-100 border-green-400 text-green-800" },
  { value: "intermediate", label: "Intermediate", desc: "Office noise, some filler words", color: "bg-yellow-100 border-yellow-400 text-yellow-800" },
  { value: "advanced", label: "Advanced", desc: "Cafe noise, interrupts, demanding", color: "bg-orange-100 border-orange-400 text-orange-800" },
  { value: "expert", label: "Expert", desc: "Street noise, very impatient", color: "bg-red-100 border-red-400 text-red-800" },
  { value: "nightmare", label: "Nightmare", desc: "Maximum chaos, constant interruptions", color: "bg-purple-100 border-purple-400 text-purple-800" },
];

const BG_NOISES = [
  { value: "office", label: "Office", icon: "🏢" },
  { value: "cafe", label: "Cafe", icon: "☕" },
  { value: "street", label: "Street", icon: "🚗" },
  { value: "home", label: "Home", icon: "🏠" },
];

const GUARDRAIL_LEVELS = [
  { value: "basic", label: "Basic", desc: "Minimal filtering" },
  { value: "medium", label: "Medium", desc: "Standard compliance" },
  { value: "strict", label: "Strict", desc: "Full compliance mode" },
];

export default function SimulationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [sim, setSim] = useState<Simulation | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const [fetchingTranscript, setFetchingTranscript] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Simulation settings
  const [difficulty, setDifficulty] = useState("intermediate");
  const [bgNoiseEnabled, setBgNoiseEnabled] = useState(false);
  const [bgNoiseSound, setBgNoiseSound] = useState("office");
  const [bgNoiseVolume, setBgNoiseVolume] = useState(50);
  const [fillerWordsFrequency, setFillerWordsFrequency] = useState(0.2);
  const [maxCallDuration, setMaxCallDuration] = useState(15);
  const [guardrailLevel, setGuardrailLevel] = useState("medium");
  const [eagerness, setEagerness] = useState("balanced");

  useEffect(() => {
    fetch(`/api/simulations/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setSim(data);
        if (data.status !== "active") setEnded(true);
        if (data.persona?.difficulty) {
          setDifficulty(data.persona.difficulty);
          applyDifficultyPreset(data.persona.difficulty);
        }
      })
      .catch(() => setError("Failed to load simulation"));
  }, [id]);

  function applyDifficultyPreset(d: string) {
    const presets: Record<string, Record<string, unknown>> = {
      beginner: { bgNoiseEnabled: false, fillerWordsFrequency: 0, maxCallDuration: 10, guardrailLevel: "basic", eagerness: "slow" },
      intermediate: { bgNoiseEnabled: true, bgNoiseSound: "office", bgNoiseVolume: 30, fillerWordsFrequency: 0.2, maxCallDuration: 15, guardrailLevel: "medium", eagerness: "balanced" },
      advanced: { bgNoiseEnabled: true, bgNoiseSound: "cafe", bgNoiseVolume: 50, fillerWordsFrequency: 0.3, maxCallDuration: 15, guardrailLevel: "medium", eagerness: "fast" },
      expert: { bgNoiseEnabled: true, bgNoiseSound: "street", bgNoiseVolume: 70, fillerWordsFrequency: 0.4, maxCallDuration: 10, guardrailLevel: "strict", eagerness: "fast" },
      nightmare: { bgNoiseEnabled: true, bgNoiseSound: "street", bgNoiseVolume: 80, fillerWordsFrequency: 0.5, maxCallDuration: 10, guardrailLevel: "strict", eagerness: "fast" },
    };
    const p = presets[d] || presets.intermediate;
    setBgNoiseEnabled(p.bgNoiseEnabled as boolean);
    if (p.bgNoiseSound) setBgNoiseSound(p.bgNoiseSound as string);
    if (p.bgNoiseVolume) setBgNoiseVolume(p.bgNoiseVolume as number);
    setFillerWordsFrequency(p.fillerWordsFrequency as number);
    setMaxCallDuration(p.maxCallDuration as number);
    setGuardrailLevel(p.guardrailLevel as string);
    setEagerness(p.eagerness as string);
  }

  useEffect(() => {
    if (!sim?.startedAt || ended) return;
    const start = new Date(sim.startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [sim?.startedAt, ended]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim?.transcript]);

  useEffect(() => {
    if (!ended && mode === "text") inputRef.current?.focus();
  }, [ended, mode, sim?.transcript]);

  async function handleSend() {
    if (!message.trim() || sending) return;
    const msg = message.trim();
    setMessage("");
    setSending(true);
    setError("");

    const agentEntry: TranscriptEntry = {
      role: "agent",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    setSim((prev) =>
      prev ? { ...prev, transcript: [...prev.transcript, agentEntry] } : prev
    );

    try {
      const res = await fetch(`/api/simulations/${id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send message");
        return;
      }

      const data = await res.json();

      const customerEntry: TranscriptEntry = {
        role: "customer",
        content: data.message,
        timestamp: new Date().toISOString(),
        emotion: data.emotion,
      };

      setSim((prev) =>
        prev ? { ...prev, transcript: [...prev.transcript, customerEntry] } : prev
      );
    } catch {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleVoiceTranscript(segment: { speaker: "agent" | "user"; text: string; timestamp: number }) {
    const entry: TranscriptEntry = {
      role: segment.speaker === "agent" ? "customer" : "agent",
      content: segment.text,
      timestamp: new Date(segment.timestamp * 1000).toISOString(),
    };

    setSim((prev) =>
      prev ? { ...prev, transcript: [...prev.transcript, entry] } : prev
    );

    try {
      await fetch(`/api/simulations/${id}/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: [{
            role: entry.role,
            content: entry.content,
            timestamp: entry.timestamp,
            emotion: entry.emotion,
          }],
        }),
      });
    } catch {
      // ignore
    }
  }

  async function handleEndCall() {
    setEnded(true);
    setFetchingTranscript(true);

    try {
      await fetch(`/api/simulations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          endedAt: new Date().toISOString(),
          durationSeconds: elapsed,
        }),
      });
    } catch {
      // ignore
    }

    try {
      await new Promise((r) => setTimeout(r, 5000));
      const transcriptRes = await fetch(`/api/simulations/${id}/fetch-transcript`, {
        method: "POST",
      });
      if (transcriptRes.ok) {
        const transcriptData = await transcriptRes.json();
        setSim((prev) =>
          prev ? { ...prev, transcript: transcriptData.transcript } : prev
        );
      }
    } catch {
      // ignore
    }

    setFetchingTranscript(false);
    router.push(`/dashboard/simulations/${id}/replay`);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  if (!sim) {
    return (
      <div className="text-center py-20">
        <Loader2 size={32} className="animate-spin mx-auto text-[#2d2d2d]" />
      </div>
    );
  }

  const transcript = sim.transcript || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[#2d2d2d]/60 hover:text-[#2d2d2d] transition-colors"
        >
          <ArrowLeft size={18} />
          End & Exit
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex border-2 border-[#2d2d2d] wobbly-sm overflow-hidden">
            <button
              onClick={() => setMode("text")}
              className={`px-4 py-2 flex items-center gap-2 font-[family-name:var(--font-body)] text-sm transition-colors ${
                mode === "text"
                  ? "bg-[#2d5da1] text-white"
                  : "bg-white text-[#2d2d2d] hover:bg-gray-100"
              }`}
            >
              <MessageSquare size={14} />
              Text
            </button>
            <button
              onClick={() => setMode("voice")}
              className={`px-4 py-2 flex items-center gap-2 font-[family-name:var(--font-body)] text-sm transition-colors ${
                mode === "voice"
                  ? "bg-[#ff4d4d] text-white"
                  : "bg-white text-[#2d2d2d] hover:bg-gray-100"
              }`}
            >
              <Mic size={14} />
              Voice
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white border-2 border-[#2d2d2d] px-4 py-2 wobbly-sm shadow-hard-sm">
            <Clock size={16} className="text-[#ff4d4d]" />
            <span className="font-[family-name:var(--font-heading)] text-lg font-bold tabular-nums">
              {formatTime(elapsed)}
            </span>
          </div>

          {!ended && (
            <button
              onClick={handleEndCall}
              className="btn-hand px-4 py-2 flex items-center gap-2 bg-[#ff4d4d] text-white border-[#ff4d4d] hover:bg-red-600"
            >
              <PhoneOff size={16} strokeWidth={2.5} />
              End Call
            </button>
          )}
        </div>
      </div>

      {/* Customer Info Bar */}
      {sim.persona && (
        <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] px-4 py-3 wobbly-sm shadow-hard-sm mb-4 flex items-center gap-4">
          <span className="text-2xl">{sim.persona.emoji}</span>
          <div>
            <span className="font-[family-name:var(--font-heading)] font-bold">
              {sim.persona.name}
            </span>
            <span className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50 ml-2">
              {sim.persona.industry} · Mood: {sim.persona.mood}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-2 text-xs font-[family-name:var(--font-body)] text-[#2d2d2d]/50">
              <span className="flex items-center gap-1 px-2 py-1 bg-white border border-[#e5e0d8] rounded">
                <Shield size={10} />
                {guardrailLevel}
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-white border border-[#e5e0d8] rounded">
                <Gauge size={10} />
                {eagerness}
              </span>
              {bgNoiseEnabled && (
                <span className="flex items-center gap-1 px-2 py-1 bg-white border border-[#e5e0d8] rounded">
                  <Waves size={10} />
                  {bgNoiseSound}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-[#2d2d2d]/40 hover:text-[#2d2d2d] transition-colors"
              title="Simulation settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && !ended && (
        <div className="bg-white border-2 border-[#2d2d2d] p-4 wobbly-sm shadow-hard-sm mb-4 space-y-4">
          <div className="flex items-center gap-2 font-[family-name:var(--font-heading)] font-bold text-sm">
            <Settings size={14} />
            Simulation Settings
          </div>

          {/* Difficulty Preset */}
          <div>
            <label className="block font-[family-name:var(--font-body)] text-xs font-bold mb-1 text-[#2d2d2d]/60">
              Difficulty Preset
            </label>
            <div className="flex gap-1.5">
              {DIFFICULTY_PRESETS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setDifficulty(d.value);
                    applyDifficultyPreset(d.value);
                  }}
                  className={`flex-1 px-2 py-1.5 border text-xs font-[family-name:var(--font-body)] transition-all ${
                    difficulty === d.value
                      ? `${d.color} font-bold`
                      : "border-[#e5e0d8] text-[#2d2d2d]/60 hover:border-[#2d2d2d]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Background Noise */}
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-bold mb-1 text-[#2d2d2d]/60">
                Background Noise
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBgNoiseEnabled(!bgNoiseEnabled)}
                  className={`px-2 py-1 border text-xs font-[family-name:var(--font-body)] ${
                    bgNoiseEnabled ? "bg-[#2d5da1] text-white border-[#2d5da1]" : "border-[#e5e0d8]"
                  }`}
                >
                  {bgNoiseEnabled ? "ON" : "OFF"}
                </button>
                {bgNoiseEnabled && (
                  <select
                    value={bgNoiseSound}
                    onChange={(e) => setBgNoiseSound(e.target.value)}
                    className="px-2 py-1 border border-[#e5e0d8] text-xs font-[family-name:var(--font-body)]"
                  >
                    {BG_NOISES.map((n) => (
                      <option key={n.value} value={n.value}>{n.icon} {n.label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Max Duration */}
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-bold mb-1 text-[#2d2d2d]/60">
                Max Duration
              </label>
              <select
                value={maxCallDuration}
                onChange={(e) => setMaxCallDuration(parseInt(e.target.value))}
                className="w-full px-2 py-1 border border-[#e5e0d8] text-xs font-[family-name:var(--font-body)]"
              >
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
              </select>
            </div>

            {/* Guardrails */}
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-bold mb-1 text-[#2d2d2d]/60">
                Guardrails
              </label>
              <select
                value={guardrailLevel}
                onChange={(e) => setGuardrailLevel(e.target.value)}
                className="w-full px-2 py-1 border border-[#e5e0d8] text-xs font-[family-name:var(--font-body)]"
              >
                {GUARDRAIL_LEVELS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Eagerness */}
            <div>
              <label className="block font-[family-name:var(--font-body)] text-xs font-bold mb-1 text-[#2d2d2d]/60">
                Speech Speed
              </label>
              <select
                value={eagerness}
                onChange={(e) => setEagerness(e.target.value)}
                className="w-full px-2 py-1 border border-[#e5e0d8] text-xs font-[family-name:var(--font-body)]"
              >
                <option value="slow">Slow</option>
                <option value="balanced">Balanced</option>
                <option value="fast">Fast</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Component */}
      {mode === "voice" && !ended && (
        <div className="mb-4">
          <VoiceCall
            simulationId={id}
            personaName={sim.persona?.name || "Customer"}
            onTranscript={handleVoiceTranscript}
            onCallEnd={handleEndCall}
          />
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto border-2 border-[#2d2d2d] bg-white wobbly shadow-hard p-6 space-y-4 mb-4">
        {transcript.length === 0 && (
          <div className="text-center py-12">
            <Phone size={48} className="mx-auto text-[#2d2d2d]/20 mb-3" />
            <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/40">
              {mode === "voice"
                ? "Click 'Start Voice Call' to begin speaking"
                : "Call connected. Say something to begin."}
            </p>
          </div>
        )}

        {transcript.map((entry, i) => (
          <div
            key={i}
            className={`flex ${entry.role === "agent" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 wobbly-sm ${
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

        {sending && (
          <div className="flex justify-start">
            <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] px-4 py-3 wobbly-sm">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#2d2d2d]/50" />
                <span className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/50">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border-2 border-[#ff4d4d] text-[#ff4d4d] px-4 py-2 font-[family-name:var(--font-body)] wobbly-sm text-sm mb-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Text Input */}
      {mode === "text" && !ended ? (
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your response as the agent..."
            rows={1}
            className="flex-1 px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 resize-none"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="btn-hand px-6 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </div>
      ) : ended ? (
        <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-4 wobbly-sm text-center">
          <p className="font-[family-name:var(--font-heading)] text-lg font-bold">
            {fetchingTranscript ? "Fetching Transcript..." : "Call Ended"}
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
            {fetchingTranscript ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Retrieving transcript from Vaani...
              </span>
            ) : (
              <>
                Duration: {formatTime(elapsed)} · {transcript.length} messages
              </>
            )}
          </p>
          {!fetchingTranscript && (
            <Link
              href={`/dashboard/simulations/${id}/replay`}
              className="btn-hand px-6 py-2 mt-3 inline-flex items-center gap-2"
            >
              View Replay & Score
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
