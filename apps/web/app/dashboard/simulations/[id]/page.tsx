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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load simulation
  useEffect(() => {
    fetch(`/api/simulations/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setSim(data);
        if (data.status !== "active") setEnded(true);
      })
      .catch(() => setError("Failed to load simulation"));
  }, [id]);

  // Timer
  useEffect(() => {
    if (!sim?.startedAt || ended) return;
    const start = new Date(sim.startedAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [sim?.startedAt, ended]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sim?.transcript]);

  // Auto-focus input in text mode
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

    // Persist to DB via transcript endpoint (no AI response)
    try {
      await fetch(`/api/simulations/${id}/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: [
            {
              role: entry.role,
              content: entry.content,
              timestamp: entry.timestamp,
              emotion: entry.emotion,
            },
          ],
        }),
      });
    } catch {
      // ignore — transcript still in local state
    }
  }

  async function handleEndCall() {
    setEnded(true);
    setFetchingTranscript(true);

    try {
      // Update simulation status
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

    // Wait for Vaani to process, then fetch transcript
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
      // Transcript fetch failed — replay page will have retry option
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
          {/* Mode Toggle */}
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
              {sim.persona.industry} · {sim.persona.difficulty} · Mood: {sim.persona.mood}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {mode === "voice" ? (
              <Volume2 size={14} className="text-[#2d5da1]" />
            ) : (
              <MessageSquare size={14} className="text-[#2d5da1]" />
            )}
            <span className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
              {mode === "voice" ? "Voice Active" : "Text Mode"}
            </span>
          </div>
        </div>
      )}

      {/* Voice Call Component (when in voice mode) */}
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

      {/* Text Input (only in text mode) */}
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
