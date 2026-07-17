"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  total_questions: number;
  time_limit: number;
};

type SupabaseQuizData = Omit<Quiz, "total_questions"> & {
  questions: { id: string }[];
};

export default function QuizPageClient() {
  const params = useParams<{ quizId: string }>();
  const { quizId } = params;
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      const { data, error } = await supabase
        .from("quizzes")
        .select(`*, questions:questions(id)`)
        .eq("id", quizId)
        .single();

      if (error) {
        console.error("Error fetching quiz:", error.message);
        setLoading(false);
        return;
      }

      const quizData = data as SupabaseQuizData;

      setQuiz({
        ...quizData,
        total_questions: quizData.questions?.length ?? 0,
      });

      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[300px] text-slate-400 text-sm animate-pulse">
        Loading quiz overview...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] text-center text-slate-400">
        <p className="text-lg">Quiz not found.</p>
        <button
          onClick={() => router.push("/student/dashboard")}
          className="mt-4 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:text-white hover:bg-slate-850 transition cursor-pointer text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-white max-w-3xl mx-auto">
      {/* Back Link */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/student/viewQuizzes")}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Quizzes</span>
        </button>
      </div>

      {/* Start Quiz Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
          {quiz.title}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          {quiz.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3.5 mb-10 text-center">
          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Difficulty</span>
            <span className={`text-xs sm:text-sm font-bold ${
              quiz.level === "Easy" ? "text-green-400" :
              quiz.level === "Medium" ? "text-amber-400" :
              "text-red-400"
            }`}>{quiz.level}</span>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Total Queries</span>
            <span className="text-xs sm:text-sm font-extrabold text-indigo-400">{quiz.total_questions} Questions</span>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-2xl">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Time Cap</span>
            <span className="text-xs sm:text-sm font-extrabold text-cyan-400">{quiz.time_limit} min</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-800/40 pt-6">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition duration-150 rounded-xl font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={() => router.push(`/student/quiz/${quiz.id}`)}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-xl font-bold text-xs transition duration-200 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer"
          >
            Begin Quiz
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Note: Good luck! Take your time and focus on each question.</span>
        </div>
      </div>
    </div>
  );
}
