'use client';

import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      
      {/* Sidebar is now independent (Fixed Position) */}
      <Sidebar />

      {/* Main Content Area */}
      {/* md:pl-20 reserves 80px space for the collapsed sidebar so icons don't cover text. */}
      {/* The content width never changes, so it never squashes. */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-20 transition-all duration-300">
        
        <Topbar />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}