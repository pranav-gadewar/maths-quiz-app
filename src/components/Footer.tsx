"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Instagram, Sparkles, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-900 overflow-hidden">
      {/* Decorative Glow Blurs */}
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[150px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[150px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Maths<span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Quiz</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Empowering students to master mathematical logic through highly engaging, interactive quizzes, and competitive rank progress.
          </p>
          <div className="flex gap-4 mt-2">
            <SocialIcon
              href="https://www.instagram.com/pranav.gadewar_1603?igsh=MXJqMTllNGU4OTRjeg=="
              label="Instagram"
              icon={<Instagram className="w-4 h-4" />}
              color="hover:text-pink-400 hover:border-pink-500/50"
            />
            <SocialIcon
              href="https://github.com/pranav-gadewar"
              label="GitHub"
              icon={<Github className="w-4 h-4" />}
              color="hover:text-white hover:border-slate-400"
            />
            <SocialIcon
              href="https://www.linkedin.com/in/pranav-gadewar/"
              label="LinkedIn"
              icon={<Linkedin className="w-4 h-4" />}
              color="hover:text-blue-400 hover:border-blue-500/50"
            />
          </div>
        </div>

        {/* Column 2: Explore */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Explore</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-white transition-colors duration-200">
                Services
              </a>
            </li>
            <li>
              <a href="#quizzes" className="hover:text-white transition-colors duration-200">
                Quiz Topics
              </a>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-white transition-colors duration-200">
                Practice Panel
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Support */}
        <div>
          <h3 className="text-white font-bold text-base mb-4 tracking-wider uppercase">Support</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Leaderboard FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-base tracking-wider uppercase">Newsletter</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Subscribe for the latest math challenge releases, study plans, and leaderboard news.
          </p>
          <div className="flex items-center gap-2 max-w-sm border border-slate-800 bg-slate-900/60 p-1.5 rounded-2xl focus-within:border-indigo-500/50 transition-all">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent text-sm w-full pl-3 focus:outline-none text-slate-200 placeholder:text-slate-800"
            />
            <button className="p-2.5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-900/80 bg-slate-950/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MathsQuiz. All rights reserved.</p>
          <p>
            Built with <span className="text-indigo-400 font-medium">Next.js</span> &{" "}
            <span className="text-cyan-400 font-medium">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon,
  color,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative p-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer ${color}`}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl transition duration-300"></div>
      <div className="relative z-10 transition">
        {icon}
      </div>
    </a>
  );
}
