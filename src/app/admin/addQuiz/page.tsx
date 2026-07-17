"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, BookOpen, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  answers: Answer[];
}

export default function AddQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Easy");
  const [active, setActive] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const updateQuestionText = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const updateAnswerText = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].text = value;
    setQuestions(updated);
  };

  const toggleCorrectAnswer = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers = updated[qIndex].answers.map((a, i) => ({
      ...a,
      isCorrect: i === aIndex,
    }));
    setQuestions(updated);
  };

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .insert([{ title, description, level, active }])
        .select()
        .single();

      if (quizError || !quizData) throw quizError;

      for (const q of questions) {
        if (q.answers.length !== 4)
          throw new Error("Each question must have exactly 4 answers.");
        const correctIndex = q.answers.findIndex((a) => a.isCorrect);
        if (correctIndex === -1)
          throw new Error("Each question must have one correct answer.");

        const { data: questionData, error: questionError } = await supabase
          .from("questions")
          .insert([
            {
              quiz_id: quizData.id,
              question_text: q.text,
              option_a: q.answers[0].text,
              option_b: q.answers[1].text,
              option_c: q.answers[2].text,
              option_d: q.answers[3].text,
              correct_option: ["A", "B", "C", "D"][correctIndex],
            },
          ])
          .select()
          .single();

        if (questionError || !questionData) throw questionError;
      }

      setSuccessMsg("Quiz added successfully!");
      setTitle("");
      setDescription("");
      setLevel("Easy");
      setActive(true);
      setQuestions([
        {
          text: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ]);
    } catch (err: any) {
      console.error("Error adding quiz:", err);
      if (err && typeof err === "object" && "message" in err) {
        setErrorMsg(err.message as string);
      } else {
        setErrorMsg("An unknown error occurred. Please try again.");
      }
    }

    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
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
      {/* Back Link */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      {/* Page Title */}
      <motion.h1 variants={itemVariants} className="text-3xl font-extrabold mb-6 flex items-center gap-2.5">
        <BookOpen className="w-7 h-7 text-indigo-400" />
        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Add New Quiz</span>
      </motion.h1>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 p-3.5 text-sm text-green-400 bg-green-950/40 border border-green-500/30 rounded-2xl mb-6"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-2xl mb-6"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl">
        <form onSubmit={handleAddQuiz} className="space-y-6">
          
          {/* Quiz Details */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600 text-sm"
                placeholder="Enter quiz title"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600 text-sm"
              placeholder="Enter quiz description details"
            />
          </div>

          {/* Questions Panel */}
          <div className="border-t border-slate-800/80 pt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Questions List</span>
            </h2>

            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {questions.map((q, qIndex) => (
                  <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="border border-slate-800/80 p-5 rounded-2xl bg-slate-950/30 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-indigo-400 text-sm">Question {qIndex + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      placeholder="Enter question text"
                      required
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-700 text-sm mb-4"
                    />

                    <div className="grid sm:grid-cols-2 gap-3">
                      {q.answers.map((a, aIndex) => (
                        <div
                          key={aIndex}
                          className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 p-2 px-3.5 rounded-xl hover:border-slate-800 transition duration-150"
                        >
                          <input
                            type="text"
                            value={a.text}
                            onChange={(e) => updateAnswerText(qIndex, aIndex, e.target.value)}
                            placeholder={`Answer option ${["A", "B", "C", "D"][aIndex]}`}
                            required
                            className="flex-grow bg-transparent text-white focus:outline-none text-sm placeholder:text-slate-700"
                          />
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                            <input
                              type="radio"
                              name={`correct-answer-${qIndex}`}
                              checked={a.isCorrect}
                              onChange={() => toggleCorrectAnswer(qIndex, aIndex)}
                              className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-950 cursor-pointer"
                            />
                            <span className={a.isCorrect ? "text-indigo-400 font-bold" : "text-slate-500"}>Correct</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="mt-4 flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Question</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {loading ? "Adding Quiz..." : "Add Quiz"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
