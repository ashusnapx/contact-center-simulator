"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const advantages = [
  {
    title: "Real-time Voice",
    description: "Natural conversations with Vaani — interruptions, emotion, low latency.",
  },
  {
    title: "Infinite Simulations",
    description: "No scripted flows. Every call generated dynamically.",
  },
  {
    title: "Emotion Engine",
    description: "Customer emotions evolve during the conversation.",
  },
  {
    title: "Long-term Memory",
    description: "Customers remember previous interactions.",
  },
  {
    title: "Company-Specific",
    description: "Upload documents. AI learns your processes automatically.",
  },
  {
    title: "Objective Evaluation",
    description: "Analytics with evidence, not trainer opinions.",
  },
  {
    title: "Unlimited Practice",
    description: "Train anytime without requiring human trainers.",
  },
  {
    title: "Rare Scenarios",
    description: "Prepare for once-a-year situations that matter most.",
  },
  {
    title: "Digital Twin",
    description: "A realistic virtual replica of the contact centre.",
  },
  {
    title: "Enterprise Ready",
    description: "Onboarding, certification, QA, hiring, coaching, compliance.",
  },
];

export default function WhyVaaniVerse() {
  return (
    <section className="py-20 px-6 bg-white border-y-3 border-[#2d2d2d]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why VaaniVerse
          </h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            Ten competitive advantages that make us the platform of choice.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`flex items-start gap-4 p-5 border-3 border-[#2d2d2d] shadow-hard wobbly hover:rotate-1 transition-transform duration-100 ${
                i % 4 === 0 ? "bg-[#fff9c4] -rotate-1" : "bg-[#fdfbf7]"
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#ff4d4d] border-2 border-[#2d2d2d] wobbly-sm flex items-center justify-center text-white shadow-hard-sm">
                <Check size={18} strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1">
                  {adv.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/70 text-sm">
                  {adv.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
