"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";

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
};

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchInitialData = async () => {
      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to take a quiz.");
        router.push("/auth/login");
        return;
      }
      setUserId(user.id);

      // Fetch quiz info
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (quizError || !quizData) {
        alert("Quiz not found.");
        router.push("/student/viewQuizzes");
        return;
      }
      setQuiz(quizData as Quiz);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("created_at", { ascending: true });

      if (questionsError || !questionsData || questionsData.length === 0) {
        alert("No questions found for this quiz.");
        router.push("/student/viewQuizzes");
        return;
      }

      setQuestions(questionsData as Question[]);
      setLoading(false);
    };

    fetchInitialData();
  }, [quizId, router]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[300px] text-slate-400 text-sm animate-pulse">
        Loading quiz questions...
      </div>
    );
  }

  if (!quiz || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (!userId) return alert("User not authenticated!");
    if (Object.keys(answers).length !== questions.length) {
      return alert("Please answer all questions before submitting!");
    }

    setSubmitting(true);

    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) correctCount += 1;
    });

    const { error } = await supabase.from("results").insert({
      quiz_id: quiz.id,
      total_questions: questions.length,
      score: correctCount,
      user_id: userId,
    });

    setSubmitting(false);

    if (error) {
      alert("Error saving results: " + error.message);
    } else {
      router.push(`/student/result?quizId=${quiz.id}`);
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full text-white max-w-3xl mx-auto">
      {/* Back Link */}
      <div className="mb-6 flex justify-between items-center">
        <Link href="/student/viewQuizzes" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Leave Quiz</span>
        </Link>
        <span className="text-xs font-bold text-slate-500">
          Level: {quiz.level}
        </span>
      </div>

      {/* Quiz Card */}
      <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-1 text-center sm:text-left">
          {quiz.title}
        </h1>
        <p className="text-slate-400 text-xs mb-8 text-center sm:text-left">
          {quiz.description}
        </p>

        {/* Question Panel */}
        <div className="bg-slate-950/40 border border-slate-850 p-5 sm:p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              {Object.keys(answers).length} answered
            </span>
          </div>

          <p className="text-slate-100 font-semibold mb-6 text-sm sm:text-base leading-relaxed">
            {currentQuestion.question_text}
          </p>

          {/* Options Grid */}
          <div className="grid gap-3.5 mb-8">
            {["A", "B", "C", "D"].map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswerSelect(opt)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl font-semibold transition duration-150 cursor-pointer text-sm ${
                    isSelected
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-slate-950/50 border border-slate-850 hover:border-slate-800 hover:bg-slate-950/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className={`inline-block w-6 font-bold ${isSelected ? "text-indigo-400" : "text-slate-500"}`}>{opt}.</span>
                  <span>{currentQuestion[`option_${opt.toLowerCase()}` as keyof Question]}</span>
                </button>
              );
            })}
          </div>

          {/* Actions Footer */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-850 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2 text-xs font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-xl shadow-md transition duration-150 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition duration-150 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? "Submitting..." : "Submit Quiz"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
