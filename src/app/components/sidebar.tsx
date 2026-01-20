'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wallet, ArrowLeftRight, TrendingUp, 
  User, Settings, ShieldCheck, Menu, X, LogOut 
} from 'lucide-react';

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
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Default to COLLAPSED for cleaner look
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);
const handleLogout = () => {
    // 1. Kill the cookie (The most important part for Middleware)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    
    // 2. Clear localStorage for extra safety
    localStorage.removeItem('token');
    
    // 3. Force a hard refresh to the login page to clear any cached states
    window.location.href = '/login';
  };

  const noScrollbarClass = "scrollbar-hide overflow-y-auto";

  // --- SHARED CONTENT (Used for both Mobile and Desktop) ---
  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <>
      {/* Header */}
      <div className={`h-20 flex items-center border-b border-white/10 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between px-6'}`}>
        {!isCollapsed && (
          <span className="font-bold text-2xl text-white tracking-wide">
            Broker<span className="text-blue-500">X</span>
          </span>
        )}
        {/* Toggle Button (Only visible on Desktop) */}
        {!isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className={`flex-1 p-4 space-y-2 ${noScrollbarClass}`}>
        {items.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} collapsed={isCollapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10 mt-auto bg-[#0b1220] flex-shrink-0">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group ${isCollapsed && 'justify-center'}`}
          title="Log Out"
        >
          <LogOut size={22} />
          {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>
      </div>
    </>
  );

  // --- RENDER ---
  return (
    <>
      {/* MOBILE: Floating Toggle Button */}
      {isMobile && (
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-[#0b1220] border border-white/10 text-white shadow-xl hover:bg-white/5"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* MOBILE: Overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#0b1220] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out shadow-2xl
          ${isMobile 
            ? (mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72') // Mobile Slide
            : (isOpen ? 'w-72' : 'w-20') // Desktop Width Change
          }
        `}
      >
        <SidebarContent isCollapsed={!isMobile && !isOpen} />
      </aside>

      {/* Styles for scrollbar hiding */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </>
  );
}

// Helper Component for Links
function NavItem({ item, pathname, collapsed }: any) {
  const Icon = item.icon;
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link 
      href={item.href} 
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      } ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-white'} />
      {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
    </Link>
  );
}