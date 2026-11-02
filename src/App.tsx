// ==============================================================================
// MAHAKALI PRODUCTION - App Router & Route Hierarchy (React Router v6)
// With Awwwards-style Custom Cursor, Lenis Smooth Scroll, and Route Guards
// ==============================================================================

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CinematicCursor } from '@/components/3d/CinematicCursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Lazy-loaded routes for optimal chunking and high-performance loading
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const Packages = lazy(() => import('@/pages/Packages').then((m) => ({ default: m.Packages })));
const BookNow = lazy(() => import('@/pages/BookNow').then((m) => ({ default: m.BookNow })));
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail').then((m) => ({ default: m.VerifyEmail })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const ClientPortal = lazy(() => import('@/pages/ClientPortal').then((m) => ({ default: m.ClientPortal })));

// Luxury Brand Logo Startup Loader & Skeleton Fallback
function StudioLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center p-6 select-none">
      <div className="relative mb-6">
        {/* Soft background pulse halo */}
        <div className="absolute -inset-4 rounded-full bg-white/5 blur-2xl animate-pulse" />
        <img
          src="/brand/logo-dark.png"
          alt="Mahakali Production"
          className="relative h-16 sm:h-20 w-auto object-contain animate-pulse"
        />
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 font-semibold mb-1">
        MAHAKALI PRODUCTION
      </div>
      <div className="text-xs text-zinc-500 font-sans tracking-widest">
        Cinema House &bull; Shujalpur
      </div>
    </div>
  );
}

// Initial mount splash loader
function StartupOverlay({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 600);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-[#09090B] flex flex-col items-center justify-center pointer-events-none select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <img
          src="/brand/logo-dark.png"
          alt="Mahakali Production"
          className="h-16 sm:h-20 w-auto object-contain mx-auto mb-4"
        />
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 font-medium">
          Mahakali Production
        </div>
      </motion.div>
    </motion.div>
  );
}

// Smooth scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isMounting, setIsMounting] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isMounting && <StartupOverlay onFinish={() => setIsMounting(false)} />}
      </AnimatePresence>

      {!isAdmin && <CinematicCursor />}
      <ScrollToTop />

      <Suspense fallback={<StudioLoadingFallback />}>
        {isAdmin ? (
          <div className="min-h-screen bg-[#09090B] text-slate-100">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen bg-[#09090B] text-slate-100">
            <Navbar />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Routes location={location}>
                    {/* 1. Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/book-now" element={<BookNow />} />

                    {/* 2. Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                    {/* 3. Protected Routes */}
                    <Route
                      path="/client-portal/*"
                      element={
                        <ProtectedRoute>
                          <ClientPortal />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback to Home */}
                    <Route path="*" element={<Home />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        )}
      </Suspense>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SmoothScroll>
          <AppContent />
        </SmoothScroll>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
