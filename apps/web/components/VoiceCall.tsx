"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Room,
  RoomEvent,
  Track,
  ConnectionState,
  Participant,
} from "livekit-client";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Loader2,
  AlertCircle,
  Volume2,
} from "lucide-react";

type VoiceSession = {
  token: string;
  roomName: string;
  connectionUrl: string;
  liveCaptionsUrl?: string;
  callId?: string;
};

type TranscriptSegment = {
  speaker: "agent" | "user";
  text: string;
  timestamp: number;
};

interface VoiceCallProps {
  simulationId: string;
  personaName: string;
  onTranscript?: (segment: TranscriptSegment) => void;
  onCallEnd?: () => void;
}

export default function VoiceCall({
  simulationId,
  personaName,
  onTranscript,
  onCallEnd,
}: VoiceCallProps) {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const roomRef = useRef<Room | null>(null);
  const captionsWsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callIdRef = useRef<string | null>(null);
  const elapsedRef = useRef(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (captionsWsRef.current) {
      captionsWsRef.current.close();
      captionsWsRef.current = null;
    }
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    setElapsed(0);
    elapsedRef.current = 0;
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  async function handleStart() {
    setStatus("connecting");
    setError("");

    try {
      const res = await fetch("/api/voice/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulationId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to connect");
        setStatus("error");
        return;
      }

      const session: VoiceSession = await res.json();
      callIdRef.current = session.callId || null;

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      roomRef.current = room;

      room.on(RoomEvent.Connected, () => {
        setStatus("connected");
        const startTime = Date.now();
        timerRef.current = setInterval(() => {
          const secs = Math.floor((Date.now() - startTime) / 1000);
          setElapsed(secs);
          elapsedRef.current = secs;
        }, 1000);
      });

      room.on(RoomEvent.Disconnected, () => {
        handleStop();
      });

      room.on(RoomEvent.TrackSubscribed, (track, _publication, _participant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
        }
      });

      room.on(RoomEvent.TrackUnsubscribed, (track) => {
        track.detach().forEach((el) => el.remove());
      });

      await room.connect(session.connectionUrl, session.token);
      await room.localParticipant.setMicrophoneEnabled(true);

      // Connect to live captions WebSocket if available
      if (session.liveCaptionsUrl) {
        try {
          const ws = new WebSocket(session.liveCaptionsUrl);
          captionsWsRef.current = ws;

          ws.onmessage = (event) => {
            try {
              const msg = JSON.parse(event.data);
              if (msg.type === "transcript" && msg.segment) {
                onTranscript?.({
                  speaker: msg.segment.speaker === "agent" ? "agent" : "user",
                  text: msg.segment.text,
                  timestamp: msg.segment.timestamp || Date.now() / 1000,
                });
              }
            } catch {
              // ignore parse errors
            }
          };

          ws.onerror = () => {
            // Live captions WebSocket failed — transcript will be fetched after call ends
          };
        } catch {
          // WebSocket connection failed — non-critical
        }
      }
    } catch (err) {
      console.error("Voice connection error:", err);
      setError("Failed to connect to voice agent");
      setStatus("error");
    }
  }

  function handleStop() {
    const finalElapsed = elapsedRef.current;
    cleanup();
    setStatus("idle");

    // Trigger transcript fetch from Vaani API (don't block on it)
    if (callIdRef.current) {
      fetch(`/api/simulations/${simulationId}/fetch-transcript`, {
        method: "POST",
      }).catch(() => {});
    }

    onCallEnd?.();
  }

  function toggleMute() {
    if (!roomRef.current) return;
    const micEnabled = !isMuted;
    roomRef.current.localParticipant.setMicrophoneEnabled(micEnabled);
    setIsMuted(!micEnabled);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  if (status === "idle") {
    return (
      <button
        onClick={handleStart}
        className="btn-hand px-6 py-3 flex items-center gap-2 bg-[#2d5da1] text-white border-[#2d5da1] hover:bg-[#1e4a8a]"
      >
        <Phone size={20} strokeWidth={2.5} />
        Start Voice Call
      </button>
    );
  }

  if (status === "connecting") {
    return (
      <div className="flex items-center gap-3 bg-[#fff9c4] border-2 border-[#2d2d2d] px-6 py-3 wobbly-sm shadow-hard-sm">
        <Loader2 size={20} className="animate-spin text-[#2d5da1]" />
        <span className="font-[family-name:var(--font-body)]">
          Connecting to {personaName}...
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-red-50 border-2 border-[#ff4d4d] text-[#ff4d4d] px-4 py-3 font-[family-name:var(--font-body)] wobbly-sm text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
        <button
          onClick={handleStart}
          className="btn-hand px-4 py-2 text-sm flex items-center gap-2"
        >
          <Phone size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-green-50 border-2 border-green-400 px-6 py-4 wobbly-sm shadow-hard-sm">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <div>
          <div className="font-[family-name:var(--font-heading)] font-bold text-green-800">
            Voice Call Active
          </div>
          <div className="font-[family-name:var(--font-body)] text-sm text-green-600">
            {formatTime(elapsed)} · Speaking with {personaName}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Volume2 size={16} className="text-green-600 animate-pulse" />

        <button
          onClick={toggleMute}
          className={`p-2 border-2 rounded-lg transition-colors ${
            isMuted
              ? "bg-[#ff4d4d] border-[#ff4d4d] text-white"
              : "bg-white border-[#2d2d2d] text-[#2d2d2d] hover:bg-gray-100"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          onClick={handleStop}
          className="p-2 bg-[#ff4d4d] border-2 border-[#ff4d4d] text-white rounded-lg hover:bg-red-600 transition-colors"
          title="End call"
        >
          <PhoneOff size={16} />
        </button>
      </div>
    </div>
  );
}
