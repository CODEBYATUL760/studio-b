// ==============================================================================
// MAHAKALI PRODUCTION - Packages Manager Panel
// Full CRUD: Add, Edit, Delete, Toggle Flagship for Studio Cinema Packages
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { StudioPackage } from '@/config/brand';

interface PackagesManagerPanelProps {
  packages: StudioPackage[];
  onAddPackage: (pkg: StudioPackage) => void;
  onUpdatePackage: (id: string, updated: Partial<StudioPackage>) => void;
  onDeletePackage: (id: string) => void;
}

export const PackagesManagerPanel: React.FC<PackagesManagerPanelProps> = ({
  packages,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<StudioPackage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Wedding' | 'Pre-Wedding'>('Wedding');
  const [tierName, setTierName] = useState('');
  const [tagline, setTagline] = useState('');
  const [priceEstimate, setPriceEstimate] = useState('₹1,25,000*');
  const [deliveryDays, setDeliveryDays] = useState(75);
  const [videoFormat, setVideoFormat] = useState('4K Cinema Master 60fps');
  const [drone, setDrone] = useState('Cinematic Drone Sweeps Included');
  const [album, setAlbum] = useState('150-photo handcrafted wedding album');
  const [storage, setStorage] = useState('1 Master USB Flash Drive');
  const [flagship, setFlagship] = useState(false);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    setName('');
    setCategory('Wedding');
    setTierName('Signature 4K Coverage');
    setTagline('Complete director-led sacred wedding cinema');
    setPriceEstimate('₹1,25,000*');
    setDeliveryDays(75);
    setVideoFormat('4K Cinema Master 60fps');
    setDrone('Cinematic Drone Sweeps Included');
    setAlbum('150-photo handcrafted wedding album');
    setStorage('1 Master USB Flash Drive');
    setFlagship(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: StudioPackage) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setCategory(pkg.category);
    setTierName(pkg.tierName);
    setTagline(pkg.tagline);
    setPriceEstimate(pkg.priceEstimate);
    setDeliveryDays(pkg.deliveryDays);
    setVideoFormat(pkg.deliverables.videoFormat);
    setDrone(pkg.deliverables.drone);
    setAlbum(pkg.deliverables.album);
    setStorage(pkg.deliverables.storage);
    setFlagship(Boolean(pkg.flagship));
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPackage) {
      onUpdatePackage(editingPackage.id, {
        name: name.trim(),
        category,
        tierName: tierName.trim(),
        tagline: tagline.trim(),
        priceEstimate: priceEstimate.trim(),
        deliveryDays: Number(deliveryDays),
        deliveryLabel: `Est. Delivery: ${deliveryDays} days`,
        flagship,
        deliverables: {
          coverage: `${category} Cinematography & Candid Photography`,
          videoFormat,
          drone,
          album,
          frames: '2 Custom wall portrait frames',
          storage,
        },
      });
    } else {
      const newPkg: StudioPackage = {
        id: `pkg-${Date.now()}`,
        name: name.trim(),
        category,
        tierName: tierName.trim(),
        tagline: tagline.trim(),
        priceEstimate: priceEstimate.trim(),
        priceNumeric: parseInt(priceEstimate.replace(/[^0-9]/g, '')) || 100000,
        deliveryDays: Number(deliveryDays),
        deliveryLabel: `Est. Delivery: ${deliveryDays} days`,
        flagship,
        popular: false,
        summary: tagline.trim(),
        deliverables: {
          coverage: `${category} Cinematography & Candid Photography`,
          videoFormat,
          drone,
          album,
          frames: '2 Custom wall portrait frames',
          storage,
        },
        features: [
          `${category} dual-team coverage`,
          drone,
          album,
          storage,
          `Est. Delivery: ${deliveryDays} days`,
        ],
      };
      onAddPackage(newPkg);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121215] border border-white/10">
        <div>
          <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-white" />
            <span>Studio Packages & Catalog</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage packages displayed on the Homepage and Packages Catalog with instant live updates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-6 rounded-2xl bg-[#121215] border transition-all flex flex-col justify-between ${
              pkg.flagship ? 'border-white/40 shadow-xl' : 'border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#09090B] border border-white/10 text-zinc-300 font-bold">
                  {pkg.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pkg.deliveryDays}d
                </span>
              </div>

              <h3 className="text-base font-bold font-display uppercase tracking-tight text-white">
                {pkg.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-light line-clamp-2">
                {pkg.tagline}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Estimate:</span>
                  <span className="font-mono font-bold text-white">{pkg.priceEstimate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Format:</span>
                  <span className="truncate max-w-[150px]">{pkg.deliverables.videoFormat}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">Flagship:</span>
                  <span className="font-mono text-[11px] text-white">
                    {pkg.flagship ? 'YES ★' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(pkg)}
                className="px-3 py-1.5 rounded-lg bg-[#09090B] border border-white/10 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDeletePackage(pkg.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-[#09090B] transition-colors"
                title="Delete package"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative z-50 w-full max-w-lg bg-[#09090B] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold font-display uppercase tracking-tight text-white">
                {editingPackage ? 'Edit Package Specs' : 'Create New Studio Package'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MAHAKALI CINEMATIC 8K"
                  className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                    Delivery (Days)
                  </label>
                  <input
                    type="number"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                  Tagline / Brief
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Cinematic 4K coverage with drone & physical album"
                  className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                  Price Estimate String
                </label>
                <input
                  type="text"
                  value={priceEstimate}
                  onChange={(e) => setPriceEstimate(e.target.value)}
                  placeholder="₹1,25,000*"
                  className="w-full px-3.5 py-2 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                    Video Format
                  </label>
                  <input
                    type="text"
                    value={videoFormat}
                    onChange={(e) => setVideoFormat(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                    Drone Spec
                  </label>
                  <input
                    type="text"
                    value={drone}
                    onChange={(e) => setDrone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#121215] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="flagshipCheck"
                  checked={flagship}
                  onChange={(e) => setFlagship(e.target.checked)}
                  className="rounded border-white/20 bg-[#121215] text-white"
                />
                <label htmlFor="flagshipCheck" className="text-xs text-zinc-300 cursor-pointer">
                  Mark as Director Flagship Collection
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-transparent border border-white/15 text-zinc-400 hover:text-white text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase hover:bg-zinc-200 cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
