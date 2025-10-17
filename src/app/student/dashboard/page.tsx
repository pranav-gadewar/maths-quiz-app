"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, CheckCircle, Award, Zap, Clock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "../../student/components/Sidebar";
import { useRouter } from "next/navigation";

// Define a type for the User object to avoid using 'any'
type User = {
  id: string;
  name: string | null;
  rank: number | string | null;
  // Add any other properties from your 'users' table here
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
  // ✅ Use the specific User type for state, allowing it to be null initially
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
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        Loading dashboard...
      </div>
    );
  }

  // Calculate dynamic stats
  const totalQuizzes = quizzes.length;
  const completedQuizzes = results.length;
  const totalXP = completedQuizzes * 10; // example: 10 XP per quiz
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 text-white px-6 py-16 pt-24 md:ml-64">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back, {user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Track your progress and level up your skills!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <Zap className="mx-auto text-yellow-400 mb-2" size={30} />
            <h3 className="text-2xl font-bold">{totalXP}</h3>
            <p className="text-gray-400">Total XP</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <CheckCircle className="mx-auto text-green-400 mb-2" size={30} />
            {/* ✅ Used 'totalQuizzes' to remove the unused variable warning */}
            <h3 className="text-2xl font-bold">
              {completedQuizzes} / {totalQuizzes}
            </h3>
            <p className="text-gray-400">Quizzes Completed</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <BarChart3 className="mx-auto text-blue-400 mb-2" size={30} />
            <h3 className="text-2xl font-bold">{accuracy}%</h3>
            <p className="text-gray-400">Accuracy</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <Award className="mx-auto text-purple-400 mb-2" size={30} />
            <h3 className="text-2xl font-bold">#{rank}</h3>
            <p className="text-gray-400">Your Rank</p>
          </div>
        </div>

        {/* Quiz List */}
        <div className="max-w-6xl mx-auto bg-gray-800/60 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
            Your Quizzes
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {quizCards.map((quiz) => (
              <div
                key={quiz.id}
                className={`p-6 rounded-2xl shadow-lg border border-gray-700 text-center
                  ${
                    quiz.progress === "Completed"
                      ? "bg-green-700/40"
                      : quiz.progress === "In Progress"
                      ? "bg-blue-700/40"
                      : "bg-gray-700/40"
                  } hover:scale-105 transition relative`}
              >
                <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                <p className="text-gray-300 mb-3">{quiz.level} Level</p>

                {quiz.lastScore != null && (
                  <p className="text-sm text-gray-300 mb-2">
                    Last Score: {quiz.lastScore}/{quiz.total_questions} (
                    {quiz.lastPercentage !== undefined
                      ? quiz.lastPercentage.toFixed(1)
                      : "0"}
                    %)
                  </p>
                )}

                {quiz.lastAttemptDate && (
                  <p className="text-sm text-gray-400 mb-3 flex items-center justify-center gap-1">
                    <Clock size={16} />{" "}
                    {new Date(quiz.lastAttemptDate).toLocaleDateString()}
                  </p>
                )}

                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    quiz.progress === "Completed"
                      ? "bg-green-500/20 text-green-300"
                      : quiz.progress === "In Progress"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {quiz.progress}
                </span>

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    {quiz.progress === "Completed" ? "Retake" : "Start"}
                  </button>
                  {quiz.lastAttemptDate && (
                    <button
                      onClick={() => router.push(`/student/results`)}
                      className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition text-sm font-semibold"
                    >
                      View History
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}