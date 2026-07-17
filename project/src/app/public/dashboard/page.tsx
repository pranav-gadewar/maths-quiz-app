"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Dashboard() {
  const quizzes = [
    { id: 1, title: "Algebra Basics", description: "Test your fundamentals of algebra" },
    { id: 2, title: "Geometry Challenge", description: "Shapes, angles, and theorems" },
    { id: 3, title: "Trigonometry Quiz", description: "Sine, Cosine, and beyond" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />

      <section className="flex flex-col items-center justify-center flex-grow px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Maths Quiz Arena</h1>

        <p className="text-gray-400 text-center max-w-2xl mb-10">
          Challenge your mind with interactive quizzes. Track progress and sharpen your math skills.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-gray-800 rounded-xl p-6 shadow-md hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-gray-400 mb-4">{quiz.description}</p>

              <Link
                href={`/auth/login`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg inline-block"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
