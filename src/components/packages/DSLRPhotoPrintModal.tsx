// ==============================================================================
// MAHAKALI PRODUCTION - DSLR Camera Photo-Print Interactive Modal
// Cinema Shutter Animation -> Flash Strobe -> Polaroid Ejection Spring -> Developing Image
// Pure Dark Aesthetic: #09090B, #121215, border-white/10
// 100% Mobile First Smooth 60FPS
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  HardDrive,
  Film,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { StudioPackage, BRAND_CONFIG } from '@/config/brand';
import { useNavigate } from 'react-router-dom';

interface DSLRPhotoPrintModalProps {
  packageData: StudioPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DSLRPhotoPrintModal: React.FC<DSLRPhotoPrintModalProps> = ({
  packageData,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [shutterTriggered, setShutterTriggered] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isDeveloped, setIsDeveloped] = useState(false);

  // Trigger shutter cycle upon modal open
  useEffect(() => {
    if (isOpen && packageData) {
      setShutterTriggered(false);
      setIsFlashing(false);
      setIsDeveloped(false);

      // Trigger shutter contract at 150ms
      const shutterTimer = setTimeout(() => {
        setShutterTriggered(true);
        setIsFlashing(true);
      }, 200);

      // Stop flash after 250ms
      const flashTimer = setTimeout(() => {
        setIsFlashing(false);
      }, 450);

      // Develop film after ejection arrives (approx 850ms)
      const developTimer = setTimeout(() => {
        setIsDeveloped(true);
      }, 950);

      return () => {
        clearTimeout(shutterTimer);
        clearTimeout(flashTimer);
        clearTimeout(developTimer);
      };
    }
  }, [isOpen, packageData]);

  if (!isOpen || !packageData) return null;

  const handleBookNow = () => {
    onClose();
    navigate(`/book-now?package=${encodeURIComponent(packageData.id)}`);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Vishal Giri / Mahakali Production! I am interested in booking the "${packageData.name}" package (${packageData.tierName}). Could you please share availability?`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Screen Flash Strobe Effect */}
        <AnimatePresence>
          {isFlashing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 w-full max-w-lg bg-[#09090B] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#121215] border border-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close Package Details"
          >
            <X className="w-4 h-4" />
          </button>

          {/* TOP SECTION: DSLR Cinema Camera Vector Illustration Rig */}
          <div className="relative w-full pb-4 border-b border-white/10 mb-4 flex flex-col items-center">
            {/* Camera Housing */}
            <div className="relative w-64 sm:w-72 h-28 bg-[#121215] border border-white/20 rounded-2xl p-3 flex items-center justify-between shadow-inner">
              {/* Top Viewfinder Prism & Dial */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#18181D] border-t border-x border-white/20 rounded-t-md flex items-center justify-center">
                <span className="text-[7px] font-mono uppercase tracking-widest text-zinc-500">
                  4K REC
                </span>
              </div>

              {/* Red Tally LED Dot */}
              <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    shutterTriggered ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-900/60'
                  }`}
                />
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500">
                  {shutterTriggered ? 'EXPOSING' : 'READY'}
                </span>
              </div>

              {/* Tactile Hotshoe Shutter Button on Top Right */}
              <div
                className={`absolute -top-2.5 right-6 w-7 h-3 rounded-t-sm border-t border-x border-white/30 transition-transform ${
                  shutterTriggered ? 'translate-y-1 bg-zinc-300' : 'bg-zinc-600'
                }`}
              />

              {/* Center Lens Barrel with Aperture Iris Mechanism */}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-[#09090B] border-2 border-white/30 p-1.5 shadow-2xl flex items-center justify-center">
                {/* Outer Lens Markings */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_40s_linear_infinite]" />

                {/* Aperture Iris Blades */}
                <motion.div
                  animate={{
                    scale: shutterTriggered ? 0.35 : 1,
                    rotate: shutterTriggered ? 45 : 0,
                  }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-full bg-[#18181D] border border-white/40 flex items-center justify-center relative overflow-hidden"
                >
                  {/* Iris polygon */}
                  <div className="w-6 h-6 bg-[#09090B] border border-white/60 rotate-45" />
                </motion.div>

                {/* Lens Coating Reflection Glint */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right Grip Texture */}
              <div className="w-7 h-18 bg-[#09090B] border border-white/10 rounded-lg flex flex-col justify-around py-1 px-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-0.5 bg-white/15 rounded-full" />
                ))}
              </div>
            </div>

            {/* Ejection Slot Line */}
            <div className="w-56 h-1.5 bg-[#050507] border-x border-b border-white/15 rounded-b-md mx-auto -mt-0.5" />
          </div>

          {/* MIDDLE SECTION: High-Gloss Polaroid Film Ejection with Spring Physics */}
          <motion.div
            initial={{ y: -160, opacity: 0 }}
            animate={{
              y: shutterTriggered ? 0 : -160,
              opacity: shutterTriggered ? 1 : 0,
            }}
            transition={{
              type: 'spring',
              damping: 17,
              stiffness: 120,
              delay: 0.1,
            }}
            className="w-full bg-[#121215] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl relative"
          >
            {/* Developing Photo Visual Frame */}
            <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-[#09090B] border border-white/10 flex flex-col justify-between p-3.5">
              {/* Developing image backdrop simulation */}
              <motion.div
                animate={{
                  filter: isDeveloped
                    ? 'blur(0px) grayscale(0%) contrast(105%)'
                    : 'blur(12px) grayscale(100%) contrast(80%)',
                  opacity: isDeveloped ? 1 : 0.6,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-[#121215] to-[#09090B]"
              />

              {/* Studio Archive Watermark */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-400">
                <span className="flex items-center gap-1 uppercase font-bold text-white">
                  <Sparkles className="w-3 h-3 text-white" />
                  {packageData.category}
                </span>
                <span className="text-zinc-500 font-mono">
                  {packageData.deliveryLabel}
                </span>
              </div>

              {/* Package Title on Polaroid */}
              <div className="relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  {packageData.tierName}
                </span>
                <h3 className="text-lg sm:text-xl font-black font-display uppercase tracking-tight text-white mt-0.5">
                  {packageData.name}
                </h3>
                <p className="text-xs text-zinc-300 font-light mt-0.5 line-clamp-1">
                  {packageData.tagline}
                </p>
              </div>

              {/* Polaroid Bottom Timestamp Stamp */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-mono text-zinc-400">
                <span>CINEMA ARCHIVE &bull; SHUJALPUR</span>
                <span className="text-white font-bold">{packageData.priceEstimate}</span>
              </div>
            </div>

            {/* Deliverables Checklist (Revealed below) */}
            <div className="mt-4 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between border-b border-white/10 pb-1.5">
                <span>Deliverables & Equipment Specs</span>
                <span className="text-white font-bold">Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">{packageData.deliverables.videoFormat}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">{packageData.deliverables.coverage}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">{packageData.deliverables.drone}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">{packageData.deliverables.album}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">{packageData.deliverables.storage}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">{packageData.deliverables.frames}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full py-2.5 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <span>Book This Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`${BRAND_CONFIG.contact.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#09090B] border border-white/15 text-white hover:bg-white/5 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
