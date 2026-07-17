"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Shield, Calendar, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[300px] text-slate-400 text-sm animate-pulse">
        Loading profile details...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[300px] text-red-400 text-sm">
        {errorMsg || "Profile not found."}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full text-white"
    >
      {/* Back Link */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link href="/student/dashboard" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>

      {/* Main Profile Card */}
      <motion.div
        variants={itemVariants}
        className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-700 pointer-events-none" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="p-4 rounded-full bg-slate-950/80 border border-slate-800 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)] mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-400 text-xs mt-1">Student Account Information</p>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <EnhancedField icon={<User size={14} />} label="Name" value={profile.name ?? "N/A"} />
          <EnhancedField icon={<Mail size={14} />} label="Email" value={profile.email} />
          <EnhancedField icon={<Phone size={14} />} label="Phone" value={profile.phone ?? "N/A"} />
          <EnhancedField icon={<Shield size={14} />} label="Role" value={profile.role ?? "student"} />
          <EnhancedField icon={<Calendar size={14} />} label="Account Created" value={new Date(profile.created_at).toLocaleDateString()} />
          <EnhancedField icon={<Award size={14} />} label="XP earned" value={`${profile.xp ?? (profile.completed ? profile.completed * 10 : 0)} XP`} />
        </div>
      </motion.div>
    </motion.div>
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
  <div className="flex flex-col p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition duration-200 shadow-inner">
    <div className="flex items-center gap-1.5 mb-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
      {icon} <span>{label}</span>
    </div>
    <p className="text-white font-extrabold text-sm sm:text-base leading-relaxed">{value}</p>
  </div>
);
