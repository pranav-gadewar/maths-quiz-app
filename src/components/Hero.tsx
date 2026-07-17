"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, LayoutDashboard, Brain, Award, Activity } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="home" className="relative flex flex-col items-center justify-center text-center min-h-[92vh] pt-24 pb-16 px-6 bg-slate-950 bg-grid-pattern text-white overflow-hidden">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-indigo-500/10 blur-[100px] sm:blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-cyan-500/10 blur-[100px] sm:blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Floating Math Symbols */}
      <div className="absolute top-[15%] left-[8%] text-indigo-500/20 text-4xl sm:text-6xl font-extrabold select-none pointer-events-none animate-float-slow">
        π
      </div>
      <div className="absolute top-[20%] right-[10%] text-cyan-500/20 text-3xl sm:text-5xl font-mono select-none pointer-events-none animate-float-medium">
        √x
      </div>
      <div className="absolute bottom-[25%] left-[12%] text-violet-500/20 text-4xl sm:text-6xl font-serif select-none pointer-events-none animate-float-fast">
        ∑
      </div>
      <div className="absolute bottom-[20%] right-[15%] text-indigo-500/20 text-5xl sm:text-7xl font-sans select-none pointer-events-none animate-float-slow" style={{ animationDelay: "1s" }}>
        ∞
      </div>
      <div className="absolute top-[50%] left-[5%] text-cyan-500/10 text-xl sm:text-3xl font-mono select-none pointer-events-none animate-float-medium">
        f'(x) = 2x
      </div>
      <div className="absolute top-[45%] right-[5%] text-violet-500/10 text-2xl sm:text-4xl font-mono select-none pointer-events-none animate-float-fast">
        a² + b² = c²
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fade-in"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold tracking-wide mb-8 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
        >
          <Brain className="w-4 h-4 text-cyan-400" />
          <span>Interactive Math Learning</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl font-extrabold mb-8 leading-none tracking-tight"
        >
          Master Maths with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Fun & Challenge
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mb-12"
        >
          Improve your problem-solving skills through engaging quizzes, track your real-time progress, and rise to the top of the leaderboard!
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-5 mb-20"
        >
          <Link href="/student/dashboard">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-300 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Learning</span>
            </motion.span>
          </Link>

          <Link href="/auth/login">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 border border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 hover:text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>View Dashboard</span>
            </motion.span>
          </Link>
        </motion.div>

        {/* Mini Stats Showcase */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="w-full max-w-3xl p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-500 mb-6">
            Platform Activity Peak
          </h4>
          <div className="grid grid-cols-3 gap-4 divide-x divide-slate-800/80 text-center">
            <div className="px-2">
              <div className="flex justify-center mb-2">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                12,450+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Quizzes Taken</div>
            </div>
            <div className="px-2">
              <div className="flex justify-center mb-2">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
                98.2%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Accuracy Goal</div>
            </div>
            <div className="px-2">
              <div className="flex justify-center mb-2">
                <Award className="w-5 h-5 text-pink-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-200 to-white bg-clip-text text-transparent">
                #1 Spot
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1">Competitive Play</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
