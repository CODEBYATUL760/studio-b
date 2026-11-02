// ==============================================================================
// MAHAKALI PRODUCTION - Admin Portfolio Manager (Linear / Vercel Style)
// Genuine Media CRUD Engine & Category Filtering
// ==============================================================================

import React, { useState } from 'react';
import {
  Camera,
  Film,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Check,
  X,
  AlertCircle,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { PortfolioItem } from '@/types/database';

interface PortfolioManagerProps {
  items: PortfolioItem[];
  onAddItem: (item: Omit<PortfolioItem, 'id' | 'created_at'>) => void;
  onDeleteItem: (itemId: string) => void;
}

type PortfolioCategory =
  | 'Wedding Films'
  | 'Pre-Wedding'
  | 'Drone Cinematography'
  | 'Cinematic Reels'
  | 'Candid Photography';

const CATEGORIES: ('All' | PortfolioCategory)[] = [
  'All',
  'Wedding Films',
  'Pre-Wedding',
  'Candid Photography',
  'Drone Cinematography',
  'Cinematic Reels',
];

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | PortfolioCategory>('All');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioCategory>('Wedding Films');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [couples, setCouples] = useState('');
  const [location, setLocation] = useState('Shujalpur, MP');
  const [specs, setSpecs] = useState('4K Cinema • Prime Optics');
  const [runtime, setRuntime] = useState('3:45');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim()) return;

    onAddItem({
      title: title.trim(),
      category,
      media_url: mediaType === 'image' ? mediaUrl.trim() : undefined,
      video_url: mediaType === 'video' ? mediaUrl.trim() : undefined,
      couples: couples.trim() || undefined,
      location: location.trim() || 'Shujalpur, MP',
      specs: specs.trim() || undefined,
      runtime: mediaType === 'video' ? runtime.trim() : undefined,
    });

    setTitle('');
    setMediaUrl('');
    setCouples('');
    setModalOpen(false);
    showToast('Media item added to portfolio');
  };

  const handleDelete = (id: string) => {
    onDeleteItem(id);
    setDeleteConfirmId(null);
    showToast('Media item deleted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-white text-[#09090B] font-semibold text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121215] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white">
              Studio Portfolio Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-300">
              {items.length} Genuine Assets
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Publish verified cinema reels and photo deliverables to the public showcase.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-[#09090B] font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1 mr-1" />
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-white text-[#09090B] shadow-sm'
                  : 'bg-[#121215] text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Media Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-2xl bg-[#121215] border border-white/10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#09090B] border border-white/10 text-zinc-400 flex items-center justify-center mx-auto mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white uppercase font-display">
            No Media in &ldquo;{selectedCategory}&rdquo;
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            Upload genuine wedding photos, high-resolution cinema stills, or 4K video reel URLs to populate this gallery.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-[#09090B] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload First Media</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#121215] border border-white/10 overflow-hidden hover:border-white/25 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Media Preview Box */}
                <div className="relative aspect-[16/10] bg-[#09090B] overflow-hidden">
                  {item.video_url && !item.media_url ? (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <Film className="w-8 h-8 text-zinc-400" />
                    </div>
                  ) : (
                    <img
                      src={item.media_url || '/brand/logo-dark.png'}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#09090B]/80 text-white backdrop-blur-md border border-white/15">
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                  {item.couples && (
                    <p className="text-xs text-zinc-400 mt-0.5">{item.couples}</p>
                  )}
                  {item.location && (
                    <p className="text-[11px] text-zinc-500 font-mono mt-1">{item.location}</p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                <span className="text-[10px] font-mono text-zinc-500">
                  {new Date(item.created_at).toLocaleDateString('en-IN')}
                </span>

                {deleteConfirmId === item.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MEDIA MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#121215] border border-white/15 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-5 border-b border-white/10 mb-6">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-300">
                Studio Asset Engine
              </span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-white mt-1">
                Add Portfolio Media
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Heritage Wedding Film"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 cursor-pointer"
                  >
                    <option value="Wedding Films">Wedding Films</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Candid Photography">Candid Photography</option>
                    <option value="Drone Cinematography">Drone Cinematography</option>
                    <option value="Cinematic Reels">Cinematic Reels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1">
                    Media Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30 cursor-pointer"
                  >
                    <option value="image">Photo Still</option>
                    <option value="video">Video Reel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1">
                  Direct Media URL *
                </label>
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://your-storage-bucket.com/photos/image.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1">
                    Client / Couples
                  </label>
                  <input
                    type="text"
                    value={couples}
                    onChange={(e) => setCouples(e.target.value)}
                    placeholder="e.g. Vikram & Radhika"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Shujalpur, MP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-[#09090B] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Save to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
