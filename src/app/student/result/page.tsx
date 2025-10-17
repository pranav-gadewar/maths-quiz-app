"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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
      // ✅ Get the currently logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please log in to view your result.");
        router.push("/login");
        return;
      }
      setUserId(user.id);

      // ✅ Fetch the most recent quiz result for this user
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-lg">
        Loading your result...
      </div>
    );

  if (!result)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center p-6">
        <h1 className="text-3xl font-bold mb-4 text-red-400">
          No recent results found
        </h1>
        <p className="text-gray-400 mb-6">
          You haven’t completed any quizzes yet.
        </p>
        <button
          onClick={() => router.push("/student/viewQuizzes")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
        >
          Go to Quizzes
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 px-4 py-10">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-white text-center">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          Quiz Result
        </h1>

        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-300 mb-2">
            {result.quizzes.title}
          </h2>
          <p className="text-gray-400 mb-4">{result.quizzes.description}</p>
          <p className="text-sm text-gray-400">
            Difficulty:{" "}
            <span className="text-gray-200 font-semibold">
              {result.quizzes.level}
            </span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-700/60 p-4 rounded-xl">
            <p className="text-gray-300 text-sm">Total Questions</p>
            <p className="text-2xl font-bold">{result.total_questions}</p>
          </div>
          <div className="bg-gray-700/60 p-4 rounded-xl">
            <p className="text-gray-300 text-sm">Correct Answers</p>
            <p className="text-2xl font-bold text-green-400">{result.score}</p>
          </div>
          <div className="bg-gray-700/60 p-4 rounded-xl">
            <p className="text-gray-300 text-sm">Percentage</p>
            <p
              className={`text-2xl font-bold ${
                result.percentage >= 75
                  ? "text-green-400"
                  : result.percentage >= 50
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {result.percentage.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push(`/student/quiz/${result.quiz_id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => router.push("/student/viewQuizzes")}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
          >
            Back to Quizzes
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Attempted on{" "}
          {new Date(result.created_at).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
}
