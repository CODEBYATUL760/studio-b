// ==============================================================================
// MAHAKALI PRODUCTION - Modern Admin Topbar
// Luxury Matte Black & Metallic Gold Header with Global Search & Real-Time Notification Bell
// ==============================================================================

import React from 'react';
import {
  Search,
  Bell,
  Menu,
  ShieldCheck,
  Phone,
  LogOut,
  Plus,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadCount?: number;
  onOpenNotifications: () => void;
  activeTabTitle?: string;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  unreadCount = 0,
  onOpenNotifications,
  activeTabTitle = 'Studio Overview',
  onPrimaryAction,
  primaryActionLabel = '+ Add Media',
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm transition-all">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
        {/* Left: Mobile Menu Toggle, Section Title & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#121215] lg:hidden transition-colors"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block shrink-0">
            <span className="text-sm font-bold font-display uppercase tracking-wider text-white">
              {activeTabTitle}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients, shoots, staff, dates..."
              className="w-full pl-10 pr-12 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-[#09090B] border border-white/10 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Primary Action, Notifications, Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Primary Action Button */}
          {onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-[#09090B] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{primaryActionLabel}</span>
            </button>
          )}

          {/* WhatsApp Direct Link */}
          <a
            href={BRAND_CONFIG.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121215] hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
            title="Open WhatsApp Studio Console"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-[11px]">+91 8719878719</span>
          </a>

          {/* Real-Time Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#121215] transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full bg-white text-black text-[9px] font-black flex items-center justify-center ring-2 ring-[#09090B]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Admin Profile Chip */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <div className="w-8 h-8 rounded-xl bg-[#121215] border border-white/15 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.role === 'admin' ? 'VG' : 'ST'}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white leading-tight">
                  {user?.fullName || BRAND_CONFIG.founder}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Direct Logout Button */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-[#121215] border border-transparent hover:border-red-500/20 transition-colors ml-1"
            title="Log Out of Studio Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
