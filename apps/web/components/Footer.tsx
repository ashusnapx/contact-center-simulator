import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#2d2d2d] bg-[#fdfbf7]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#ff4d4d] border-2 border-[#2d2d2d] flex items-center justify-center text-white font-[family-name:var(--font-heading)] font-bold text-sm wobbly-sm shadow-hard-sm">
                V
              </div>
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
                VaaniVerse
              </span>
            </Link>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
              The world&apos;s first AI Contact Centre Flight Simulator.
              Train like you&apos;re already live.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-bold mb-3">
              Product
            </h4>
            <ul className="space-y-2 font-[family-name:var(--font-body)] text-sm">
              <li>
                <Link href="/dashboard" className="text-[#2d2d2d]/60 hover:text-[#ff4d4d] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/personas" className="text-[#2d2d2d]/60 hover:text-[#ff4d4d] transition-colors">
                  Personas
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="text-[#2d2d2d]/60 hover:text-[#ff4d4d] transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="text-[#2d2d2d]/60 hover:text-[#ff4d4d] transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] font-bold mb-3">
              Built for
            </h4>
            <p className="font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/60">
              Contact centre teams who want AI-powered training
              without the risk of live customers.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="bg-[#fff9c4] border border-[#2d2d2d] px-2 py-1 font-[family-name:var(--font-body)] text-xs wobbly-sm">
                Voice AI
              </span>
              <span className="bg-[#fff9c4] border border-[#2d2d2d] px-2 py-1 font-[family-name:var(--font-body)] text-xs wobbly-sm rotate-1">
                QA Scoring
              </span>
              <span className="bg-[#fff9c4] border border-[#2d2d2d] px-2 py-1 font-[family-name:var(--font-body)] text-xs wobbly-sm -rotate-1">
                Analytics
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#e5e0d8] text-center">
          <p className="font-[family-name:var(--font-body)] text-xs text-[#2d2d2d]/40">
            &copy; {new Date().getFullYear()} VaaniVerse. AI Contact Centre Flight Simulator.
          </p>
        </div>
      </div>
    </footer>
  );
}
