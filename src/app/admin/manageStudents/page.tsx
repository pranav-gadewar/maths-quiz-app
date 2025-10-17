"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <a href="/admin/dashboard" className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </a>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Students</h1>

      {errorMsg && (
        <p className="bg-red-100 text-red-800 p-3 rounded mb-4">{errorMsg}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-600">No students registered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Registered At</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-semibold">{student.name || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-[250px]">
                    {student.email}
                  </td>
                  <td className="py-3 px-4">{student.phone || "N/A"}</td>
                  <td className="py-3 px-4">
                    {new Date(student.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
