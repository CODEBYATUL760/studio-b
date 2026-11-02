// ==============================================================================
// MAHAKALI PRODUCTION - Ambient Studio Background
// 60FPS Subtle Floating Cinema Objects (Apertures, Film Strips, Viewfinder HUD, Bokeh)
// GPU Accelerated, pointer-events-none, strictly zero horizontal overflow
// ==============================================================================

import React from 'react';
import { motion } from 'framer-motion';

export const AmbientStudioBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none will-change-transform"
    >
      {/* 1. Subtle Radial Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.015] blur-[140px] pointer-events-none" />
      <div className="absolute top-3/4 left-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />

      {/* 2. Rotating Aperture Blades Ring (Top Right) */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -18, 0],
          x: [0, 10, 0],
        }}
        transition={{
          rotate: { duration: 55, repeat: Infinity, ease: 'linear' },
          y: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[8%] -right-16 sm:right-10 w-72 h-72 sm:w-96 sm:h-96 opacity-[0.045] text-white"
      >
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current">
          <circle cx="100" cy="100" r="90" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="70" strokeWidth="0.6" />
          <circle cx="100" cy="100" r="45" strokeWidth="1" />
          {/* 8 Aperture Iris Blades */}
          <path d="M100 30 L140 75 L100 100" strokeWidth="0.75" />
          <path d="M170 100 L125 140 L100 100" strokeWidth="0.75" />
          <path d="M100 170 L60 125 L100 100" strokeWidth="0.75" />
          <path d="M30 100 L75 60 L100 100" strokeWidth="0.75" />
          <path d="M149 51 L110 115 L100 100" strokeWidth="0.75" />
          <path d="M149 149 L85 110 L100 100" strokeWidth="0.75" />
          <path d="M51 149 L90 85 L100 100" strokeWidth="0.75" />
          <path d="M51 51 L115 90 L100 100" strokeWidth="0.75" />
          {/* Center Aperture Opening */}
          <polygon
            points="100,75 118,83 125,100 118,117 100,125 82,117 75,100 82,83"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />
        </svg>
      </motion.div>

      {/* 3. Floating 35mm Cinema Film Strip (Left Middle) */}
      <motion.div
        animate={{
          y: [-25, 25, -25],
          x: [-10, 15, -10],
          rotate: [-4, 4, -4],
        }}
        transition={{
          y: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-[42%] -left-12 sm:left-6 w-36 sm:w-48 h-80 opacity-[0.04] text-white"
      >
        <svg viewBox="0 0 100 240" fill="none" className="w-full h-full stroke-current">
          {/* Film Strip Outline */}
          <rect x="10" y="5" width="80" height="230" rx="3" strokeWidth="1" />
          {/* Sprocket Holes Left */}
          {[15, 35, 55, 75, 95, 115, 135, 155, 175, 195, 215].map((y) => (
            <rect key={`l-${y}`} x="14" y={y} width="7" height="10" rx="1.5" strokeWidth="0.7" />
          ))}
          {/* Sprocket Holes Right */}
          {[15, 35, 55, 75, 95, 115, 135, 155, 175, 195, 215].map((y) => (
            <rect key={`r-${y}`} x="79" y={y} width="7" height="10" rx="1.5" strokeWidth="0.7" />
          ))}
          {/* Frames */}
          <rect x="25" y="20" width="50" height="42" rx="1" strokeWidth="0.8" />
          <rect x="25" y="72" width="50" height="42" rx="1" strokeWidth="0.8" />
          <rect x="25" y="124" width="50" height="42" rx="1" strokeWidth="0.8" />
          <rect x="25" y="176" width="50" height="42" rx="1" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* 4. Drifting Viewfinder Focus HUD Brackets [ + ] (Bottom Right) */}
      <motion.div
        animate={{
          scale: [0.96, 1.04, 0.96],
          y: [0, 20, 0],
          x: [0, -12, 0],
        }}
        transition={{
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 19, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-[18%] right-8 sm:right-24 w-44 h-44 sm:w-60 sm:h-60 opacity-[0.055] text-white"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
          {/* 4 Corner Focus Brackets */}
          <path d="M15 30 L15 15 L30 15" strokeWidth="1.2" strokeLinecap="square" />
          <path d="M85 30 L85 15 L70 15" strokeWidth="1.2" strokeLinecap="square" />
          <path d="M15 70 L15 85 L30 85" strokeWidth="1.2" strokeLinecap="square" />
          <path d="M85 70 L85 85 L70 85" strokeWidth="1.2" strokeLinecap="square" />
          {/* Center Crosshair [ + ] */}
          <line x1="50" y1="42" x2="50" y2="58" strokeWidth="1" />
          <line x1="42" y1="50" x2="58" y2="50" strokeWidth="1" />
          <circle cx="50" cy="50" r="14" strokeWidth="0.8" strokeDasharray="2 3" />
          {/* 4K / 24FPS HUD Markings */}
          <text x="22" y="27" fill="currentColor" stroke="none" fontSize="4.5" fontFamily="monospace">
            4K RAW
          </text>
          <text x="62" y="27" fill="currentColor" stroke="none" fontSize="4.5" fontFamily="monospace">
            24.0 FPS
          </text>
          <text x="22" y="78" fill="currentColor" stroke="none" fontSize="4.5" fontFamily="monospace">
            ISO 400
          </text>
          <text x="62" y="78" fill="currentColor" stroke="none" fontSize="4.5" fontFamily="monospace">
            f/1.4
          </text>
        </svg>
      </motion.div>

      {/* 5. Soft Bokeh Light Orb 1 (Top Left) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.03, 0.07, 0.03],
          x: [-15, 20, -15],
          y: [-10, 25, -10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[20%] left-[10%] w-44 h-44 rounded-full bg-white blur-3xl pointer-events-none"
      />

      {/* 6. Soft Bokeh Light Orb 2 (Lower Right) */}
      <motion.div
        animate={{
          scale: [1.2, 0.9, 1.2],
          opacity: [0.04, 0.08, 0.04],
          x: [15, -20, 15],
          y: [20, -15, 20],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[28%] right-[14%] w-60 h-60 rounded-full bg-white blur-3xl pointer-events-none"
      />
    </div>
  );
};
