import React from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">MathsQuiz</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/student/dashboard">
            <span className="text-gray-300 hover:text-white font-medium cursor-pointer">Dashboard</span>
          </Link>
          <Link href="/student/viewProfile">
            <span className="text-gray-300 hover:text-white font-medium cursor-pointer">Profile</span>
          </Link>
          <Link href="/student/viewQuizzes">
            <span className="text-gray-300 hover:text-white font-medium cursor-pointer">Quizzes</span>
          </Link>
          <Link href="/student/quizHistory">
            <span className="text-gray-300 hover:text-white font-medium cursor-pointer">Quiz History</span>
          </Link>
        </nav>
      </div>
      <div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/auth/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded mt-6 font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}