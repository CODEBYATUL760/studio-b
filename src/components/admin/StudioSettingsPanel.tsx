// ==============================================================================
// MAHAKALI PRODUCTION - Studio Settings Workstation Panel
// Update Brand Metadata, Direct Contacts, Location, and Typography
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { StudioSettings } from '@/types/database';

interface StudioSettingsPanelProps {
  settings: StudioSettings;
  onSaveSettings: (updated: Partial<StudioSettings>) => void;
}

export const StudioSettingsPanel: React.FC<StudioSettingsPanelProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121215] border border-white/10">
        <div>
          <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-white" />
            <span>Studio Configuration & Brand Identity</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time settings for header, footer, contracts, invoices, and direct contact buttons.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Executive Brand Info */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-white/10 pb-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Studio Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                Studio Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                Founder & Creative Director
              </label>
              <input
                type="text"
                name="founder"
                value={formData.founder}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Channels & Desk */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-white/10 pb-2">
            <Phone className="w-4 h-4 text-white" />
            <span>Direct Desk & Communications</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                Direct Phone Display
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                Official Studio Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                WhatsApp Link
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Studio Location */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 border-b border-white/10 pb-2">
            <MapPin className="w-4 h-4 text-white" />
            <span>Studio Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Studio Settings</span>
        </button>
      </form>
    </div>
  );
};
