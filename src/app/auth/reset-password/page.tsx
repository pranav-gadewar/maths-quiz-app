"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Supabase automatically authenticates the user via the recovery link,
      // so we can call updateUser directly to update their password.
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccessMsg("Password updated successfully! Redirecting you to login...");
      setLoading(false);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. Please request a new recovery link.");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-grid-pattern px-6 relative overflow-hidden text-white">
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-10 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Floating Math Symbols */}
      <div className="absolute top-[10%] left-[8%] text-indigo-500/10 text-5xl font-extrabold select-none pointer-events-none animate-float-slow">π</div>
      <div className="absolute top-[15%] right-[10%] text-cyan-500/10 text-4xl font-mono select-none pointer-events-none animate-float-medium">√x</div>
      <div className="absolute bottom-[20%] left-[12%] text-violet-500/10 text-5xl font-serif select-none pointer-events-none animate-float-fast">∑</div>
      <div className="absolute bottom-[15%] right-[15%] text-indigo-500/10 text-6xl font-sans select-none pointer-events-none animate-float-slow" style={{ animationDelay: "1.5s" }}>∞</div>

      {/* Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/auth/login" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-200 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Login</span>
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <form
          onSubmit={handleReset}
          className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl relative group overflow-hidden"
        >
          {/* Card Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-700 pointer-events-none" />

          {/* Logo Brand Icon */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] mb-4">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-center">
              New <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Password</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 text-center leading-relaxed">
              Create a secure new password for your account
            </p>
          </motion.div>

          {/* Success message */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 p-3.5 text-sm text-green-400 bg-green-950/40 border border-green-500/30 rounded-xl mb-6"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Error message */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 p-3.5 text-sm text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl mb-6"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Password Field */}
          <motion.div variants={itemVariants} className="relative mb-5">
            <div className="absolute left-4 top-3.5 text-slate-500 flex items-center pointer-events-none">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-3.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 text-white transition-all duration-300 placeholder:text-slate-600"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <div className="absolute left-4 top-3.5 text-slate-500 flex items-center pointer-events-none">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full pl-12 pr-12 py-3.5 bg-slate-950/50 border border-slate-800 focus:border-indigo-500/80 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500/30 text-white transition-all duration-300 placeholder:text-slate-600"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3.5 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                loading ? "opacity-75 cursor-not-allowed animate-pulse" : "hover:scale-[1.02]"
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? "Updating password..." : "Update Password"}</span>
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
