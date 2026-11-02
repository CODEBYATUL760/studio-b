// ==============================================================================
// MAHAKALI PRODUCTION - Selected Works (3D Holographic Perspective Showcase)
// Pure Monochrome: 100% Real Media, Tilt Mechanics, Zero Clutter
// ==============================================================================

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Aperture, Plus } from 'lucide-react';
import { VideoModal } from '@/components/common/VideoModal';
import { useStudioData } from '@/hooks/useStudioData';
import { PortfolioItem } from '@/types/database';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Wedding', 'Pre-Wedding', 'Teaser'] as const;

// 3D Perspective Card
const PerspectiveCard: React.FC<{
  item: PortfolioItem;
  onPlay: () => void;
}> = ({ item, onPlay }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);

    const glareXPercent = (x / rect.width) * 100;
    const glareYPercent = (y / rect.height) * 100;
    setGlare({ x: glareXPercent, y: glareYPercent, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-[400px] cursor-pointer"
      onClick={onPlay}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
          scale: rotateX !== 0 || rotateY !== 0 ? 1.02 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-[#121215] border border-white/10 hover:border-white/25 transition-all duration-300 group"
      >
        {/* Media Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#09090B]">
          {item.media_url ? (
            <img
              src={item.media_url}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 group-hover:brightness-90 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#121215]">
              <Aperture className="w-12 h-12 text-zinc-600 animate-spin-slow" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-transparent" />
        </div>

        {/* Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 300px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.2), transparent 70%)`,
          }}
        />

        {/* Category Pill Top Left */}
        <div className="absolute top-5 left-5 z-20">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#09090B]/80 border border-white/10 text-white backdrop-blur-md">
            {item.category}
          </span>
        </div>

        {/* Play Icon Center */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>

        {/* 2-Word Title Overlay on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-6 z-20 bg-gradient-to-t from-[#09090B] to-transparent">
          <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:translate-x-1 transition-transform">
            {item.title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
};

export const Showcase3DTilt: React.FC = () => {
  const { portfolioItems } = useStudioData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = portfolioItems.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="portfolio-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 bg-[#09090B]">
      {/* Header: Title + Category Pills ONLY (0 paragraph descriptions) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-6 border-b border-white/10">
        <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
          Selected Works
        </h2>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-white text-black font-medium'
                  : 'bg-[#121215] text-zinc-400 border border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Clean Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <PerspectiveCard
              key={item.id}
              item={item}
              onPlay={() => setSelectedItem(item)}
            />
          ))}
        </div>
      ) : (
        /* Minimal Empty State */
        <div className="rounded-2xl p-12 bg-[#121215] border border-white/10 text-center">
          <div className="w-14 h-14 rounded-full bg-[#09090B] border border-white/10 flex items-center justify-center text-white mx-auto mb-4">
            <Aperture className="w-7 h-7 animate-spin-slow" />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
            No Media Uploaded
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-6">
            Upload genuine work from the Admin Panel to showcase here.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-xs uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Work</span>
          </Link>
        </div>
      )}

      {/* Video Modal Trigger */}
      <VideoModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || 'Mahakali Production Film'}
        subtitle={selectedItem?.couples}
        category={selectedItem?.category}
      />
    </section>
  );
};
