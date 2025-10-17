"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/dist/client/link";

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

  useEffect(() => {
    const fetchQuizHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to view your quiz history.");
        window.location.href = "/login";
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        Loading your quiz history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        You haven’t attempted any quizzes yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-8 text-gray-800">
      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link href="/student/dashboard">
          <span className="text-blue-600 hover:underline font-medium cursor-pointer">
            ← Back to Dashboard
          </span>
        </Link>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700">
        📚 Quiz History
      </h1>

      {/* Table */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50 text-gray-700">
              <th className="p-3 font-semibold">Quiz Title</th>
              <th className="p-3 font-semibold">Score</th>
              <th className="p-3 font-semibold">Percentage</th>
              <th className="p-3 font-semibold">Attempt Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((quiz) => (
              <tr
                key={quiz.id}
                className="border-b border-gray-200 hover:bg-blue-50 transition"
              >
                <td className="p-3">{quiz.quiz_title}</td>
                <td className="p-3">
                  {quiz.score}/{quiz.total_questions}
                </td>
                <td className="p-3 text-blue-600 font-semibold">
                  {quiz.percentage?.toFixed(1)}%
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(quiz.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
