"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Users, BookOpen, CheckCircle, Plus, Eye, Award, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Quiz = {
  id: string;
  title: string;
  active: boolean;
  created_at?: string;
  total_questions?: number;
  description?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    activeQuizzes: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchAdminName = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("role", "admin")
        .single();
      if (data?.name) setAdminName(data.name);
      if (error) console.error("Error fetching admin name:", error);
    };
    fetchAdminName();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: quizzes, error: quizError } = await supabase
        .from("quizzes")
        .select("*");
      const { data: students, error: studentError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "student");

      if (quizError) console.error("Error fetching quizzes:", quizError);
      if (studentError) console.error("Error fetching students:", studentError);

      const activeQuizzes = quizzes?.filter((q) => q.active).length || 0;

      setStats({
        totalQuizzes: quizzes?.length || 0,
        totalStudents: students?.length || 0,
        activeQuizzes,
      });

      setRecentQuizzes((quizzes ?? []).slice(-5).reverse());
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) return alert("Error logging out: " + error.message);
    router.push("/auth/login");
  };

  const dashboardCards = [
    {
      id: 1,
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: <BookOpen className="text-indigo-400 w-6 h-6" />,
      glowColor: "hover:shadow-indigo-500/10 hover:border-indigo-500/30",
    },
    {
      id: 2,
      title: "Total Students",
      value: stats.totalStudents,
      icon: <Users className="text-cyan-400 w-6 h-6" />,
      glowColor: "hover:shadow-cyan-500/10 hover:border-cyan-500/30",
    },
    {
      id: 3,
      title: "Active Quizzes",
      value: stats.activeQuizzes,
      icon: <CheckCircle className="text-purple-400 w-6 h-6" />,
      glowColor: "hover:shadow-purple-500/10 hover:border-purple-500/30",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-grow text-white"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Welcome Back, {adminName} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's the current overview of your math platform.
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold py-2.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            loading ? "opacity-75 cursor-not-allowed animate-pulse" : "hover:scale-[1.02]"
          }`}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>{loading ? "Logging out..." : "Logout"}</span>
        </button>
      </motion.div>

      {/* Dashboard Cards */}
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            className={`bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 flex items-center gap-5 hover:scale-[1.03] transition-all duration-300 group shadow-lg ${card.glowColor}`}
          >
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/50 group-hover:border-slate-700/80 transition-colors">
              {card.icon}
            </div>
            <div>
              <h2 className="text-slate-400 text-sm font-medium">{card.title}</h2>
              <p className="text-3xl font-black mt-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Quick Actions</span>
        </h2>
        <div className="flex gap-4 flex-wrap">
          <Link href="/admin/addQuiz">
            <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
              <Plus className="w-4 h-4" />
              <span>Create New Quiz</span>
            </button>
          </Link>
          <Link href="/admin/manageStudents">
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>View Students</span>
            </button>
          </Link>
          <Link href="/admin/manageQuizzes">
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Manage Quizzes</span>
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Quizzes */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Recent Quizzes</span>
        </h2>
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg">
          {recentQuizzes.length === 0 ? (
            <p className="text-slate-500 text-center py-6 text-sm">No quizzes available yet. Create one above!</p>
          ) : (
            <ul className="divide-y divide-slate-800/60">
              {recentQuizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="py-4 flex justify-between items-center group transition"
                >
                  <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {quiz.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        quiz.active
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-slate-800/50 text-slate-400 border border-slate-700/50"
                      }`}
                    >
                      {quiz.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
