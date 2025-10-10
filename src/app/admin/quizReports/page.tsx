"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <a href="/admin/dashboard" className="text-blue-500 hover:underline">&larr; Back to Dashboard</a>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Reports</h1>

      {errorMsg && (
        <p className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMsg}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-600">No quizzes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Level</th>
                <th className="py-3 px-4 text-center">Active</th>
                <th className="py-3 px-4 text-center">Questions</th>
                <th className="py-3 px-4 text-center">Created</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-semibold">{quiz.title}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-[250px]">
                    {quiz.description}
                  </td>
                  <td className="py-3 px-4">{quiz.level}</td>
                  <td className="py-3 px-4 text-center">
                    {quiz.active ? "Yes" : "No"}
                  </td>
                  <td className="py-3 px-4 text-center">{quiz.question_count}</td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
