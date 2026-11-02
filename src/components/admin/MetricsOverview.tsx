// ==============================================================================
// MAHAKALI PRODUCTION - Executive Metrics Bar
// High-level operational & financial telemetry
// ==============================================================================

import React from 'react';
import {
  Film,
  Camera,
  Clock,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react';
import { OrderBooking, PaymentEMI } from '@/types/database';

interface MetricsOverviewProps {
  orders: OrderBooking[];
  payments: PaymentEMI[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ orders, payments }) => {
  // 1. Total Bookings
  const totalBookings = orders.length;

  // 2. Active Shoots (Shoots In-Progress or Confirmed awaiting shoot day)
  const activeShoots = orders.filter(
    (o) => o.status === 'Shoot In-Progress' || o.status === 'Confirmed' || o.status === 'In-Production'
  ).length;

  // 3. Pending Order Delivery (Shoots in Post-Production or awaiting final handover)
  const pendingDeliveries = orders.filter(
    (o) => o.status === 'Post-Production' || o.status === 'In-Production' || (o.status !== 'Delivered' && o.status !== 'Completed')
  ).length;

  // 4. Total Revenue (Gross value of all contracted packages)
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // 5. Pending Receivables / EMI (Outstanding balances across all client productions)
  const pendingReceivables = orders.reduce((sum, o) => sum + Number(o.balance_due || 0), 0);

  // Additional calculated metrics
  const totalCollected = Math.max(0, totalRevenue - pendingReceivables);
  const overdueCount = payments.filter((p) => p.status === 'Overdue').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered' || o.status === 'Completed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* 1. Total Bookings */}
      <div className="relative overflow-hidden rounded-2xl bg-studio-900/90 border border-studio-800 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-gold-500/30">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Total Bookings
          </span>
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-display text-slate-100 tracking-tight">
          {totalBookings}
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">{deliveredCount}</span> delivered & settled
        </div>
      </div>

      {/* 2. Active Shoots */}
      <div className="relative overflow-hidden rounded-2xl bg-studio-900/90 border border-studio-800 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-amber-500/30">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90">
            Active Shoots
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Camera className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-display text-amber-400 tracking-tight">
          {activeShoots}
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Dual-crew on location</span>
        </div>
      </div>

      {/* 3. Pending Order Delivery */}
      <div className="relative overflow-hidden rounded-2xl bg-studio-900/90 border border-studio-800 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-sky-500/30">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400/90">
            Pending Delivery
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-display text-sky-400 tracking-tight">
          {pendingDeliveries}
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <Film className="w-3.5 h-3.5 text-sky-400" />
          <span>Color grade & album binding</span>
        </div>
      </div>

      {/* 4. Total Revenue */}
      <div className="relative overflow-hidden rounded-2xl bg-studio-900/90 border border-gold-500/20 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-gold-500/40">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400">
            Total Revenue
          </span>
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-display text-slate-100 tracking-tight">
          ₹{totalRevenue.toLocaleString('en-IN')}
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold">₹{totalCollected.toLocaleString('en-IN')}</span>
          <span className="text-slate-500">cleared</span>
        </div>
      </div>

      {/* 5. Pending Receivables / EMI */}
      <div className="relative overflow-hidden rounded-2xl bg-studio-900/90 border border-studio-800 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-gold-500/30">
        <div className="flex items-center justify-between text-slate-400 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Pending Receivables
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold font-display text-gold-400 tracking-tight">
          ₹{pendingReceivables.toLocaleString('en-IN')}
        </div>
        <div className="text-[11px] text-slate-400 mt-2">
          {overdueCount > 0 ? (
            <span className="text-red-400 font-semibold">{overdueCount} installment overdue</span>
          ) : (
            <span className="text-slate-500">All installments on schedule</span>
          )}
        </div>
      </div>
    </div>
  );
};
