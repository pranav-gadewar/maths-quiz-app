"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Award, ArrowLeft, RotateCcw, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Result = {
  id: string;
  quiz_id: string;
  total_questions: number;
  score: number;
  percentage: number;
  created_at: string;
  quizzes: {
    title: string;
    description: string;
    level: string;
  };
};

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to view your result.");
        router.push("/auth/login");
        return;
      }
      setUserId(user.id);

      const { data, error } = await supabase
        .from("results")
        .select("*, quizzes(title, description, level)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching result:", error.message);
      } else {
        setResult(data as Result);
      }

      setLoading(false);
    };

    fetchResult();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[300px] text-slate-400 text-sm animate-pulse">
        Loading your result...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] text-center text-slate-400">
        <AlertCircle className="w-12 h-12 text-red-500/80 mb-3 animate-pulse" />
        <h1 className="text-xl font-bold mb-2">No recent results found</h1>
        <p className="text-sm text-slate-500 mb-6">You haven’t completed any quizzes yet.</p>
        <button
          onClick={() => router.push("/student/viewQuizzes")}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-xl font-bold text-xs transition duration-200 cursor-pointer shadow-lg"
        >
          Go to Quizzes
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-white max-w-2xl mx-auto"
    >
      {/* Back Link */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/student/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      {/* Result Card */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-slate-950/80 border border-slate-800 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Award className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          Quiz Result
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-400 mb-1">{result.quizzes.title}</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">{result.quizzes.description}</p>
          <span className="inline-block mt-3 px-2 py-0.5 bg-slate-950/60 border border-slate-850 rounded text-[10px] font-bold text-slate-400">
            Level: {result.quizzes.level}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Total Queries</span>
            <span className="text-base sm:text-lg font-bold text-slate-200">{result.total_questions}</span>
          </div>

          <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Correct</span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-400">{result.score}</span>
          </div>

          <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Accuracy</span>
            <span className={`text-base sm:text-lg font-extrabold ${
              result.percentage >= 75
                ? "text-green-400"
                : result.percentage >= 50
                ? "text-amber-400"
                : "text-red-400"
            }`}>
              {result.percentage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center border-t border-slate-800/40 pt-6">
          <button
            onClick={() => router.push(`/student/quiz/${result.quiz_id}`)}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-xl font-bold text-xs transition duration-200 shadow-lg cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
          
          <button
            onClick={() => router.push("/student/viewQuizzes")}
            className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition duration-150 rounded-xl font-bold text-xs cursor-pointer"
          >
            Browse Other Quizzes
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-500 flex items-center justify-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Attempted on{" "}
            {new Date(result.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
