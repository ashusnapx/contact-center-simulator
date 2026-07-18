"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-sm border-b-2 border-[#2d2d2d]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#ff4d4d] border-3 border-[#2d2d2d] flex items-center justify-center text-white font-[family-name:var(--font-heading)] font-bold text-lg wobbly-sm shadow-hard">
            V
          </div>
          <span className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight">
            VaaniVerse
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-body)] text-lg text-[#2d2d2d] hover:text-[#ff4d4d] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4d4d] transition-all group-hover:w-full" />
            </a>
          ))}

          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="btn-hand btn-hand-secondary px-4 py-2 text-base flex items-center gap-2"
              >
                <LayoutDashboard size={18} strokeWidth={2.5} />
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="btn-hand btn-hand-secondary px-4 py-2 text-base flex items-center gap-2"
              >
                <Settings size={18} strokeWidth={2.5} />
                Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-hand px-4 py-2 text-base flex items-center gap-2"
              >
                <LogOut size={18} strokeWidth={2.5} />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-hand px-6 py-2 text-lg">
              Start Training
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 border-2 border-[#2d2d2d] wobbly-sm"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t-2 border-[#2d2d2d] bg-[#fdfbf7] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-body)] text-xl text-[#2d2d2d] hover:text-[#ff4d4d]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="btn-hand px-6 py-3 text-xl text-center"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/settings"
                className="btn-hand btn-hand-secondary px-6 py-3 text-xl text-center"
                onClick={() => setOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="btn-hand btn-hand-secondary px-6 py-3 text-xl text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="btn-hand px-6 py-3 text-xl text-center"
              onClick={() => setOpen(false)}
            >
              Start Training
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
