// ==============================================================================
// MAHAKALI PRODUCTION - Customer Review Moderation Panel
// Genuine Review Workflow: Review, Approve, Reject, Delete with Zero AI Data
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Calendar,
  Sparkles,
  ShieldAlert,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { CustomerReview } from '@/types/database';

interface ReviewsModerationPanelProps {
  reviews: CustomerReview[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReviewsModerationPanel: React.FC<ReviewsModerationPanelProps> = ({
  reviews,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121215] border border-white/10">
        <div>
          <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-white" />
            <span>Customer Review Moderation</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Only approved reviews appear publicly on the Mahakali Production homepage.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 rounded-xl bg-[#09090B] border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-400 text-black font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              filter === 'approved'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Approved Live</span>
            <span className="text-[10px] font-mono text-zinc-500">({approvedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>All ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121215] border border-white/10 max-w-lg mx-auto">
          <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            No {filter} Reviews
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {filter === 'pending'
              ? 'Zero pending reviews awaiting moderation.'
              : 'Clients can submit their genuine experiences from the homepage review modal.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => {
            const isPending = rev.status === 'pending';
            const isApproved = rev.status === 'approved';

            return (
              <div
                key={rev.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPending
                    ? 'bg-[#121215] border-amber-500/30'
                    : 'bg-[#121215] border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-white text-white' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        isApproved
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-red-950/60 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white">{rev.clientName}</h4>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {rev.eventType}
                      </span>
                    </div>

                    {rev.shootDate && (
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(rev.shootDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono text-zinc-500">
                    ID: {rev.id.slice(0, 8)}
                  </span>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(rev.id)}
                          className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-semibold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                          <span>Approve & Publish</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onReject(rev.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-400 hover:text-white text-xs uppercase transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        type="button"
                        onClick={() => onReject(rev.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#09090B] border border-white/10 text-zinc-400 hover:text-white text-xs transition-colors"
                      >
                        Unpublish
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(rev.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-[#09090B] transition-colors"
                      title="Permanently Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
