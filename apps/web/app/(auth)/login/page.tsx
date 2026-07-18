"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSignedUp = searchParams.get("signup") === "success";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      remember: rememberMe,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.url) {
      router.push(result.url);
      router.refresh();
    }
  }

  const isValid = email.length > 0 && password.length > 0;

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
            Welcome Back
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 mt-2">
            Sign in to continue training
          </p>
        </div>

        {justSignedUp && (
          <div className="flex items-center gap-2 bg-green-50 border-2 border-green-400 text-green-700 px-4 py-3 font-[family-name:var(--font-body)] wobbly-sm text-sm mb-4">
            <CheckCircle2 size={16} />
            Account created! Please sign in.
          </div>
        )}

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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-[#2d2d2d] bg-white font-[family-name:var(--font-body)] wobbly-sm focus:outline-none focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 transition-colors"
                placeholder="Your password"
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-[#2d5da1] rounded"
              />
              <span className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/70">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="font-[family-name:var(--font-body)] text-sm text-[#2d5da1] hover:underline font-bold"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full btn-hand py-3 text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-6 font-[family-name:var(--font-body)] text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#2d5da1] hover:underline font-bold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-[#2d2d2d] p-8 wobbly shadow-hard text-center">
            <Loader2 size={24} className="animate-spin mx-auto text-[#2d2d2d]" />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
