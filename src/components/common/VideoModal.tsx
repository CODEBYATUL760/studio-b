// ==============================================================================
// MAHAKALI PRODUCTION - 4K Cinematic Reel Lightbox Modal
// ==============================================================================

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Maximize2, Sparkles, Film } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  category?: string;
  videoUrl?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  category,
}) => {
  const [isMuted, setIsMuted] = React.useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center bg-studio-950/95 backdrop-blur-xl p-4 sm:p-8"
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl rounded-3xl bg-studio-900 border border-gold-500/40 shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-studio-950/80 border-b border-studio-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold font-display uppercase text-slate-100">
                      {title}
                    </h3>
                    {category && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
                        {category}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Directed by {BRAND_CONFIG.founder} &bull; True Asli 4K Master
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-studio-900 hover:bg-studio-850 text-slate-300 border border-studio-700 hover:border-gold-500/50 transition-colors"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold-400" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-studio-900 hover:bg-studio-850 text-slate-300 border border-studio-700 hover:border-gold-500/50 transition-colors"
                  title="Close Preview (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Canvas Container (16:9 Aspect Ratio) */}
            <div className="relative aspect-video bg-[#0A0A0B] overflow-hidden flex items-center justify-center">
              {/* Cinematic Studio Visualizer Canvas */}
              <div className="absolute inset-0 bg-gradient-to-t from-studio-950 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Ambient Studio Aperture Graphic */}
              <div className="relative z-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4 animate-pulse-subtle">
                  <Film className="w-10 h-10 text-gold-400" />
                </div>
                <div className="text-lg font-bold font-display uppercase tracking-widest text-[#F8F9FA]">
                  {title}
                </div>
                <div className="text-xs font-mono text-gold-400 mt-1">
                  True Asli 4K DCI • Uncompressed Master Reel
                </div>
              </div>

              <div className="absolute inset-0 film-vignette pointer-events-none" />

              {/* Watermark & Live Timecode */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-200 uppercase bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  4K DCI &bull; 24.00 FPS &bull; S-LOG3
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-xs text-slate-300">
                <span className="font-mono text-[11px] text-gold-400">
                  {subtitle || 'The Royal Heritage Vows &bull; Udaipur Palace'}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  MAHAKALI PRODUCTION STUDIO &bull; SHUJALPUR
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
