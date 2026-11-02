// ==============================================================================
// MAHAKALI PRODUCTION - EMI & Payment Tracking Widget
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import {
  CreditCard,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Aperture,
} from 'lucide-react';
import { OrderBooking, PaymentEMI } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface EMITrackerProps {
  orders: OrderBooking[];
  payments: PaymentEMI[];
  onToggleStatus: (paymentId: string, customRef?: string) => void;
}

export const EMITracker: React.FC<EMITrackerProps> = ({
  orders,
  payments,
  onToggleStatus,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const orderPayments = payments
    .filter((p) => p.order_id === selectedOrder?.id)
    .sort((a, b) => a.installment_no - b.installment_no);

  const totalContract = Number(selectedOrder?.total_amount || 0);
  const totalBalanceDue = Number(selectedOrder?.balance_due || 0);
  const totalSettled = Math.max(0, totalContract - totalBalanceDue);

  const sendEmiReminder = (payment: PaymentEMI) => {
    const rawPhone = (selectedOrder?.client?.phone || BRAND_CONFIG.contact.phone).replace(
      /[^0-9]/g,
      ''
    );
    const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const text = encodeURIComponent(
      `Hello ${selectedOrder?.client?.full_name || 'Client'},\n\nPayment Milestone Reminder from MAHAKALI PRODUCTION:\nInstallment: ${
        payment.milestone_name || `Installment #${payment.installment_no}`
      }\nAmount: ₹${Number(payment.amount).toLocaleString(
        'en-IN'
      )}\nDue Date: ${new Date(payment.due_date).toLocaleDateString(
        'en-IN'
      )}\nOrder Ref: #${selectedOrder?.id.slice(0, 8)}\n\nBank Account: MAHAKALI PRODUCTION\nHDFC Bank, Shujalpur\nUPI: ${BRAND_CONFIG.contact.phoneRaw}@upi\n\nThank you!`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const copyBankDetails = () => {
    const text = `MAHAKALI PRODUCTION\nBank: HDFC Bank, Shujalpur\nA/C: 50200087198787\nIFSC: HDFC0001928\nUPI: ${BRAND_CONFIG.contact.phoneRaw}@upi`;
    navigator.clipboard.writeText(text);
    setCopiedId('bank');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
            EMI & Milestone Tracker
          </h3>
        </div>
        <div className="py-8 text-center text-zinc-400 space-y-2">
          <Aperture className="w-8 h-8 text-zinc-600 mx-auto animate-spin-slow" />
          <div className="text-xs font-semibold text-white">No Active Production Selected</div>
          <p className="text-[11px] text-zinc-400 font-light">
            When bookings are confirmed, milestone schedules appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
              EMI & Milestone Tracker
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#09090B] text-zinc-300 border border-white/10">
              3-Stage
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-light">
            Token advance, shoot day & album delivery clearance
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#09090B] border border-white/10 flex items-center justify-center text-white">
          <CreditCard className="w-4 h-4" />
        </div>
      </div>

      {/* Client Selector Dropdown */}
      <div className="mt-4">
        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1 font-semibold">
          Select Client Production
        </label>
        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#09090B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white cursor-pointer"
        >
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.client?.full_name || 'Client'} &bull; {o.package_name}
            </option>
          ))}
        </select>
      </div>

      {/* Contract Financial Snapshot */}
      <div className="my-4 p-3.5 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Total Package</span>
          <span className="font-extrabold text-white font-mono">
            ₹{totalContract.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Cleared</span>
          <span className="font-extrabold text-white font-mono">
            ₹{totalSettled.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <span className="text-[10px] uppercase font-mono text-zinc-500 block">Balance Due</span>
          <span className="font-extrabold text-white font-mono">
            ₹{totalBalanceDue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 3-Milestone Installment Breakdown List */}
      <div className="space-y-3 mt-4">
        {orderPayments.map((payment, idx) => {
          const isPaid = payment.status === 'Paid';
          const isOverdue = payment.status === 'Overdue';

          const milestoneLabel =
            payment.milestone_name ||
            (idx === 0
              ? '1st: Booking Advance (Token)'
              : idx === 1
              ? '2nd: Shoot Day'
              : '3rd: Final Album Delivery');

          return (
            <div
              key={payment.id}
              className="p-3.5 rounded-xl border border-white/10 bg-[#09090B]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPaid ? 'bg-white' : 'bg-zinc-600'
                      }`}
                    />
                    <span className="text-xs font-bold text-white truncate">
                      {milestoneLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>
                      {new Date(payment.due_date).toLocaleDateString('en-IN')}
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono font-bold text-white">
                      ₹{Number(payment.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => sendEmiReminder(payment)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Send WhatsApp Reminder"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(payment.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      isPaid
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isPaid ? 'Paid' : 'Mark Paid'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Copy Bank Details Strip */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
        <span>Bank: HDFC Bank (Shujalpur)</span>
        <button
          type="button"
          onClick={copyBankDetails}
          className="flex items-center gap-1 text-white hover:underline transition-colors"
        >
          {copiedId === 'bank' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copiedId === 'bank' ? 'Copied' : 'Copy UPI / Bank'}</span>
        </button>
      </div>
    </div>
  );
};
