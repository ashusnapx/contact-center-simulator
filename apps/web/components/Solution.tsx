"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Database,
  BookOpen,
  Shield,
  Brain,
  Clock,
  Users,
  BarChart3,
  Mic,
} from "lucide-react";

const components = [
  { icon: <Database size={20} strokeWidth={2.5} />, label: "CRM Simulation" },
  { icon: <BookOpen size={20} strokeWidth={2.5} />, label: "Knowledge Base" },
  { icon: <Shield size={20} strokeWidth={2.5} />, label: "Compliance Rules" },
  { icon: <Brain size={20} strokeWidth={2.5} />, label: "Emotional Engine" },
  { icon: <Clock size={20} strokeWidth={2.5} />, label: "Time Pressure" },
  { icon: <Users size={20} strokeWidth={2.5} />, label: "Supervisor AI" },
  { icon: <BarChart3 size={20} strokeWidth={2.5} />, label: "Analytics" },
];

export default function Solution() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#fff9c4] border-2 border-[#2d2d2d] px-4 py-1 font-[family-name:var(--font-body)] text-lg shadow-hard wobbly-sm mb-4 -rotate-1">
            Not a chatbot. Not roleplay.
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            We Build the Entire Job
          </h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            VaaniVerse simulates the complete contact centre environment — not
            just one conversation.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white border-3 border-[#2d2d2d] wobbly shadow-hard-lg p-8 md:p-12 -rotate-1"
        >
          <div className="tape" />

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Left: Customer */}
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 mx-auto bg-[#fff9c4] border-3 border-[#2d2d2d] wobbly flex items-center justify-center text-3xl mb-4 shadow-hard"
              >
                📞
              </motion.div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2">
                Customer
              </h3>
              <p className="text-[#2d2d2d]/60">AI-powered persona with emotions, memory, and hidden objectives</p>
            </div>

            {/* Middle: Vaani + Environment */}
            <div className="space-y-4">
              {/* Vaani */}
              <div className="bg-[#ff4d4d] border-3 border-[#2d2d2d] wobbly p-4 text-center text-white shadow-hard">
                <Mic size={28} className="mx-auto mb-2" strokeWidth={2.5} />
                <p className="font-[family-name:var(--font-heading)] text-xl font-bold">
                  Voice AI (Vaani)
                </p>
                <p className="text-sm text-white/80">Real-time voice • Natural interruptions</p>
              </div>

              {/* Environment components */}
              <div className="grid grid-cols-2 gap-2">
                {components.map((comp) => (
                  <div
                    key={comp.label}
                    className="bg-[#fdfbf7] border-2 border-[#2d2d2d]/30 p-2 text-center wobbly-sm flex flex-col items-center gap-1"
                  >
                    <span className="text-[#2d5da1]">{comp.icon}</span>
                    <span className="text-xs font-[family-name:var(--font-body)]">
                      {comp.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Trainee + Coach */}
            <div className="space-y-4 text-center">
              <div className="bg-[#2d5da1] border-3 border-[#2d2d2d] wobbly p-4 text-white shadow-hard">
                <p className="font-[family-name:var(--font-heading)] text-xl font-bold">
                  Trainee Agent
                </p>
                <p className="text-sm text-white/80">Navigates real scenarios</p>
              </div>

              <div className="bg-[#fff9c4] border-3 border-[#2d2d2d] wobbly p-4 shadow-hard rotate-1">
                <p className="font-[family-name:var(--font-heading)] text-xl font-bold">
                  AI Coach + Analytics
                </p>
                <p className="text-sm text-[#2d2d2d]/60">14-dimension QA • Replay • Feedback</p>
              </div>
            </div>
          </div>

          {/* Flow arrows */}
          <div className="hidden md:flex justify-center mt-6">
            <svg
              width="400"
              height="30"
              viewBox="0 0 400 30"
              fill="none"
              className="text-[#2d2d2d]"
            >
              <path
                d="M10 15 H390"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
              <path
                d="M382 8 L392 15 L382 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
