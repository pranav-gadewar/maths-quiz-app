"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

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

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <Link href="/student/dashboard" className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Quizzes</h1>

      {errorMsg && (
        <p className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMsg}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-center text-gray-600">No active quizzes available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                Level: {quiz.level || "N/A"} | Questions: {quiz.total_questions || 0}
              </p>
              <Link
                href={`/student/startQuiz/${quiz.id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
