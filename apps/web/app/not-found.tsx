import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-6 overflow-hidden bg-[#fdfbf7]">
        <div className="max-w-2xl w-full mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#ff4d4d] border-4 border-[#2d2d2d] wobbly-sm text-white mb-8 shadow-hard rotate-3">
            <span className="font-[family-name:var(--font-heading)] font-bold text-4xl">404</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Call Dropped!
          </h1>
          
          <p className="text-xl md:text-2xl text-[#2d2d2d]/70 mb-10 max-w-lg">
            It looks like this simulation route doesn't exist or the connection was lost.
          </p>

          <Link href="/" className="btn-hand inline-flex items-center gap-2 px-8 py-4 text-xl">
            <ArrowLeft size={22} strokeWidth={2.5} />
            Return to Base
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
