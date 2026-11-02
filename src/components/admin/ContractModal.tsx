// ==============================================================================
// MAHAKALI PRODUCTION - Client Studio Contract Dossier Modal
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import { OrderBooking } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface ContractModalProps {
  order: OrderBooking;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ order, onClose }) => {
  const rawPhone = (order.client?.phone || BRAND_CONFIG.contact.phone).replace(/[^0-9]/g, '');
  const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

  const advanceToken = Math.round(Number(order.total_amount) * 0.2);
  const shootDayAmount = Math.round(Number(order.total_amount) * 0.5);
  const deliveryAmount = Number(order.total_amount) - advanceToken - shootDayAmount;

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#121215] border border-white/10 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#09090B] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contract Header */}
        <div className="pb-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white border border-white/15 font-bold">
              Agreement Ref: #{order.id.slice(0, 8)}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Executed {new Date(order.created_at).toLocaleDateString('en-IN')}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display uppercase tracking-tight text-white mt-1">
            Studio Production Agreement
          </h2>
          <p className="text-xs text-zinc-400 font-medium">
            MAHAKALI PRODUCTION &bull; Shujalpur, MP &bull; Creative Direction: Vishal Giri
          </p>
        </div>

        {/* Contract Body */}
        <div className="space-y-6 mt-6 text-xs text-zinc-300">
          {/* Parties Involved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#09090B] border border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Party A (Studio)
              </span>
              <div className="font-bold text-white mt-1">{BRAND_CONFIG.brandName}</div>
              <div className="text-zinc-400 mt-0.5">Vishal Giri (Creative Director)</div>
              <div className="text-zinc-400">{BRAND_CONFIG.location.fullFormatted}</div>
              <div className="text-white font-mono mt-0.5">{BRAND_CONFIG.contact.phone}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                Party B (Client / Couple)
              </span>
              <div className="font-bold text-white mt-1">{order.client?.full_name}</div>
              <div className="text-zinc-400 mt-0.5">{order.client?.email || 'N/A'}</div>
              <div className="text-white font-mono">{order.client?.phone}</div>
              <div className="text-zinc-400 mt-0.5">
                Venue: {order.venue_location || 'Shujalpur, MP'}
              </div>
            </div>
          </div>

          {/* Event & Package Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-white mb-2">
              Scope of Work & Deliverables
            </h4>
            <div className="p-4 rounded-xl border border-white/10 bg-[#09090B] space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="font-bold text-white text-sm">{order.package_name}</span>
                <span className="font-bold text-white font-mono text-sm">
                  ₹{Number(order.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
                <div>
                  <span className="text-zinc-500">Event Type:</span> {order.event_type}
                </div>
                <div>
                  <span className="text-zinc-500">Shoot Date:</span>{' '}
                  {new Date(order.event_date).toLocaleDateString('en-IN')}
                </div>
                <div>
                  <span className="text-zinc-500">Guaranteed Delivery:</span>{' '}
                  {order.delivery_estimate_days || 40} Days SLA
                </div>
                <div>
                  <span className="text-zinc-500">Resolution:</span> 4K Ultra Cinematic
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Payment Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-white mb-2">
              Payment Milestones
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between p-2.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-300">
                <span>1st Installment: Booking Advance (20%)</span>
                <span className="font-mono font-bold text-white">
                  ₹{advanceToken.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-300">
                <span>2nd Installment: Shoot Day Clearance (50%)</span>
                <span className="font-mono font-bold text-white">
                  ₹{shootDayAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-300">
                <span>3rd Installment: Post-Production / Album Clearance (30%)</span>
                <span className="font-mono font-bold text-white">
                  ₹{deliveryAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Studio Disclaimer Notice */}
          <div className="p-3 rounded-xl bg-[#09090B] border border-white/10 text-[11px] text-zinc-400 leading-relaxed">
            <span className="font-bold text-white">Disclaimer: </span>
            {BRAND_CONFIG.disclaimer}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
