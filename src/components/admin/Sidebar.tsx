// ==============================================================================
// MAHAKALI PRODUCTION - Admin Executive Workstation Sidebar
// Studio Workstation Navigation: Overview, Bookings, Portfolio, Packages, Reviews, Staff, Settings
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Camera,
  Film,
  Package,
  Star,
  Users,
  Settings,
  ExternalLink,
  ShieldCheck,
  X,
  LogOut,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  totalShootsCount: number;
  pendingReviewsCount?: number;
  pendingStaffCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  totalShootsCount,
  pendingReviewsCount = 0,
  pendingStaffCount = 0,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Compass,
      badge: null,
    },
    {
      id: 'bookings',
      label: 'Bookings & Enquiries',
      icon: Film,
      badge: totalShootsCount > 0 ? `${totalShootsCount}` : null,
    },
    {
      id: 'portfolio',
      label: 'Portfolio Media',
      icon: Camera,
      badge: null,
    },
    {
      id: 'packages',
      label: 'Packages Manager',
      icon: Package,
      badge: null,
    },
    {
      id: 'reviews',
      label: 'Reviews Moderation',
      icon: Star,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} new` : null,
      highlightBadge: pendingReviewsCount > 0,
    },
    {
      id: 'staff',
      label: 'Staff Access & Gatekeeper',
      icon: Users,
      badge: pendingStaffCount > 0 ? `${pendingStaffCount} req` : null,
      highlightBadge: pendingStaffCount > 0,
    },
    {
      id: 'settings',
      label: 'Studio Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#09090B] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <img
                src="/brand/logo-dark.png"
                alt="Mahakali Production"
                className="h-10 sm:h-12 w-auto object-contain filter contrast-125 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#121215] lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location & Contact Chip */}
          <div className="px-5 py-2.5 bg-[#121215] border-b border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="truncate">Shujalpur (MP)</span>
            <span className="font-mono text-zinc-300 font-medium">+91 8719878719</span>
          </div>

          {/* Navigation Section */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Workstation Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0 ml-1 ${
                        isActive
                          ? 'bg-black/15 text-black'
                          : item.highlightBadge
                          ? 'bg-white text-black font-black'
                          : 'bg-white/10 text-white border border-white/15'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Studio Status */}
        <div className="p-4 border-t border-white/10 bg-[#09090B] space-y-3">
          {/* Active Operator Chip */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#121215] border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white font-bold text-xs font-mono">
              {user?.role === 'admin' ? 'VG' : 'ST'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName || BRAND_CONFIG.founder}
              </div>
              <div className="text-[10px] text-zinc-400 truncate font-mono uppercase">
                {user?.role === 'admin' ? BRAND_CONFIG.role : 'Authorized Staff'}
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
          </div>

          {/* Quick External Actions */}
          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              to="/"
              target="_blank"
              className="text-zinc-400 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => logout()}
              className="text-zinc-400 hover:text-red-400 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
