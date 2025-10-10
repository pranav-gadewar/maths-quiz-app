"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import Sidebar from "../../../components/admin/Sidebar";
import { Users, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalStudents: 0,
    activeQuizzes: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);

  // Fetch admin name
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

  // Fetch stats and recent quizzes
  useEffect(() => {
    const fetchStats = async () => {
      const { data: quizzes } = await supabase.from("quizzes").select("*");
      const { data: students } = await supabase
        .from("users")
        .select("*")
        .eq("role", "student");

      const activeQuizzes = quizzes?.filter((q) => q.active).length || 0;

      setStats({
        totalQuizzes: quizzes?.length || 0,
        totalStudents: students?.length || 0,
        activeQuizzes,
      });

      // ✅ Fixed red underline issue
      setRecentQuizzes((quizzes ?? []).slice(-5).reverse());
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      alert("Error logging out: " + error.message);
      return;
    }

    router.push("/auth/login");
  };

  const dashboardCards = [
    {
      id: 1,
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: <BookOpen className="text-blue-400" size={28} />,
    },
    {
      id: 2,
      title: "Total Students",
      value: stats.totalStudents,
      icon: <Users className="text-green-400" size={28} />,
    },
    {
      id: 3,
      title: "Active Quizzes",
      value: stats.activeQuizzes,
      icon: <CheckCircle className="text-purple-400" size={28} />,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome Back, {adminName} 👋
          </h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition transform"
            >
              {card.icon}
              <h2 className="text-xl font-semibold mt-2 mb-1">{card.title}</h2>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <Link href="/admin/addQuiz">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow">
                Create New Quiz
              </button>
            </Link>
            <Link href="/admin/manageStudents">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow">
                View Students
              </button>
            </Link>
            <Link href="/admin/manageQuizzes">
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded shadow">
                Manage Quizzes
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Quizzes */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Quizzes</h2>
          <div className="bg-white rounded-xl shadow p-6">
            {recentQuizzes.length === 0 ? (
              <p className="text-gray-500">No quizzes available.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentQuizzes.map((quiz) => (
                  <li
                    key={quiz.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <span className="font-medium">{quiz.title}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        quiz.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {quiz.active ? "Active" : "Inactive"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
