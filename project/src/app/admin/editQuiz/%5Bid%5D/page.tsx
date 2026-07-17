"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Trash2, Plus, ArrowLeft, BookOpen, AlertCircle, Save, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { PostgrestError } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

type Question = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  created_at?: string;
};

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Easy");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!quizId) return;
    fetchQuiz();
    fetchQuestions();
  }, [quizId]);

  // Fetch quiz info
  const fetchQuiz = async () => {
    const { data, error }: { data: Quiz | null; error: PostgrestError | null } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (error) {
      setErrorMsg(error.message);
    } else if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setLevel(data.level || "Easy");
      setActive(data.active);
    }
    setLoading(false);
  };

  // Fetch quiz questions
  const fetchQuestions = async () => {
    const { data, error }: { data: Question[] | null; error: PostgrestError | null } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching questions:", error.message);
    } else if (data) {
      setQuestions(data);
    }
  };

  // Update quiz
  const handleUpdateQuiz = async () => {
    if (!title || !description) {
      setErrorMsg("Title and Description are required.");
      return;
    }

    setSaving(true);
    const { error }: { error: PostgrestError | null } = await supabase
      .from("quizzes")
      .update({ title, description, level, active })
      .eq("id", quizId);

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/admin/manageQuizzes");
    }
  };

  // Update a question in state
  const handleQuestionChange = (id: string, field: keyof Question, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // Update question in Supabase
  const handleUpdateQuestion = async (q: Question) => {
    const { error }: { error: PostgrestError | null } = await supabase
      .from("questions")
      .update({
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
      })
      .eq("id", q.id);

    if (error) {
      alert("Error updating question: " + error.message);
    } else {
      alert("Question updated successfully");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    const { error }: { error: PostgrestError | null } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      alert("Error deleting question: " + error.message);
    } else {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleAddQuestion = async () => {
    const { data, error }: { data: Question | null; error: PostgrestError | null } = await supabase
      .from("questions")
      .insert({
        quiz_id: quizId,
        question_text: "New Question",
        option_a: "Option A",
        option_b: "Option B",
        option_c: "Option C",
        option_d: "Option D",
        correct_option: "A",
      })
      .select()
      .single();

    if (error) {
      alert("Error adding question: " + error.message);
    } else if (data) {
      setQuestions([...questions, data]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  if (loading) return <p className="text-center text-slate-400 py-12 text-sm animate-pulse">Loading quiz details...</p>;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-white"
    >
      {/* Back Link */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/admin/manageQuizzes" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Manage Quizzes</span>
        </Link>
      </motion.div>

      {/* Page Title */}
      <motion.h1 variants={itemVariants} className="text-3xl font-extrabold mb-6 flex items-center gap-2.5">
        <BookOpen className="w-7 h-7 text-indigo-400" />
        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Edit Quiz</span>
      </motion.h1>

      {errorMsg && (
        <motion.div
          variants={itemVariants}
          className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm"
        >
          {errorMsg}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl mb-8">
        
        {/* Quiz Form Details */}
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Title</label>
              <input
                type="text"
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm cursor-pointer"
                >
                  <option className="bg-slate-900 text-white">Easy</option>
                  <option className="bg-slate-900 text-white">Medium</option>
                  <option className="bg-slate-900 text-white">Hard</option>
                </select>
              </div>

              <div className="flex items-center justify-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950 rounded cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-300">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-300">Description</label>
            <textarea
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Questions Manager */}
        <div className="border-t border-slate-800/80 pt-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Questions List</span>
            </h2>
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-4 py-2 rounded-2xl font-bold text-xs transition duration-200 shadow-lg cursor-pointer hover:scale-[1.02]"
            >
              <Plus size={14} />
              <span>Add Question</span>
            </button>
          </div>

          {questions.length === 0 ? (
            <p className="text-slate-500 text-center py-6 text-sm">No questions found. Add one above.</p>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {questions.map((q, qIndex) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="border border-slate-800/80 p-5 rounded-2xl bg-slate-950/30 relative"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-indigo-400 text-sm">Question {qIndex + 1}</span>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm mb-4"
                      value={q.question_text}
                      onChange={(e) => handleQuestionChange(q.id, "question_text", e.target.value)}
                      placeholder="Question Text"
                    />

                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      <input
                        type="text"
                        className="w-full bg-slate-950/40 border border-slate-800/60 focus:border-indigo-500/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all text-xs"
                        value={q.option_a}
                        onChange={(e) => handleQuestionChange(q.id, "option_a", e.target.value)}
                        placeholder="Option A"
                      />
                      <input
                        type="text"
                        className="w-full bg-slate-950/40 border border-slate-800/60 focus:border-indigo-500/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all text-xs"
                        value={q.option_b}
                        onChange={(e) => handleQuestionChange(q.id, "option_b", e.target.value)}
                        placeholder="Option B"
                      />
                      <input
                        type="text"
                        className="w-full bg-slate-950/40 border border-slate-800/60 focus:border-indigo-500/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all text-xs"
                        value={q.option_c}
                        onChange={(e) => handleQuestionChange(q.id, "option_c", e.target.value)}
                        placeholder="Option C"
                      />
                      <input
                        type="text"
                        className="w-full bg-slate-950/40 border border-slate-800/60 focus:border-indigo-500/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all text-xs"
                        value={q.option_d}
                        onChange={(e) => handleQuestionChange(q.id, "option_d", e.target.value)}
                        placeholder="Option D"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-950/20 p-2.5 px-4 rounded-xl border border-slate-850">
                      <label className="text-xs font-semibold text-slate-400">Correct Option:</label>
                      <select
                        value={q.correct_option}
                        onChange={(e) => handleQuestionChange(q.id, "correct_option", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>

                      <button
                        onClick={() => handleUpdateQuestion(q)}
                        className="ml-auto flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white text-indigo-400 text-xs font-bold py-1 px-3.5 rounded-lg transition-all duration-150 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Question</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleUpdateQuiz}
          disabled={saving}
          className={`mt-8 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-[1.02] ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Update Quiz Info"}</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
