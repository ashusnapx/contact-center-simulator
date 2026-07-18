"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  User,
  MessageSquare,
  Eye,
  Brain,
  Heart,
  Zap,
  Save,
} from "lucide-react";

const INDUSTRIES = [
  { value: "telecom", label: "Telecom", emoji: "📡" },
  { value: "banking", label: "Banking", emoji: "🏦" },
  { value: "insurance", label: "Insurance", emoji: "🛡️" },
  { value: "healthcare", label: "Healthcare", emoji: "🏥" },
  { value: "saas", label: "SaaS", emoji: "💻" },
  { value: "ecommerce", label: "E-commerce", emoji: "🛒" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "logistics", label: "Logistics", emoji: "📦" },
  { value: "retail", label: "Retail", emoji: "🛍️" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner", color: "bg-green-100 border-green-400 text-green-800" },
  { value: "intermediate", label: "Intermediate", color: "bg-yellow-100 border-yellow-400 text-yellow-800" },
  { value: "advanced", label: "Advanced", color: "bg-orange-100 border-orange-400 text-orange-800" },
  { value: "expert", label: "Expert", color: "bg-red-100 border-red-400 text-red-800" },
  { value: "nightmare", label: "Nightmare", color: "bg-purple-100 border-purple-400 text-purple-800" },
];

const MOODS = [
  "neutral", "angry", "frustrated", "confused", "impatient",
  "happy", "worried", "sarcastic", "polite", "demanding",
];

const EMOJIS = ["👤", "👩", "👨", "👵", "👴", "🧑", "👩‍💼", "👨‍💼", "👩‍🔧", "👨‍🔧"];

function SliderInput({
  label,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-[#2d2d2d]/50 shrink-0" />
      <span className="font-[family-name:var(--font-body)] text-sm w-24 shrink-0">
        {label}
      </span>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1 accent-[#2d5da1] h-2"
      />
      <span className="font-[family-name:var(--font-body)] text-sm font-bold w-6 text-center">
        {value}
      </span>
    </div>
  );
}

export default function EditPersonaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("👤");
  const [industry, setIndustry] = useState("telecom");
  const [difficulty, setDifficulty] = useState("beginner");
  const [mood, setMood] = useState("neutral");
  const [description, setDescription] = useState("");
  const [backstory, setBackstory] = useState("");
  const [hiddenObjective, setHiddenObjective] = useState("");
  const [urgency, setUrgency] = useState(5);
  const [technicalKnowledge, setTechnicalKnowledge] = useState(5);
  const [patience, setPatience] = useState(5);
  const [agreeableness, setAgreeableness] = useState(50);
  const [personalityPatience, setPersonalityPatience] = useState(50);
  const [trust, setTrust] = useState(50);
  const [stress, setStress] = useState(50);
  const [empathy, setEmpathy] = useState(50);
  const [assertiveness, setAssertiveness] = useState(50);

  useEffect(() => {
    fetch(`/api/personas/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((p) => {
        setName(p.name || "");
        setEmoji(p.emoji || "👤");
        setIndustry(p.industry || "telecom");
        setDifficulty(p.difficulty || "beginner");
        setMood(p.mood || "neutral");
        setDescription(p.description || "");
        setBackstory(p.backstory || "");
        setHiddenObjective(p.hiddenObjective || "");
        setUrgency(p.urgency || 5);
        setTechnicalKnowledge(p.technicalKnowledge || 5);
        setPatience(p.patience || 5);
        const traits = (p.personalityTraits as Record<string, number>) || {};
        setAgreeableness(traits.agreeableness || 50);
        setPersonalityPatience(traits.patience || 50);
        setTrust(traits.trust || 50);
        setStress(traits.stress || 50);
        setEmpathy(traits.empathy || 50);
        setAssertiveness(traits.assertiveness || 50);
        setFetching(false);
      })
      .catch(() => {
        setError("Failed to load persona");
        setFetching(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim() || !backstory.trim() || !hiddenObjective.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/personas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          emoji,
          industry,
          difficulty,
          mood,
          description: description.trim(),
          backstory: backstory.trim(),
          hiddenObjective: hiddenObjective.trim(),
          urgency,
          technicalKnowledge,
          patience,
          personalityTraits: {
            agreeableness,
            patience: personalityPatience,
            trust,
            stress,
            empathy,
            assertiveness,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update persona");
        return;
      }

      router.push("/dashboard/personas");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isValid = name.trim() && description.trim() && backstory.trim() && hiddenObjective.trim();

  if (fetching) {
    return (
      <div className="text-center py-20">
        <Loader2 size={32} className="animate-spin mx-auto text-[#2d2d2d]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/dashboard/personas"
        className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[#2d2d2d]/60 hover:text-[#2d2d2d] mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Personas
      </Link>

      <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard">
        <div className="flex items-center gap-3 mb-8">
          <Save size={28} className="text-[#2d5da1]" />
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
            Edit Persona
          </h1>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border-2 border-[#ff4d4d] text-[#ff4d4d] px-4 py-3 font-[family-name:var(--font-body)] wobbly-sm text-sm mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold flex items-center gap-2">
              <User size={20} /> Basic Info
            </h2>

            <div>
              <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                Persona Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20"
                placeholder="e.g., Angry Mr. Thompson"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                  Avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`w-10 h-10 text-xl flex items-center justify-center border-2 transition-all ${
                        emoji === e
                          ? "border-[#2d5da1] bg-[#2d5da1]/10 scale-110"
                          : "border-[#e5e0d8] hover:border-[#2d2d2d]"
                      } wobbly-sm`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1]"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.emoji} {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                  Initial Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1]"
                >
                  {MOODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-2">
                Difficulty
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    className={`flex-1 px-3 py-2 border-2 font-[family-name:var(--font-body)] text-sm transition-all ${
                      difficulty === d.value
                        ? `${d.color} font-bold shadow-hard-sm`
                        : "border-[#e5e0d8] text-[#2d2d2d]/60 hover:border-[#2d2d2d]"
                    } wobbly-sm`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold flex items-center gap-2">
              <MessageSquare size={20} /> Story
            </h2>

            <div>
              <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 resize-none"
                placeholder="Short description of who this customer is..."
              />
            </div>

            <div>
              <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                Backstory
              </label>
              <textarea
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 resize-none"
                placeholder="Full backstory — past experiences, personality, what happened before this call..."
              />
            </div>

            <div>
              <label className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1">
                Hidden Objective
              </label>
              <textarea
                value={hiddenObjective}
                onChange={(e) => setHiddenObjective(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 resize-none"
                placeholder="What does this customer REALLY want but won't say upfront?"
              />
            </div>
          </div>

          {/* Behavioral Sliders */}
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold flex items-center gap-2">
              <Brain size={20} /> Behavior
            </h2>

            <SliderInput label="Urgency" value={urgency} onChange={setUrgency} icon={Zap} />
            <SliderInput label="Tech Knowledge" value={technicalKnowledge} onChange={setTechnicalKnowledge} icon={Brain} />
            <SliderInput label="Patience" value={patience} onChange={setPatience} icon={Heart} />
          </div>

          {/* Personality Traits */}
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold flex items-center gap-2">
              <Heart size={20} /> Personality Traits
            </h2>

            <SliderInput label="Agreeable" value={agreeableness} onChange={setAgreeableness} icon={Heart} />
            <SliderInput label="Patience" value={personalityPatience} onChange={setPersonalityPatience} icon={Heart} />
            <SliderInput label="Trust" value={trust} onChange={setTrust} icon={Eye} />
            <SliderInput label="Stress" value={stress} onChange={setStress} icon={Zap} />
            <SliderInput label="Empathy" value={empathy} onChange={setEmpathy} icon={Heart} />
            <SliderInput label="Assertive" value={assertiveness} onChange={setAssertiveness} icon={Zap} />
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/personas"
              className="btn-hand btn-hand-secondary px-6 py-3 text-lg"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="btn-hand px-8 py-3 text-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
