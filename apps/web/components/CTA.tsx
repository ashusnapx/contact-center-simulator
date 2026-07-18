"use client";

import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section
      id="cta"
      className="py-20 px-6 bg-[#2d2d2d] relative overflow-hidden"
    >
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Decorative elements */}
      <motion.div
        className="hidden md:block absolute top-12 left-16 w-20 h-20 border-2 border-dashed border-white/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="hidden md:block absolute bottom-12 right-16 w-12 h-12 bg-[#ff4d4d]/20 wobbly"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6">
            <span className="bg-[#fff9c4] border-2 border-white px-4 py-2 font-[family-name:var(--font-body)] text-lg wobbly-sm inline-block rotate-1">
              Ready to transform training?
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Start Training Today
          </h2>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Stop training on real customers. Give your agents a safe
            environment to fail, learn, and master every scenario before going
            live.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="btn-hand px-10 py-4 text-2xl flex items-center gap-3"
            >
              <Phone size={26} strokeWidth={2.5} />
              Get Early Access
            </a>
            <a
              href="#"
              className="btn-hand btn-hand-secondary px-10 py-4 text-2xl flex items-center gap-2"
            >
              Talk to Sales
              <ArrowRight size={26} strokeWidth={2.5} />
            </a>
          </div>

          {/* Hand-drawn underline */}
          <div className="mt-12">
            <svg
              width="300"
              height="16"
              viewBox="0 0 300 16"
              fill="none"
              className="mx-auto text-white/20"
            >
              <path
                d="M2 10 C50 4, 100 14, 150 6 S250 12, 298 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
