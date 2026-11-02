// ==============================================================================
// MAHAKALI PRODUCTION - Dedicated Services & Package Selector
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import {
  Film,
  Camera,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Image as ImageIcon,
  HardDrive,
  Tv,
  SlidersHorizontal,
} from 'lucide-react';
import { BRAND_CONFIG, StudioPackage } from '@/config/brand';
import { QuotationModal } from './QuotationModal';

export const PackageSelector: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Wedding' | 'Pre-Wedding'>('All');
  const [selectedPackageForQuote, setSelectedPackageForQuote] = useState<StudioPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  const filteredPackages = BRAND_CONFIG.packages.filter(
    (pkg) => activeCategory === 'All' || pkg.category === activeCategory
  );

  const handleOpenQuotation = (pkg: StudioPackage) => {
    setSelectedPackageForQuote(pkg);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Category Tabs & Interactive Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div className="inline-flex p-1 rounded-2xl bg-[#121215] border border-white/10">
          {(['All', 'Wedding', 'Pre-Wedding'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All Packages' : `${cat} Collections`}
            </button>
          ))}
        </div>

        {/* Toggle Detailed Comparison Table Button */}
        <button
          onClick={() => setShowComparisonTable(!showComparisonTable)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121215] hover:bg-zinc-800 border border-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span>{showComparisonTable ? 'Hide Specs' : 'View Specifications Matrix'}</span>
        </button>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative bg-[#121215] border ${
              pkg.flagship
                ? 'border-white shadow-2xl'
                : 'border-white/10 hover:border-white/25'
            }`}
          >
            {/* Top Pill Ribbons */}
            {pkg.flagship && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black font-bold text-[10px] uppercase font-mono tracking-widest rounded-full shadow-lg">
                Director Flagship
              </div>
            )}

            <div>
              {/* Header: Tier & Delivery Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400">
                  {pkg.tierName}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#09090B] text-zinc-300 border border-white/10">
                  <Clock className="w-3 h-3 text-white" />
                  {pkg.deliveryLabel}
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-black font-display text-white uppercase tracking-tight mb-1">
                {pkg.name}
              </h3>
              <p className="text-xs text-zinc-400 min-h-[32px]">{pkg.tagline}</p>

              {/* Price Estimate Box */}
              <div className="my-5 p-4 rounded-2xl bg-[#09090B] border border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-extrabold font-display text-white">
                    {pkg.priceEstimate}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 ml-1.5 uppercase">
                    Base Quote
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-[#121215] px-2 py-0.5 rounded border border-white/10">
                  {pkg.category}
                </span>
              </div>

              {/* Verified Catalog Deliverables Badges */}
              <div className="space-y-2.5 py-4 border-t border-b border-white/10 text-xs">
                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Camera className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Coverage:</span>
                    <span className="text-zinc-400 text-[11px]">{pkg.deliverables.coverage}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Tv className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Format:</span>
                    <span className="text-zinc-400 text-[11px]">{pkg.deliverables.videoFormat}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-300">
                  <Film className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Drone:</span>
                    <span className="text-zinc-400 text-[11px]">{pkg.deliverables.drone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-300">
                  <ImageIcon className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Albums & Frames:</span>
                    <span className="text-zinc-400 text-[11px]">
                      {pkg.deliverables.album} &bull; {pkg.deliverables.frames}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-zinc-300">
                  <HardDrive className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Storage:</span>
                    <span className="text-zinc-400 text-[11px]">{pkg.deliverables.storage}</span>
                  </div>
                </div>
              </div>

              {/* Key Features Bullet List */}
              <ul className="my-5 space-y-2">
                {pkg.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={() => handleOpenQuotation(pkg)}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all mt-4 bg-white text-black hover:bg-zinc-200 cursor-pointer"
            >
              <span>Request Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Deliverables Comparison Specification Matrix */}
      {showComparisonTable && (
        <div className="mb-16 bg-[#121215] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
              Technical Audit
            </span>
            <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white">
              Studio Deliverables Matrix
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#09090B] text-zinc-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-4 px-4">Package</th>
                  <th className="py-4 px-4">Coverage & Video</th>
                  <th className="py-4 px-4">Drone</th>
                  <th className="py-4 px-4">Albums</th>
                  <th className="py-4 px-4">Custom Frames</th>
                  <th className="py-4 px-4">Storage & Cloud</th>
                  <th className="py-4 px-4">Est. Delivery</th>
                  <th className="py-4 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {BRAND_CONFIG.packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold font-display text-white">
                      <div>{pkg.name}</div>
                      <span className="text-[10px] font-mono text-zinc-400 font-semibold">
                        {pkg.priceEstimate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      <div>{pkg.deliverables.coverage}</div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {pkg.deliverables.videoFormat}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-medium">
                      {pkg.deliverables.drone}
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      {pkg.deliverables.album}
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-medium">
                      {pkg.deliverables.frames}
                    </td>
                    <td className="py-4 px-4 text-zinc-300 font-mono text-[11px]">
                      {pkg.deliverables.storage}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-white">
                      {pkg.deliveryLabel}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleOpenQuotation(pkg)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Inquire
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prominent Booking Policy Disclaimer Notice */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09090B] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-[#121215] border border-white/10 flex items-center justify-center text-white shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
            Official Studio Booking Policy
          </div>
          <p className="text-sm font-medium text-white leading-relaxed">
            &ldquo;{BRAND_CONFIG.disclaimer}&rdquo;
          </p>
          <p className="text-xs text-zinc-400">
            For dates in Shujalpur, Bhopal, Indore, or destination venues,
            agreements specify travel logistics and deliverables.
          </p>
        </div>
      </div>

      {/* Dynamic Quotation Request Modal */}
      <QuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPackage={selectedPackageForQuote}
      />
    </div>
  );
};
