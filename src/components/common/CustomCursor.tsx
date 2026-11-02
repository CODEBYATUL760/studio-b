// ==============================================================================
// MAHAKALI PRODUCTION - Awwwards-style Interactive Custom Cursor
// Follows cursor with spring physics and morphs on interactive elements
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState<string>('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'play' | 'drag'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only activate cursor on desktop pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;

      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor');
        if (type === 'play') {
          setCursorVariant('play');
          setCursorText('PLAY');
        } else if (type === 'explore') {
          setCursorVariant('hover');
          setCursorText('VIEW');
        } else if (type === 'drag') {
          setCursorVariant('drag');
          setCursorText('DRAG');
        } else {
          setCursorVariant('hover');
          setCursorText('');
        }
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveMouse);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Trailing Ring / Pill */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'default' ? 36 : cursorVariant === 'play' || cursorVariant === 'drag' ? 72 : 56,
          height: cursorVariant === 'default' ? 36 : cursorVariant === 'play' || cursorVariant === 'drag' ? 72 : 56,
          backgroundColor:
            cursorVariant === 'play'
              ? 'rgba(229, 184, 59, 0.95)'
              : cursorVariant === 'drag'
              ? 'rgba(24, 27, 35, 0.9)'
              : cursorVariant === 'hover'
              ? 'rgba(229, 184, 59, 0.2)'
              : 'rgba(229, 184, 59, 0.08)',
          borderColor:
            cursorVariant === 'default'
              ? 'rgba(229, 184, 59, 0.4)'
              : 'rgba(229, 184, 59, 0.9)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="rounded-full border backdrop-blur-[2px] flex items-center justify-center text-center shadow-lg pointer-events-none"
      >
        {cursorText && (
          <span
            className={`font-mono text-[10px] font-extrabold tracking-widest ${
              cursorVariant === 'play' ? 'text-studio-950' : 'text-gold-400'
            }`}
          >
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Tiny Center Dot for precision */}
      {cursorVariant === 'default' && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="w-1.5 h-1.5 rounded-full bg-gold-400 pointer-events-none"
        />
      )}
    </div>
  );
};
