'use client';

import { Users, CreditCard, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Admin Overview</h1>
      <p className="text-gray-400 mb-8">Welcome back, Admin.</p>

      {/* Stats Cards (Placeholders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Users</p>
            <h2 className="text-2xl font-bold">128</h2>
          </div>
        </div>

        <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-xl text-green-400">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Pending Deposits</p>
            <h2 className="text-2xl font-bold">4</h2>
          </div>
        </div>

        <div className="bg-[#1a1f2e] border border-white/10 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Volume</p>
            <h2 className="text-2xl font-bold">$45,200</h2>
          </div>
        </div>

      </div>

      <div className="bg-[#1a1f2e] border border-white/10 p-8 rounded-2xl text-center text-gray-400">
        <p>Select a category from the sidebar to manage the platform.</p>
      </div>
    </div>
  );
}