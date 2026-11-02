// ==============================================================================
// MAHAKALI PRODUCTION - Edit Shoot & Deliverables Modal
// Interactive 5-Stage Checklist & Status Updater for Admin Operations
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import {
  X,
  Camera,
  Palette,
  Film,
  HardDrive,
  Image as ImageIcon,
  Save,
} from 'lucide-react';
import { OrderBooking, BookingStatus, DeliverablesChecklist } from '@/types/database';

interface EditDeliverablesModalProps {
  order: OrderBooking | null;
  onClose: () => void;
  onSaveStatus: (orderId: string, status: BookingStatus) => void;
  onSaveDeliverables: (orderId: string, deliverables: Partial<DeliverablesChecklist>) => void;
}

export const EditDeliverablesModal: React.FC<EditDeliverablesModalProps> = ({
  order,
  onClose,
  onSaveStatus,
  onSaveDeliverables,
}) => {
  if (!order) return null;

  const initialDeliverables: DeliverablesChecklist = order.deliverables || {};

  const [status, setStatus] = useState<BookingStatus>(order.status);
  const [photosSelected, setPhotosSelected] = useState<boolean>(
    !!(initialDeliverables.photosSelected || initialDeliverables.albums)
  );
  const [colorGrading, setColorGrading] = useState<boolean>(
    !!(initialDeliverables.colorGrading || initialDeliverables.reelEdits)
  );
  const [teaserReady, setTeaserReady] = useState<boolean>(
    !!(initialDeliverables.teaserReady || initialDeliverables.reelEdits)
  );
  const [albumPrinted, setAlbumPrinted] = useState<boolean>(
    !!(initialDeliverables.albumPrinted || initialDeliverables.albums)
  );
  const [penDriveDispatched, setPenDriveDispatched] = useState<boolean>(
    !!(initialDeliverables.penDriveDispatched || initialDeliverables.penDrives)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStatus(order.id, status);
    onSaveDeliverables(order.id, {
      photosSelected,
      colorGrading,
      teaserReady,
      albumPrinted,
      penDriveDispatched,
      albums: albumPrinted,
      penDrives: penDriveDispatched,
      reelEdits: teaserReady,
    });
    onClose();
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#121215] border border-white/10 p-6 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#09090B] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-5 border-b border-white/10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white border border-white/15 font-bold">
            Edit Pipeline
          </span>
          <h2 className="text-xl font-bold font-display uppercase tracking-tight text-white mt-1">
            {order.client?.full_name}
          </h2>
          <p className="text-xs text-zinc-400">
            {order.package_name} &bull; {order.event_type} &bull; {new Date(order.event_date).toLocaleDateString('en-IN')}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 mt-5">
          {/* Status Select */}
          <div>
            <label className="text-xs font-bold text-white block mb-1.5 uppercase font-mono tracking-wider">
              Workflow Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="Pending Advance">Pending Advance</option>
              <option value="In-Production / Editing">In-Production / Editing</option>
              <option value="Ready for Delivery">Ready for Delivery</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* 5-Stage Deliverables Checklist */}
          <div>
            <label className="text-xs font-bold text-white block mb-2 uppercase font-mono tracking-wider">
              Deliverables Progress Checklist
            </label>
            <div className="space-y-2.5">
              {/* 1. Photos Selected */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#09090B] hover:border-white/25 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-zinc-300">
                    1. Photos Shortlisted & Selected
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={photosSelected}
                  onChange={(e) => setPhotosSelected(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-[#121215] text-white focus:ring-white cursor-pointer"
                />
              </label>

              {/* 2. Color Grading */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#09090B] hover:border-white/25 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-zinc-300">
                    2. Cinematic Color Grading Completed
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={colorGrading}
                  onChange={(e) => setColorGrading(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-[#121215] text-white focus:ring-white cursor-pointer"
                />
              </label>

              {/* 3. 4K Teaser Ready */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#09090B] hover:border-white/25 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-zinc-300">
                    3. 4K Wedding Teaser / Reel Ready
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={teaserReady}
                  onChange={(e) => setTeaserReady(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-[#121215] text-white focus:ring-white cursor-pointer"
                />
              </label>

              {/* 4. Luxury Album Printed */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#09090B] hover:border-white/25 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-zinc-300">
                    4. Luxury Photo Album Printed
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={albumPrinted}
                  onChange={(e) => setAlbumPrinted(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-[#121215] text-white focus:ring-white cursor-pointer"
                />
              </label>

              {/* 5. Pen Drive Dispatched */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#09090B] hover:border-white/25 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-zinc-300">
                    5. Master High-Speed USB Dispatched
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={penDriveDispatched}
                  onChange={(e) => setPenDriveDispatched(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-[#121215] text-white focus:ring-white cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
