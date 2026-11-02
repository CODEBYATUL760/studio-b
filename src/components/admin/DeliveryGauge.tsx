// ==============================================================================
// MAHAKALI PRODUCTION - Real Deliverables & Completion Gauge
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React from 'react';
import { ShieldCheck, Aperture } from 'lucide-react';
import { OrderBooking } from '@/types/database';

interface DeliveryGaugeProps {
  orders: OrderBooking[];
}

export const DeliveryGauge: React.FC<DeliveryGaugeProps> = ({ orders }) => {
  const total = orders.length;
  const completedOrders = orders.filter(
    (o) => o.status === 'Completed' || o.status === 'Delivered'
  );
  
  const rate = total > 0 ? Math.round((completedOrders.length / total) * 100) : 0;

  // Real deliverables counts
  const albumsCount = orders.filter((o) => o.deliverables?.albums || o.deliverables?.albumPrinted).length;
  const teaserCount = orders.filter((o) => o.deliverables?.reelEdits || o.deliverables?.teaserReady).length;
  const usbCount = orders.filter((o) => o.deliverables?.penDrives || o.deliverables?.penDriveDispatched).length;

  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
            Delivery Performance
          </h3>
          <p className="text-[11px] text-zinc-400 font-light">
            Live Turnaround Rate & Milestone SLA
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#09090B] border border-white/10 flex items-center justify-center text-white">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      {total > 0 ? (
        <>
          {/* Semi-circular SVG Gauge */}
          <div className="flex flex-col items-center justify-center pt-6 pb-2">
            <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
              <svg className="w-48 h-48 -rotate-180" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#27272A"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-3xl font-black font-display text-white tracking-tight">
                  {rate}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#09090B] px-2 py-0.5 rounded-full border border-white/15">
                  Fulfilled
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mt-2 text-center font-light">
              {completedOrders.length} of {total} orders delivered
            </p>
          </div>

          {/* Deliverables Pipeline Tracker Real Counts */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1 font-medium">
                <span>Photo Albums Printed</span>
                <span className="font-mono text-white font-bold">
                  {albumsCount} / {total}
                </span>
              </div>
              <div className="w-full bg-[#09090B] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (albumsCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1 font-medium">
                <span>4K Master Teasers & Reels</span>
                <span className="font-mono text-white font-bold">
                  {teaserCount} / {total}
                </span>
              </div>
              <div className="w-full bg-[#09090B] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-zinc-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (teaserCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1 font-medium">
                <span>Master USB Drives Dispatched</span>
                <span className="font-mono text-white font-bold">
                  {usbCount} / {total}
                </span>
              </div>
              <div className="w-full bg-[#09090B] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-zinc-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (usbCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-zinc-400 space-y-2">
          <Aperture className="w-8 h-8 text-zinc-600 mx-auto animate-spin-slow" />
          <div className="text-xs font-semibold text-white">No Orders Recorded Yet</div>
          <p className="text-[11px] text-zinc-500 font-light">
            When shoot commissions are logged, turnaround percentages calculate in real time.
          </p>
        </div>
      )}
    </div>
  );
};
