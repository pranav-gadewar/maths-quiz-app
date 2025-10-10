"use client";

export const dynamic = "force-dynamic"; // ⚡ Fixes Supabase prerender error

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  // Add a new question
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

  // Remove a question
  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // Update question text
  const updateQuestionText = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  // Update answer text
  const updateAnswerText = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex].text = value;
    setQuestions(updated);
  };

  // Toggle correct answer (only one correct per question)
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-2xl shadow-lg">
        <a
          href="/admin/dashboard"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </a>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Quiz</h1>

        {successMsg && (
          <p className="bg-green-100 text-green-800 p-2 rounded mb-4">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="bg-red-100 text-red-800 p-2 rounded mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleAddQuiz} className="space-y-6">
          {/* Quiz Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-gray-700 font-semibold">Active</label>
          </div>

          {/* Questions */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Questions</h2>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold">Question {qIndex + 1}</label>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  placeholder="Enter question"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Answers */}
                <div className="ml-4 space-y-2">
                  {q.answers.map((a, aIndex) => (
                    <div key={aIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={a.text}
                        onChange={(e) =>
                          updateAnswerText(qIndex, aIndex, e.target.value)
                        }
                        placeholder={`Answer ${["A", "B", "C", "D"][aIndex]}`}
                        required
                        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`correct-answer-${qIndex}`}
                          checked={a.isCorrect}
                          onChange={() => toggleCorrectAnswer(qIndex, aIndex)}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 text-green-600 font-semibold"
            >
              + Add Question
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Adding Quiz..." : "Add Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
}
