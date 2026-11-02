// ==============================================================================
// MAHAKALI PRODUCTION - Order Detail & Deliverables Checklist Modal
// Detailed client dossier, delivery countdown engine & physical deliverables
// ==============================================================================

import React from 'react';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  Package,
  Film,
  HardDrive,
  Image as ImageIcon,
} from 'lucide-react';
import { OrderBooking, BookingStatus, DeliverablesChecklist } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface OrderDetailModalProps {
  order: OrderBooking | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: BookingStatus) => void;
  onUpdateDeliverables: (orderId: string, deliverables: Partial<DeliverablesChecklist>) => void;
  onOpenEmiManager: (order: OrderBooking) => void;
  onOpenInvoice: (order: OrderBooking) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdateDeliverables,
  onOpenEmiManager,
  onOpenInvoice,
}) => {
  if (!order) return null;

  // Delivery countdown calculations
  const eventTime = new Date(order.event_date).getTime();
  const now = Date.now();
  const estimateDays = order.delivery_estimate_days || 40;
  const deadlineTime = eventTime + estimateDays * 86400000;
  const deadlineDateStr = new Date(deadlineTime).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));
  const isDelivered = order.status === 'Delivered';
  const isOverdue = !isDelivered && diffDays < 0;

  // Days elapsed since shoot date
  const daysElapsedSinceEvent = Math.max(0, Math.floor((now - eventTime) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.max(0, Math.round((daysElapsedSinceEvent / estimateDays) * 100)));

  const deliverables: DeliverablesChecklist = order.deliverables || {
    albums: false,
    penDrives: false,
    reelEdits: false,
    frames: false,
  };

  const completedDeliverablesCount = [
    deliverables.albums,
    deliverables.penDrives,
    deliverables.reelEdits,
    deliverables.frames,
  ].filter(Boolean).length;

  // WhatsApp quick concierge link
  const clientPhoneClean = (order.client?.phone || '').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello ${order.client?.full_name || 'Client'}, this is Vishal Giri from MAHAKALI PRODUCTION regarding your ${order.package_name} booking for ${new Date(
      order.event_date
    ).toLocaleDateString('en-IN')}.`
  );
  const whatsappUrl = `https://wa.me/${clientPhoneClean.startsWith('91') ? clientPhoneClean : `91${clientPhoneClean}`}?text=${whatsappMessage}`;

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl rounded-2xl bg-studio-900 border border-gold-500/30 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-gold-400 hover:bg-studio-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-studio-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
                Order Ref: #{order.id.slice(0, 8)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Created {new Date(order.created_at).toLocaleDateString('en-IN')}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-100 mt-1">
              {order.client?.full_name || 'VIP Client'}
            </h2>
            <p className="text-xs text-gold-400 font-medium">
              {order.package_name} &bull; {order.event_type}
            </p>
          </div>

          {/* Status Control */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as BookingStatus)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider border bg-studio-950 border-gold-500/40 text-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
            >
              <option value="New Enquiry">New Enquiry</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shoot In-Progress">Shoot In-Progress</option>
              <option value="Post-Production">Post-Production</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Delivery Countdown Engine */}
        <div className="my-6 p-5 rounded-2xl bg-studio-950/80 border border-studio-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Turnaround & Delivery Countdown Engine
              </span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Guaranteed Window: </span>
              <span className="font-bold text-gold-400">{estimateDays} Days</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-studio-800 rounded-full h-2.5 overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 ${
                isDelivered
                  ? 'bg-emerald-400'
                  : isOverdue
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-gold-500 to-amber-300'
              }`}
              style={{ width: `${isDelivered ? 100 : progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Shoot Date:</span>
              <span className="font-semibold text-slate-200">
                {new Date(order.event_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Target Delivery Date:</span>
              <span className="font-semibold text-slate-200">{deadlineDateStr}</span>
            </div>

            <div className="font-mono">
              {isDelivered ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over & Delivered
                </span>
              ) : isOverdue ? (
                <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> Overdue by {Math.abs(diffDays)} Days
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-gold-400 font-bold bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/20">
                  <Clock className="w-3.5 h-3.5" /> {diffDays} Days Remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Deliverables Checklist Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Package className="w-4 h-4 text-gold-400" />
              Physical & Digital Deliverables Checklist ({completedDeliverablesCount}/4 Completed)
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Live Toggle to Save</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Photo Albums */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                deliverables.albums
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-studio-950/60 border-studio-800 text-slate-400 hover:border-studio-700'
              }`}
            >
              <input
                type="checkbox"
                checked={deliverables.albums}
                onChange={(e) => onUpdateDeliverables(order.id, { albums: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-studio-700 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 bg-studio-900 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                  <span>Handcrafted Photo Albums</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  150/300/400 photos luxury embossed double album & velvet carry case
                </p>
                <span
                  className={`inline-block mt-1.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    deliverables.albums
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-studio-800 text-slate-400'
                  }`}
                >
                  {deliverables.albums ? 'Ready for Handover' : 'Printing / In-Queue'}
                </span>
              </div>
            </label>

            {/* 2. Master USB / Type-C */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                deliverables.penDrives
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-studio-950/60 border-studio-800 text-slate-400 hover:border-studio-700'
              }`}
            >
              <input
                type="checkbox"
                checked={deliverables.penDrives}
                onChange={(e) => onUpdateDeliverables(order.id, { penDrives: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-studio-700 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 bg-studio-900 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <HardDrive className="w-3.5 h-3.5 text-gold-400" />
                  <span>Pen Drives / Type-C Storage</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  High-speed USB formatted with 4K ProRes & Master MP4 documentary cuts
                </p>
                <span
                  className={`inline-block mt-1.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    deliverables.penDrives
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-studio-800 text-slate-400'
                  }`}
                >
                  {deliverables.penDrives ? 'Loaded & Sealed' : 'Pending Rendering'}
                </span>
              </div>
            </label>

            {/* 3. Reel Edits & Teasers */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                deliverables.reelEdits
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-studio-950/60 border-studio-800 text-slate-400 hover:border-studio-700'
              }`}
            >
              <input
                type="checkbox"
                checked={deliverables.reelEdits}
                onChange={(e) => onUpdateDeliverables(order.id, { reelEdits: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-studio-700 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 bg-studio-900 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Film className="w-3.5 h-3.5 text-gold-400" />
                  <span>Cinematic Reel Edits & Teasers</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Instagram reels, 60s teaser, and licensed musical grade cuts
                </p>
                <span
                  className={`inline-block mt-1.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    deliverables.reelEdits
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-studio-800 text-slate-400'
                  }`}
                >
                  {deliverables.reelEdits ? 'Rendered & Shared' : 'Color Grading'}
                </span>
              </div>
            </label>

            {/* 4. Custom Portrait Frames */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                deliverables.frames
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-studio-950/60 border-studio-800 text-slate-400 hover:border-studio-700'
              }`}
            >
              <input
                type="checkbox"
                checked={deliverables.frames}
                onChange={(e) => onUpdateDeliverables(order.id, { frames: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-studio-700 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 bg-studio-900 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Package className="w-3.5 h-3.5 text-gold-400" />
                  <span>Custom Portrait Frames</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Custom framed wall portraits (1 to 4 frames all sizes)
                </p>
                <span
                  className={`inline-block mt-1.5 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    deliverables.frames
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-studio-800 text-slate-400'
                  }`}
                >
                  {deliverables.frames ? 'Fabricated & Boxed' : 'Awaiting Selection'}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Client & Venue Logistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-studio-950/60 border border-studio-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Client Contact Dossier
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-200 font-semibold">{order.client?.full_name}</div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>{order.client?.email || 'N/A'}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>{order.client?.phone || BRAND_CONFIG.contact.phone}</span>
              </div>
            </div>

            {/* Quick contact actions */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-studio-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </a>
              <a
                href={`tel:${order.client?.phone || BRAND_CONFIG.contact.phone}`}
                className="px-3 py-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-studio-950/60 border border-studio-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Event & Venue Details
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                <span>{order.venue_location || 'Venue details pending client confirmation'}</span>
              </div>
              {order.special_instructions && (
                <div className="pt-2 text-slate-400 italic border-t border-studio-800/80">
                  &ldquo;{order.special_instructions}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-studio-800">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Total Contract</div>
              <div className="text-base font-bold text-slate-100">
                ₹{Number(order.total_amount).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="h-6 w-px bg-studio-800" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Balance Due</div>
              <div className="text-base font-bold text-gold-400">
                ₹{Number(order.balance_due).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onOpenEmiManager(order)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>EMI Engine</span>
            </button>
            <button
              onClick={() => onOpenInvoice(order)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-studio-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span>GST Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
