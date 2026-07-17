"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Trash2, Plus } from "lucide-react";
import type { PostgrestError } from "@supabase/supabase-js";

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
  const [level, setLevel] = useState("");
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
      setLevel(data.level || "");
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
        option_a: "A",
        option_b: "B",
        option_c: "C",
        option_d: "D",
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

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading quiz...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <a href="/admin/manageQuizzes" className="text-blue-500 hover:underline">&larr; Back to Manage Quizzes</a>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Quiz</h1>

      {errorMsg && (
        <p className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMsg}</p>
      )}

      {/* Quiz Form */}
      <div className="flex flex-col gap-4 mb-6">
        <label className="font-semibold text-gray-700">Title</label>
        <input
          type="text"
          className="border px-4 py-2 rounded-lg w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="font-semibold text-gray-700">Description</label>
        <textarea
          className="border px-4 py-2 rounded-lg w-full"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="font-semibold text-gray-700">Level</label>
        <input
          type="text"
          className="border px-4 py-2 rounded-lg w-full"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-5 h-5"
          />
          Active
        </label>
      </div>

      {/* Questions */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Questions</h2>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        {questions.length === 0 ? (
          <p className="text-gray-600">No questions found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map((q) => (
              <div key={q.id} className="border p-4 rounded-lg bg-gray-50 flex flex-col gap-2">
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full"
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(q.id, "question_text", e.target.value)}
                  placeholder="Question Text"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={q.option_a}
                    onChange={(e) => handleQuestionChange(q.id, "option_a", e.target.value)}
                    placeholder="Option A"
                  />
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={q.option_b}
                    onChange={(e) => handleQuestionChange(q.id, "option_b", e.target.value)}
                    placeholder="Option B"
                  />
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={q.option_c}
                    onChange={(e) => handleQuestionChange(q.id, "option_c", e.target.value)}
                    placeholder="Option C"
                  />
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={q.option_d}
                    onChange={(e) => handleQuestionChange(q.id, "option_d", e.target.value)}
                    placeholder="Option D"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="font-semibold text-gray-700">Correct Option:</label>
                  <select
                    value={q.correct_option}
                    onChange={(e) => handleQuestionChange(q.id, "correct_option", e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateQuestion(q)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleUpdateQuiz}
          className={`mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition ${saving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Quiz"}
        </button>
      </div>
    </div>
  );
}
