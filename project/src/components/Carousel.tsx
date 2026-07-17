"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Binary, Compass, BarChart3, Cpu, Calculator, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quizzes = [
  {
    id: 1,
    title: "Algebra",
    description: "Master equations, variables, and expressions with fun challenges.",
    color: "from-blue-600 to-indigo-700 border-blue-500/30",
    shadow: "shadow-blue-500/20",
    glow: "bg-blue-500/10",
    icon: Binary,
  },
  {
    id: 2,
    title: "Geometry",
    description: "Explore angles, shapes, and theorems through interactive quizzes.",
    color: "from-purple-600 to-pink-700 border-purple-500/30",
    shadow: "shadow-purple-500/20",
    glow: "bg-purple-500/10",
    icon: Compass,
  },
  {
    id: 3,
    title: "Trigonometry",
    description: "Understand sine, cosine, and tangent like never before.",
    color: "from-green-600 to-emerald-700 border-green-500/30",
    shadow: "shadow-green-500/20",
    glow: "bg-green-500/10",
    icon: Calculator,
  },
  {
    id: 4,
    title: "Calculus",
    description: "Test your skills on limits, derivatives, and integrals.",
    color: "from-amber-600 to-orange-700 border-amber-500/30",
    shadow: "shadow-amber-500/20",
    glow: "bg-amber-500/10",
    icon: Cpu,
  },
  {
    id: 5,
    title: "Statistics",
    description: "Analyze data, probability, and distributions effortlessly.",
    color: "from-pink-600 to-rose-700 border-pink-500/30",
    shadow: "shadow-pink-500/20",
    glow: "bg-pink-500/10",
    icon: BarChart3,
  },
];

export default function Carousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const length = quizzes.length;

  const current = (page % length + length) % length;

  useEffect(() => {
    const timer = setInterval(() => {
      setPage([page + 1, 1]);
    }, 5000);
    return () => clearInterval(timer);
  }, [page]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const activeQuiz = quizzes[current];
  const ActiveIcon = activeQuiz.icon;

  const sliderVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 25 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 25 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <section id="quizzes" className="relative w-full py-24 bg-slate-950 overflow-hidden border-t border-slate-900">
      {/* Decorative side blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent mb-6">
            Explore Quiz Topics
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Test your limits and gain mastery over these fundamental pillars of modern mathematics.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-center w-full max-w-4xl min-h-[380px]">
          {/* Prev Button */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 sm:left-4 z-20 p-3 rounded-full border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slide Container */}
          <div className="relative flex items-center justify-center w-full max-w-[520px] h-[360px] overflow-visible">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={sliderVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full px-4"
              >
                <div
                  className={`w-full p-8 sm:p-10 rounded-3xl border bg-gradient-to-br ${activeQuiz.color} text-white shadow-2xl flex flex-col items-center text-center select-none relative overflow-hidden group`}
                >
                  {/* Decorative formula backdrop */}
                  <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-grid-pattern pointer-events-none" />

                  {/* Icon badge */}
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <ActiveIcon className="w-8 h-8" />
                  </div>

                  <h3 className="text-3xl font-extrabold mb-4 tracking-tight drop-shadow-md">
                    {activeQuiz.title}
                  </h3>
                  
                  <p className="text-slate-100/90 text-base leading-relaxed max-w-md mb-8">
                    {activeQuiz.description}
                  </p>

                  <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 shadow-xl hover:shadow-white/10 transition-all duration-300 transform active:scale-95 cursor-pointer">
                    <Play className="w-4 h-4 fill-current text-slate-900" />
                    <span>Practice Now</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 sm:right-4 z-20 p-3 rounded-full border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-2.5">
          {quizzes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const dir = index > current ? 1 : -1;
                setPage([index, dir]);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === current
                  ? "w-8 bg-gradient-to-r from-indigo-500 to-cyan-400"
                  : "w-2.5 bg-slate-800 hover:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
