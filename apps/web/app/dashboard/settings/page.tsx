"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Key,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

type Settings = {
  vaaniApiKey: string;
  vaaniAgentId: string;
  geminiApiKey: string;
  openaiApiKey: string;
};

function KeyInput({
  label,
  value,
  onChange,
  placeholder,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  description: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
        {label}
      </label>
      <p className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50 mb-2">
        {description}
      </p>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2d2d2d]/50 hover:text-[#2d2d2d] transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    vaaniApiKey: "",
    vaaniAgentId: "",
    geminiApiKey: "",
    openaiApiKey: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          vaaniApiKey: data.vaaniApiKey || "",
          vaaniAgentId: data.vaaniAgentId || "",
          geminiApiKey: data.geminiApiKey || "",
          openaiApiKey: data.openaiApiKey || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        setMessage({ type: "error", text: "Failed to save settings" });
        return;
      }

      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 size={32} className="animate-spin mx-auto text-[#2d2d2d]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold flex items-center gap-3">
          <Key size={32} className="text-[#ff4d4d]" />
          Settings
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d]/60 mt-2">
          Configure your API keys and integrations
        </p>
      </div>

      <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard">
        {message && (
          <div
            className={`flex items-center gap-2 px-4 py-3 font-[family-name:var(--font-body)] wobbly-sm text-sm mb-6 ${
              message.type === "success"
                ? "bg-green-50 border-2 border-green-400 text-green-700"
                : "bg-red-50 border-2 border-[#ff4d4d] text-[#ff4d4d]"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Vaani Section */}
          <div className="bg-[#fff9c4] border-2 border-[#2d2d2d] p-5 wobbly-sm">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4 flex items-center gap-2">
              🎙️ Vaani Voice AI
            </h2>
            <div className="space-y-4">
              <KeyInput
                label="API Key"
                value={settings.vaaniApiKey}
                onChange={(v) => setSettings({ ...settings, vaaniApiKey: v })}
                placeholder="vaani_xxxxxxxxxxxx"
                description="Your Vaani API key for voice calls"
              />
              <KeyInput
                label="Agent ID"
                value={settings.vaaniAgentId}
                onChange={(v) => setSettings({ ...settings, vaaniAgentId: v })}
                placeholder="d368c9d7-fde7-4190-a6f4-9e6091424153"
                description="UUID of your Vaani voice agent"
              />
            </div>
          </div>

          {/* Gemini Section */}
          <div className="bg-white border-2 border-[#e5e0d8] p-5 wobbly-sm">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4 flex items-center gap-2">
              🧠 Google Gemini
            </h2>
            <KeyInput
              label="API Key"
              value={settings.geminiApiKey}
              onChange={(v) => setSettings({ ...settings, geminiApiKey: v })}
              placeholder="AIzaSy..."
              description="For text chat and QA scoring (gemini-3.1-flash-lite)"
            />
          </div>

          {/* OpenAI Section */}
          <div className="bg-white border-2 border-[#e5e0d8] p-5 wobbly-sm">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4 flex items-center gap-2">
              🤖 OpenAI
            </h2>
            <KeyInput
              label="API Key"
              value={settings.openaiApiKey}
              onChange={(v) => setSettings({ ...settings, openaiApiKey: v })}
              placeholder="sk-..."
              description="Alternative LLM for text chat and scoring"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-hand px-8 py-3 text-lg flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>

          <button
            onClick={() => {
              setSettings({ vaaniApiKey: "", vaaniAgentId: "", geminiApiKey: "", openaiApiKey: "" });
              setMessage(null);
            }}
            className="btn-hand btn-hand-secondary px-6 py-3 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
