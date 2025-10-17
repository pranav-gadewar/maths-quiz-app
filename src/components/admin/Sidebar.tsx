"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Add Quiz", href: "/admin/addQuiz" },
    { title: "Manage Students", href: "/admin/manageStudents" },
    { title: "Quiz Reports", href: "/admin/quizReports" },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 text-white h-16 p-3 shadow-md md:hidden">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none text-3xl p-1 rounded hover:bg-gray-700 transition"
        >
          {isOpen ? "✕" : "☰"}
        </button>
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
          <h1 className="text-2xl font-bold mb-8 hidden md:block">Admin Panel</h1>
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
