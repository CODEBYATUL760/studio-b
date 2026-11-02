// ==============================================================================
// MAHAKALI PRODUCTION - Minimal "Why Us" / Studio Philosophy Section
// Clean 3-Column Minimal Feature Strip (Max 12 words per card)
// ==============================================================================

import React from 'react';
import { Camera, Clock, ShieldCheck, Sparkles, MapPin, Phone } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface FeatureCard {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string; // Maximum 12 words
}

const FEATURES: FeatureCard[] = [
  {
    title: 'Cinema-Grade Gear',
    icon: Camera,
    description: 'Sony FX3 cinema bodies, prime optical glass, and 4K DJI drone cinematography.', // 11 words
  },
  {
    title: 'Timely Delivery',
    icon: Clock,
    description: 'Guaranteed 40 to 80-day delivery timeline confirmed in writing before booking.', // 10 words
  },
  {
    title: 'Dedicated Client Portal',
    icon: ShieldCheck,
    description: 'Private encrypted portal for tracking shoot milestones, EMI schedules, and downloadable invoices.', // 12 words
  },
];

export const StudioPhilosophy: React.FC = () => {
  return (
    <section className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121215] border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.25em] mb-4">
          <Sparkles className="w-3 h-3" />
          <span>The Studio Standard</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
          Why Mahakali Production
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Directed personally by {BRAND_CONFIG.founder} with an uncompromising focus on heirloom cinema.
        </p>
      </div>

      {/* Clean 3-Column Minimal Feature Strip (Max 12 words per card) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display uppercase tracking-tight text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Founder & Studio Location Strip */}
      <div className="mt-12 p-6 rounded-2xl bg-[#121215] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-white shrink-0" />
          <span>
            Studio at <strong className="text-white">{BRAND_CONFIG.location.address}</strong>, {BRAND_CONFIG.location.city} ({BRAND_CONFIG.location.state})
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span>Creative Director: <strong className="text-white">{BRAND_CONFIG.founder}</strong></span>
          <span>&bull;</span>
          <a
            href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
            className="hover:text-white text-zinc-300 transition-colors"
          >
            {BRAND_CONFIG.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
};
