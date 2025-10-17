"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", href: "/student/dashboard" },
    { title: "Profile", href: "/student/viewProfile" },
    { title: "Quizzes", href: "/student/viewQuizzes" },
    { title: "Quiz History", href: "/student/quizHistory" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-gray-900 shadow-md">
        <div className="flex items-center justify-between px-4 py-3 w-full">
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded w-full">
            <span className="text-white font-semibold text-2xl">Student Panel</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-2xl p-1 rounded hover:bg-gray-700 transition"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-gray-900 text-white shadow-lg
          w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="flex flex-col flex-1 py-8 px-5 overflow-y-auto">
          {/* Desktop Title */}
          <h1 className="text-2xl font-bold mb-8 hidden md:block">Student Panel</h1>

          {/* Mobile Title */}
          {isOpen && (
            <h2 className="text-2xl font-bold mb-4 md:hidden">
              Maths Quiz App
            </h2>
          )}

          <nav className="flex flex-col gap-2 mt-4 md:mt-0">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`
                  px-3 py-2 rounded-lg hover:bg-gray-700 transition
                  ${pathname === item.href ? "bg-gray-800 font-semibold" : ""}
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Logout button at the bottom */}
          <div className="mt-auto pt-6">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/auth/login";
              }}
              className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
