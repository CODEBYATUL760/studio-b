// ==============================================================================
// MAHAKALI PRODUCTION - Real-Time Client Shoot Production Status Tracker
// 5-Stage Live Milestone Indicator (Booking Confirmed -> Final Master Delivery)
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  Film,
  Camera,
  Layers,
  HardDrive,
  PackageCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useStudioData } from '@/hooks/useStudioData';
import { OrderBooking, BookingStatus } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

export const ShootStatusTracker: React.FC = () => {
  const { orders } = useStudioData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderBooking | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchedOrder(null);
      setSearched(false);
      return;
    }

    const cleanPhone = query.replace(/[^0-9]/g, '');

    // Match by phone or order id or client name
    const match = orders.find((o) => {
      const phoneMatch = o.client?.phone?.replace(/[^0-9]/g, '').includes(cleanPhone);
      const idMatch = o.id.toLowerCase().includes(query);
      const nameMatch = o.client?.full_name?.toLowerCase().includes(query);
      return phoneMatch || idMatch || nameMatch;
    });

    setSearchedOrder(match || null);
    setSearched(true);
  };

  // Determine which of the 5 stages is active based on order status
  const getStageIndex = (status: BookingStatus): number => {
    switch (status) {
      case 'New Enquiry':
      case 'Pending Advance':
        return 0; // Stage 1 pending
      case 'Confirmed':
        return 1; // Stage 1 completed
      case 'Shoot In-Progress':
        return 2; // Stage 2 active
      case 'In-Production':
      case 'In-Production / Editing':
      case 'Post-Production':
        return 3; // Stage 4 active (Color grading)
      case 'Ready for Delivery':
        return 4; // Stage 5 active
      case 'Completed':
      case 'Delivered':
        return 5; // All completed
      default:
        return 1;
    }
  };

  const STAGES = [
    {
      step: 1,
      title: 'Booking Confirmed',
      desc: 'Date reserved, advance verified & shoot contract locked.',
      icon: Film,
    },
    {
      step: 2,
      title: 'Shoot In Progress',
      desc: 'Cinematography crew rolling on venue with multi-cam rig.',
      icon: Camera,
    },
    {
      step: 3,
      title: 'Raw Footage In Ingest',
      desc: 'Multi-terabyte 4K RAW backup on high-speed SSD RAID arrays.',
      icon: HardDrive,
    },
    {
      step: 4,
      title: 'Color Grading & Sound',
      desc: 'Cinematic tone curves, noise reduction & dialogue mastering.',
      icon: Layers,
    },
    {
      step: 5,
      title: 'Final Master Delivery',
      desc: 'Handcrafted luxury album binding & 4K USB master dispatched.',
      icon: PackageCheck,
    },
  ];

  const activeStage = searchedOrder ? getStageIndex(searchedOrder.status) : 0;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#09090B]">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl p-7 sm:p-12 bg-[#121215] border border-white/10 relative overflow-hidden"
      >
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09090B] border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Studio Production Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Track Shoot Status
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light">
            Enter your 10-digit registered phone number or booking reference to view live cinema production milestones.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter registered phone (e.g. 8719878719)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090B] border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        {searched && !searchedOrder ? (
          <div className="text-center py-8 p-6 rounded-2xl bg-[#09090B] border border-white/10 max-w-md mx-auto">
            <Clock className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              No Matching Active Record Found
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Verify your registered phone number or connect directly with our studio desk for live status updates.
            </p>
            <a
              href={BRAND_CONFIG.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#121215] border border-white/15 text-xs text-white hover:bg-zinc-800 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ask Studio Desk on WhatsApp</span>
            </a>
          </div>
        ) : searchedOrder ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Booking Summary Card */}
            <div className="p-5 rounded-2xl bg-[#09090B] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Client Record &bull; {searchedOrder.id.slice(0, 8)}
                </span>
                <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white mt-0.5">
                  {searchedOrder.client?.full_name || 'VIP Client'}
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {searchedOrder.package_name} &bull; {searchedOrder.event_type} on{' '}
                  <span className="font-mono text-white">{searchedOrder.event_date}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-right">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">Current Status</div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {searchedOrder.status}
                  </div>
                </div>

                <a
                  href={`${BRAND_CONFIG.contact.whatsapp}?text=${encodeURIComponent(
                    `Hello Vishal Giri! I am checking on my booking for ${searchedOrder.client?.full_name} (${searchedOrder.package_name}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 5-STAGE PROGRESS MILESTONE INDICATOR */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {STAGES.map((stg) => {
                const Icon = stg.icon;
                const isCompleted = activeStage >= stg.step;
                const isCurrent = activeStage === stg.step - 1;

                return (
                  <div
                    key={stg.step}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-[#09090B] border-white/30 text-white'
                        : isCurrent
                        ? 'bg-[#18181E] border-white text-white shadow-lg'
                        : 'bg-[#09090B]/50 border-white/5 text-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isCompleted
                            ? 'bg-white text-black'
                            : isCurrent
                            ? 'bg-zinc-800 text-white border border-white'
                            : 'bg-zinc-900 text-zinc-600'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold">0{stg.step}</span>
                    </div>

                    <h4 className="text-xs font-bold tracking-tight uppercase leading-snug">
                      {stg.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed font-light">
                      {stg.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Deliverables Checklist Chips */}
            {searchedOrder.deliverables && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[11px] font-mono uppercase text-zinc-400">
                  Deliverables Checklist:
                </span>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span
                    className={`px-2.5 py-1 rounded-lg border ${
                      searchedOrder.deliverables.albums
                        ? 'bg-white text-black border-white'
                        : 'bg-[#09090B] text-zinc-500 border-white/10'
                    }`}
                  >
                    Albums {searchedOrder.deliverables.albums ? '✓' : '...'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border ${
                      searchedOrder.deliverables.penDrives
                        ? 'bg-white text-black border-white'
                        : 'bg-[#09090B] text-zinc-500 border-white/10'
                    }`}
                  >
                    Pen Drive {searchedOrder.deliverables.penDrives ? '✓' : '...'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border ${
                      searchedOrder.deliverables.reelEdits
                        ? 'bg-white text-black border-white'
                        : 'bg-[#09090B] text-zinc-500 border-white/10'
                    }`}
                  >
                    4K Reels {searchedOrder.deliverables.reelEdits ? '✓' : '...'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border ${
                      searchedOrder.deliverables.frames
                        ? 'bg-white text-black border-white'
                        : 'bg-[#09090B] text-zinc-500 border-white/10'
                    }`}
                  >
                    Frames {searchedOrder.deliverables.frames ? '✓' : '...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Initial Empty Preview of the 5 Stages */
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-4xl mx-auto opacity-70">
            {STAGES.map((stg) => {
              const Icon = stg.icon;
              return (
                <div
                  key={stg.step}
                  className="p-4 rounded-xl bg-[#09090B] border border-white/5 text-zinc-400"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#121215] border border-white/10 flex items-center justify-center text-zinc-300">
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">0{stg.step}</span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-tight text-zinc-200">
                    {stg.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{stg.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
};
