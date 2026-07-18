"use client";

import { motion } from "framer-motion";
import { X, ArrowDown } from "lucide-react";

const steps = [
  { label: "Product Training", icon: "📚" },
  { label: "PowerPoint", icon: "📊" },
  { label: "Trainer Roleplay", icon: "🎭" },
  { label: "Few Mock Calls", icon: "📞" },
  { label: "LIVE CUSTOMERS", icon: "😬", isFinal: true },
];

const problems = [
  "Roleplays are repetitive",
  "Trainers can't simulate thousands of personalities",
  "Feedback is subjective",
  "Very few practice calls",
  "No rare edge-case training",
  "No emotional realism",
  "No pressure simulation",
  "Real customers become the training ground",
];

export default function Problem() {
  return (
    <section className="py-20 px-6 bg-[#2d2d2d] text-white relative overflow-hidden">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Today&apos;s Training is Broken
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            The traditional funnel sends underprepared agents straight to live customers.
          </p>
        </motion.div>

        {/* Funnel visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-2 mb-16"
        >
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center">
              <div
                className={`px-8 py-3 border-2 text-center font-[family-name:var(--font-body)] text-lg ${
                  step.isFinal
                    ? "bg-[#ff4d4d] border-white wobbly-sm"
                    : "bg-white/10 border-white/30 wobbly-sm"
                }`}
                style={{
                  width: `${320 - i * 40}px`,
                }}
              >
                <span className="mr-2">{step.icon}</span>
                {step.label}
              </div>
              {i < steps.length - 1 && (
                <ArrowDown
                  size={24}
                  className="my-1 text-white/40"
                  strokeWidth={2}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Problems grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((problem, i) => (
            <motion.div
              key={problem}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 wobbly-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-[#ff4d4d] border-2 border-white rounded-full flex items-center justify-center">
                <X size={16} strokeWidth={3} />
              </div>
              <span className="font-[family-name:var(--font-body)] text-lg text-white/90">
                {problem}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
