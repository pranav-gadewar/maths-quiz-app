"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Trash2, ArrowLeft } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, phone, created_at")
        .eq("role", "student")
        .order("created_at", { ascending: false });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setStudents(data || []);
      }
    };

    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      alert("Error deleting student: " + error.message);
    } else {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-white"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-3xl font-extrabold mb-6 flex items-center gap-2.5">
        <Users className="w-7 h-7 text-indigo-400" />
        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Manage Students</span>
      </motion.h1>

      {errorMsg && (
        <motion.div
          variants={itemVariants}
          className="bg-red-950/40 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm"
        >
          {errorMsg}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <p className="text-center text-slate-400 py-12 text-sm animate-pulse">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-center text-slate-400 py-12 text-sm">No students registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-sm font-semibold">
                <tr>
                  <th className="py-4 px-6 text-left">Name</th>
                  <th className="py-4 px-6 text-left">Email</th>
                  <th className="py-4 px-6 text-left">Phone</th>
                  <th className="py-4 px-6 text-left">Registered At</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-800/20 transition duration-150"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-200">{student.name || "N/A"}</td>
                    <td className="py-4 px-6 truncate max-w-[250px]">{student.email}</td>
                    <td className="py-4 px-6">{student.phone || "N/A"}</td>
                    <td className="py-4 px-6">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
