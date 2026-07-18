"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Star, Medal, Award, Crown } from "lucide-react";

const ranks = [
  { title: "Level 1", subtitle: "Trainee", icon: <Star size={24} strokeWidth={2.5} />, xp: "0 XP" },
  { title: "Junior Agent", subtitle: "Handles basic calls", icon: <Medal size={24} strokeWidth={2.5} />, xp: "1,000 XP" },
  { title: "Senior Agent", subtitle: "Complex scenarios", icon: <Award size={24} strokeWidth={2.5} />, xp: "5,000 XP" },
  { title: "Escalation Specialist", subtitle: "Nightmare calls", icon: <Flame size={24} strokeWidth={2.5} />, xp: "15,000 XP" },
  { title: "Team Lead", subtitle: "Mentors others", icon: <Trophy size={24} strokeWidth={2.5} />, xp: "30,000 XP" },
  { title: "Supervisor", subtitle: "Mastery level", icon: <Crown size={24} strokeWidth={2.5} />, xp: "50,000 XP" },
];

export default function CareerMode() {
  return (
    <section className="py-20 px-6 bg-[#fdfbf7]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#fff9c4] border-2 border-[#2d2d2d] px-4 py-1 font-[family-name:var(--font-body)] text-lg shadow-hard wobbly-sm mb-4 rotate-1">
            Gamified Learning
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Career Mode
          </h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            Level up from trainee to supervisor. Earn XP, badges, streaks,
            and climb the leaderboard.
          </p>
        </motion.div>

        {/* Career ladder */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-[#e5e0d8] -translate-x-1/2" />

          <div className="space-y-6">
            {ranks.map((rank, i) => (
              <motion.div
                key={rank.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-4 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Card */}
                <div
                  className={`flex-1 bg-white border-3 border-[#2d2d2d] p-6 shadow-hard wobbly hover:rotate-1 transition-transform duration-100 ${
                    i === ranks.length - 1 ? "bg-[#fff9c4]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 border-3 border-[#2d2d2d] wobbly-sm flex items-center justify-center text-[#2d5da1] shadow-hard ${
                        i === ranks.length - 1 ? "bg-[#ff4d4d] text-white" : ""
                      }`}
                    >
                      {rank.icon}
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
                        {rank.title}
                      </h3>
                      <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/60 text-sm">
                        {rank.subtitle}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="font-[family-name:var(--font-heading)] font-bold text-[#ff4d4d]">
                        {rank.xp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-4 h-4 bg-[#2d2d2d] rounded-full border-2 border-white z-10" />

                {/* Spacer for alignment */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
