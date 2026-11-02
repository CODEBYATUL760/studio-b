// ==============================================================================
// MAHAKALI PRODUCTION - Genuine Customer Review Submission Modal
// 100% Zero Fake Data: Submitted by real clients and moderated by Admin
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useStudioData } from '@/hooks/useStudioData';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({ isOpen, onClose }) => {
  const { submitReview } = useStudioData();

  const [clientName, setClientName] = useState('');
  const [eventType, setEventType] = useState('Wedding Cinematography');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [shootDate, setShootDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !reviewText.trim()) return;
    setLoading(true);

    try {
      submitReview({
        clientName: clientName.trim(),
        eventType,
        rating,
        reviewText: reviewText.trim(),
        shootDate: shootDate || new Date().toISOString().split('T')[0],
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Average', 'Good', 'Exceptional', 'Cinematic Masterpiece'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 w-full max-w-lg bg-[#09090B] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#121215] border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-tight text-white">
                Review Submitted
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{clientName}</span>! Your honest feedback has been submitted to the Mahakali Production desk and will appear after director verification.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121215] border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Genuine Client Voice</span>
                </div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white">
                  Leave a Review
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Share your experience with Vishal Giri & the Mahakali Production cinematography crew.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating Selector */}
                <div className="text-center py-2 bg-[#121215] border border-white/10 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Your Rating &bull; {ratingLabels[hoverRating || rating]}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 text-white hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled ? 'fill-white text-white' : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                    Your Full Name / Couple Names
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Radhika & Kunal"
                    className="w-full px-4 py-2.5 bg-[#121215] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Shoot Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Wedding Cinematography">Wedding Cinematography</option>
                      <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
                      <option value="Candid Photography">Candid Photography</option>
                      <option value="Commercial Production">Commercial Production</option>
                      <option value="Ring Ceremony / Engagement">Ring Ceremony / Engagement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Shoot Date
                    </label>
                    <input
                      type="date"
                      value={shootDate}
                      onChange={(e) => setShootDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                    Your Honest Experience
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe the filming experience, camera team direction, prompt delivery, or overall emotion..."
                    className="w-full px-4 py-3 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit for Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
