"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    subtitle: "MVP",
    status: "Building",
    items: [
      "Voice AI (Vaani)",
      "AI customer personas",
      "Emotion engine",
      "QA scoring",
      "Call replay",
      "Analytics dashboard",
    ],
  },
  {
    phase: "Phase 2",
    subtitle: "Expansion",
    status: "Planned",
    items: [
      "CRM simulation",
      "Knowledge base",
      "Document ingestion",
      "Scenario generator",
      "Supervisor AI",
    ],
  },
  {
    phase: "Phase 3",
    subtitle: "Scale",
    status: "Future",
    items: [
      "Multi-party calls",
      "Team simulations",
      "Live coaching",
      "Accent & industry packs",
      "Hiring assessments",
    ],
  },
  {
    phase: "Phase 4",
    subtitle: "Enterprise",
    status: "Vision",
    items: [
      "Full Digital Twin",
      "Multi-agent workflows",
      "Omnichannel (voice, chat, email)",
      "Predictive readiness",
      "Benchmarking",
    ],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 px-6 bg-[#fdfbf7]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Roadmap</h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            From MVP to full Digital Twin. Four phases of deliberate
            execution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[6%] right-[6%] h-0.5 border-t-2 border-dashed border-[#e5e0d8] z-0" />

          {phases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative z-10"
            >
              <div
                className={`bg-white border-3 border-[#2d2d2d] p-6 shadow-hard hobbly ${
                  i === 0 ? "bg-[#fff9c4] rotate-1" : ""
                }`}
                style={{
                  borderRadius:
                    i % 2 === 0
                      ? "255px 15px 225px 15px / 15px 225px 15px 255px"
                      : "15px 225px 15px 255px / 225px 15px 255px 15px",
                }}
              >
                {/* Phase badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`px-3 py-1 border-2 border-[#2d2d2d] font-[family-name:var(--font-heading)] font-bold text-sm wobbly-sm ${
                      i === 0 ? "bg-[#ff4d4d] text-white" : "bg-[#e5e0d8]"
                    }`}
                  >
                    {phase.phase}
                  </div>
                  <span className="text-xs text-[#2d2d2d]/50 font-[family-name:var(--font-body)]">
                    {phase.status}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
                  {phase.subtitle}
                </h3>

                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 font-[family-name:var(--font-body)] text-sm text-[#2d2d2d]/80"
                    >
                      {i === 0 ? (
                        <Check
                          size={16}
                          strokeWidth={3}
                          className="text-[#ff4d4d] flex-shrink-0"
                        />
                      ) : (
                        <Circle
                          size={8}
                          strokeWidth={3}
                          className="text-[#e5e0d8] flex-shrink-0"
                        />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
