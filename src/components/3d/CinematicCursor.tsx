// ==============================================================================
// MAHAKALI PRODUCTION - Luxury Studio Custom Cursor (<CinematicCursor />)
// Dual-state Magnetic Lagging Ring with Damped Spring Interpolation
// Pure Monochrome (#09090B, #121215, #FFFFFF)
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CinematicCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'play' | 'drag' | 'explore'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inner dot coordinates (Instant tracking)
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 600 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600 });

  // Outer ring coordinates (Magnetic inertia lag)
  const ringX = useSpring(mouseX, { damping: 26, stiffness: 220, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 26, stiffness: 220, mass: 0.6 });

  useEffect(() => {
    // Only show on desktop pointers
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check element under cursor for data-cursor attributes
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor');
        if (type === 'play') {
          setCursorVariant('play');
          setCursorText('PLAY');
          return;
        }
        if (type === 'drag') {
          setCursorVariant('drag');
          setCursorText('DRAG');
          return;
        }
        if (type === 'explore') {
          setCursorVariant('explore');
          setCursorText('VIEW');
          return;
        }
      }

      // Check standard interactive elements
      if (target.closest('a, button, input, select, textarea, [role="button"]')) {
        setCursorVariant('hover');
        setCursorText('');
        return;
      }

      setCursorVariant('default');
      setCursorText('');
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  const isExpanded = cursorVariant === 'play' || cursorVariant === 'drag' || cursorVariant === 'explore';

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Inner White Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isExpanded ? 0 : cursorVariant === 'hover' ? 1.5 : 1,
          opacity: isExpanded ? 0 : 1,
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
      />

      {/* 2. Magnetic Lagging Outer Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isExpanded ? 80 : cursorVariant === 'hover' ? 48 : 32,
          height: isExpanded ? 80 : cursorVariant === 'hover' ? 48 : 32,
          backgroundColor:
            cursorVariant === 'play'
              ? 'rgba(255, 255, 255, 0.95)'
              : cursorVariant === 'explore'
              ? 'rgba(18, 18, 21, 0.92)'
              : cursorVariant === 'drag'
              ? 'rgba(18, 18, 21, 0.92)'
              : cursorVariant === 'hover'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.04)',
          borderColor:
            cursorVariant === 'default'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.8)',
          boxShadow: isExpanded
            ? '0 0 20px rgba(255, 255, 255, 0.3)'
            : '0 0 8px rgba(255, 255, 255, 0.1)',
        }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="fixed top-0 left-0 rounded-full border backdrop-blur-[3px] flex items-center justify-center text-center pointer-events-none"
      >
        {isExpanded && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-[9px] font-mono font-black tracking-widest uppercase leading-none px-2 ${
              cursorVariant === 'play' ? 'text-black' : 'text-white'
            }`}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};
