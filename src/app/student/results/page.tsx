"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Result = {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
  quiz_title?: string;
};

export default function StudentResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to view results.");
        window.location.href = "/login";
        return;
      }

      // Fetch student's quiz results and include quiz titles
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
        console.error(error);
      } else {
        const formatted = data.map((r: any) => ({
          id: r.id,
          quiz_id: r.quiz_id,
          score: r.score,
          total_questions: r.total_questions,
          percentage: r.percentage,
          created_at: r.created_at,
          quiz_title: r.quizzes?.title || "Unknown Quiz",
        }));
        setResults(formatted);
      }

      setLoading(false);
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading your quiz history...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        You haven’t completed any quizzes yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8 text-white">
      <div className="mb-6">
        <a href="/student/dashboard" className="text-blue-400 hover:underline">&larr; Back to Dashboard</a>
      </div>
      <h1 className="text-4xl font-bold text-center mb-10">
        📊 Your Quiz History
      </h1>

      <div className="max-w-4xl mx-auto bg-gray-800/80 rounded-2xl shadow-2xl p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600 text-gray-300">
              <th className="p-3">Quiz Title</th>
              <th className="p-3">Score</th>
              <th className="p-3">Percentage</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.id}
                className="border-b border-gray-700 hover:bg-gray-700/50 transition"
              >
                <td className="p-3">{result.quiz_title}</td>
                <td className="p-3">{result.score}/{result.total_questions}</td>
                <td className="p-3">{result.percentage?.toFixed(1)}%</td>
                <td className="p-3">
                  {new Date(result.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
