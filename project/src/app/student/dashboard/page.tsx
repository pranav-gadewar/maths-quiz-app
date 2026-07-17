"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, CheckCircle, Award, Zap, Clock, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type User = {
  id: string;
  name: string | null;
  rank: number | string | null;
};

type Quiz = {
  id: string;
  title: string;
  level: string;
  progress: string;
};

type Result = {
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
};

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      // Fetch user info
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();
      if (userError) console.error(userError);
      setUser(userData);

      // Fetch all quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from("quizzes")
        .select("*");
      if (quizzesError) console.error(quizzesError);
      setQuizzes(quizzesData || []);

      // Fetch results for stats
      const { data: resultsData, error: resultsError } = await supabase
        .from("results")
        .select("*")
        .eq("user_id", authData.user.id);
      if (resultsError) console.error(resultsError);
      setResults(resultsData || []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading || !user) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[300px] text-slate-400 text-sm animate-pulse">
        Loading dashboard details...
      </div>
    );
  }

  // Calculate dynamic stats
  const totalQuizzes = quizzes.length;
  const completedQuizzes = results.length;
  const totalXP = completedQuizzes * 10;
  const accuracy = results.length
    ? (
        (results.reduce((acc, r) => acc + r.percentage, 0) / results.length) ||
        0
      ).toFixed(1)
    : "0";
  const rank = user.rank || "-";

  // Merge quizzes with last attempt info
  const quizCards = quizzes.map((q) => {
    const lastAttempt = results
      .filter((r) => r.quiz_id === q.id)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

    return {
      ...q,
      progress: lastAttempt
        ? lastAttempt.percentage === 100
          ? "Completed"
          : "In Progress"
        : "Not Attempted",
      lastScore: lastAttempt?.score ?? null,
      lastPercentage: lastAttempt?.percentage ?? null,
      lastAttemptDate: lastAttempt?.created_at,
      total_questions: lastAttempt?.total_questions ?? 0,
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  const statsCards = [
    { title: "Total XP", value: totalXP, icon: <Zap className="text-yellow-400 w-6 h-6 animate-pulse" /> },
    { title: "Completed", value: `${completedQuizzes}/${totalQuizzes}`, icon: <CheckCircle className="text-emerald-400 w-6 h-6" /> },
    { title: "Accuracy", value: `${accuracy}%`, icon: <BarChart3 className="text-cyan-400 w-6 h-6" /> },
    { title: "Your Rank", value: `#${rank}`, icon: <Award className="text-purple-400 w-6 h-6" /> },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-grow text-white"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Welcome Back, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
          Ready to level up your mathematical skills and unlock new achievements?
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {statsCards.map((card, i) => (
          <div
            key={i}
            className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left hover:scale-[1.03] transition duration-300 shadow-lg"
          >
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-850">
              {card.icon}
            </div>
            <div>
              <p className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{card.value}</p>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">{card.title}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quiz List */}
      <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-5.5 h-5.5 text-indigo-400" />
          <span>Active Quizzes</span>
        </h2>

        {quizCards.length === 0 ? (
          <p className="text-slate-500 text-center py-6 text-sm">No quizzes available at the moment. Check back soon!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizCards.map((quiz) => {
              const isCompleted = quiz.progress === "Completed";
              const isInProgress = quiz.progress === "In Progress";
              return (
                <div
                  key={quiz.id}
                  className={`p-6 rounded-2xl border transition duration-300 flex flex-col group relative overflow-hidden ${
                    isCompleted
                      ? "bg-green-950/10 border-green-500/20 text-slate-100"
                      : isInProgress
                      ? "bg-indigo-950/10 border-indigo-500/20 text-slate-100"
                      : "bg-slate-950/40 border-slate-850 text-slate-300"
                  } hover:scale-[1.03]`}
                >
                  <h3 className="text-lg font-bold mb-1.5 text-slate-200 group-hover:text-white transition-colors">{quiz.title}</h3>
                  
                  <div className="mb-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      quiz.level === "Easy" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      quiz.level === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {quiz.level}
                    </span>
                  </div>

                  {quiz.lastScore != null && (
                    <div className="text-xs text-slate-400 space-y-1 mb-4">
                      <p>
                        Last Attempt: <span className="font-semibold text-slate-200">{quiz.lastScore}</span> / {quiz.total_questions} ({quiz.lastPercentage !== null ? quiz.lastPercentage.toFixed(0) : "0"}%)
                      </p>
                      {quiz.lastAttemptDate && (
                        <p className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                          <Clock size={12} />
                          <span>{new Date(quiz.lastAttemptDate).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/40 gap-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs rounded-full font-bold ${
                        isCompleted
                          ? "bg-green-500/20 text-green-300"
                          : isInProgress
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {quiz.progress}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                          isCompleted
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
                        }`}
                      >
                        {isCompleted ? "Retake" : "Start"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}