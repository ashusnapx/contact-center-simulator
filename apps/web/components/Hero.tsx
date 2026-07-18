"use client";

import { motion } from "framer-motion";
import { Phone, ArrowRight, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-6 overflow-hidden">
      {/* Decorative bouncing circle */}
      <motion.div
        className="hidden md:block absolute top-20 right-16 w-16 h-16 bg-[#fff9c4] border-3 border-[#2d2d2d] wobbly z-0"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decorative dashed circle */}
      <div className="hidden md:block absolute bottom-32 left-8 w-24 h-24 border-2 border-dashed border-[#e5e0d8] rounded-full z-0" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        {/* Sticky note tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <span className="bg-[#fff9c4] border-2 border-[#2d2d2d] px-4 py-2 font-[family-name:var(--font-body)] text-lg shadow-hard wobbly-sm inline-block -rotate-1">
            World&apos;s First AI Contact Centre Flight Simulator
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Train Like You&apos;re Already{" "}
              <span className="relative inline-block">
                Live
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8 C40 2, 80 12, 120 4 S180 8, 198 3"
                    stroke="#ff4d4d"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-[#2d2d2d]/70 mb-8 max-w-lg"
            >
              Not another AI chatbot. A complete virtual contact centre where
              agents learn by doing, fail safely, and become production-ready
              before talking to real customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#cta" className="btn-hand px-8 py-3 text-xl flex items-center gap-2">
                <Phone size={22} strokeWidth={2.5} />
                Start Training
              </a>
              <a
                href="#how-it-works"
                className="btn-hand btn-hand-secondary px-8 py-3 text-xl flex items-center gap-2"
              >
                See How It Works
                <ArrowRight size={22} strokeWidth={2.5} />
              </a>
            </motion.div>

            {/* Hand-drawn arrow pointing to CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="hidden md:block mt-4"
            >
              <svg
                width="120"
                height="50"
                viewBox="0 0 120 50"
                fill="none"
                className="text-[#2d2d2d]"
              >
                <path
                  d="M10 40 C30 10, 60 5, 100 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
                <path
                  d="M95 14 L102 20 L94 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white border-3 border-[#2d2d2d] wobbly shadow-hard-lg p-8 rotate-1">
              {/* Mock call interface */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#ff4d4d] border-2 border-[#2d2d2d] wobbly-sm flex items-center justify-center text-white font-bold">
                  <Phone size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-heading)] font-bold text-lg">
                    Simulation #247
                  </p>
                  <p className="text-sm text-[#2d2d2d]/60">Angry customer — Refund dispute</p>
                </div>
              </div>

              {/* Emotion bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Emotion</span>
                  <span className="text-[#ff4d4d] font-bold">Frustrated →</span>
                </div>
                <div className="h-3 bg-[#e5e0d8] wobbly-sm border border-[#2d2d2d]/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#ff4d4d]"
                    initial={{ width: "30%" }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "QA Score", value: "87", icon: <Zap size={16} strokeWidth={2.5} /> },
                  { label: "Empathy", value: "Good", icon: null },
                  { label: "Duration", value: "3:42", icon: null },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#fdfbf7] border-2 border-[#2d2d2d]/20 p-3 text-center wobbly-sm"
                  >
                    <p className="text-xs text-[#2d2d2d]/60">{stat.label}</p>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-lg flex items-center justify-center gap-1">
                      {stat.icon}
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quote bubble */}
              <div className="mt-6 relative bg-[#fff9c4] border-2 border-[#2d2d2d] p-4 wobbly-sm">
                <p className="font-[family-name:var(--font-body)] text-sm italic">
                  &quot;You already told me that! I want to speak to a manager.&quot;
                </p>
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#fff9c4] border-b-2 border-r-2 border-[#2d2d2d] rotate-45" />
              </div>
            </div>

            {/* Thumbtack on card */}
            <div className="tack" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
