"use client";

import React, { useEffect, useState } from "react";
// ✘ [ERROR] Could not resolve "next/navigation" - Removed this import
// import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabaseClient";

// Define the shape of the props that Next.js passes to the page
type PageProps = {
  params: {
    quizId: string;
  };
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  level: string;
  active: boolean;
  total_questions: number;
  time_limit: number;
};

// Define the shape of the data returned from the Supabase query
type SupabaseQuizData = Omit<Quiz, "total_questions"> & {
  questions: { id: string }[];
};

// Use the PageProps type for the component props
export default function StartQuizPage({ params }: PageProps) {
  // const router = useRouter(); // Replaced with window.location.href
  const { quizId } = params;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;

      const { data, error } = await supabase
        .from("quizzes")
        .select(`*, questions:questions(id)`)
        .eq("id", quizId)
        .single();

      if (error) {
        console.error("Error fetching quiz:", error.message);
        setLoading(false);
        return;
      }
      
      const quizData = data as SupabaseQuizData;

      setQuiz({
        ...quizData,
        total_questions: quizData.questions ? quizData.questions.length : 0,
      });

      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Loading quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gray-900">
        <p className="text-xl">Quiz not found.</p>
        <button
          onClick={() => window.location.href = "/student/dashboard"}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {quiz.title}
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mt-6 text-center">
          {quiz.description}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-blue-600/30 rounded-full text-blue-300 font-semibold">
            Level: {quiz.level || "N/A"}
          </span>
          <span className="px-4 py-2 bg-green-600/30 rounded-full text-green-300 font-semibold">
            Questions: {quiz.total_questions || 0}
          </span>
          <span className="px-4 py-2 bg-purple-600/30 rounded-full text-purple-300 font-semibold">
            Time Limit: {quiz.time_limit || 0} min
          </span>
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => window.location.href = `/student/quiz/${quiz.id}`}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl font-bold shadow-lg text-lg"
          >
            Start Quiz
          </button>

          <button
            onClick={() => window.location.href = "/student/dashboard"}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-700 transition-colors rounded-xl font-semibold shadow-lg text-lg"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400">
          Good luck! 🍀 Take your time and focus on each question.
        </div>
      </div>
    </div>
  );
}

