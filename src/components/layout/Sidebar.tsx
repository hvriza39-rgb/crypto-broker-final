'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  TrendingUp, 
  User, 
  Settings, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react'; // Ensure you have lucide-react installed

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deposit', label: 'Deposit', icon: Wallet },
  { href: '/withdrawal', label: 'Withdrawal', icon: ArrowLeftRight },
  { href: '/trade', label: 'Trade', icon: TrendingUp },
  { href: '/settings/profile', label: 'Profile Settings', icon: User },
  { href: '/settings/account', label: 'Account Settings', icon: Settings },
  { href: '/settings/security', label: 'Security', icon: ShieldCheck }
];

export default function Sidebar() {
  const pathname = usePathname();
  // State for Mobile (Open/Closed)
  const [mobileOpen, setMobileOpen] = useState(false);
  // State for Desktop (Expanded/Collapsed)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      {/* --- Toggle Button (Visible on both Mobile & Desktop) --- */}
      <button
        onClick={() => {
          if (window.innerWidth >= 768) {
            setDesktopCollapsed(!desktopCollapsed); // Toggle Collapse on Desktop
          } else {
            setMobileOpen(!mobileOpen); // Toggle Slide on Mobile
          }
        }}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#0b1220] border border-white/10 text-white hover:bg-white/5 transition-colors"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* --- Mobile Overlay (Dimming Background) --- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* --- The Sidebar --- */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 bg-[#0b1220] border-r border-white/10 transition-all duration-300 ease-in-out',
          // Mobile: Slide in/out
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: Always visible, but width changes
          'md:translate-x-0',
          desktopCollapsed ? 'md:w-20' : 'md:w-64'
        )}
      >
        {/* Logo Section */}
        <div className={clsx("flex items-center h-16 border-b border-white/10", desktopCollapsed ? "justify-center" : "px-6")}>
          <div className="text-xl font-bold text-white tracking-wide">
            {desktopCollapsed ? (
              <span className="text-blue-500">B</span>
            ) : (
              <>Broker<span className="text-blue-500">X</span></>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all group',
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  desktopCollapsed && 'justify-center px-0'
                )}
                title={desktopCollapsed ? item.label : undefined}
              >
                {/* Icon */}
                <Icon size={20} className={clsx(isActive ? 'text-white' : 'group-hover:text-white')} />
                
                {/* Text Label (Hidden if Collapsed) */}
                {!desktopCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}