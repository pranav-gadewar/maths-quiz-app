import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[80vh] px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Master Maths with Fun & Challenge
      </h1>

      {/* Subtext */}
      <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-2xl mb-10">
        Improve your problem-solving skills through engaging quizzes, track your progress,
        and rise to the top of the leaderboard!
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/public/dashboard"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
        >
          Start Learning
        </Link>

        <Link
          href="/auth/login"
          className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
        >
          View Dashboard
        </Link>
      </div>
    </section>
  );
}
