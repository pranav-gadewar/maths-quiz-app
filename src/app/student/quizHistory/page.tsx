"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { History, ArrowLeft, Calendar, Award } from "lucide-react";

type QuizHistory = {
  id: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
};

export default function QuizHistoryPage() {
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to view your quiz history.");
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("results")
        .select(`
          id,
          quiz_id,
          score,
          total_questions,
          percentage,
          created_at,
          quizzes!inner(title)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching quiz history:", error);
      } else {
        const formatted = data.map((r: any) => ({
          id: r.id,
          quiz_id: r.quiz_id,
          quiz_title: r.quizzes?.title || "Unknown Quiz",
          score: r.score,
          total_questions: r.total_questions,
          percentage: r.percentage,
          created_at: r.created_at,
        }));
        setHistory(formatted);
      }

      setLoading(false);
    };

    fetchQuizHistory();
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
        Loading your quiz history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] text-slate-400 text-sm">
        <History className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
        <p>You haven’t attempted any quizzes yet.</p>
        <button
          onClick={() => router.push("/student/viewQuizzes")}
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-xl font-bold text-xs transition duration-250 cursor-pointer shadow-md"
        >
          Browse Quizzes
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-white"
    >
      {/* Back to Dashboard */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/student/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      {/* Page Title */}
      <motion.h1 variants={itemVariants} className="text-3xl font-extrabold mb-6 flex items-center gap-2.5">
        <History className="w-7 h-7 text-indigo-400" />
        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Quiz History</span>
      </motion.h1>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-sm font-semibold">
              <tr>
                <th className="py-4 px-6 text-left">Quiz Title</th>
                <th className="py-4 px-6 text-center">Score</th>
                <th className="py-4 px-6 text-center">Percentage</th>
                <th className="py-4 px-6 text-center">Attempt Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
              {history.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="hover:bg-slate-800/20 transition duration-150"
                >
                  <td className="py-4 px-6 font-semibold text-slate-200">{quiz.quiz_title}</td>
                  <td className="py-4 px-6 text-center font-medium">
                    <span className="bg-slate-950/50 border border-slate-850 px-2.5 py-1 rounded-xl text-slate-300 text-xs">
                      {quiz.score} / {quiz.total_questions}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-indigo-400">
                    {quiz.percentage?.toFixed(1)}%
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(quiz.created_at).toLocaleString()}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
