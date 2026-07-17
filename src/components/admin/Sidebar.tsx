"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Users, BarChart3, BookOpen, Menu, X, Sparkles } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "Add Quiz", href: "/admin/addQuiz", icon: <PlusCircle className="w-5 h-5" /> },
    { title: "Manage Quizzes", href: "/admin/manageQuizzes", icon: <BookOpen className="w-5 h-5" /> },
    { title: "Manage Students", href: "/admin/manageStudents", icon: <Users className="w-5 h-5" /> },
    { title: "Quiz Reports", href: "/admin/quizReports", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-slate-950/95 border-b border-slate-900 backdrop-blur-md text-white h-16 p-4 shadow-lg md:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none p-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-slate-900/40 border-r border-slate-800/80 backdrop-blur-md text-white shadow-2xl
          w-64 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="flex flex-col flex-1 py-8 px-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-10 hidden md:flex">
            <div className="p-1.5 rounded-lg bg-indigo-600">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              Admin Portal
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-4 md:mt-0">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-400 border-l-[3px] border-indigo-500 pl-3 font-semibold"
                        : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`transition-colors duration-200 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
