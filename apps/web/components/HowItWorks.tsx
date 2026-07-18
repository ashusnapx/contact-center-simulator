"use client";

import { motion } from "framer-motion";
import { Phone, Cpu, User, BarChart3 } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Phone size={32} strokeWidth={2.5} />,
    title: "Customer Calls",
    description:
      "AI customer initiates call with unique personality, mood, accent, and hidden objectives. Background noise and time pressure included.",
    color: "#fff9c4",
  },
  {
    num: "02",
    icon: <Cpu size={32} strokeWidth={2.5} />,
    title: "Vaani Connects",
    description:
      "Real-time voice AI handles speech-to-speech with natural interruptions, low latency, and emotional speaking.",
    color: "#ff4d4d",
  },
  {
    num: "03",
    icon: <User size={32} strokeWidth={2.5} />,
    title: "Agent Responds",
    description:
      "Trainee navigates CRM, searches knowledge base, follows compliance rules, and handles the live conversation.",
    color: "#2d5da1",
  },
  {
    num: "04",
    icon: <BarChart3 size={32} strokeWidth={2.5} />,
    title: "Coach Evaluates",
    description:
      "AI Supervisor scores 14 QA dimensions with timestamps, explains mistakes, suggests alternatives, and enables replay.",
    color: "#fff9c4",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-[#fdfbf7]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            Four steps from call to mastery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connecting dashed line */}
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-[#e5e0d8] z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10"
            >
              <div
                className={`bg-white border-3 border-[#2d2d2d] p-6 text-center shadow-hard ${
                  i % 2 === 0 ? "wobbly rotate-1" : "wobbly-md -rotate-1"
                }`}
              >
                {/* Step number */}
                <div
                  className="w-14 h-14 mx-auto mb-4 border-3 border-[#2d2d2d] wobbly-sm flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-xl shadow-hard"
                  style={{ backgroundColor: step.color }}
                >
                  {step.num}
                </div>

                {/* Icon */}
                <div className="text-[#2d2d2d] mb-3">{step.icon}</div>

                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/70 text-sm">
                  {step.description}
                </p>
              </div>

              {/* Arrow between cards */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -right-4 z-20 text-[#2d2d2d]">
                  <svg
                    width="32"
                    height="16"
                    viewBox="0 0 32 16"
                    fill="none"
                  >
                    <path
                      d="M2 8 H26"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22 3 L28 8 L22 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
