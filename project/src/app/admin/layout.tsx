import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex bg-grid-pattern relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 relative flex flex-col min-h-screen">
        {/* Glow Blobs */}
        <div className="absolute top-0 right-0 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        {/* Responsive Content Container */}
        <main className="flex-1 p-6 md:p-8 pt-24 md:pt-8 z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
