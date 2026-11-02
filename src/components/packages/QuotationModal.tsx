// ==============================================================================
// MAHAKALI PRODUCTION - Dynamic Quotation Request & Booking Modal
// Clean date picker, availability check, strict disclaimer, Admin queue dispatch
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Sparkles,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Package,
  Send,
  AlertCircle,
} from 'lucide-react';
import { BRAND_CONFIG, StudioPackage } from '@/config/brand';
import { useStudioData } from '@/hooks/useStudioData';
import { PackageName } from '@/types/database';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: StudioPackage | null;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
}) => {
  const { createBooking, orders } = useStudioData();

  const [packageName, setPackageName] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdOrderRef, setCreatedOrderRef] = useState<string>('');
  const [availabilityMessage, setAvailabilityMessage] = useState<{
    status: 'available' | 'high_demand' | 'empty';
    text: string;
  }>({ status: 'empty', text: '' });

  // Update selected package when modal opens or prop changes
  useEffect(() => {
    if (selectedPackage) {
      setPackageName(selectedPackage.name);
    } else if (BRAND_CONFIG.packages[0]) {
      setPackageName(BRAND_CONFIG.packages[0].name);
    }
  }, [selectedPackage, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Dynamic Date Availability Checker
  const handleDateChange = (dateValue: string) => {
    setEventDate(dateValue);
    if (!dateValue) {
      setAvailabilityMessage({ status: 'empty', text: '' });
      return;
    }

    // Check if any existing orders exist on this date
    const conflictingBookings = orders.filter((o) => o.event_date === dateValue);
    if (conflictingBookings.length >= 2) {
      setAvailabilityMessage({
        status: 'high_demand',
        text: 'Peak wedding date — Multiple inquiries received. Priority booking recommended.',
      });
    } else {
      setAvailabilityMessage({
        status: 'available',
        text: 'Date currently available for commission by Creative Director Vishal Giri.',
      });
    }
  };

  const currentPkgDetails = BRAND_CONFIG.packages.find((p) => p.name === packageName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const price = currentPkgDetails ? currentPkgDetails.priceNumeric : 125000;
    const deliveryDays = currentPkgDetails ? currentPkgDetails.deliveryDays : 50;
    const category = currentPkgDetails ? currentPkgDetails.category : 'Wedding';

    // Enter data into Admin pending queue and store
    const createdOrder = createBooking(
      {
        package_name: packageName as PackageName,
        event_type: category,
        event_date: eventDate,
        total_amount: price,
        delivery_estimate_days: deliveryDays,
        venue_location: eventLocation,
        special_instructions: customNotes,
      },
      fullName,
      email,
      phone
    );

    setCreatedOrderRef(createdOrder.id.slice(0, 8).toUpperCase());
    setLoading(false);
    setSubmitted(true);
  };

  const getWhatsAppQuotationUrl = () => {
    const text = encodeURIComponent(
      `Hello Vishal Giri,\n\nI would like to request a quotation for Mahakali Production!\n\nBooking Ref: MP-${createdOrderRef}\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nPackage: ${packageName}\nEvent Date: ${eventDate}\nLocation: ${eventLocation}\nNotes: ${customNotes || 'N/A'}\n\nPlease confirm availability and quotation.`
    );
    return `https://wa.me/918719878719?text=${text}`;
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-lenis-prevent
          className="fixed inset-0 z-[120] flex items-center justify-center bg-studio-950/95 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop Click */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl rounded-3xl bg-studio-900 border border-gold-500/40 shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Modal Header */}
            <div className="p-6 bg-studio-950/90 border-b border-studio-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-tight text-slate-100">
                    Request Package Quotation
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {BRAND_CONFIG.brandName} &bull; Directed by {BRAND_CONFIG.founder}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-studio-900 hover:bg-studio-850 text-slate-400 hover:text-gold-400 border border-studio-800 transition-colors"
                aria-label="Close Quotation Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              /* Success / Confirmation State */
              <div className="p-8 sm:p-10 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Quotation Request #MP-{createdOrderRef}
                  </span>
                  <h4 className="text-2xl font-bold font-display uppercase tracking-tight text-slate-100 mt-3">
                    Inquiry Enqueued for Studio Review
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you, <strong className="text-gold-400">{fullName}</strong>. Your quotation
                    request for <strong className="text-slate-100">{packageName}</strong> has been
                    entered into our Admin pending queue.
                  </p>
                </div>

                {/* Instant Notification Banner */}
                <div className="p-4 rounded-2xl bg-studio-950 border border-studio-800 text-left text-xs space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-gold-400 font-mono text-[11px] font-bold uppercase">
                    <Send className="w-3.5 h-3.5" />
                    <span>Instant Confirmation Dispatched</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Confirmation Email:</span>
                    <span className="text-slate-200 font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Target:</span>
                    <span className="text-slate-200 font-medium">
                      {currentPkgDetails?.deliveryLabel || 'Confirmed in writing'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Admin Status:</span>
                    <span className="text-amber-400 font-mono font-bold">Pending Review (Vishal Giri)</span>
                  </div>
                </div>

                {/* Disclaimer in Confirmation */}
                <div className="p-3.5 rounded-xl bg-gold-500/5 border border-gold-500/20 text-[11px] text-gold-300/90 text-left flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-gold-400 mt-0.5" />
                  <span>{BRAND_CONFIG.disclaimer}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={getWhatsAppQuotationUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-studio-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp (+91 8719878719)</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-studio-700 text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Quotation Request Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                {/* Selected Package Banner */}
                {currentPkgDetails && (
                  <div className="p-4 rounded-2xl bg-studio-950 border border-gold-500/30 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold block">
                        Selected Package Tier
                      </span>
                      <h4 className="text-sm font-bold font-display text-slate-100 uppercase mt-0.5">
                        {currentPkgDetails.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {currentPkgDetails.deliverables.coverage} &bull;{' '}
                        <span className="text-gold-400 font-mono">
                          {currentPkgDetails.deliveryLabel}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-extrabold font-display text-gold-400 block">
                        {currentPkgDetails.priceEstimate}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">Base Estimate</span>
                    </div>
                  </div>
                )}

                {/* Form Fields: Package & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Change Package Tier
                    </label>
                    <select
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                    >
                      {BRAND_CONFIG.packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.name}>
                          {pkg.name} &bull; {pkg.deliveryLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Event Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={eventDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Realtime Date Availability Feedback */}
                {availabilityMessage.status !== 'empty' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      availabilityMessage.status === 'available'
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{availabilityMessage.text}</span>
                  </motion.div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Priya & Rahul Sharma"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 8719878719"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Event Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Event Location / Venue *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="e.g. Soni Plaza, Shujalpur / Udaipur"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Custom Notes / Specific Requests
                  </label>
                  <textarea
                    rows={2}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Drone permissions required, pre-wedding save-the-date teaser details, number of guests..."
                    className="w-full px-3.5 py-2.5 bg-studio-950 border border-studio-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>

                {/* Strict Booking Disclaimer Notice */}
                <div className="p-3.5 rounded-xl bg-studio-950 border border-gold-500/30 text-[11px] text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-gold-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-gold-400 block mb-0.5">Booking Policy Notice:</span>
                    <span>{BRAND_CONFIG.disclaimer}</span>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-studio-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-gold-500/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Quotation to Queue...</span>
                  ) : (
                    <>
                      <span>Submit Quotation Request to Vishal Giri</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
