// ==============================================================================
// MAHAKALI PRODUCTION - Staff Access & Gatekeeper Moderation Panel
// Strict Single-Admin Approval Workflow: Grant / Revoke Staff Credentials
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Phone,
  Mail,
  Camera,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';
import { StaffRequest } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface StaffApprovalsPanelProps {
  staffRequests: StaffRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StaffApprovalsPanel: React.FC<StaffApprovalsPanelProps> = ({
  staffRequests,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  const pendingCount = staffRequests.filter((s) => s.status === 'pending').length;
  const approvedCount = staffRequests.filter((s) => s.status === 'approved').length;

  const filtered = staffRequests.filter((s) => {
    if (filter === 'pending') return s.status === 'pending';
    if (filter === 'approved') return s.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121215] border border-white/10">
        <div>
          <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-white" />
            <span>Staff Access & Single-Admin Gatekeeper</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sole Administrator: <span className="text-white font-semibold">{BRAND_CONFIG.founder}</span>. Approve crew members to grant studio console privileges.
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
            <span>Pending Requests</span>
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
            <span>Active Staff</span>
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
            <span>All ({staffRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Staff List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#121215] border border-white/10 max-w-lg mx-auto">
          <Camera className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Zero {filter === 'pending' ? 'Pending' : 'Staff'} Records
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {filter === 'pending'
              ? 'No crew access requests are waiting for approval.'
              : 'New production team applicants can request credentials via the login portal.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((staff) => {
            const isPending = staff.status === 'pending';
            const isApproved = staff.status === 'approved';

            return (
              <div
                key={staff.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPending
                    ? 'bg-[#121215] border-amber-500/30 shadow-md'
                    : isApproved
                    ? 'bg-[#121215] border-white/15'
                    : 'bg-[#121215] border-white/5 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#09090B] border border-white/10 text-zinc-300 font-bold">
                      {staff.requestedRole}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        isApproved
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-red-950/60 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display uppercase tracking-tight text-white">
                    {staff.fullName}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="font-mono text-zinc-300 truncate">{staff.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="font-mono text-zinc-300">{staff.phone}</span>
                    </div>
                  </div>

                  {staff.reason && (
                    <div className="mt-3 p-3 rounded-xl bg-[#09090B] border border-white/5 text-xs text-zinc-300 font-light">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                        Statement:
                      </span>
                      &ldquo;{staff.reason}&rdquo;
                    </div>
                  )}

                  <div className="mt-3 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                    <span>Requested: {new Date(staff.createdAt).toLocaleDateString()}</span>
                    {staff.approvedAt && (
                      <span className="text-emerald-400">
                        Approved by {staff.reviewedBy || 'Vishal Giri'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Single-Admin Gatekeeper Actions */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <a
                    href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${staff.fullName}! Vishal Giri from Mahakali Production regarding your studio access request.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="WhatsApp Staff"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </a>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(staff.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Access</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onReject(staff.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-400 hover:text-white text-xs uppercase transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        type="button"
                        onClick={() => onReject(staff.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Revoke Access
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDelete(staff.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete record"
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
