"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColors = [
  "",
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-500",
  "bg-green-500",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/login?signup=success");
  }

  const isValid =
    name.length >= 2 &&
    email.length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-12 h-12 bg-[#ff4d4d] border-2 border-[#2d2d2d] flex items-center justify-center text-white font-[family-name:var(--font-heading)] font-bold text-xl wobbly-sm shadow-hard mx-auto">
              V
            </div>
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mt-4">
            Create Account
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 mt-2">
            Start your AI training journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border-2 border-[#ff4d4d] text-[#ff4d4d] px-4 py-3 font-[family-name:var(--font-body)] wobbly-sm text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              autoFocus
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 transition-colors"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2d2d2d]/50 hover:text-[#2d2d2d] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full border border-[#2d2d2d]/10 ${
                        i <= strength ? strengthColors[strength] : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/50">
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-[family-name:var(--font-body)] text-sm font-bold mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 border-2 bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none transition-colors ${
                  passwordsMatch
                    ? "border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    : passwordsMismatch
                    ? "border-[#ff4d4d] focus:border-[#ff4d4d] focus:ring-2 focus:ring-[#ff4d4d]/20"
                    : "border-[#2d2d2d] focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20"
                }`}
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2d2d2d]/50 hover:text-[#2d2d2d] transition-colors"
                tabIndex={-1}
                aria-label={
                  showConfirm ? "Hide password" : "Show password"
                }
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordsMatch && (
              <p className="flex items-center gap-1 font-[family-name:var(--font-body)] text-xs text-green-600 mt-1">
                <CheckCircle2 size={12} />
                Passwords match
              </p>
            )}
            {passwordsMismatch && (
              <p className="flex items-center gap-1 font-[family-name:var(--font-body)] text-xs text-[#ff4d4d] mt-1">
                <XCircle size={12} />
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full btn-hand py-3 text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-6 font-[family-name:var(--font-body)] text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#2d5da1] hover:underline font-bold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
