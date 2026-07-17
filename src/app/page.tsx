"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Dashboard />
      <Footer />
    </main>
  );
}
