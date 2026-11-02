// ==============================================================================
// MAHAKALI PRODUCTION - Protected Route Guard (React Router v6)
// Enforces Authentication, Mandatory Email Verification, and RBAC
// ==============================================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-studio-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-mono uppercase tracking-widest text-gold-400">
          Verifying Studio Security Credentials...
        </p>
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Unverified Account -> Redirect to email verification
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // 3. Role-Based Access Control (RBAC)
  if (requiredRole) {
    if (requiredRole === 'admin') {
      // Both primary admin and approved staff have studio workstation access
      if (user.role !== 'admin' && user.role !== 'staff') {
        return <Navigate to="/client-portal" replace />;
      }
    } else if (user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
