"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Trophy, ArrowRight } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Interactive Quizzes",
    description: "Engage with dynamic, adaptive quizzes covering Algebra, Geometry, Calculus and statistics.",
    icon: BookOpen,
    color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
    shadow: "shadow-indigo-500/5",
  },
  {
    id: 2,
    title: "Progress Tracking",
    description: "Track your performance and accuracy improvements over time with detailed visual statistics.",
    icon: TrendingUp,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    shadow: "shadow-cyan-500/5",
  },
  {
    id: 3,
    title: "Global Leaderboard",
    description: "Compete with friends and learners globally, climbing the ranks to showcase your mastery.",
    icon: Trophy,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    shadow: "shadow-amber-500/5",
  },
];

export default function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 12 },
    },
  };

  return (
    <section id="services" className="py-24 bg-slate-950 w-full relative overflow-hidden border-t border-slate-900">
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent mb-6">
            Everything You Need to Excel
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Discover a comprehensive suite of learning tools designed to sharpen your mathematical logic and make practice feel rewarding.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative group hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between ${service.shadow}`}
              >
                {/* Glow layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Icon badge */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br border mb-6 shadow-inner ${service.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-white tracking-tight group-hover:text-indigo-200 transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors mt-auto text-sm cursor-pointer select-none">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
