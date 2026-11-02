// ==============================================================================
// MAHAKALI PRODUCTION - Monochrome Minimalist Footer
// 100% Pure Monochrome Black & White (#09090B & #121215)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageSquare,
  ArrowUpRight,
  Copy,
  Check,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [istTime, setIstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(BRAND_CONFIG.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#09090B] border-t border-white/10 text-zinc-400 relative overflow-hidden pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Manifesto & Live Time (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-block">
              <img
                src="/brand/logo-dark.png"
                alt="Mahakali Production"
                className="h-14 sm:h-16 w-auto object-contain filter contrast-125"
                loading="lazy"
              />
            </Link>

            <p className="text-sm text-zinc-300 leading-relaxed font-light max-w-md">
              &ldquo;{BRAND_CONFIG.tagline}&rdquo;
            </p>

            <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 max-w-md">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-400 font-bold mb-1">
                <span>Founder & Creative Director</span>
                <span>Studio Headquarters</span>
              </div>
              <div className="text-base font-bold font-display text-white">
                {BRAND_CONFIG.founder}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Leading wedding cinematography in Madhya Pradesh & destination venues.
              </p>
            </div>

            {/* Live Studio Timecode HUD */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>SHUJALPUR, MP (IST):</span>
              </span>
              <span className="text-white font-bold">{istTime || '10:30:00 AM'}</span>
            </div>
          </div>

          {/* Studio Physical Coordinates (3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Studio Headquarters</span>
            </h4>

            <div className="text-xs text-zinc-400 space-y-1.5 leading-relaxed">
              <p className="font-bold text-white">{BRAND_CONFIG.location.address}</p>
              <p>Near by Railway Station</p>
              <p>
                {BRAND_CONFIG.location.city}, {BRAND_CONFIG.location.state}
              </p>
              <p className="font-mono text-zinc-300">PIN: {BRAND_CONFIG.location.pincode}</p>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-zinc-500 space-y-1">
              <div>Desk Hours: 10:00 AM &ndash; 08:30 PM</div>
              <div>Consultations: By Prior Appointment</div>
            </div>
          </div>

          {/* Direct Communication & Socials (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <span>Direct Communication</span>
            </h4>

            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
                  className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="font-mono font-semibold">{BRAND_CONFIG.contact.phone}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>

              <li>
                <a
                  href={BRAND_CONFIG.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>WhatsApp: +91 8719878719</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>

              <li>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#121215] border border-white/10">
                  <div className="flex items-center gap-2 truncate text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">
                      {BRAND_CONFIG.contact.email}
                    </span>
                  </div>
                  <button
                    onClick={copyEmailToClipboard}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </li>

              <li>
                <a
                  href={BRAND_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors group"
                >
                  <Instagram className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{BRAND_CONFIG.contact.instagram}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Portal Sitemap & Back to top */}
        <div className="py-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/packages" className="hover:text-white transition-colors">
              &bull; 4K Packages
            </Link>
            <Link to="/book-now" className="hover:text-white transition-colors">
              &bull; Inquire Shoot
            </Link>
            <Link to="/client-portal" className="hover:text-white transition-colors">
              &bull; Client Portal
            </Link>
            <Link to="/admin" className="hover:text-white transition-colors">
              &bull; Studio Admin
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-white hover:text-zinc-300 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Metadata & Legal Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {BRAND_CONFIG.brandName}. Directed by {BRAND_CONFIG.founder}.
          </div>
          <div>
            Shujalpur &bull; Madhya Pradesh &bull; All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
