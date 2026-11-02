// ==============================================================================
// MAHAKALI PRODUCTION - Quick Invoice Generator & Billing Section
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React from 'react';
import {
  Printer,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Aperture,
} from 'lucide-react';
import { Invoice, OrderBooking } from '@/types/database';

interface InvoiceSectionProps {
  invoices: Invoice[];
  orders: OrderBooking[];
  onOpenInvoice: (order: OrderBooking, invoice?: Invoice) => void;
}

export const InvoiceSection: React.FC<InvoiceSectionProps> = ({
  invoices,
  orders,
  onOpenInvoice,
}) => {
  return (
    <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-display uppercase tracking-wide text-white">
              Recent GST Studio Invoices & Bills
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#09090B] text-zinc-300 border border-white/10">
              {invoices.length} Bills Issued
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 font-light">
            Auto-generate print-ready bills with official Shujalpur studio address, GSTIN: 23AAGCM8719E1Z8 & SAC: 998381
          </p>
        </div>

        {/* Quick New Invoice Trigger */}
        {orders.length > 0 && (
          <button
            type="button"
            onClick={() => onOpenInvoice(orders[0])}
            className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate Quick Bill</span>
          </button>
        )}
      </div>

      {/* Invoices List Table */}
      <div className="overflow-x-auto mt-4 w-full">
        {invoices.length > 0 ? (
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-[#09090B] text-zinc-400 uppercase text-[10px] font-mono tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-bold">Invoice Ref</th>
                <th className="py-3 px-4 font-bold">Billed Client</th>
                <th className="py-3 px-4 font-bold">Package</th>
                <th className="py-3 px-4 font-bold">Issue Date</th>
                <th className="py-3 px-4 font-bold">Subtotal</th>
                <th className="py-3 px-4 font-bold">GST (18%)</th>
                <th className="py-3 px-4 font-bold">Total</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invoices.map((inv) => {
                const linkedOrder = orders.find((o) => o.id === inv.order_id);

                const isPaid = inv.payment_status === 'Paid';
                const isPartiallyPaid = inv.payment_status === 'Partially_Paid';

                return (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    {/* Invoice Number */}
                    <td className="py-4 px-4 font-mono font-bold text-white">
                      {inv.invoice_number}
                    </td>

                    {/* Client Name */}
                    <td className="py-4 px-4 font-semibold text-white">
                      {linkedOrder?.client?.full_name || 'Client'}
                    </td>

                    {/* Package */}
                    <td className="py-4 px-4 text-zinc-400">
                      <span className="font-medium text-zinc-200">{linkedOrder?.package_name || 'Custom Film'}</span>
                    </td>

                    {/* Issue Date */}
                    <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">
                      {new Date(inv.generated_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Subtotal */}
                    <td className="py-4 px-4 font-mono text-zinc-400">
                      ₹{Number(inv.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* GST */}
                    <td className="py-4 px-4 font-mono text-zinc-400">
                      ₹{Number(inv.tax_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4 font-mono font-bold text-white text-sm">
                      ₹{Number(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Paid
                        </span>
                      ) : isPartiallyPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                          <Clock className="w-3 h-3" />
                          Partially Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                          <AlertCircle className="w-3 h-3" />
                          Unpaid
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (linkedOrder) onOpenInvoice(linkedOrder, inv);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#09090B] hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-white" />
                        <span>Print / PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-zinc-400 space-y-2">
            <Aperture className="w-8 h-8 text-zinc-600 mx-auto animate-spin-slow" />
            <div className="text-xs font-semibold text-white">No Invoices Generated Yet</div>
            <p className="text-[11px] text-zinc-500 font-light">
              Invoices will appear here with one-click print and PDF download.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
