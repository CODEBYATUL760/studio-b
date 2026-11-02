// ==============================================================================
// MAHAKALI PRODUCTION - GST Studio Tax Invoice Engine
// Print-ready, branded studio invoice with direct payment sync
// Shujalpur (MP) &bull; Founder & Creative Director: Vishal Giri
// ==============================================================================

import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { OrderBooking, Invoice, PaymentEMI } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface InvoiceModalProps {
  order: OrderBooking | null;
  invoice: Invoice | null;
  payments: PaymentEMI[];
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  invoice,
  payments,
  onClose,
}) => {
  if (!order) return null;

  const invoiceRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Relevant payments for this order
  const orderPayments = payments
    .filter((p) => p.order_id === order.id)
    .sort((a, b) => a.installment_no - b.installment_no);

  const totalPaid = orderPayments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const balanceDue = Math.max(0, Number(order.total_amount) - totalPaid);

  const invoiceNumber = invoice?.invoice_number || `INV-MP-2026-${order.id.slice(-4).toUpperCase()}`;
  const invoiceDate = invoice?.generated_date
    ? new Date(invoice.generated_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  // Calculate Subtotal & GST breakdown (18% GST: 9% CGST + 9% SGST)
  const totalAmount = Number(order.total_amount);
  const subtotal = invoice?.subtotal || Math.round((totalAmount / 1.18) * 100) / 100;
  const taxAmount = invoice?.tax_amount || Math.round((totalAmount - subtotal) * 100) / 100;
  const cgst = Math.round((taxAmount / 2) * 100) / 100;
  const sgst = cgst;

  const paymentStatus =
    balanceDue === 0
      ? 'Paid'
      : totalPaid > 0
      ? 'Partially Paid'
      : 'Unpaid';

  const handlePrint = () => {
    window.print();
  };

  const copyInvoiceDetails = () => {
    const text = `MAHAKALI PRODUCTION - GST TAX INVOICE\nInvoice Ref: ${invoiceNumber}\nClient: ${order.client?.full_name}\nPackage: ${order.package_name}\nTotal: ₹${totalAmount.toLocaleString('en-IN')}\nCleared: ₹${totalPaid.toLocaleString('en-IN')}\nBalance Due: ₹${balanceDue.toLocaleString('en-IN')}\nStudio: ${BRAND_CONFIG.location.fullFormatted}\nFounder: ${BRAND_CONFIG.founder} (${BRAND_CONFIG.contact.phone})\nGSTIN: 23AAGCM8719E1Z8`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto print:p-0 print:bg-white"
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-10 shadow-2xl my-8 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        {/* Modal Controls - Hidden during print */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/5 text-black border border-black/15 font-bold">
              Official Tax Invoice
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyInvoiceDetails}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CANVAS */}
        <div ref={invoiceRef} className="mt-6 text-slate-900 print:text-black">
          {/* Studio Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 print:border-gray-300">
            <div>
              <div className="text-2xl font-black font-display tracking-tight text-slate-900 uppercase">
                {BRAND_CONFIG.brandName}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Cinematography & Photography Studio &bull; Shujalpur, MP
              </p>
              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="font-bold text-slate-800">
                  Founder & Creative Director: {BRAND_CONFIG.founder}
                </div>
                <div className="flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                  <span>{BRAND_CONFIG.location.fullFormatted}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>{BRAND_CONFIG.contact.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>{BRAND_CONFIG.contact.email}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">
                  GSTIN: 23AAGCM8719E1Z8 &bull; PAN: AAGCM8719E &bull; State Code: 23 (MP)
                </div>
              </div>
            </div>

            {/* Invoice Meta Box */}
            <div className="sm:text-right">
              <div className="text-xl font-bold font-display uppercase tracking-wider text-slate-900">
                TAX INVOICE
              </div>
              <div className="text-xs font-mono font-bold text-black mt-1">
                {invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Date: <span className="font-semibold text-slate-800">{invoiceDate}</span>
              </div>
              <div className="text-xs text-slate-500">
                Order Ref: <span className="font-mono text-slate-700">#{order.id.slice(0, 8)}</span>
              </div>

              {/* Status Badge */}
              <div className="mt-3 inline-block">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : paymentStatus === 'Partially Paid'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  Payment Status: {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Client Breakdown Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">
                Billed To (Client / Couple)
              </div>
              <div className="text-sm font-bold text-slate-900">
                {order.client?.full_name || 'VIP Client'}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Email: {order.client?.email || 'N/A'}
              </div>
              <div className="text-xs text-slate-600 font-mono">
                Phone: {order.client?.phone || BRAND_CONFIG.contact.phone}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">
                Event Logistics & Venue
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Event Type:</span>{' '}
                {order.event_type}
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Shoot Date:</span>{' '}
                {new Date(order.event_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Venue:</span>{' '}
                {order.venue_location || 'Shujalpur Studio Territory'}
              </div>
            </div>
          </div>

          {/* Itemized Services Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">#</th>
                  <th className="py-3 px-4 font-bold">Description of Services & Package Inclusions</th>
                  <th className="py-3 px-4 text-center font-bold">HSN/SAC</th>
                  <th className="py-3 px-4 text-right font-bold">Taxable Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-4 font-mono text-slate-500">01</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {order.package_name}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 max-w-md leading-relaxed">
                      Professional 4K dual-crew cinematography, prime lens wedding coverage, 4K aerial drone perspective, handcrafted embossed album binding, 4K master teaser cut, and master high-speed USB storage.
                    </div>
                    <div className="text-[10px] font-mono text-black mt-1 font-semibold">
                      Guaranteed Studio Delivery: {order.delivery_estimate_days || 40} Days SLA
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-slate-500 font-semibold">
                    998381
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-slate-200">
            {/* Bank Remittance Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex-1">
              <div className="text-[10px] uppercase font-mono text-black font-bold mb-2">
                Bank Settlement & Remittance Details
              </div>
              <div className="space-y-1 text-slate-700">
                <div><span className="text-slate-400">Account Name:</span> MAHAKALI PRODUCTION</div>
                <div><span className="text-slate-400">Bank:</span> HDFC Bank, Shujalpur Branch</div>
                <div><span className="text-slate-400">Account No:</span> 50200087198787</div>
                <div><span className="text-slate-400">IFSC Code:</span> HDFC0001928</div>
                <div><span className="text-slate-400">UPI ID:</span> {BRAND_CONFIG.contact.phoneRaw}@upi</div>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Taxable):</span>
                <span className="font-mono text-slate-900 font-semibold">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span className="font-mono text-slate-900 font-semibold">
                  ₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span className="font-mono text-slate-900 font-semibold">
                  ₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Total Contract Value:</span>
                <span className="font-mono text-black">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-black font-semibold pt-1">
                <span>Total Received to Date:</span>
                <span className="font-mono">
                  - ₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm bg-slate-50 p-2 rounded-lg">
                <span className="text-black">Remaining Balance Due:</span>
                <span className="font-mono text-black">
                  ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Signatory & Authorization */}
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6 pt-6 text-xs text-slate-500">
            <div>
              <p className="italic text-[11px] text-slate-400">
                &ldquo;{BRAND_CONFIG.tagline}&rdquo;
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                This computer-generated studio tax invoice is verified under Mahakali Production accounting standards.
              </p>
            </div>

            <div className="text-right">
              <div className="font-display text-lg text-slate-900 font-bold">
                {BRAND_CONFIG.founder}
              </div>
              <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-700 mt-0.5">
                Authorized Signatory & Creative Director
              </div>
              <div className="text-[10px] text-slate-400">
                MAHAKALI PRODUCTION &bull; Shujalpur, MP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
