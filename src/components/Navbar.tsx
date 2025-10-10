import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md sticky top-0 z-50">
      {/* Logo */}
      <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
        MathsQuiz
      </h1>

      {/* Menu */}
      <div className="flex gap-6 items-center">
        {/* <Link href="/">
          <span className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer font-medium">
            Home
          </span>
        </Link> */}

        {/* <Link href="/about">
          <span className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer font-medium">
            About
          </span>
        </Link> */}

        <Link href="/auth/login">
          <span className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold shadow hover:bg-yellow-300 transition-all duration-300 cursor-pointer">
            Login
          </span>
        </Link>
      </div>
    </nav>
  );
}
