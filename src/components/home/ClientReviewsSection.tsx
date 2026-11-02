// ==============================================================================
// MAHAKALI PRODUCTION - Client Reviews & Stories Section
// 100% Zero Fake Data & Zero AI Testimonials
// Renders ONLY Admin-approved reviews; Luxury Empty State when 0 reviews exist
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, Sparkles, Quote, Calendar, CheckCircle } from 'lucide-react';
import { useStudioData } from '@/hooks/useStudioData';
import { LeaveReviewModal } from './LeaveReviewModal';

export const ClientReviewsSection: React.FC = () => {
  const { reviews } = useStudioData();
  const [modalOpen, setModalOpen] = useState(false);

  // Strictly filter only verified approved reviews
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#09090B]">
      {/* Section Header */}
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
            <span>Verified Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Client Reviews & Stories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-light">
            Genuine words from families, couples, and brands filmed by Mahakali Production.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer shadow-md"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Leave a Review</span>
        </button>
      </motion.div>

      {/* ZERO FAKE DATA CHECK: If 0 approved reviews exist, show Luxury Empty State */}
      {approvedReviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 sm:p-14 bg-[#121215] border border-white/10 text-center max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#09090B] border border-white/15 flex items-center justify-center text-zinc-400 shadow-inner">
            <Quote className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div>
            <h3 className="text-lg font-bold font-display uppercase tracking-tight text-white">
              Be the First to Share Your Experience
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-md mx-auto">
              We uphold strict authenticity and never publish fake AI reviews. If our team covered your sacred wedding or cinematic shoot, we would love your honest review.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-2 px-6 py-2.5 rounded-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-colors"
          >
            Submit First Review &rarr;
          </button>
        </motion.div>
      ) : (
        /* Approved Reviews Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-7 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-white text-white' : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-zinc-600" />
                </div>

                {/* Review Text */}
                <p className="text-xs text-zinc-300 leading-relaxed font-light italic">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>
              </div>

              {/* Review Author & Metadata */}
              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white tracking-wide">{rev.clientName}</h4>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    {rev.eventType}
                  </span>
                </div>

                {rev.shootDate && (
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(rev.shootDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      <LeaveReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
