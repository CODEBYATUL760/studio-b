// ==============================================================================
// MAHAKALI PRODUCTION - Awwwards-style Luxury Header / Navbar
// Ultra-clean matte black, metallic champagne accents, audio toggle & live status
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Film, Shield, LogOut, Menu, X, Sparkles, Volume2, VolumeX, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/config/brand';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Portfolio', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'Inquire Date', path: '/book-now' },
    { name: 'Client Portal', path: '/client-portal', icon: Film },
    { name: 'Admin Studio', path: '/admin', icon: Shield },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-[#09090B]/85 border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent border-b border-white/5 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Identity with Logo from image_0.png */}
        <Link
          to="/"
          className="flex items-center group py-0.5"
          data-cursor="explore"
        >
          <img
            src="/brand/logo-dark.png"
            alt="Mahakali Production"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            loading="eager"
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                data-cursor="explore"
                className={`relative py-1 transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Sound, Status Pill & Auth CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Audio Visualizer Button */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121215] border border-white/10 hover:border-white/25 text-zinc-300 transition-all text-[10px] font-mono uppercase tracking-wider"
            title={isPlayingAudio ? 'Mute Ambient Audio' : 'Play Cinematic Ambience'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-white" />
                <span className="flex items-center gap-0.5 h-2.5">
                  <span className="w-0.5 h-full bg-white animate-pulse" />
                  <span className="w-0.5 h-1/2 bg-white animate-bounce" />
                  <span className="w-0.5 h-3/4 bg-white animate-pulse" />
                </span>
                <span>AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-500">SOUND</span>
              </>
            )}
          </button>

          {/* Commissions Available Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono font-semibold tracking-wider text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>2026 COMMISSIONS OPEN</span>
          </div>

          {/* User state / Book Shoot CTA */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-white">{user.fullName}</span>
                <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400">
                  {user.role === 'admin' ? 'Studio Director' : 'VIP Client'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-[#121215] hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/book-now"
                data-cursor="explore"
                className="relative group px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-[#09090B] font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-1.5 duration-300"
              >
                <span>Book Shoot</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090B]/98 backdrop-blur-2xl border-b border-white/10 px-6 pt-4 pb-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Navigation Menu
            </span>
            <span className="text-[10px] font-mono text-zinc-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Available 2026
            </span>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-display font-semibold uppercase tracking-wider ${
                location.pathname === link.path ? 'text-white' : 'text-zinc-400'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <a
              href={BRAND_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: +91 8719878719</span>
            </a>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-red-950/30 text-red-400 border border-red-500/20 text-xs font-semibold"
              >
                Sign Out ({user.fullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-[#121215] border border-white/10 text-xs font-semibold text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/book-now"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-white text-xs font-bold uppercase tracking-wider text-[#09090B]"
                >
                  Book Shoot
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
