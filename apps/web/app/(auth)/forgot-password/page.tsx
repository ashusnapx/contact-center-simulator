"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard text-center">
          <div className="w-12 h-12 bg-green-100 border-2 border-green-400 flex items-center justify-center text-green-600 wobbly-sm mx-auto mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-4">
            Check Your Email
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/70 mb-6">
            If an account exists with <strong>{email}</strong>, we&apos;ve sent
            password reset instructions.
          </p>
          <Link href="/login" className="btn-hand px-6 py-3 text-lg inline-block">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
            Reset Password
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 mt-2">
            Enter your email and we&apos;ll send you a reset link
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
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || email.length === 0}
            className="w-full btn-hand py-3 text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="text-center mt-6 font-[family-name:var(--font-body)] text-sm">
          Remember your password?{" "}
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
