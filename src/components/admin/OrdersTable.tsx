// ==============================================================================
// MAHAKALI PRODUCTION - Order & Shoot Management Table
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  FileText,
  MessageSquare,
  Sparkles,
  Camera,
  HardDrive,
  ImageIcon,
  Aperture,
  Plus,
} from 'lucide-react';
import { OrderBooking, BookingStatus, DeliverablesChecklist } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';
import { Link } from 'react-router-dom';

interface OrdersTableProps {
  orders: OrderBooking[];
  onUpdateStatus: (orderId: string, status: BookingStatus) => void;
  onUpdateDeliverables: (orderId: string, deliverables: Partial<DeliverablesChecklist>) => void;
  onEditOrder: (order: OrderBooking) => void;
  onViewContract: (order: OrderBooking) => void;
  searchFilter?: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onUpdateStatus,
  onEditOrder,
  onViewContract,
  searchFilter = '',
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All Shoots');

  const filterTabs = [
    'All Shoots',
    'Pending Advance',
    'In-Production / Editing',
    'Ready for Delivery',
    'Completed',
  ];

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      let matchesStatus = true;
      if (activeFilter === 'Pending Advance') {
        matchesStatus =
          order.status === 'Pending Advance' ||
          order.status === 'New Enquiry' ||
          order.status === 'Pending';
      } else if (activeFilter === 'In-Production / Editing') {
        matchesStatus =
          order.status === 'In-Production / Editing' ||
          order.status === 'In-Production' ||
          order.status === 'Shoot In-Progress';
      } else if (activeFilter === 'Ready for Delivery') {
        matchesStatus =
          order.status === 'Ready for Delivery' ||
          order.status === 'Post-Production';
      } else if (activeFilter === 'Completed') {
        matchesStatus =
          order.status === 'Completed' ||
          order.status === 'Delivered';
      }

      const query = searchFilter.toLowerCase().trim();
      if (!query) return matchesStatus;

      const clientName = (order.client?.full_name || '').toLowerCase();
      const packageName = (order.package_name || '').toLowerCase();
      const eventType = (order.event_type || '').toLowerCase();
      const location = (order.venue_location || '').toLowerCase();
      const phone = (order.client?.phone || '').toLowerCase();
      const shootDate = (order.event_date || '').toLowerCase();

