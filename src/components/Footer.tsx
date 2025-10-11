"use client";
import React from "react";
import { Github, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300 border-t border-gray-800 overflow-hidden">
      {/* Decorative Gradient Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Section */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            MathsQuiz
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Built with ❤️ using{" "}
            <span className="text-blue-400 font-medium">Next.js</span> &{" "}
            <span className="text-cyan-400 font-medium">Tailwind CSS</span>
          </p>
          <p className="text-xs text-gray-500 mt-3">
            © {new Date().getFullYear()} MathsQuiz. All rights reserved.
          </p>
        </div>

        {/* Right Section (Social Links) */}
        <div className="flex gap-6">
          <SocialIcon
            href="https://www.instagram.com/pranav.gadewar_1603?igsh=MXJqMTllNGU4OTRjeg=="
            label="Instagram"
            icon={<Instagram className="w-5 h-5" />}
            color="text-pink-400"
          />
          <SocialIcon
            href="https://github.com/pranav-gadewar"
            label="GitHub"
            icon={<Github className="w-5 h-5" />}
            color="text-gray-100"
          />
          <SocialIcon
            href="https://www.linkedin.com/in/pranav-gadewar/"
            label="LinkedIn"
            icon={<Linkedin className="w-5 h-5" />}
            color="text-blue-500"
          />
        </div>
      </div>

      {/* Bottom Glow Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>
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
      className="group relative p-2 rounded-full border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-110"
    >
      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 rounded-full blur-md transition duration-300"></div>
      <div className={`relative z-10 ${color} group-hover:text-blue-400 transition`}>
        {icon}
      </div>
    </a>
  );
}
