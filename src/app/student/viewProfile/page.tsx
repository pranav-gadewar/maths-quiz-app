"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Award,
} from "lucide-react"; // Icons for fields

type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string | null;
  xp?: number | null;
  completed?: number | null;
  accuracy?: string | null;
  rank?: number | null;
  created_at: string;
};

export default function ViewProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const userResponse = await supabase.auth.getUser();
    const user = userResponse.data.user;

    if (!user) {
      setErrorMsg("No user logged in.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      setErrorMsg(error.message);
    } else {
      setProfile(data as UserProfile);
    }

    setLoading(false);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Loading profile...
      </p>
    );

  if (!profile)
    return (
      <p className="text-center text-gray-600 mt-10 font-medium">{errorMsg}</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl border border-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        My Profile
      </h1>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnhancedField icon={<User size={18} />} label="Name" value={profile.name || "N/A"} />
        <EnhancedField icon={<Mail size={18} />} label="Email" value={profile.email} />
        <EnhancedField icon={<Phone size={18} />} label="Phone" value={profile.phone || "N/A"} />
        <EnhancedField icon={<Shield size={18} />} label="Role" value={profile.role || "N/A"} />
        <EnhancedField icon={<Calendar size={18} />} label="Account Created" value={new Date(profile.created_at).toLocaleDateString()} />
        {profile.xp !== undefined && (
          <EnhancedField icon={<Award size={18} />} label="XP" value={profile.xp.toString()} />
        )}
        {profile.completed !== undefined && (
          <EnhancedField icon={<Award size={18} />} label="Quizzes Completed" value={profile.completed.toString()} />
        )}
        {profile.accuracy && (
          <EnhancedField icon={<Award size={18} />} label="Accuracy" value={`${profile.accuracy}%`} />
        )}
        {profile.rank !== undefined && (
          <EnhancedField icon={<Award size={18} />} label="Rank" value={`#${profile.rank}`} />
        )}
      </div>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap justify-center items-center gap-5 text-center">
        <button
          onClick={() => router.push("/student/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => router.push("/student/editProfile")}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

// Enhanced profile field with icon
const EnhancedField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col p-3 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 border border-gray-200">
    <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium">
      {icon} <span>{label}</span>
    </div>
    <p className="text-gray-700 font-semibold text-sm md:text-base">{value}</p>
  </div>
);
