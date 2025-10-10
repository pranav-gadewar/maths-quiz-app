"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
  const [userId, setUserId] = useState<string | null>(null); // Updated to match user_id

  useEffect(() => {
    if (!quizId) return;

    const fetchInitialData = async () => {
      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to take a quiz.");
        router.push("/login");
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Loading quiz...
      </div>
    );

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

    // Count correct answers
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) correctCount += 1;
    });

    // Insert into results table
    const { error } = await supabase.from("results").insert({
      quiz_id: quiz.id,
      total_questions: questions.length,
      score: correctCount,
      user_id: userId, // Matches the new schema
      // created_at and percentage are handled automatically by the database
    });

    setSubmitting(false);

    if (error) {
      alert("Error saving results: " + error.message);
    } else {
      alert(`Quiz submitted! You got ${correctCount} / ${questions.length}`);
      router.push("/student/viewQuizzes");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {quiz.title}
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mt-4 text-center">
          {quiz.description}
        </p>

        <div className="mt-8 bg-gray-700/50 p-6 rounded-xl">
          <p className="text-lg font-semibold mb-4">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-gray-200 mb-6">{currentQuestion.question_text}</p>
          <div className="grid gap-4">
            {["A", "B", "C", "D"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerSelect(opt)}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                  answers[currentQuestion.id] === opt
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                {opt}. {currentQuestion[`option_${opt.toLowerCase()}` as keyof Question]}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/student/viewQuizzes")}
            className="text-blue-400 hover:underline"
          >
            &larr; Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}
