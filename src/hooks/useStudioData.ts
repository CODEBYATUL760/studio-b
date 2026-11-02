// ==============================================================================
// MAHAKALI PRODUCTION - Complete Studio Data Hook & Real-Time Engine
// Genuine Real-World Data Store: Supabase Sync + Reactive LocalStorage Engine
// Zero Fake AI Data & Zero Stock Dummy Records
// ==============================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  OrderBooking,
  PaymentEMI,
  Invoice,
  BookingStatus,
  PaymentStatus,
  DeliverablesChecklist,
  PortfolioItem,
  CustomerReview,
  StaffRequest,
  AdminNotification,
  StudioSettings,
} from '@/types/database';
import { BRAND_CONFIG, StudioPackage } from '@/config/brand';

const LOCAL_STORAGE_ORDERS = 'mahakali_orders_live';
const LOCAL_STORAGE_PAYMENTS = 'mahakali_payments_live';
const LOCAL_STORAGE_INVOICES = 'mahakali_invoices_live';
const LOCAL_STORAGE_PORTFOLIO = 'mahakali_portfolio_live';
const LOCAL_STORAGE_REVIEWS = 'mahakali_reviews_live';
const LOCAL_STORAGE_STAFF_REQUESTS = 'mahakali_staff_requests_live';
const LOCAL_STORAGE_NOTIFICATIONS = 'mahakali_notifications_live';
const LOCAL_STORAGE_PACKAGES = 'mahakali_packages_live';
const LOCAL_STORAGE_SETTINGS = 'mahakali_settings_live';

const SYNC_EVENT_NAME = 'mahakali_studio_sync_event';

export const defaultSettings: StudioSettings = {
  brandName: BRAND_CONFIG.brandName,
  founder: BRAND_CONFIG.founder,
  phone: BRAND_CONFIG.contact.phone,
  phoneRaw: BRAND_CONFIG.contact.phoneRaw,
  whatsapp: BRAND_CONFIG.contact.whatsapp,
  email: BRAND_CONFIG.contact.email,
  instagram: BRAND_CONFIG.contact.instagram,
  address: BRAND_CONFIG.location.address,
  city: BRAND_CONFIG.location.city,
  state: BRAND_CONFIG.location.state,
  pincode: BRAND_CONFIG.location.pincode,
  tagline: BRAND_CONFIG.tagline,
  heroHeadline: 'Visual Stories. Crafted in Cinema.',
};

