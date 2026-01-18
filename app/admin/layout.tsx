"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter for redirection
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut // Import the Logout icon
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // Hook for navigation
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 1. Logic to Hide Sidebar on Login Page
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-[#0b1220] flex items-center justify-center">
        {children}
      </main>
    );
  }

  // 2. Logout Handler
  const handleLogout = () => {
    // Perform any cleanup here (e.g., clearing local storage or cookies)
    // localStorage.removeItem('token'); 
    
    // Redirect to login
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Transactions', href: '/admin/transactions', icon: ArrowRightLeft },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b1220]">
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out relative bg-[#0b1220]`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-500 transition-colors z-50 border border-[#0b1220]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Sidebar Content Container */}
        <div className="flex flex-col h-full p-4">
          
          {/* Logo Area */}
          <div className={`mb-8 flex items-center h-10 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className={`font-bold tracking-tighter text-blue-500 transition-all duration-300 ${
              isCollapsed ? 'text-xl' : 'text-xl'
            }`}>
              {isCollapsed ? 'AP' : 'ADMIN_PANEL'}
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg transition-colors group relative ${
                    isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
                  } ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-500' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  
                  <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed ? 'w-0 opacity-0 absolute' : 'w-auto opacity-100'
                  }`}>
                    {item.name}
                  </span>

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Logout Button (Pushed to bottom using mt-auto) */}
          <div className="mt-auto border-t border-white/10 pt-4">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full rounded-lg transition-colors group relative text-red-400 hover:bg-red-500/10 hover:text-red-400 ${
                isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
              }`}
            >
              <LogOut size={20} />
              
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isCollapsed ? 'w-0 opacity-0 absolute' : 'w-auto opacity-100'
              }`}>
                Logout
              </span>

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-red-400 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Logout
                </div>
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gradient-to-b from-white/[0.02] to-transparent overflow-y-auto">
        {children}
      </main>
    </div>
  );
}