"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import type { PostgrestError } from "@supabase/supabase-js";
import { motion } from "framer-motion";

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
      <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
        <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-indigo-400" />
          <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Manage Quizzes</span>
        </h1>

        <Link
          href="/admin/addQuiz"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-5 py-2.5 rounded-2xl font-bold transition duration-200 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 cursor-pointer hover:scale-[1.02]"
        >
          <Plus size={18} />
          <span>Add New Quiz</span>
        </Link>
      </motion.div>

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
          <p className="text-center text-slate-400 py-12 text-sm animate-pulse">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-slate-400 py-12 text-sm">No quizzes found. Get started by adding one above!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-sm font-semibold">
                <tr>
                  <th className="py-4 px-6 text-left">Title</th>
                  <th className="py-4 px-6 text-left">Description</th>
                  <th className="py-4 px-6 text-left">Level</th>
                  <th className="py-4 px-6 text-center">Active Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
                {quizzes.map((quiz) => (
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
                      <button
                        onClick={() => toggleActive(quiz.id, quiz.active)}
                        className="inline-flex items-center text-slate-400 hover:text-white transition duration-150 cursor-pointer"
                      >
                        {quiz.active ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-medium text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            <ToggleRight className="w-5 h-5 text-emerald-400" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 font-medium text-xs bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded">
                            <ToggleLeft className="w-5 h-5 text-slate-500" />
                            <span>Inactive</span>
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/editQuiz/${quiz.id}`}>
                          <button className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-white transition duration-200 cursor-pointer">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition duration-200 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
