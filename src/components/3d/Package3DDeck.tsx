// ==============================================================================
// MAHAKALI PRODUCTION - Interactive 3D Package Cube / Showcase Deck (<Package3DDeck />)
// 3D Rotating Deck between Signature Packages with Specular Lighting & Flip Transitions
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Camera,
  Film,
  HardDrive,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG, StudioPackage } from '@/config/brand';

export const Package3DDeck: React.FC = () => {
  const weddingPackages = BRAND_CONFIG.packages.filter(
    (p) => p.category === 'Wedding'
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const currentPkg: StudioPackage = weddingPackages[activeIndex];

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % weddingPackages.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + weddingPackages.length) % weddingPackages.length);
  };

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-studio-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-900 border border-gold-500/30 text-gold-400 text-[10px] font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Interactive 3D Package Deck</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-slate-100">
            Cinema Commission Tiers
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl">
            Switch between Mahakali Production packages with spatial 3D card flipping, complete
            deliverables breakdowns, and guaranteed delivery SLAs.
          </p>
        </div>

        {/* Deck Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="p-3 rounded-full bg-studio-900 hover:bg-studio-800 text-gold-400 border border-gold-500/30 hover:border-gold-400 transition-all shadow-lg cursor-pointer"
            aria-label="Previous package"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-3 rounded-full bg-studio-900 hover:bg-studio-800 text-gold-400 border border-gold-500/30 hover:border-gold-400 transition-all shadow-lg cursor-pointer"
            aria-label="Next package"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Package Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {weddingPackages.map((pkg, idx) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => {
              setDirection(idx > activeIndex ? 1 : -1);
              setActiveIndex(idx);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              activeIndex === idx
                ? 'bg-gold-500 text-studio-950 shadow-lg shadow-gold-500/20 scale-105'
                : 'bg-studio-900 text-slate-400 hover:text-slate-200 border border-studio-800'
            }`}
          >
            {pkg.name}
          </button>
        ))}
      </div>

      {/* 3D Flipping Card Stage */}
      <div className="relative w-full max-w-4xl mx-auto min-h-[500px]" style={{ perspective: 1400 }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPkg.id}
            custom={direction}
            initial={{
              rotateY: direction > 0 ? 80 : -80,
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              rotateY: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              rotateY: direction > 0 ? -80 : 80,
              opacity: 0,
              scale: 0.9,
            }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 24,
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className={`w-full rounded-3xl p-8 sm:p-12 relative overflow-hidden border shadow-2xl backdrop-blur-xl ${
              currentPkg.flagship
                ? 'bg-gradient-to-b from-studio-900 via-studio-900 to-studio-950 border-gold-500/80 shadow-gold-500/10'
                : 'bg-studio-900/90 border-gold-500/30'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Package Overview (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    {currentPkg.tierName}
                  </span>
                  {currentPkg.flagship && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-gradient-to-r from-gold-600 to-amber-400 text-studio-950">
                      Signature Master
                    </span>
                  )}
                  {currentPkg.popular && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold bg-amber-500 text-studio-950">
                      Most Chosen
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
                  {currentPkg.name}
                </h3>
                <p className="text-xs sm:text-sm text-gold-400/90 font-medium">
                  {currentPkg.tagline}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {currentPkg.summary}
                </p>

                {/* Inclusions Feature List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4">
                  {currentPkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Pricing & Turnaround SLA Box (5 Cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-studio-950/80 border border-gold-500/30 text-center flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                    Custom Investment Estimate
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-display text-gold-400">
                    {currentPkg.priceEstimate}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Format: {currentPkg.deliverables.videoFormat}
                  </div>
                </div>

                {/* Turnaround SLA Badge */}
                <div className="p-3 rounded-xl bg-studio-900 border border-studio-800 flex items-center justify-center gap-2 text-xs font-mono text-slate-300">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span>{currentPkg.deliveryLabel}</span>
                </div>

                {/* CTA Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <Link
                    to="/book-now"
                    state={{ selectedPackage: currentPkg.name }}
                    data-cursor="explore"
                    className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-studio-950 font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                  >
                    Commission This Package
                  </Link>

                  <Link
                    to="/packages"
                    className="block w-full py-2.5 px-4 rounded-xl bg-studio-900 hover:bg-studio-850 text-slate-300 border border-studio-800 text-xs font-medium text-center transition-colors"
                  >
                    View Full Catalog Comparison
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
