// ==============================================================================
// MAHAKALI PRODUCTION - Split-Screen Interactive Gallery Showcase
// 100% Genuine Media Driven (Zero Fake Stock Photos / Zero Fake AI Data)
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Play,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Camera,
  Aperture,
  Plus,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { VideoModal } from '@/components/common/VideoModal';
import { useStudioData } from '@/hooks/useStudioData';
import { PortfolioItem } from '@/types/database';
import { Link } from 'react-router-dom';

export const CinematicShowcase: React.FC = () => {
  const { portfolioItems } = useStudioData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVideo, setModalVideo] = useState<{ open: boolean; title: string; subtitle: string; category: string }>({
    open: false,
    title: '',
    subtitle: '',
    category: '',
  });

  const hasItems = portfolioItems.length > 0;
  const currentFrame = hasItems ? portfolioItems[activeIndex % portfolioItems.length] : null;

  const handleNext = () => {
    if (!hasItems) return;
    setActiveIndex((prev) => (prev + 1) % portfolioItems.length);
  };

  const handlePrev = () => {
    if (!hasItems) return;
    setActiveIndex((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length);
  };

  const openPlayer = (item: PortfolioItem) => {
    setModalVideo({
      open: true,
      title: item.title,
      subtitle: `${item.couples || 'Commission'} • ${item.location || 'Shujalpur'}`,
      category: item.category,
    });
  };

  return (
    <section className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>Interactive Gallery Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#F8F9FA] uppercase">
            Signature Wedding Films
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] max-w-xl font-light">
            Director-grade 4K wedding films, pre-wedding reels, and drone panoramas by Vishal Giri.
          </p>
        </div>

        {hasItems && (
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs text-[#A1A1AA]">
              <span className="text-gold-400 font-bold text-sm">0{activeIndex + 1}</span>
              <span className="mx-1">/</span>
              <span>0{portfolioItems.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                data-cursor="explore"
                className="p-3 rounded-full bg-[#121316] hover:bg-[#181A1F] text-slate-300 hover:text-gold-400 border border-gold-500/16 hover:border-gold-500/40 transition-all shadow-md"
                aria-label="Previous Slide"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                data-cursor="explore"
                className="p-3 rounded-full bg-[#121316] hover:bg-[#181A1F] text-slate-300 hover:text-gold-400 border border-gold-500/16 hover:border-gold-500/40 transition-all shadow-md"
                aria-label="Next Slide"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {hasItems && currentFrame ? (
        /* Split-Screen Slide Transition Container */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl bg-[#121316] border border-gold-500/16 p-6 sm:p-10 shadow-2xl overflow-hidden relative backdrop-blur-md">
          {/* Left Column: Metadata */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFrame.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0A0A0B] text-gold-400 border border-gold-500/30 inline-block mb-3">
                    {currentFrame.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-[#F8F9FA]">
                    {currentFrame.title}
                  </h3>
                  {currentFrame.couples && (
                    <p className="text-xs font-mono text-gold-400 mt-1">{currentFrame.couples}</p>
                  )}
                </div>

                {currentFrame.location && (
                  <div className="py-4 border-t border-b border-white/5 text-xs text-[#A1A1AA] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{currentFrame.location}</span>
                  </div>
                )}

                {currentFrame.specs && (
                  <div className="p-4 rounded-xl bg-[#0A0A0B] border border-white/5 text-xs text-[#A1A1AA] space-y-1">
                    <div className="text-[10px] font-mono text-gold-400 uppercase font-bold">
                      Cinema Details
                    </div>
                    <div>{currentFrame.specs}</div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => openPlayer(currentFrame)}
              data-cursor="play"
              className="w-full py-4 px-6 bg-gold-500 hover:bg-gold-400 text-studio-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gold-500/10 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-studio-950" />
              <span>Launch 4K Reel Player</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Visual Cinema Canvas */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[500px] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/5 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFrame.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => openPlayer(currentFrame)}
                data-cursor="play"
              >
                {currentFrame.media_url ? (
                  <img
                    src={currentFrame.media_url}
                    alt={currentFrame.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.85] transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#121316] to-[#0A0A0B]">
                    <Aperture className="w-16 h-16 text-gold-500/30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-gold-500 text-studio-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-studio-950 ml-0.5" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Empty State (Clean Luxury Matte Black + Gold) */
        <div className="rounded-3xl p-10 sm:p-16 bg-[#121316] border border-gold-500/16 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-[#0A0A0B] border border-gold-500/25 flex items-center justify-center text-gold-400 mx-auto mb-5 shadow-lg">
            <Aperture className="w-8 h-8 text-gold-400 animate-spin-slow" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#F8F9FA] mb-2">
            Cinematic Reel Showcase
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto mb-6 font-light leading-relaxed">
            Upload genuine work from the Admin Panel to showcase here. All project highlights will automatically synchronize with this split-screen player.
          </p>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-studio-950 font-bold text-xs uppercase tracking-widest transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Media in Admin</span>
          </Link>
        </div>
      )}

      {/* Lightbox Video Player */}
      <VideoModal
        isOpen={modalVideo.open}
        onClose={() => setModalVideo((prev) => ({ ...prev, open: false }))}
        title={modalVideo.title}
        subtitle={modalVideo.subtitle}
        category={modalVideo.category}
      />
    </section>
  );
};
