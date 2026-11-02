// ==============================================================================
// MAHAKALI PRODUCTION - Client-Side Authentication Context (Vite SPA)
// Integrates with Supabase Auth (Sign Up, Verify OTP, RBAC, Local Storage)
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserRole } from '@/types/database';
import { BRAND_CONFIG } from '@/config/brand';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  isVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requireVerification?: boolean }>;
  register: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  demoLogin: (role: UserRole) => void;
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mahakali_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Check local session cache first for fast initial paint
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }

      // 2. If Supabase is configured, sync with active Supabase session
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const role = (session.user.user_metadata?.role as UserRole) || 
              (session.user.email?.toLowerCase().includes('admin') || session.user.email?.toLowerCase().includes('vishal') ? 'admin' : 'client');

            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || BRAND_CONFIG.founder,
              phone: session.user.user_metadata?.phone || null,
              role,
              isVerified: Boolean(session.user.email_confirmed_at),
            };
            setUser(authUser);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
          }
        } catch (err) {
          console.warn('[AuthContext] Session fetch error:', err);
        }
      }

      setLoading(false);
    };

    initializeAuth();

    // Listen to Supabase auth state changes
    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) || 
            (session.user.email?.toLowerCase().includes('admin') ? 'admin' : 'client');

          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || (role === 'admin' ? BRAND_CONFIG.founder : 'VIP Client'),
            phone: session.user.user_metadata?.phone || null,
            role,
            isVerified: Boolean(session.user.email_confirmed_at),
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check for live Supabase Auth
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        setPendingEmail(cleanEmail);
        return {
          success: false,
          requireVerification: true,
          error: 'Email verification required. Please verify your 6-digit OTP code.',
        };
      }

      const role = (data.user?.user_metadata?.role as UserRole) || 
        (cleanEmail.includes('admin') || cleanEmail.includes('vishal') ? 'admin' : 'client');

      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        fullName: data.user.user_metadata?.full_name || (role === 'admin' ? BRAND_CONFIG.founder : 'VIP Client'),
        phone: data.user.user_metadata?.phone || null,
        role,
        isVerified: true,
      };

      setUser(authUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
      return { success: true };
    }

    // 2. Resilient Fallback / Demo Credentials (allows instant client evaluation)
    if (cleanEmail === 'admin@mahakaliproduction.com' || cleanEmail === 'mahakaliproduction69@gmail.com') {
      if (password === 'Mahakali@2026') {
        const adminUser: AuthUser = {
          id: 'c0000000-0000-0000-0000-000000000001',
          email: cleanEmail,
          fullName: `${BRAND_CONFIG.founder} (Creative Director)`,
          phone: BRAND_CONFIG.contact.phone,
          role: 'admin',
          isVerified: true,
        };
        setUser(adminUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(adminUser));
        return { success: true };
      }
    }

    // 2b. Check Staff Approval Gatekeeper
    try {
      const cachedStaff = localStorage.getItem('mahakali_staff_requests_live');
      if (cachedStaff) {
        const staffList = JSON.parse(cachedStaff);
        const match = staffList.find((s: any) => s.email.toLowerCase() === cleanEmail);
        if (match) {
          if (match.status === 'pending') {
            return {
              success: false,
              error: 'Staff access request is pending approval by Creative Director Vishal Giri.',
            };
          }
          if (match.status === 'rejected') {
            return {
              success: false,
              error: 'Staff access request has been revoked or declined by the Studio Director.',
            };
          }
          if (match.status === 'approved') {
            const staffUser: AuthUser = {
              id: match.id,
              email: cleanEmail,
              fullName: `${match.fullName} (${match.requestedRole})`,
              phone: match.phone,
              role: 'staff',
              isVerified: true,
            };
            setUser(staffUser);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(staffUser));
            return { success: true };
          }
        }
      }
    } catch (err) {
      console.warn('Error reading staff approvals', err);
    }

    if (cleanEmail === 'client@mahakaliproduction.com' || cleanEmail.includes('client')) {
      if (password === 'Mahakali@2026') {
        const clientUser: AuthUser = {
          id: 'c0000000-0000-0000-0000-000000000002',
          email: cleanEmail,
          fullName: 'Studio Client',
          phone: '+91 8719878719',
          role: 'client',
          isVerified: true,
        };
        setUser(clientUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clientUser));
        return { success: true };
      }
    }

    return { success: false, error: 'Invalid email or password. Please try again.' };
  };

  // Register handler
  const register = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    setPendingEmail(cleanEmail);

    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone || '',
            role: data.role,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    }

    // Fallback store simulation: Set pending for OTP verification
    sessionStorage.setItem('pending_reg_data', JSON.stringify({
      ...data,
      email: cleanEmail,
    }));
    return { success: true };
  };

  // OTP Verification handler
  const verifyOtp = async (email: string, otp: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: otp,
        type: 'email',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const role = (data.user?.user_metadata?.role as UserRole) || 'client';
      const authUser: AuthUser = {
        id: data.user?.id || crypto.randomUUID(),
        email: cleanEmail,
        fullName: data.user?.user_metadata?.full_name || 'Verified Client',
        role,
        isVerified: true,
      };

      setUser(authUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
      setPendingEmail(null);
      return { success: true, role };
    }

    // Fallback: Validate 6-digit code
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      const pendingRaw = sessionStorage.getItem('pending_reg_data');
      let registeredName = 'VIP Client';
      let assignedRole: UserRole = 'client';

      if (pendingRaw) {
        try {
          const parsed = JSON.parse(pendingRaw);
          registeredName = parsed.fullName || registeredName;
          assignedRole = parsed.role || assignedRole;
        } catch {
          // ignore
        }
      }

      const verifiedUser: AuthUser = {
        id: crypto.randomUUID(),
        email: cleanEmail,
        fullName: assignedRole === 'admin' ? `${BRAND_CONFIG.founder} (Admin)` : registeredName,
        phone: BRAND_CONFIG.contact.phone,
        role: assignedRole,
        isVerified: true,
      };

      setUser(verifiedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(verifiedUser));
      sessionStorage.removeItem('pending_reg_data');
      setPendingEmail(null);
      return { success: true, role: assignedRole };
    }

    return { success: false, error: 'Invalid 6-digit OTP passkey. Please check the digits.' };
  };

  // Resend OTP
  const resendOtp = async (email: string) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  // Logout handler
  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem('pending_reg_data');
  };

  // One-click quick demo login
  const demoLogin = (role: UserRole) => {
    const demoUser: AuthUser = role === 'admin'
      ? {
          id: 'c0000000-0000-0000-0000-000000000001',
          email: 'mahakaliproduction69@gmail.com',
          fullName: `${BRAND_CONFIG.founder} (Studio Director)`,
          phone: BRAND_CONFIG.contact.phone,
          role: 'admin',
          isVerified: true,
        }
      : {
          id: 'c0000000-0000-0000-0000-000000000002',
          email: 'client@mahakaliproduction.com',
          fullName: 'Studio Client',
          phone: '+91 8719878719',
          role: 'client',
          isVerified: true,
        };

    setUser(demoUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        demoLogin,
        pendingEmail,
        setPendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
