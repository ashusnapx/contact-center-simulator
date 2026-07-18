"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Heart,
  Database,
  FileSearch,
  Shield,
  Volume2,
  Clock,
  Headphones,
  RotateCcw,
  BarChart3,
  Fingerprint,
  Eye,
  Gauge,
  Globe,
  Package,
  Sparkles,
  Trophy,
  TrendingUp,
  UserCheck,
  Mic,
} from "lucide-react";

const features = [
  {
    icon: <Bot size={24} strokeWidth={2.5} />,
    title: "AI Customer Engine",
    description: "Unlimited unique personas with age, accent, mood, personality, patience, technical knowledge, urgency, and stress.",
  },
  {
    icon: <Heart size={24} strokeWidth={2.5} />,
    title: "Dynamic Emotions",
    description: "Customer emotions evolve during the call — happy to confused to angry to relieved based on trainee behavior.",
  },
  {
    icon: <Database size={24} strokeWidth={2.5} />,
    title: "Customer Memory",
    description: "AI remembers interruptions, promises, repeated questions, and tone — just like real customers.",
  },
  {
    icon: <FileSearch size={24} strokeWidth={2.5} />,
    title: "CRM Simulator",
    description: "Navigate customer profiles, order history, tickets, invoices, and refund status in real-time.",
  },
  {
    icon: <Shield size={24} strokeWidth={2.5} />,
    title: "Compliance Engine",
    description: "Identity verification, GDPR, PCI, policy violations, and missing legal disclosures checked automatically.",
  },
  {
    icon: <Volume2 size={24} strokeWidth={2.5} />,
    title: "Background Environment",
    description: "Crying baby, traffic, poor network, office noise — realistic phone conditions.",
  },
  {
    icon: <Clock size={24} strokeWidth={2.5} />,
    title: "Time Pressure",
    description: "\"I have one minute\" — tests concise communication under real constraints.",
  },
  {
    icon: <Headphones size={24} strokeWidth={2.5} />,
    title: "AI Supervisor",
    description: "Post-call explains mistakes, strengths, and better alternatives — not just a score.",
  },
  {
    icon: <RotateCcw size={24} strokeWidth={2.5} />,
    title: "Replay Mode",
    description: "Jump to any timestamp, retry that section until mastered. Practice makes permanent.",
  },
  {
    icon: <BarChart3 size={24} strokeWidth={2.5} />,
    title: "14-Dimension QA",
    description: "Empathy, listening, confidence, ownership, compliance, resolution — with timestamps.",
  },
  {
    icon: <Fingerprint size={24} strokeWidth={2.5} />,
    title: "Personality Generator",
    description: "Hidden traits — agreeableness, patience, trust, stress — discovered during the call.",
  },
  {
    icon: <Eye size={24} strokeWidth={2.5} />,
    title: "Hidden Objectives",
    description: "Customer never tells the full story. Visible complaint masks refund, discount, or cancellation intent.",
  },
  {
    icon: <Gauge size={24} strokeWidth={2.5} />,
    title: "Difficulty Levels",
    description: "Beginner to Nightmare — interruptions, shouting, sarcasm, threats, emotional manipulation.",
  },
  {
    icon: <Globe size={24} strokeWidth={2.5} />,
    title: "Accent Engine",
    description: "Indian, American, British, Australian, Filipino, Middle Eastern, African, European accents.",
  },
  {
    icon: <Package size={24} strokeWidth={2.5} />,
    title: "Industry Packs",
    description: "Banking, Telecom, Insurance, Healthcare, SaaS, E-commerce, Travel, Logistics, Retail.",
  },
  {
    icon: <Sparkles size={24} strokeWidth={2.5} />,
    title: "AI Scenario Generator",
    description: "Upload SOPs, PDFs, policies — AI auto-generates personas, conversations, and edge cases.",
  },
  {
    icon: <Trophy size={24} strokeWidth={2.5} />,
    title: "Career Mode",
    description: "Gamified progression — XP, badges, streaks, rankings from Junior Agent to Supervisor.",
  },
  {
    icon: <TrendingUp size={24} strokeWidth={2.5} />,
    title: "Performance Prediction",
    description: "CSAT, QA Score, FCR, Escalation Rate, AHT, and Readiness Score predicted live.",
  },
  {
    icon: <UserCheck size={24} strokeWidth={2.5} />,
    title: "AI Hiring Mode",
    description: "Candidates complete AI calls. Recruiters get objective, evidence-based reports.",
  },
  {
    icon: <Mic size={24} strokeWidth={2.5} />,
    title: "Real-Time Voice",
    description: "Vaani-powered speech-to-speech with natural interruptions, turn-taking, and low latency.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            20 Features. One Platform.
          </h2>
          <p className="text-xl text-[#2d2d2d]/60 max-w-2xl mx-auto">
            Everything a contact centre agent needs to master — before going
            live.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className={`bg-white border-3 border-[#2d2d2d] p-6 shadow-hard hover:rotate-1 transition-transform duration-100 ${
                i % 5 === 0
                  ? "bg-[#fff9c4] rotate-1"
                  : i % 3 === 0
                  ? "-rotate-1"
                  : ""
              }`}
              style={{
                borderRadius:
                  i % 2 === 0
                    ? "255px 15px 225px 15px / 15px 225px 15px 255px"
                    : "15px 225px 15px 255px / 225px 15px 255px 15px",
              }}
            >
              {/* Tape on some cards */}
              {i % 7 === 0 && <div className="tape" />}

              <div className="text-[#2d5da1] mb-3">{feature.icon}</div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[#2d2d2d]/70 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
