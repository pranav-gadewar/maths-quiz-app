"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import Link from "next/link";
import type { PostgrestError } from "@supabase/supabase-js";

type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  created_at: string | null;
};

export default function ManageQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data, error }: { data: Quiz[] | null; error: PostgrestError | null } = await supabase
      .from("quizzes")
      .select("id, title, description, level, active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setQuizzes(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    const { error }: { error: PostgrestError | null } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) {
      alert("Error deleting quiz: " + error.message);
    } else {
      setQuizzes(quizzes.filter((q) => q.id !== id));
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error }: { error: PostgrestError | null } = await supabase
      .from("quizzes")
      .update({ active: !current })
      .eq("id", id);

    if (error) {
      alert("Error updating quiz status: " + error.message);
    } else {
      setQuizzes(
        quizzes.map((q) =>
          q.id === id ? { ...q, active: !current } : q
        )
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <div>
        <a href="/admin/dashboard" className="text-blue-500 hover:underline">&larr; Back to Dashboard</a>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Quizzes</h1>

        <Link
          href="/admin/addQuiz"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          <Plus size={18} />
          Add New Quiz
        </Link>
      </div>

      {errorMsg && (
        <p className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMsg}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-center text-gray-600">No quizzes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Level</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Created</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
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
                    <button
                      onClick={() => toggleActive(quiz.id, quiz.active)}
                      className="focus:outline-none"
                    >
                      {quiz.active ? (
                        <ToggleRight className="text-green-500" size={24} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={24} />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 px-4 text-center flex items-center justify-center gap-3">
                    <Link
                      href={`/admin/editQuiz/${quiz.id}`}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Pencil size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
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
