// ==============================================================================
// MAHAKALI PRODUCTION - Real-Time Admin Notification Drawer
// Slide-out Notification Center with Unread Counters & 1-Click WhatsApp Quick Action
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  CheckCheck,
  MessageSquare,
  ShieldAlert,
  Star,
  Film,
  UserPlus,
  Trash2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { AdminNotification } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onSelectTab: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'enquiry':
        return <Film className="w-4 h-4 text-white" />;
      case 'staff_request':
        return <UserPlus className="w-4 h-4 text-white" />;
      case 'review':
        return <Star className="w-4 h-4 text-white" />;
      default:
        return <Bell className="w-4 h-4 text-white" />;
    }
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    if (!notif.read) {
      onMarkRead(notif.id);
    }
    if (notif.linkTab) {
      onSelectTab(notif.linkTab);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Slide-out Panel */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="relative z-50 w-full max-w-md bg-[#09090B] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#121215] border border-white/10 flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">
                  Notifications
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="px-2.5 py-1 rounded-lg bg-[#121215] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark Read</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#121215] transition-colors"
                aria-label="Close Notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <Bell className="w-8 h-8 stroke-[1.2] mb-3 text-zinc-600" />
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Zero Pending Alerts
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                  New enquiries, staff requests, and client reviews will appear here in real-time.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isNew = !notif.read;
                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isNew
                        ? 'bg-[#121215] border-white/20 shadow-md'
                        : 'bg-[#09090B] border-white/5 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#09090B] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {notif.title}
                            </h4>
                            {isNew && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-white text-black">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="text-[9px] font-mono text-zinc-500 mt-1.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              &bull; {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDelete(notif.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Action Buttons for Enquiries / Reviews */}
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                      {notif.metadata?.phone && (
                        <a
                          href={`https://wa.me/${notif.metadata.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${notif.metadata.clientName || 'there'}! This is Vishal Giri from Mahakali Production regarding your shoot enquiry.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#09090B] border border-white/15 hover:border-white text-zinc-200 hover:text-white text-[10px] font-mono font-medium transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp Reply</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notif)}
                        className="text-[10px] font-mono text-zinc-400 hover:text-white transition-colors ml-auto flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-[#121215] text-[11px] text-zinc-500 text-center font-mono">
            Mahakali Production Executive Dispatch
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
