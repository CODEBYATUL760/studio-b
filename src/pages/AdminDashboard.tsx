// ==============================================================================
// MAHAKALI PRODUCTION - Executive Studio Admin Workstation
// Full Workstation Architecture:
// 1. Overview & Financial KPIs
// 2. Bookings & Enquiries
// 3. Portfolio Media
// 4. Packages Manager
// 5. Customer Reviews Moderation
// 6. Staff Access & Single-Admin Gatekeeper
// 7. Studio Settings
// 8. Real-Time Notification Center Drawer
// Pure Monochrome: #09090B & #121215 border border-white/10
// ==============================================================================

import React, { useState } from 'react';
import { useStudioData } from '@/hooks/useStudioData';
import { BRAND_CONFIG } from '@/config/brand';
import { OrderBooking, Invoice } from '@/types/database';

// Modular Components
import { Sidebar } from '@/components/admin/Sidebar';
import { Topbar } from '@/components/admin/Topbar';
import { KPICards } from '@/components/admin/KPICards';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { PortfolioManager } from '@/components/admin/PortfolioManager';
import { PackagesManagerPanel } from '@/components/admin/PackagesManagerPanel';
import { ReviewsModerationPanel } from '@/components/admin/ReviewsModerationPanel';
import { StaffApprovalsPanel } from '@/components/admin/StaffApprovalsPanel';
import { StudioSettingsPanel } from '@/components/admin/StudioSettingsPanel';
import { NotificationDrawer } from '@/components/admin/NotificationDrawer';

// Modals
import { EditDeliverablesModal } from '@/components/admin/EditDeliverablesModal';
import { ContractModal } from '@/components/admin/ContractModal';
import { InvoiceModal } from '@/components/admin/InvoiceModal';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    payments,
    portfolioItems,
    reviews,
    staffRequests,
    notifications,
    packages,
    settings,
    updateOrderStatus,
    updateDeliverables,
    generateInvoiceForOrder,
    addPortfolioItem,
    removePortfolioItem,
    submitReview,
    approveReview,
    rejectReview,
    deleteReview,
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
  } = useStudioData();

  // Navigation & Search State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(false);

  // Modals state
  const [editingOrder, setEditingOrder] = useState<OrderBooking | null>(null);
  const [contractOrder, setContractOrder] = useState<OrderBooking | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<OrderBooking | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const pendingStaffCount = staffRequests.filter((s) => s.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleOpenInvoice = (order: OrderBooking, inv?: Invoice) => {
    const existingOrNewInvoice = inv || generateInvoiceForOrder(order.id);
    setSelectedInvoice(existingOrNewInvoice);
    setInvoiceModalOrder(order);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'portfolio':
        return 'Portfolio Media';
      case 'bookings':
        return 'Bookings & Enquiries';
      case 'packages':
        return 'Packages Catalog';
      case 'reviews':
        return 'Reviews Moderation';
      case 'staff':
        return 'Staff Access Gatekeeper';
      case 'settings':
        return 'Studio Configuration';
      default:
        return 'Studio Overview';
    }
  };

  const getPrimaryAction = () => {
    switch (activeTab) {
      case 'portfolio':
        return { label: '+ Add Media', action: () => {} };
      case 'packages':
        return { label: '+ Add Package', action: () => {} };
      default:
        return { label: '+ Add Media', action: () => setActiveTab('portfolio') };
    }
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-300 flex font-sans antialiased selection:bg-white/20 selection:text-white">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        totalShootsCount={orders.length}
        pendingReviewsCount={pendingReviewsCount}
        pendingStaffCount={pendingStaffCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* 2. Top Navigation Bar */}
        <Topbar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unreadCount={unreadNotificationsCount}
          onOpenNotifications={() => setNotificationDrawerOpen(true)}
          activeTabTitle={getTabTitle()}
          onPrimaryAction={primaryAction.action}
          primaryActionLabel={primaryAction.label}
        />

        {/* 3. Dashboard Body Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Welcome Studio Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h1 className="text-2xl font-black font-display tracking-tight text-white uppercase">
                {getTabTitle()}
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                {settings.brandName} &bull; Soni Plaza, Shujalpur (MP)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#121215] border border-white/10 text-white shadow-sm">
                Director: <span className="font-bold">{settings.founder}</span>
              </span>
            </div>
          </div>

          {/* TAB 1: PORTFOLIO MEDIA */}
          {activeTab === 'portfolio' && (
            <PortfolioManager
              items={portfolioItems}
              onAddItem={addPortfolioItem}
              onDeleteItem={removePortfolioItem}
            />
          )}

          {/* TAB 2: BOOKINGS & ENQUIRIES */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <OrdersTable
                orders={orders}
                onUpdateStatus={updateOrderStatus}
                onUpdateDeliverables={updateDeliverables}
                onEditOrder={setEditingOrder}
                onViewContract={setContractOrder}
                searchFilter={searchQuery}
              />
            </div>
          )}

          {/* TAB 3: PACKAGES MANAGER */}
          {activeTab === 'packages' && (
            <PackagesManagerPanel
              packages={packages}
              onAddPackage={addPackage}
              onUpdatePackage={updatePackage}
              onDeletePackage={deletePackage}
            />
          )}

          {/* TAB 4: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <ReviewsModerationPanel
              reviews={reviews}
              onApprove={approveReview}
              onReject={rejectReview}
              onDelete={deleteReview}
            />
          )}

          {/* TAB 5: STAFF ACCESS GATEKEEPER */}
          {activeTab === 'staff' && (
            <StaffApprovalsPanel
              staffRequests={staffRequests}
              onApprove={approveStaffRequest}
              onReject={rejectStaffRequest}
              onDelete={deleteStaffRequest}
            />
          )}

          {/* TAB 6: STUDIO SETTINGS */}
          {activeTab === 'settings' && (
            <StudioSettingsPanel
              settings={settings}
              onSaveSettings={updateSettings}
            />
          )}

          {/* TAB 7: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <KPICards orders={orders} payments={payments} />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Recent Bookings & Enquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View All ({orders.length}) &rarr;
                  </button>
                </div>
                <OrdersTable
                  orders={orders}
                  onUpdateStatus={updateOrderStatus}
                  onUpdateDeliverables={updateDeliverables}
                  onEditOrder={setEditingOrder}
                  onViewContract={setContractOrder}
                  searchFilter={searchQuery}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Real-Time Notification Center Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onDelete={deleteNotification}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* MODAL 1: Edit Shoot & Deliverables Checklist */}
      {editingOrder && (
        <EditDeliverablesModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSaveStatus={updateOrderStatus}
          onSaveDeliverables={updateDeliverables}
        />
      )}

      {/* MODAL 2: Client Studio Contract Dossier */}
      {contractOrder && (
        <ContractModal
          order={contractOrder}
          onClose={() => setContractOrder(null)}
        />
      )}

      {/* MODAL 3: Print-Ready GST Tax Invoice */}
      {invoiceModalOrder && (
        <InvoiceModal
          order={invoiceModalOrder}
          invoice={selectedInvoice}
          payments={payments}
          onClose={() => {
            setInvoiceModalOrder(null);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};
