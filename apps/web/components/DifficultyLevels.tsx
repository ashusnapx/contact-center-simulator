"use client";

import { motion } from "framer-motion";

const levels = [
  {
    name: "Beginner",
    emoji: "🌱",
    description: "Basic scenarios, patient customers, simple issues",
    color: "#e8f5e9",
    barWidth: "20%",
  },
  {
    name: "Intermediate",
    emoji: "🌿",
    description: "Moderate urgency, some frustration, multi-step issues",
    color: "#fff9c4",
    barWidth: "40%",
  },
  {
    name: "Advanced",
    emoji: "🌳",
    description: "Angry customers, complex complaints, compliance traps",
    color: "#ffe0b2",
    barWidth: "60%",
  },
  {
    name: "Expert",
    emoji: "🔥",
    description: "Interruptions, sarcasm, topic switching, emotional manipulation",
    color: "#ffccbc",
    barWidth: "80%",
  },
  {
    name: "Nightmare",
    emoji: "💀",
    description: "Shouting, threats, refusal to verify, overlapping demands",
    color: "#ff4d4d",
    barWidth: "100%",
  },
];

export default function DifficultyLevels() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Five Difficulty Levels
          </h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            From first day on the job to worst call of your career.
          </p>
        </motion.div>

        <div className="space-y-4">
          {levels.map((level, i) => (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border-3 border-[#2d2d2d] p-6 flex flex-col md:flex-row md:items-center gap-4 shadow-hard wobbly hover:-rotate-1 transition-transform duration-100"
            >
              {/* Level badge */}
              <div
                className="flex-shrink-0 w-16 h-16 border-3 border-[#2d2d2d] wobbly-sm flex items-center justify-center text-2xl font-bold shadow-hard"
                style={{ backgroundColor: level.color }}
              >
                {level.emoji}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-1">
                  {level.name}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/70">
                  {level.description}
                </p>
              </div>

              {/* Difficulty bar */}
              <div className="flex-shrink-0 w-full md:w-48">
                <div className="h-4 bg-[#e5e0d8] border-2 border-[#2d2d2d]/20 wobbly-sm overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: level.color === "#ff4d4d" ? "#ff4d4d" : "#2d2d2d" }}
                    initial={{ width: 0 }}
                    whileInView={{ width: level.barWidth }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
