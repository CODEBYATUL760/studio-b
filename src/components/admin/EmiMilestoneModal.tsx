// ==============================================================================
// MAHAKALI PRODUCTION - EMI & Payment Tracking Engine Modal
// Milestone Splitter, Status Toggle, Auto-Txn Logging & Payment Reminders
// ==============================================================================

import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  Check,
  Split,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { OrderBooking, PaymentEMI } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface EmiMilestoneModalProps {
  order: OrderBooking | null;
  payments: PaymentEMI[];
  onClose: () => void;
  onTogglePaymentStatus: (paymentId: string, customRef?: string) => void;
  onSplitOrderEmis: (
    orderId: string,
    milestones: { name: string; percentage: number; dueDate: string }[]
  ) => void;
}

interface MilestoneDraft {
  name: string;
  percentage: number;
  dueDate: string;
}

export const EmiMilestoneModal: React.FC<EmiMilestoneModalProps> = ({
  order,
  payments,
  onClose,
  onTogglePaymentStatus,
  onSplitOrderEmis,
}) => {
  if (!order) return null;

  const orderPayments = payments
    .filter((p) => p.order_id === order.id)
    .sort((a, b) => a.installment_no - b.installment_no);

  const [activeTab, setActiveTab] = useState<'ledger' | 'splitter'>('ledger');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeReminder, setActiveReminder] = useState<PaymentEMI | null>(null);

  // Custom Splitter State
  const defaultMilestones: MilestoneDraft[] = [
    {
      name: 'Booking Advance',
      percentage: 20,
      dueDate: new Date().toISOString().split('T')[0],
    },
    {
      name: 'On Shoot Day',
      percentage: 50,
      dueDate: order.event_date,
    },
    {
      name: 'On Final Album Delivery',
      percentage: 30,
      dueDate: new Date(
        new Date(order.event_date).getTime() + (order.delivery_estimate_days || 40) * 86400000
      )
        .toISOString()
        .split('T')[0],
    },
  ];

  const [milestones, setMilestones] = useState<MilestoneDraft[]>(defaultMilestones);

  const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage || 0), 0);

  const handleApplySplit = () => {
    if (totalPercentage !== 100) {
      alert(`Milestone percentages must total exactly 100%. Current sum: ${totalPercentage}%`);
      return;
    }
    onSplitOrderEmis(order.id, milestones);
    setActiveTab('ledger');
  };

  const handleSetPreset = (preset: 'standard' | 'half') => {
    if (preset === 'standard') {
      setMilestones([
        {
          name: 'Booking Advance',
          percentage: 20,
          dueDate: new Date().toISOString().split('T')[0],
        },
        {
          name: 'On Shoot Day',
          percentage: 50,
          dueDate: order.event_date,
        },
        {
          name: 'On Final Album Delivery',
          percentage: 30,
          dueDate: new Date(
            new Date(order.event_date).getTime() + (order.delivery_estimate_days || 40) * 86400000
          )
            .toISOString()
            .split('T')[0],
        },
      ]);
    } else {
      setMilestones([
        {
          name: 'Booking Advance',
          percentage: 50,
          dueDate: new Date().toISOString().split('T')[0],
        },
        {
          name: 'On Shoot Completion',
          percentage: 50,
          dueDate: order.event_date,
        },
      ]);
    }
  };

  const addCustomMilestone = () => {
    setMilestones([
      ...milestones,
      {
        name: 'Milestone Stage',
        percentage: 0,
        dueDate: order.event_date,
      },
    ]);
  };

  const removeMilestone = (idx: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  // Reminder generator
  const getReminderText = (payment: PaymentEMI) => {
    return `Namaste ${order.client?.full_name || 'Client'},\n\nThis is a gentle payment reminder from MAHAKALI PRODUCTION regarding your ${order.package_name} booking.\n\nInstallment: ${payment.milestone_name || `Installment #${payment.installment_no}`}\nAmount Due: ₹${Number(payment.amount).toLocaleString('en-IN')}\nDue Date: ${new Date(payment.due_date).toLocaleDateString('en-IN')}\n\nBank / UPI Remittance Details:\nUPI ID: ${BRAND_CONFIG.contact.phoneRaw}@upi\nStudio: MAHAKALI PRODUCTION, Shujalpur, MP\nContact: ${BRAND_CONFIG.founder} (${BRAND_CONFIG.contact.phone})\n\nThank you for choosing MAHAKALI PRODUCTION!`;
  };

  const copyReminderToClipboard = (payment: PaymentEMI) => {
    const text = getReminderText(payment);
    navigator.clipboard.writeText(text);
    setCopiedId(payment.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openWhatsAppReminder = (payment: PaymentEMI) => {
    const clientPhoneClean = (order.client?.phone || '').replace(/[^0-9]/g, '');
    const phone = clientPhoneClean.startsWith('91') ? clientPhoneClean : `91${clientPhoneClean}`;
    const text = encodeURIComponent(getReminderText(payment));
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const openEmailReminder = (payment: PaymentEMI) => {
    const email = order.client?.email || '';
    const subject = encodeURIComponent(
      `Payment Reminder: MAHAKALI PRODUCTION - ${payment.milestone_name || `Installment #${payment.installment_no}`}`
    );
    const body = encodeURIComponent(getReminderText(payment));
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-studio-900 border border-gold-500/30 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-gold-400 hover:bg-studio-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-6 border-b border-studio-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
              EMI & Receivables Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Order #{order.id.slice(0, 8)}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-100 mt-1">
            Payment Tracking & Milestone Splitter
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Client: <span className="text-slate-200 font-semibold">{order.client?.full_name}</span> &bull; Total Contract: <span className="text-gold-400 font-bold">₹{Number(order.total_amount).toLocaleString('en-IN')}</span> &bull; Remaining Due: <span className="text-amber-400 font-bold">₹{Number(order.balance_due).toLocaleString('en-IN')}</span>
          </p>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'ledger'
                  ? 'bg-gold-500 text-studio-950 shadow-md shadow-gold-500/20'
                  : 'bg-studio-950 text-slate-400 hover:text-slate-200 border border-studio-800'
              }`}
            >
              Active Installments Ledger ({orderPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('splitter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                activeTab === 'splitter'
                  ? 'bg-gold-500 text-studio-950 shadow-md shadow-gold-500/20'
                  : 'bg-studio-950 text-slate-400 hover:text-slate-200 border border-studio-800'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Customize Milestone Split</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ACTIVE INSTALLMENTS LEDGER */}
        {activeTab === 'ledger' && (
          <div className="mt-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-studio-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-studio-800">
                  <tr>
                    <th className="py-3.5 px-4">Milestone</th>
                    <th className="py-3.5 px-4">Due Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status Toggle</th>
                    <th className="py-3.5 px-4">Transaction Reference</th>
                    <th className="py-3.5 px-4 text-right">Reminder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-800">
                  {orderPayments.map((p) => {
                    const isPaid = p.status === 'Paid';
                    return (
                      <tr key={p.id} className="hover:bg-studio-850/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-100">
                            {p.milestone_name || `Installment #${p.installment_no}`}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            Stage #{p.installment_no}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-300">
                          {new Date(p.due_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-4 font-bold text-slate-100 text-sm">
                          ₹{Number(p.amount).toLocaleString('en-IN')}
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => onTogglePaymentStatus(p.id)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                              isPaid
                                ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40'
                            }`}
                            title="Click to toggle between Pending and Completed"
                          >
                            {isPaid ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Completed (Paid)</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Pending &bull; Mark Paid</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-4 px-4 font-mono text-[11px]">
                          {p.transaction_ref ? (
                            <span className="text-emerald-400 font-semibold">{p.transaction_ref}</span>
                          ) : (
                            <span className="text-slate-500 italic">&mdash; No ref logged &mdash;</span>
                          )}
                          {p.paid_at && (
                            <div className="text-[10px] text-slate-500">
                              Settled {new Date(p.paid_at).toLocaleDateString('en-IN')}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right">
                          {!isPaid ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openWhatsAppReminder(p)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                                title="Send WhatsApp payment reminder"
                              >
                                <Send className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>
                              <button
                                onClick={() => copyReminderToClipboard(p)}
                                className="p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-300 border border-studio-700 text-[10px] transition-colors"
                                title="Copy reminder text"
                              >
                                {copiedId === p.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">Receipt Cleared</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Concierge Info Banner */}
            <div className="p-4 rounded-xl bg-studio-950/60 border border-studio-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>
                  Toggling any installment automatically re-indexes order balance and updates GST invoice payment state in real time.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMIZE MILESTONE SPLIT */}
        {activeTab === 'splitter' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-studio-950/60 border border-studio-800">
              <div>
                <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-200">
                  Quick Milestone Presets
                </h3>
                <p className="text-[11px] text-slate-400">
                  Apply industry-standard milestone allocations or adjust custom percentages
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSetPreset('standard')}
                  className="px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-700 text-xs font-semibold transition-colors"
                >
                  Standard (20% Advance / 50% Shoot / 30% Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPreset('half')}
                  className="px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-700 text-xs font-semibold transition-colors"
                >
                  50 / 50 Split
                </button>
              </div>
            </div>

            {/* Milestones list */}
            <div className="space-y-3">
              {milestones.map((milestone, idx) => {
                const calculatedAmount = Math.round(
                  (order.total_amount * (milestone.percentage || 0)) / 100
                );

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-studio-950/80 border border-studio-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-full bg-studio-850 text-gold-400 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                          Milestone Label
                        </label>
                        <input
                          type="text"
                          value={milestone.name}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].name = e.target.value;
                            setMilestones(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-studio-900 border border-studio-700 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div className="w-32">
                      <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                        Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={milestone.percentage}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].percentage = Number(e.target.value) || 0;
                          setMilestones(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-studio-900 border border-studio-700 text-xs text-slate-200 focus:outline-none focus:border-gold-500 font-mono font-bold"
                      />
                    </div>

                    <div className="w-40">
                      <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].dueDate = e.target.value;
                          setMilestones(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-studio-900 border border-studio-700 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div className="w-28 text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                        Value
                      </div>
                      <div className="text-sm font-bold font-display text-gold-400">
                        ₹{calculatedAmount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      disabled={milestones.length <= 1}
                      className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                      title="Remove milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Splitter Footer & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-studio-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={addCustomMilestone}
                  className="px-3 py-2 rounded-xl bg-studio-850 hover:bg-studio-800 text-slate-200 border border-studio-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone Stage</span>
                </button>

                <div className="text-xs">
                  <span className="text-slate-400">Total Split: </span>
                  <span
                    className={`font-mono font-bold ${
                      totalPercentage === 100 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {totalPercentage}% / 100%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {totalPercentage !== 100 && (
                  <div className="text-xs text-red-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Must equal exactly 100%</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleApplySplit}
                  disabled={totalPercentage !== 100}
                  className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-studio-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
                >
                  Apply & Re-generate Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
