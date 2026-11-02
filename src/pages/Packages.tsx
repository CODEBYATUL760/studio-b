// ==============================================================================
// MAHAKALI PRODUCTION - Packages & Services Catalog Page
// Pure Monochrome: #09090B & #121215
// ==============================================================================

import React from 'react';
import { PackageSelector } from '@/components/packages/PackageSelector';
import { Sparkles, Phone, MessageSquare } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const Packages: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090B] text-white py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full selection:bg-white/20 selection:text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121215] border border-white/10 text-zinc-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Curated by {BRAND_CONFIG.founder} &bull; Shujalpur, MP</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
          Services & Packages
        </h1>
        <p className="mt-4 text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
          Tailored with specific camera configurations, album deliverables, and verified delivery timelines.
        </p>

        {/* Quick Contact Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
          <a
            href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>Direct Desk: {BRAND_CONFIG.contact.phone}</span>
          </a>
          <span>&bull;</span>
          <a
            href={BRAND_CONFIG.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>WhatsApp Inquiries</span>
          </a>
        </div>
      </div>

      {/* Package Selector Component with Quotation Flow */}
      <PackageSelector />
    </div>
  );
};
