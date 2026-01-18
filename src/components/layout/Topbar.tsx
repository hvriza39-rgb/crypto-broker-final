'use client';

import { useState, useEffect } from 'react';

export default function Topbar() {
  // Default values so the bar is never empty
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('Trader');
  const [isVerified, setIsVerified] = useState(true);

  // Fetch Real Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/user/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });
        
        if (!res.ok) return; // Stop if request fails

        const data = await res.json();

        // Safely update state only if data exists
        if (data.user?.name) {
          setUsername(data.user.name);
        }
        if (data.balances?.available !== undefined) {
          setBalance(data.balances.available);
        }
      } catch (err) {
        console.error("Topbar error:", err);
      }
    };

    fetchData();
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full h-16 bg-[#0b1220] border-b border-white/10 flex items-center justify-between px-4 md:px-8 relative z-20">
      
      {/* 1. Mobile Menu Spacer (Keeps layout consistent) */}
      <div className="w-8 md:hidden"></div>

      {/* 2. Right Side: Balance & Profile */}
      <div className="flex items-center gap-4 md:gap-6 ml-auto">
        
        {/* Balance Badge (Hidden on small phones, visible on desktop) */}
        <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {isVerified ? 'Verified' : 'Unverified'}
          </span>
          <span className="text-gray-400 text-sm">Balance:</span>
          <span className="text-white font-mono font-medium tracking-wide">
            ${balance.toLocaleString()} <span className="text-gray-500 text-xs">USD</span>
          </span>
        </div>

        {/* Notification Bell Icon */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          {/* Red Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0b1220]"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-white leading-tight">
              {username}
            </div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wide">
              Standard Account
            </div>
          </div>
          
          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg text-sm border border-white/10">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}