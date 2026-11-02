// ==============================================================================
// MAHAKALI PRODUCTION - Interactive DSLR Camera Photo-Print Packages Section
// Clean Minimal Initial Cards + Interactive Shutter -> DSLR Polaroid Print
// 100% Monochrome Black & White (#09090B & #121215)
// ==============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG, StudioPackage } from '@/config/brand';
import { DSLRPhotoPrintModal } from '@/components/packages/DSLRPhotoPrintModal';
import { Link } from 'react-router-dom';

export const HomePackagesSection: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<StudioPackage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDetails = (pkg: StudioPackage) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#09090B]">
      {/* Section Header with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mb-12 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121215] border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Interactive Studio Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Curated Packages
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
            Click shutter on any collection to develop full cinema deliverables & camera specifications.
          </p>
        </div>

        <Link
          to="/packages"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <span>All Packages</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* Minimal Package Cards Grid (Strictly no bulky bullet lists initially) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {BRAND_CONFIG.packages.slice(0, 4).map((pkg, index) => {
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-7 rounded-2xl bg-[#121215] border transition-all duration-300 flex flex-col justify-between group relative ${
                pkg.flagship
                  ? 'border-white/40 hover:border-white shadow-xl'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              {/* Category & Delivery Pill */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#09090B] border border-white/10 text-zinc-300 font-semibold">
                    {pkg.category === 'Wedding' ? 'Wedding Cinematography' : 'Pre-Wedding Shoot'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pkg.deliveryDays}d
                  </span>
                </div>

                {/* Package Title */}
                <h3 className="text-lg font-bold font-display uppercase tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                  {pkg.name}
                </h3>

                {/* Starting Tagline */}
                <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed line-clamp-2">
                  {pkg.tagline}
                </p>
              </div>

              {/* Bottom Interactive Shutter Button */}
              <div className="pt-6 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleOpenDetails(pkg)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#09090B] group-hover:bg-white text-zinc-200 group-hover:text-black border border-white/15 group-hover:border-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                  <span>View Details</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive DSLR Polaroid Print Modal */}
      <DSLRPhotoPrintModal
        isOpen={modalOpen}
        packageData={selectedPackage}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};
