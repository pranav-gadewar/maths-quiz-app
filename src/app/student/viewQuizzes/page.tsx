"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, HelpCircle } from "lucide-react";

type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  created_at: string;
  total_questions?: number; // dynamic count
};

export default function ViewQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      // Fetch all active quizzes
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (quizError) {
        setErrorMsg(`Failed to fetch quizzes: ${quizError.message}`);
        setLoading(false);
        return;
      }

      if (!quizData) {
        setQuizzes([]);
        setLoading(false);
        return;
      }

      // For each quiz, fetch the number of questions dynamically
      const quizzesWithCounts = await Promise.all(
        quizData.map(async (quiz: Quiz) => {
          const { count } = await supabase
            .from("questions")
            .select("*", { count: "exact", head: true })
            .eq("quiz_id", quiz.id);

          return {
            ...quiz,
            total_questions: count || 0,
          };
        })
      );

      setQuizzes(quizzesWithCounts);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while fetching quizzes.");
    }

    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-white"
    >
      {/* Back Link */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/student/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      {/* Page Title */}
      <motion.h1 variants={itemVariants} className="text-3xl font-extrabold mb-6 flex items-center gap-2.5">
        <BookOpen className="w-7 h-7 text-indigo-400" />
        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Available Quizzes</span>
      </motion.h1>

      {errorMsg && (
        <motion.div
          variants={itemVariants}
          className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm"
        >
          {errorMsg}
        </motion.div>
      )}

      {loading ? (
        <p className="text-center text-slate-400 py-12 text-sm animate-pulse">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-center text-slate-400 py-12 text-sm">No active quizzes available.</p>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl hover:scale-[1.02] transition duration-300 flex flex-col group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex-grow mb-6">
                <h2 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors mb-2">{quiz.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{quiz.description}</p>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    quiz.level === "Easy" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                    quiz.level === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {quiz.level} Level
                  </span>
                  
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{quiz.total_questions || 0} Questions</span>
                  </span>
                </div>
              </div>

              <div className="relative z-10 border-t border-slate-800/40 pt-4 flex justify-end">
                <Link
                  href={`/student/startQuiz/${quiz.id}`}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition duration-200 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
