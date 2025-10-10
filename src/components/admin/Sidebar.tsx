import React from "react";
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Add Quiz", href: "/admin/addQuiz" },
    { title: "Manage Students", href: "/admin/manageStudents" },
    { title: "Quiz Reports", href: "/admin/quizReports" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
