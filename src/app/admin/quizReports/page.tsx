"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, ArrowLeft, Calendar } from "lucide-react";

type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  created_at: string | null;
};

type QuizReport = Quiz & {
  question_count: number;
};

export default function QuizReportsPage() {
  const [reports, setReports] = useState<QuizReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);

    try {
      // Fetch quizzes
      const { data, error } = await supabase
        .from("quizzes")
        .select("id, title, description, level, active, created_at");

      if (error) throw error;

      // Type assertion here
      const quizzes: Quiz[] = data as Quiz[];

      // Fetch question count for each quiz
      const reportsWithQuestions: QuizReport[] = await Promise.all(
        (quizzes || []).map(async (quiz) => {
          const { count: question_count, error: countError } = await supabase
            .from("questions")
            .select("*", { count: "exact", head: true })
            .eq("quiz_id", quiz.id);

          if (countError) {
            console.error("Error fetching question count for quiz:", quiz.id, countError.message);
          }

          return {
            ...quiz,
            question_count: question_count || 0,
          };
        })
      );

      setReports(reportsWithQuestions);
    } catch (err: any) {
      setErrorMsg(err.message || "Error fetching reports");
    }

    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-3xl font-extrabold mb-6 flex items-center gap-2.5">
        <BarChart3 className="w-7 h-7 text-indigo-400" />
        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Quiz Reports</span>
      </motion.h1>

      {errorMsg && (
        <motion.div
          variants={itemVariants}
          className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm"
        >
          {errorMsg}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <p className="text-center text-slate-400 py-12 text-sm animate-pulse">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-slate-400 py-12 text-sm">No quizzes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-sm font-semibold">
                <tr>
                  <th className="py-4 px-6 text-left">Title</th>
                  <th className="py-4 px-6 text-left">Description</th>
                  <th className="py-4 px-6 text-left">Level</th>
                  <th className="py-4 px-6 text-center">Active</th>
                  <th className="py-4 px-6 text-center">Questions</th>
                  <th className="py-4 px-6 text-center">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
                {reports.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className="hover:bg-slate-800/20 transition duration-150"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-200">{quiz.title}</td>
                    <td className="py-4 px-6 truncate max-w-[200px] text-slate-400">{quiz.description || "N/A"}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        quiz.level === "Easy" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        quiz.level === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {quiz.level}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        quiz.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800/50 text-slate-400 border border-slate-700/50"
                      }`}>
                        {quiz.active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-indigo-400">{quiz.question_count}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="flex items-center justify-center gap-1 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : "N/A"}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
