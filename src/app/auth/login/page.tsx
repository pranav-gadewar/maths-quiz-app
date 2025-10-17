"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setErrorMsg(error?.message || "Login failed");
      setLoading(false);
      return;
    }

    // Fetch user role
    const { data: userRole, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (roleError || !userRole) {
      setErrorMsg("Failed to fetch user role");
      setLoading(false);
      return;
    }

    if (userRole.role === "admin") router.push("/admin/dashboard");
    else router.push("/student/dashboard");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 relative">
      {/* Back Link */}
      <div className="absolute top-6 left-6 text-white">
        <Link href="/" className="hover:underline">back to home</Link>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 text-white transition-all duration-300 hover:shadow-blue-500/20"
      >
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome Back 👋
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Log in to continue your maths journey
        </p>

        {/* Error */}
        {errorMsg && (
          <p className="text-red-400 text-sm text-center mb-4 bg-red-900/30 py-2 rounded-lg">
            {errorMsg}
          </p>
        )}

        {/* Email Field */}
        <div className="relative mb-6 w-full">
          <input
            type="email"
            id="email"
            className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 text-white placeholder-transparent focus:outline-none focus:border-blue-400 transition-all duration-300"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm bg-transparent px-1"
          >
            Email Address
          </label>
        </div>

        {/* Password Field */}
        <div className="relative mb-8 w-full">
          <input
            type="password"
            id="password"
            className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 text-white placeholder-transparent focus:outline-none focus:border-purple-400 transition-all duration-300"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-purple-400 peer-focus:text-sm bg-transparent px-1"
          >
            Password
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forgot Password */}
        <p className="text-center text-gray-400 text-sm mt-4 hover:text-blue-400 cursor-pointer transition">
          Forgot your password?
        </p>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-600"></div>

        {/* Signup Option */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link href="/auth/signup">
            <span className="text-blue-400 hover:text-purple-400 font-semibold cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}