      return (
        matchesStatus &&
        (clientName.includes(query) ||
          packageName.includes(query) ||
          eventType.includes(query) ||
          location.includes(query) ||
          phone.includes(query) ||
          shootDate.includes(query))
      );
    });
  }, [orders, activeFilter, searchFilter]);

  // Counts
  const counts = useMemo(() => {
    return {
      'All Shoots': orders.length,
      'Pending Advance': orders.filter(
        (o) =>
          o.status === 'Pending Advance' ||
          o.status === 'New Enquiry' ||
          o.status === 'Pending'
      ).length,
      'In-Production / Editing': orders.filter(
        (o) =>
          o.status === 'In-Production / Editing' ||
          o.status === 'In-Production' ||
          o.status === 'Shoot In-Progress'
      ).length,
      'Ready for Delivery': orders.filter(
        (o) =>
          o.status === 'Ready for Delivery' ||
          o.status === 'Post-Production'
      ).length,
      Completed: orders.filter(
        (o) => o.status === 'Completed' || o.status === 'Delivered'
      ).length,
    };
  }, [orders]);

  const triggerWhatsAppReminder = (order: OrderBooking) => {
    const rawPhone = (order.client?.phone || BRAND_CONFIG.contact.phone).replace(/[^0-9]/g, '');
    const phone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
    const message = encodeURIComponent(
      `Hello ${order.client?.full_name || 'Client'},\n\nGreetings from MAHAKALI PRODUCTION. This is regarding your ${order.package_name} booking for ${new Date(
        order.event_date
      ).toLocaleDateString('en-IN')}.\n\nWarm regards,\nVishal Giri & Studio Team\n+91 8719878719`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="rounded-2xl bg-[#121215] border border-white/10 p-6 shadow-sm">
      {/* Table Card Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-display uppercase tracking-wide text-white">
              Bookings & Shoot Pipeline
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#09090B] text-white border border-white/15">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 font-light">
            Live pipeline across weddings and deliverables.
          </p>
        </div>

        {/* Filter Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {filterTabs.map((tab) => {
            const count = counts[tab as keyof typeof counts] || 0;
            const isActive = activeFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-[#09090B] text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-black/15 text-black font-bold' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table or Empty State (Scrollable on Mobile) */}
      <div className="overflow-x-auto mt-4 w-full">
        {filteredOrders.length > 0 ? (
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-[#09090B] text-zinc-400 uppercase text-[10px] font-mono tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-bold">Client & Event Date</th>
                <th className="py-3 px-4 font-bold">Package & Venue</th>
                <th className="py-3 px-4 font-bold">Deliverables Progress</th>
                <th className="py-3 px-4 font-bold">Financials</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.map((order) => {
                const deliverables = order.deliverables || {};
                const totalAmount = Number(order.total_amount || 0);
                const balanceDue = Number(order.balance_due || 0);

                return (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    {/* Client & Date & Contact */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">
                        {order.client?.full_name || 'Client'}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {order.client?.phone || order.client?.email || 'Direct Walk-in'}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span>
                          {new Date(order.event_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>&bull;</span>
                        <span className="text-zinc-300 font-mono text-[10px]">{order.event_type}</span>
                      </div>
                    </td>

                    {/* Package */}
                    <td className="py-4 px-4 text-white">
                      <div className="font-semibold text-xs text-white">{order.package_name}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                        {order.venue_location || 'Shujalpur, MP'}
                      </div>
                    </td>

                    {/* Deliverables Checklist Progress */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          title="Albums printed"
                          className={`p-1 rounded ${
                            deliverables.albums || deliverables.albumPrinted
                              ? 'text-white bg-white/20'
                              : 'text-zinc-600 bg-white/5'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </span>
                        <span
                          title="Master USB Dispatched"
                          className={`p-1 rounded ${
                            deliverables.penDrives || deliverables.penDriveDispatched
                              ? 'text-white bg-white/20'
                              : 'text-zinc-600 bg-white/5'
                          }`}
                        >
                          <HardDrive className="w-3.5 h-3.5" />
                        </span>
                        <span
                          title="4K Teaser / Reel edit ready"
                          className={`p-1 rounded ${
                            deliverables.reelEdits || deliverables.teaserReady
                              ? 'text-white bg-white/20'
                              : 'text-zinc-600 bg-white/5'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </span>
                        <span
                          title="Wall Frames"
                          className={`p-1 rounded ${
                            deliverables.frames
                              ? 'text-white bg-white/20'
                              : 'text-zinc-600 bg-white/5'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-1">
                        SLA: {order.delivery_estimate_days || 40} Days
                      </div>
                    </td>

                    {/* Financials */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white font-mono text-xs">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-mono mt-0.5">
                        {balanceDue === 0 ? (
                          <span className="text-zinc-300 font-semibold">100% Cleared</span>
                        ) : (
                          <span className="text-zinc-400">
                            Due: ₹{balanceDue.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value as BookingStatus)}
                        className="bg-[#09090B] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                      >
                        <option value="New Enquiry">New Enquiry</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shoot In-Progress">In-Production</option>
                        <option value="Ready for Delivery">Ready for Delivery</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditOrder(order)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="Edit Deliverables & Status"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewContract(order)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="View Studio Contract"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerWhatsAppReminder(order)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          title="Send WhatsApp Update"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Clean Minimal Empty State */
          <div className="py-12 text-center text-zinc-400 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#09090B] border border-white/10 flex items-center justify-center text-white mx-auto">
              <Aperture className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="text-sm font-bold font-display uppercase tracking-wide text-white">
                No Bookings In This Category
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto font-light">
                New booking enquiries will appear here in real time.
              </p>
            </div>
            <Link
              to="/book-now"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-widest transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate New Booking</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
