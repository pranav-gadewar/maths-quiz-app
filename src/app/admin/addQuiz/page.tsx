"use client";

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

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <a
          href="/admin/dashboard"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </a>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
          Add New Quiz
        </h1>

        {successMsg && (
          <p className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center sm:text-left">
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center sm:text-left">
            {errorMsg}
          </p>
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex items-center mt-2 sm:mt-8">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="ml-2 text-gray-700 font-semibold">Active</label>
            </div>
          </div>

          {/* Questions Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Questions
            </h2>
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 p-4 rounded-xl mb-4 bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                  <label className="font-semibold text-gray-700">
                    Question {qIndex + 1}
                  </label>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 font-semibold text-sm hover:underline"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="space-y-2">
                  {q.answers.map((a, aIndex) => (
                    <div
                      key={aIndex}
                      className="flex flex-col sm:flex-row sm:items-center gap-2"
                    >
                      <input
                        type="text"
                        value={a.text}
                        onChange={(e) =>
                          updateAnswerText(qIndex, aIndex, e.target.value)
                        }
                        placeholder={`Answer ${["A", "B", "C", "D"][aIndex]}`}
                        required
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <label className="flex items-center gap-1 text-sm sm:text-base">
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
              className="mt-2 text-green-600 font-semibold hover:underline"
            >
              + Add Question
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition ${
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
