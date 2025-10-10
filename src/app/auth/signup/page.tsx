"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setLoading(true);

        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        // Immediately sign in the user (bypass email confirmation)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError || !loginData.user) {
            setErrorMsg(loginError?.message || "Login failed after signup");
            setLoading(false);
            return;
        }

        // Insert user into 'users' table with name and phone
        await supabase.from("users").insert([
            {
                id: loginData.user.id,
                name: name,
                phone: phone,
                email: email,
                role: "student", // default role
            },
        ]);

        setLoading(false);

        // Redirect to student dashboard
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6">
            <form
                onSubmit={handleSignup}
                className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 text-white transition-all duration-300 hover:shadow-blue-500/20"
            >
                {/* Title */}
                <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Create Account ✨
                </h1>
                <p className="text-gray-300 text-center mb-8">
                    Join MathsQuiz and start your learning journey today!
                </p>

                {/* Error */}
                {errorMsg && (
                    <p className="text-red-400 text-sm text-center mb-4 bg-red-900/30 py-2 rounded-lg">
                        {errorMsg}
                    </p>
                )}

                {/* Name Field */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        id="name"
                        className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 focus:border-blue-500 outline-none text-white placeholder-transparent"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="name"
                        className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-blue-400 peer-focus:text-sm"
                    >
                        Full Name
                    </label>
                </div>

                {/* Phone Number Field */}
                <div className="relative mb-6">
                    <input
                        type="tel"
                        id="phone"
                        className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 focus:border-blue-500 outline-none text-white placeholder-transparent"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="phone"
                        className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-blue-400 peer-focus:text-sm"
                    >
                        Phone Number
                    </label>
                </div>

                {/* Email Field */}
                <div className="relative mb-6">
                    <input
                        type="email"
                        id="email"
                        className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 focus:border-blue-500 outline-none text-white placeholder-transparent"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-blue-400 peer-focus:text-sm"
                    >
                        Email Address
                    </label>
                </div>

                {/* Password Field */}
                <div className="relative mb-6">
                    <input
                        type="password"
                        id="password"
                        className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 focus:border-purple-500 outline-none text-white placeholder-transparent"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-purple-400 peer-focus:text-sm"
                    >
                        Password
                    </label>
                </div>

                {/* Confirm Password Field */}
                <div className="relative mb-8">
                    <input
                        type="password"
                        id="confirmPassword"
                        className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-500 focus:border-purple-500 outline-none text-white placeholder-transparent"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="confirmPassword"
                        className="absolute left-4 top-3 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-purple-400 peer-focus:text-sm"
                    >
                        Confirm Password
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
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* Divider */}
                <div className="mt-8 border-t border-gray-600"></div>

                {/* Login Redirect */}
                <p className="text-center text-gray-400 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => router.push("/auth/login")}
                        className="text-blue-400 hover:text-purple-400 font-semibold cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}
