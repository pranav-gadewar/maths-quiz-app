"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const quizzes = [
  {
    id: 1,
    title: "Algebra",
    description: "Master equations, variables, and expressions with fun challenges.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Geometry",
    description: "Explore angles, shapes, and theorems through interactive quizzes.",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Trigonometry",
    description: "Understand sine, cosine, and tangent like never before.",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 4,
    title: "Calculus",
    description: "Test your skills on limits, derivatives, and integrals.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 5,
    title: "Statistics",
    description: "Analyze data, probability, and distributions effortlessly.",
    color: "from-pink-500 to-rose-500",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const length = quizzes.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 4000);
    return () => clearInterval(timer);
  }, [length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);

  return (
    <section className="relative w-full max-w-5xl mx-auto py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Types of Quizzes
      </h2>

      {/* Carousel Container */}
      <div className="relative flex items-center justify-center">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-8 z-10 bg-gray-700/80 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Slide Container */}
        <div className="relative flex items-center justify-center w-full h-[300px] sm:h-[340px]">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className={`absolute transition-all duration-700 ease-in-out transform ${
                index === current
                  ? "opacity-100 scale-100 translate-x-0"
                  : "opacity-0 scale-90 translate-x-5"
              }`}
            >
              <div
                className={`w-[360px] sm:w-[480px] p-10 rounded-3xl shadow-2xl text-center bg-gradient-to-r ${quiz.color} text-white`}
              >
                <h3 className="text-3xl font-bold mb-3">{quiz.title}</h3>
                <p className="text-gray-100 text-base leading-relaxed">{quiz.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-8 z-10 bg-gray-700/80 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-10 space-x-2">
        {quizzes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-blue-500 scale-110" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
