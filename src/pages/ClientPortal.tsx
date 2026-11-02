// ==============================================================================
// MAHAKALI PRODUCTION - VIP Client Portal
// Scoped strictly to authenticated client's projects, EMIs, and invoices
// Pure Monochrome: #09090B & #121215
// ==============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  Sparkles,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Printer,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStudioData } from '@/hooks/useStudioData';
import { BRAND_CONFIG } from '@/config/brand';
import { InvoiceModal } from '@/components/admin/InvoiceModal';
import { Invoice, OrderBooking } from '@/types/database';

export const ClientPortal: React.FC = () => {
  const { user } = useAuth();
  const { orders, payments, invoices } = useStudioData();
  const [activeInvoice, setActiveInvoice] = useState<{ invoice: Invoice; order: OrderBooking } | null>(null);

  const clientOrders = orders.filter((o) => {
    if (user?.role === 'admin') return true;
    return o.client_id === user?.id || o.client?.email === user?.email;
  });

  const displayOrders = clientOrders.length > 0 ? clientOrders : (user?.role === 'admin' ? orders : []);
  const clientOrderIds = displayOrders.map((o) => o.id);

  const clientPayments = payments.filter((p) => clientOrderIds.includes(p.order_id));
  const clientInvoices = invoices.filter((i) => clientOrderIds.includes(i.order_id));

  const totalBookingValue = displayOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);
  const totalBalanceDue = displayOrders.reduce((acc, o) => acc + Number(o.balance_due || 0), 0);
  const totalPaid = Math.max(0, totalBookingValue - totalBalanceDue);

  return (
    <div className="min-h-screen bg-[#09090B] text-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full selection:bg-white/20 selection:text-white">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/" className="shrink-0">
            <img
              src="/brand/logo-dark.png"
              alt="Mahakali Production"
              className="h-12 w-auto object-contain filter contrast-125"
            />
          </Link>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
                {user?.fullName || 'Client Portal'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-white/10 text-white border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Production Portal &bull; Milestones & Deliverables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#121215] border border-white/10 text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-500">Account</div>
            <div className="text-xs font-medium text-zinc-300">
              {user?.email || 'Authenticated'}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-2xl bg-[#121215] border border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
            Total Production Value
          </span>
          <div className="text-2xl font-bold font-display text-white">
            ₹{totalBookingValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-zinc-400" />
            <span>{displayOrders.length} Booked Package{displayOrders.length === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#121215] border border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
            Total Settled
          </span>
          <div className="text-2xl font-bold font-display text-white">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>
              {clientPayments.filter((p) => p.status === 'Paid').length} Completed Payments
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#121215] border border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
            Current Balance Due
          </span>
          <div className="text-2xl font-bold font-display text-white">
            ₹{totalBalanceDue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Milestone deliverables</span>
          </div>
        </div>
      </div>

      {/* Section 1: Bookings & Production Status */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-white" />
            Production Status
          </h2>
          <span className="text-xs text-zinc-400">
            {displayOrders.length} project{displayOrders.length === 1 ? '' : 's'}
          </span>
        </div>

        {displayOrders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#09090B] border border-white/10 text-white flex items-center justify-center mx-auto mb-3">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-display">No Active Bookings</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
              When your cinema package is confirmed, shoot milestones and deliverables will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 transition-all shadow-xl"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">
                      Package Tier
                    </span>
                    <h3 className="text-lg font-bold font-display text-white uppercase">
                      {order.package_name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/10 text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[11px] mb-0.5">Event Type</span>
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      {order.event_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] mb-0.5">Event Date</span>
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(order.event_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] mb-0.5">Total Amount</span>
                    <span className="font-bold text-white">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] mb-0.5">Balance Due</span>
                    <span className="font-bold text-white">
                      ₹{Number(order.balance_due).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {order.venue_location && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{order.venue_location}</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Turnaround Window:</span>
                  <span className="font-medium text-white">
                    {order.delivery_estimate_days} Days post-event
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: EMI Schedule */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-white" />
            Installment Schedule
          </h2>
          <span className="text-xs text-zinc-400">Direct studio ledger</span>
        </div>

        {clientPayments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#09090B] border border-white/10 text-white flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-display">No Invoices Pending</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
              Your installment ledger is currently clear.
            </p>
          </div>
        ) : (
          <div className="bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#09090B] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3.5 px-6">Installment</th>
                    <th className="py-3.5 px-6">Due Date</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Transaction Ref</th>
                    <th className="py-3.5 px-6">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {clientPayments.map((emi) => (
                    <tr key={emi.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">
                          {emi.milestone_name || `Installment #${emi.installment_no}`}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          Stage #{emi.installment_no}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-zinc-300">
                        {new Date(emi.due_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        ₹{Number(emi.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                          {emi.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-zinc-400">
                        {emi.transaction_ref || '&mdash;'}
                      </td>
                      <td className="py-4 px-6 text-zinc-400">{emi.payment_method || 'UPI / NEFT'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Section 3: Invoices */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display uppercase tracking-wide text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            Tax Invoices & Receipts
          </h2>
          <span className="text-xs text-zinc-400">Digital receipts</span>
        </div>

        {clientInvoices.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#121215] border border-white/10 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#09090B] border border-white/10 text-white flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-display">No Invoices Issued</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
              Official GST invoices will be accessible here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-[#121215] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-white">
                      {inv.invoice_number}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                      {inv.payment_status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-400 mb-4">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="text-zinc-200">
                        {new Date(inv.generated_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold text-white">
                        ₹{Number(inv.total_amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const matchingOrder = orders.find((o) => o.id === inv.order_id) || null;
                    if (matchingOrder) {
                      setActiveInvoice({ invoice: inv, order: matchingOrder });
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-black" />
                  <span>View Receipt</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Direct Concierge Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-display uppercase tracking-wide text-white">
            Questions Regarding Your Schedule?
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Connect directly with Vishal Giri or our studio editing desk.
          </p>
        </div>

        <a
          href={BRAND_CONFIG.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Concierge</span>
        </a>
      </div>

      {/* Invoice Modal Preview */}
      {activeInvoice && (
        <InvoiceModal
          order={activeInvoice.order}
          invoice={activeInvoice.invoice}
          payments={payments}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
};