export function useStudioData() {
  const [orders, setOrders] = useState<OrderBooking[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_ORDERS);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [payments, setPayments] = useState<PaymentEMI[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PAYMENTS);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_INVOICES);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PORTFOLIO);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_REVIEWS);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_STAFF_REQUESTS);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [packages, setPackages] = useState<StudioPackage[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_PACKAGES);
      return cached ? JSON.parse(cached) : BRAND_CONFIG.packages;
    } catch {
      return BRAND_CONFIG.packages;
    }
  });

  const [settings, setSettings] = useState<StudioSettings>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
      return cached ? JSON.parse(cached) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Dispatch custom event to notify all hooks on the same window
  const notifyStateChange = useCallback(() => {
    window.dispatchEvent(new Event(SYNC_EVENT_NAME));
  }, []);

  // Listen to same-window and cross-window sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const o = localStorage.getItem(LOCAL_STORAGE_ORDERS);
        if (o) setOrders(JSON.parse(o));
        const p = localStorage.getItem(LOCAL_STORAGE_PAYMENTS);
        if (p) setPayments(JSON.parse(p));
        const i = localStorage.getItem(LOCAL_STORAGE_INVOICES);
        if (i) setInvoices(JSON.parse(i));
        const pf = localStorage.getItem(LOCAL_STORAGE_PORTFOLIO);
        if (pf) setPortfolioItems(JSON.parse(pf));
        const r = localStorage.getItem(LOCAL_STORAGE_REVIEWS);
        if (r) setReviews(JSON.parse(r));
        const s = localStorage.getItem(LOCAL_STORAGE_STAFF_REQUESTS);
        if (s) setStaffRequests(JSON.parse(s));
        const n = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS);
        if (n) setNotifications(JSON.parse(n));
        const pkg = localStorage.getItem(LOCAL_STORAGE_PACKAGES);
        if (pkg) setPackages(JSON.parse(pkg));
        const set = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
        if (set) setSettings(JSON.parse(set));
      } catch (err) {
        console.error('Failed to sync storage', err);
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Sync with Supabase if configured with active database
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchFromSupabase = async () => {
      setLoading(true);
      try {
        const { data: dbOrders } = await supabase
          .from('orders_bookings')
          .select('*, client:users(id, full_name, email, phone)')
          .order('created_at', { ascending: false });

        if (dbOrders) {
          setOrders(dbOrders as unknown as OrderBooking[]);
          localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(dbOrders));
        }

        const { data: dbPayments } = await supabase
          .from('payments_emi')
          .select('*')
          .order('due_date', { ascending: true });

        if (dbPayments) {
          setPayments(dbPayments as unknown as PaymentEMI[]);
          localStorage.setItem(LOCAL_STORAGE_PAYMENTS, JSON.stringify(dbPayments));
        }

        const { data: dbInvoices } = await supabase
          .from('invoices')
          .select('*')
          .order('generated_date', { ascending: false });

        if (dbInvoices) {
          setInvoices(dbInvoices as unknown as Invoice[]);
          localStorage.setItem(LOCAL_STORAGE_INVOICES, JSON.stringify(dbInvoices));
        }
      } catch (err) {
        console.warn('[useStudioData] Supabase sync notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFromSupabase();
  }, []);

  // --- Notification Helper ---
  const pushNotification = useCallback(
    (notif: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => {
      const newNotif: AdminNotification = {
        ...notif,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS, JSON.stringify(updated));
        return updated;
      });
      notifyStateChange();
    },
    [notifyStateChange]
  );

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === notifId ? { ...n, read: true } : n));
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const deleteNotification = (notifId: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== notifId);
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  // --- Orders & Enquiries ---
  const createBooking = (
    newBooking: Partial<OrderBooking>,
    clientName: string,
    clientEmail: string,
    clientPhone: string
  ) => {
    const orderId = crypto.randomUUID();
    const clientId = crypto.randomUUID();

    const createdOrder: OrderBooking = {
      id: orderId,
      client_id: clientId,
      package_name: newBooking.package_name || 'MAHAKALI ULTRA ASLI 4K',
      event_date: newBooking.event_date || new Date().toISOString().split('T')[0],
      event_type: newBooking.event_type || 'Wedding',
      total_amount: Number(newBooking.total_amount) || 125000,
      balance_due: Number(newBooking.total_amount) || 125000,
      status: 'New Enquiry',
      delivery_estimate_days: newBooking.delivery_estimate_days || 40,
      venue_location: newBooking.venue_location || '',
      special_instructions: newBooking.special_instructions || '',
      deliverables: {
        albums: false,
        penDrives: false,
        reelEdits: false,
        frames: false,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      client: {
        id: clientId,
        full_name: clientName,
        email: clientEmail,
        phone: clientPhone,
        role: 'client',
        is_verified: true,
        created_at: new Date().toISOString(),
      },
    };

    const updatedOrders = [createdOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(updatedOrders));

    // Default 3-milestone breakdown: 20% advance, 50% shoot day, 30% delivery
    const advanceAmount = Math.round(createdOrder.total_amount * 0.2);
    const shootAmount = Math.round(createdOrder.total_amount * 0.5);
    const deliveryAmount = createdOrder.total_amount - advanceAmount - shootAmount;

    const newPayments: PaymentEMI[] = [
      {
        id: crypto.randomUUID(),
        order_id: orderId,
        installment_no: 1,
        milestone_name: '20% Booking Advance',
        due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        amount: advanceAmount,
        status: 'Pending',
        transaction_ref: null,
        paid_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        order_id: orderId,
        installment_no: 2,
        milestone_name: '50% On Shoot Day',
        due_date: createdOrder.event_date,
        amount: shootAmount,
        status: 'Pending',
        transaction_ref: null,
        paid_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        order_id: orderId,
        installment_no: 3,
        milestone_name: '30% On Final Album Delivery',
        due_date: new Date(
          new Date(createdOrder.event_date).getTime() + (createdOrder.delivery_estimate_days || 40) * 86400000
        )
          .toISOString()
          .split('T')[0],
        amount: deliveryAmount,
        status: 'Pending',
        transaction_ref: null,
        paid_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const updatedPayments = [...newPayments, ...payments];
    setPayments(updatedPayments);
    localStorage.setItem(LOCAL_STORAGE_PAYMENTS, JSON.stringify(updatedPayments));

    // Send real-time notification
    pushNotification({
      type: 'enquiry',
      title: 'New Client Enquiry Received',
      message: `${clientName} inquired for ${createdOrder.package_name} (${createdOrder.event_type}) on ${createdOrder.event_date}`,
      linkTab: 'bookings',
      metadata: {
        orderId,
        clientName,
        phone: clientPhone,
        email: clientEmail,
        amount: createdOrder.total_amount,
      },
    });

    notifyStateChange();
    return createdOrder;
  };

  const updateOrderStatus = (orderId: string, status: BookingStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
    );
    setOrders(updated);
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(updated));
    notifyStateChange();
  };

  const updateDeliverables = (orderId: string, checklist: Partial<DeliverablesChecklist>) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const currentDeliverables = o.deliverables || {
          albums: false,
          penDrives: false,
          reelEdits: false,
          frames: false,
        };
        return {
          ...o,
          deliverables: { ...currentDeliverables, ...checklist },
          updated_at: new Date().toISOString(),
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(updated));
    notifyStateChange();
  };

  const toggleEmiStatus = (paymentId: string, customTxnRef?: string) => {
    let targetOrderId = '';

    const updatedPayments = payments.map((p) => {
      if (p.id === paymentId) {
        targetOrderId = p.order_id;
        const willBePaid = p.status !== 'Paid';
        return {
          ...p,
          status: (willBePaid ? 'Paid' : 'Pending') as PaymentStatus,
          transaction_ref: willBePaid
            ? customTxnRef || `TXN_MP_${Date.now().toString().slice(-8)}`
            : null,
          paid_at: willBePaid ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });

    setPayments(updatedPayments);
    localStorage.setItem(LOCAL_STORAGE_PAYMENTS, JSON.stringify(updatedPayments));

    if (targetOrderId) {
      recalculateOrderBalanceAndInvoices(targetOrderId, updatedPayments);
    }
    notifyStateChange();
  };

  const recalculateOrderBalanceAndInvoices = (orderId: string, paymentList: PaymentEMI[]) => {
    const orderEmis = paymentList.filter((p) => p.order_id === orderId);
    const paidSum = orderEmis
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        const newBalance = Math.max(0, Number(o.total_amount) - paidSum);
        return {
          ...o,
          balance_due: newBalance,
          updated_at: new Date().toISOString(),
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    localStorage.setItem(LOCAL_STORAGE_ORDERS, JSON.stringify(updatedOrders));

    const updatedInvoices = invoices.map((inv) => {
      if (inv.order_id === orderId) {
        const total = Number(inv.total_amount);
        let newStatus: 'Paid' | 'Partially_Paid' | 'Unpaid' = 'Unpaid';
        if (paidSum >= total) {
          newStatus = 'Paid';
        } else if (paidSum > 0) {
          newStatus = 'Partially_Paid';
        }
        return {
          ...inv,
          payment_status: newStatus,
          updated_at: new Date().toISOString(),
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    localStorage.setItem(LOCAL_STORAGE_INVOICES, JSON.stringify(updatedInvoices));
  };

  const generateInvoiceForOrder = (orderId: string): Invoice => {
    const targetOrder = orders.find((o) => o.id === orderId);
    const existing = invoices.find((i) => i.order_id === orderId);
    if (existing) return existing;

    const orderTotal = targetOrder ? targetOrder.total_amount : 125000;
    const subtotal = Math.round((orderTotal / 1.18) * 100) / 100;
    const taxAmount = Math.round((orderTotal - subtotal) * 100) / 100;

    const orderEmis = payments.filter((p) => p.order_id === orderId);
    const paidSum = orderEmis
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    let paymentStatus: 'Paid' | 'Partially_Paid' | 'Unpaid' = 'Unpaid';
    if (paidSum >= orderTotal) {
      paymentStatus = 'Paid';
    } else if (paidSum > 0) {
      paymentStatus = 'Partially_Paid';
    }

    const nextNumber = invoices.length + 101;
    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      order_id: orderId,
      invoice_number: `INV-MP-2026-${String(nextNumber).padStart(4, '0')}`,
      generated_date: new Date().toISOString(),
      pdf_url: null,
      payment_status: paymentStatus,
      subtotal,
      tax_amount: taxAmount,
      total_amount: orderTotal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem(LOCAL_STORAGE_INVOICES, JSON.stringify(updatedInvoices));
    notifyStateChange();
    return newInvoice;
  };

  // --- Portfolio ---
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id' | 'created_at'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    const updated = [newItem, ...portfolioItems];
    setPortfolioItems(updated);
    localStorage.setItem(LOCAL_STORAGE_PORTFOLIO, JSON.stringify(updated));
    notifyStateChange();
    return newItem;
  };

  const removePortfolioItem = (itemId: string) => {
    const updated = portfolioItems.filter((i) => i.id !== itemId);
    setPortfolioItems(updated);
    localStorage.setItem(LOCAL_STORAGE_PORTFOLIO, JSON.stringify(updated));
    notifyStateChange();
  };

  // --- Reviews Moderation ---
  const submitReview = (data: {
    clientName: string;
    eventType: string;
    rating: number;
    reviewText: string;
    shootDate?: string;
  }) => {
    const newReview: CustomerReview = {
      id: crypto.randomUUID(),
      clientName: data.clientName.trim(),
      eventType: data.eventType || 'Wedding',
      rating: Math.min(5, Math.max(1, data.rating)),
      reviewText: data.reviewText.trim(),
      shootDate: data.shootDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => {
      const updated = [newReview, ...prev];
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(updated));
      return updated;
    });

    pushNotification({
      type: 'review',
      title: 'New Client Review Pending Moderation',
      message: `${newReview.clientName} left a ${newReview.rating}★ review for ${newReview.eventType}`,
      linkTab: 'reviews',
      metadata: {
        clientName: newReview.clientName,
        rating: newReview.rating,
      },
    });

    notifyStateChange();
    return newReview;
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.id === reviewId ? { ...r, status: 'approved' as const } : r
      );
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const rejectReview = (reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.map((r) =>
        r.id === reviewId ? { ...r, status: 'rejected' as const } : r
      );
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== reviewId);
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  // --- Staff Requests & Access Gatekeeper ---
  const submitStaffRequest = (data: {
    fullName: string;
    email: string;
    phone: string;
    requestedRole: string;
    reason: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const newRequest: StaffRequest = {
      id: crypto.randomUUID(),
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      requestedRole: data.requestedRole,
      reason: data.reason.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setStaffRequests((prev) => {
      // Overwrite if previously requested by same email
      const filtered = prev.filter((s) => s.email.toLowerCase() !== cleanEmail);
      const updated = [newRequest, ...filtered];
      localStorage.setItem(LOCAL_STORAGE_STAFF_REQUESTS, JSON.stringify(updated));
      return updated;
    });

    pushNotification({
      type: 'staff_request',
      title: 'New Staff Access Request',
      message: `${newRequest.fullName} requested studio access as ${newRequest.requestedRole}`,
      linkTab: 'staff',
      metadata: {
        clientName: newRequest.fullName,
        email: newRequest.email,
        phone: newRequest.phone,
        role: newRequest.requestedRole,
      },
    });

    notifyStateChange();
    return newRequest;
  };

  const approveStaffRequest = (requestId: string, reviewedBy: string = 'Vishal Giri (Director)') => {
    setStaffRequests((prev) => {
      const updated = prev.map((s) =>
        s.id === requestId
          ? {
              ...s,
              status: 'approved' as const,
              approvedAt: new Date().toISOString(),
              reviewedBy,
            }
          : s
      );
      localStorage.setItem(LOCAL_STORAGE_STAFF_REQUESTS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const rejectStaffRequest = (requestId: string) => {
    setStaffRequests((prev) => {
      const updated = prev.map((s) =>
        s.id === requestId ? { ...s, status: 'rejected' as const } : s
      );
      localStorage.setItem(LOCAL_STORAGE_STAFF_REQUESTS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const deleteStaffRequest = (requestId: string) => {
    setStaffRequests((prev) => {
      const updated = prev.filter((s) => s.id !== requestId);
      localStorage.setItem(LOCAL_STORAGE_STAFF_REQUESTS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  // --- Packages CRUD ---
  const addPackage = (newPkg: StudioPackage) => {
    setPackages((prev) => {
      const updated = [newPkg, ...prev];
      localStorage.setItem(LOCAL_STORAGE_PACKAGES, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const updatePackage = (pkgId: string, updatedFields: Partial<StudioPackage>) => {
    setPackages((prev) => {
      const updated = prev.map((p) => (p.id === pkgId ? { ...p, ...updatedFields } : p));
      localStorage.setItem(LOCAL_STORAGE_PACKAGES, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  const deletePackage = (pkgId: string) => {
    setPackages((prev) => {
      const updated = prev.filter((p) => p.id !== pkgId);
      localStorage.setItem(LOCAL_STORAGE_PACKAGES, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  // --- Studio Settings ---
  const updateSettings = (newSettings: Partial<StudioSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(updated));
      return updated;
    });
    notifyStateChange();
  };

  return {
    orders,
    payments,
    invoices,
    portfolioItems,
    reviews,
    staffRequests,
    notifications,
    packages,
    settings,
    loading,
    createBooking,
    updateOrderStatus,
    updateDeliverables,
    toggleEmiStatus,
    generateInvoiceForOrder,
    addPortfolioItem,
    removePortfolioItem,
    submitReview,
    approveReview,
    rejectReview,
    deleteReview,
    submitStaffRequest,
    approveStaffRequest,
    rejectStaffRequest,
    deleteStaffRequest,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    addPackage,
    updatePackage,
    deletePackage,
    updateSettings,
  };
}