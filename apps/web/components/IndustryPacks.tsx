"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Wifi,
  Shield,
  Heart,
  Cloud,
  ShoppingCart,
  Plane,
  Truck,
  Store,
} from "lucide-react";

const industries = [
  { icon: <Building2 size={28} strokeWidth={2.5} />, name: "Banking", color: "#fff9c4" },
  { icon: <Wifi size={28} strokeWidth={2.5} />, name: "Telecom", color: "#ffffff" },
  { icon: <Shield size={28} strokeWidth={2.5} />, name: "Insurance", color: "#fff9c4" },
  { icon: <Heart size={28} strokeWidth={2.5} />, name: "Healthcare", color: "#ffffff" },
  { icon: <Cloud size={28} strokeWidth={2.5} />, name: "SaaS", color: "#fff9c4" },
  { icon: <ShoppingCart size={28} strokeWidth={2.5} />, name: "E-commerce", color: "#ffffff" },
  { icon: <Plane size={28} strokeWidth={2.5} />, name: "Travel", color: "#fff9c4" },
  { icon: <Truck size={28} strokeWidth={2.5} />, name: "Logistics", color: "#ffffff" },
  { icon: <Store size={28} strokeWidth={2.5} />, name: "Retail", color: "#fff9c4" },
];

export default function IndustryPacks() {
  return (
    <section id="industries" className="py-20 px-6 bg-[#2d2d2d]">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Industry Packs
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Tailored simulations for every sector. One platform, every
            industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white border-3 border-[#2d2d2d] p-6 flex flex-col items-center gap-3 shadow-hard hover:rotate-2 transition-transform duration-100 wobbly"
              style={{
                backgroundColor: ind.color,
              }}
            >
              <div className="text-[#2d2d2d]">{ind.icon}</div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-lg">
                {ind.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
