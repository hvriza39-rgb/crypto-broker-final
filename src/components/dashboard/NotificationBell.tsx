'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react'; // Make sure you have icons, or use text

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch messages on load
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const res = await fetch('/api/user/notifications');
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
          // Optional: You could filter for actual 'isRead' status from DB
          // For now, we just show the count of recent messages
          setUnreadCount(data.length); 
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotifs();
    
    // Optional: Poll every 30 seconds to check for new messages
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-50">
      {/* Bell Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <div key={note.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <p className="text-white font-medium text-sm mb-1">{note.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{note.message}</p>
                  <p className="text-gray-600 text-[10px] mt-2 text-right">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                No new messages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}