// ==============================================================================
// MAHAKALI PRODUCTION - Booking Consultation & Shoot Inquiry
// Pure Monochrome: #09090B & #121215
// ==============================================================================

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useStudioData } from '@/hooks/useStudioData';
import { EventType, PackageName } from '@/types/database';

export const BookNow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useStudioData();

  const preselected = location.state?.selectedPackage || 'Mahakali Ultra Asli 4K';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [packageName, setPackageName] = useState<PackageName>(preselected);
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedPkg = BRAND_CONFIG.packages.find((p) => p.name === packageName);
    const amount = selectedPkg ? selectedPkg.priceNumeric : 125000;

    createBooking(
      {
        package_name: packageName,
        event_type: eventType,
        event_date: eventDate,
        total_amount: amount,
        delivery_estimate_days: selectedPkg ? selectedPkg.deliveryDays : 20,
        venue_location: venueLocation,
        special_instructions: specialInstructions,
      },
      fullName,
      email,
      phone
    );

    setLoading(false);
    setSubmitted(true);
  };

  const getWhatsAppBookingUrl = () => {
    const text = encodeURIComponent(
      `Hello Vishal Giri,\n\nI would like to book a cinematography shoot with Mahakali Production!\n\nName: ${fullName}\nPhone: ${phone}\nEvent Type: ${eventType}\nEvent Date: ${eventDate}\nPackage: ${packageName}\nVenue: ${venueLocation}\n\nPlease let me know your availability.`
    );
    return `https://wa.me/918719878719?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121215] border border-white/10 text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Direct Inquiry &bull; Vishal Giri</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-tight text-white">
          Book Shoot Consultation
        </h1>
        <p className="mt-3 text-zinc-400 text-sm max-w-2xl mx-auto">
          Secure your wedding or pre-wedding dates with {BRAND_CONFIG.brandName}.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121215] border border-white/10 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-display uppercase tracking-tight text-white mb-2">
            Inquiry Registered
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto mb-8">
            Thank you, <strong className="text-white">{fullName}</strong>. Your date inquiry for{' '}
            <strong className="text-white">{packageName}</strong> has been logged.
          </p>

          <div className="p-4 rounded-xl bg-[#09090B] border border-white/10 max-w-md mx-auto mb-8 text-xs text-left space-y-2 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Event Type:</span>
              <span className="font-semibold text-white">{eventType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Event Date:</span>
              <span className="font-semibold text-white">{eventDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Venue:</span>
              <span className="font-semibold text-white">{venueLocation || 'To be specified'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppBookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Instantly via WhatsApp</span>
            </a>

            <button
              onClick={() => navigate('/client-portal')}
              className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-white border border-white/20 hover:bg-white/5 font-semibold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              View Client Portal
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#121215] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priya & Rahul Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 8719878719"
                    className="w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Estimated Event Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Wedding">Wedding Celebration</option>
                  <option value="Pre-Wedding">Pre-Wedding Shoot</option>
                  <option value="Engagement">Ring Ceremony / Engagement</option>
                  <option value="Commercial">Commercial / Brand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Film Package Tier
                </label>
                <select
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value as PackageName)}
                  className="w-full px-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                >
                  {BRAND_CONFIG.packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} &bull; {pkg.priceEstimate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Venue Location / City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={venueLocation}
                  onChange={(e) => setVenueLocation(e.target.value)}
                  placeholder="e.g. Royal Palace, Shujalpur"
                  className="w-full pl-10 pr-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Special Requests / Custom Vision
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Drone coverage, special ceremonies, function timeline..."
                className="w-full px-4 py-3 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Registering Commission...</span>
              ) : (
                <>
                  <span>Submit Inquiry to Vishal Giri</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
