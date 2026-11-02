// ==============================================================================
// MAHAKALI PRODUCTION - Top Metrics KPI Row (4 Stat Cards)
// 100% Genuine Database Metrics, Pure Monochrome (#121215 & #09090B)
// ==============================================================================

import React from 'react';
import {
  Film,
  Camera,
  Clock,
  IndianRupee,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { OrderBooking, PaymentEMI } from '@/types/database';

interface KPICardsProps {
  orders: OrderBooking[];
  payments: PaymentEMI[];
}

export const KPICards: React.FC<KPICardsProps> = ({ orders, payments }) => {
  const totalBookings = orders.length;

  const activeShoots = orders.filter(
    (o) =>
      o.status === 'In-Production / Editing' ||
      o.status === 'Shoot In-Progress' ||
      o.status === 'Confirmed' ||
      o.status === 'In-Production'
  ).length;

  const pendingDeliveries = orders.filter(
    (o) => o.status !== 'Completed' && o.status !== 'Delivered'
  ).length;

  const pendingReceivables = orders.reduce((sum, o) => sum + Number(o.balance_due || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalSettled = Math.max(0, totalRevenue - pendingReceivables);
  const overdueCount = payments.filter((p) => p.status === 'Overdue').length;
  const completedCount = orders.filter((o) => o.status === 'Completed' || o.status === 'Delivered').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* CARD 1: Total Bookings */}
      <div className="rounded-2xl bg-[#121215] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400">
            Total Bookings
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-extrabold font-display text-white tracking-tight">
            {totalBookings}
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Ledger
          </span>
        </div>

        <div className="text-xs text-zinc-400 mt-3 flex items-center gap-1.5 font-light">
          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
          <span>
            {completedCount} commission{completedCount === 1 ? '' : 's'} completed
          </span>
        </div>
      </div>

      {/* CARD 2: Active Shoots */}
      <div className="rounded-2xl bg-[#121215] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400">
            Active Shoots
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-extrabold font-display text-white tracking-tight">
            {activeShoots}
          </div>
          {activeShoots > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/15">
              <span>In Pipeline</span>
            </span>
          )}
        </div>

        <div className="text-xs text-zinc-400 mt-3 flex items-center gap-1.5 font-light">
          <Film className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Production queue</span>
        </div>
      </div>

      {/* CARD 3: Pending Deliveries */}
      <div className="rounded-2xl bg-[#121215] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400">
            Pending Deliveries
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-extrabold font-display text-white tracking-tight">
            {pendingDeliveries}
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Queue
          </span>
        </div>

        <div className="text-xs text-zinc-400 mt-3 flex items-center gap-1.5 font-light">
          <span>Final edits & albums in progress</span>
        </div>
      </div>

      {/* CARD 4: Pending EMI & Receivables */}
      <div className="rounded-2xl bg-[#121215] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-400">
            Pending Balance
          </span>
          <div className="w-10 h-10 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            ₹{pendingReceivables.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="text-xs text-zinc-400 mt-3 flex items-center justify-between font-light">
          <span className="text-zinc-300 font-medium">
            ₹{totalSettled.toLocaleString('en-IN')} received
          </span>
          {overdueCount > 0 ? (
            <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
              {overdueCount} Overdue
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500 font-mono">Up to date</span>
          )}
        </div>
      </div>
    </div>
  );
};
