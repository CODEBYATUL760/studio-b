// ==============================================================================
// MAHAKALI PRODUCTION - Minimal Contact Section
// Heading: Let's Create Together + Clean 4-Field Inquiry + Direct Contacts
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import { Phone, Mail, Instagram, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useStudioData } from '@/hooks/useStudioData';
import { EventType } from '@/types/database';

export const ContactSection: React.FC = () => {
  const { createBooking } = useStudioData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);

    try {
      createBooking(
        {
          package_name: 'Mahakali Ultra Asli 4K',
          event_type: eventType,
          event_date: eventDate || new Date().toISOString().split('T')[0],
          total_amount: 125000,
          delivery_estimate_days: 40,
        },
        name,
        '',
        phone
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-[#09090B]">
      <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-[#121215] border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Contact Links */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white leading-tight">
              Let&apos;s Create Together
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Reserve your wedding date for the upcoming season.
            </p>

            {/* Direct Contact Links */}
            <div className="pt-4 space-y-3 text-xs">
              <a
                href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
                className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-mono">{BRAND_CONFIG.contact.phone}</span>
              </a>

              <a
                href={BRAND_CONFIG.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>WhatsApp Instant Inquiry</span>
              </a>

              <a
                href={BRAND_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <span>{BRAND_CONFIG.contact.instagram}</span>
              </a>

              <div className="flex items-center gap-3 text-zinc-300">
                <div className="w-9 h-9 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-mono">{BRAND_CONFIG.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean 4-Field Inquiry Form */}
          <div className="lg:col-span-7 bg-[#09090B] p-6 sm:p-8 rounded-2xl border border-white/10">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  Inquiry Received
                </h3>
                <p className="text-xs text-zinc-400">
                  Our director will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as EventType)}
                      className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Wedding">Wedding Film</option>
                      <option value="Pre-Wedding">Pre-Wedding Shoot</option>
                      <option value="Engagement">Engagement / Reception</option>
                      <option value="Commercial">Commercial / Brand</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-medium text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
