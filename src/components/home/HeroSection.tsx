// ==============================================================================
// MAHAKALI PRODUCTION - Ultra-Clean Monochrome Hero Section
// Pure Minimalist Architecture: Headline (max 6 words), Subtitle (under 10 words), 2 CTAs
// ==============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hero3DCanvas } from '@/components/3d/Hero3DCanvas';

export const HeroSection: React.FC = () => {
  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] w-full flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#09090B]">
      {/* Interactive 3D Three.js R3F Canvas */}
      <div className="absolute inset-0 z-0">
        <Hero3DCanvas />
        <div className="absolute inset-0 bg-[#09090B]/60 pointer-events-none" />
      </div>

      {/* Center High-Impact Typography */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center my-auto py-12">
        {/* Headline: strictly max 6 words */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white uppercase leading-[1.05]"
        >
          Visual Stories. <br />
          Crafted in Cinema.
        </motion.h1>

        {/* Subtitle: strictly 1 single sentence under 10 words */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-lg mx-auto font-light leading-relaxed"
        >
          Luxury wedding films and candid photography by Mahakali Production.
        </motion.p>

        {/* Strictly 2 Buttons: Solid White & Ghost */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/book-now"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-xs uppercase tracking-widest transition-all duration-300"
          >
            Book a Shoot
          </Link>

          <button
            onClick={scrollToPortfolio}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent text-white border border-white/20 hover:bg-white/5 font-medium text-xs uppercase tracking-widest transition-all duration-300"
          >
            View Work
          </button>
        </motion.div>
      </div>
    </section>
  );
};
