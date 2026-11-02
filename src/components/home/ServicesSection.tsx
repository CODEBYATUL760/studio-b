// ==============================================================================
// MAHAKALI PRODUCTION - Minimal Services Grid
// Exactly 4 Cards: 1 Icon + 2-word Title + max 6-word Subtitle
// Pure Monochrome (#09090B & #121215 border border-white/10)
// ==============================================================================

import React from 'react';
import { Film, Camera, HeartHandshake, Sparkles } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'wedding-cinematography',
    title: 'Wedding Cinematography',
    icon: Film,
    subtitle: 'Director-led 4K sacred wedding cinema.',
  },
  {
    id: 'candid-photography',
    title: 'Candid Photography',
    icon: Camera,
    subtitle: 'Unscripted emotions documented in prime optics.',
  },
  {
    id: 'pre-wedding-shoot',
    title: 'Pre-Wedding Shoot',
    icon: HeartHandshake,
    subtitle: 'Narrative romance films in scenic destinations.',
  },
  {
    id: 'commercial-production',
    title: 'Commercial Production',
    icon: Sparkles,
    subtitle: 'High-impact multi-camera coverage for brands.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#09090B]">
      {/* Section Header */}
      <div className="mb-12 pb-6 border-b border-white/10">
        <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
          Services
        </h2>
      </div>

      {/* Exactly 4 Cards in Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="p-8 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display uppercase tracking-tight text-white">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                  {service.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
