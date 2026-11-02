// ==============================================================================
// Mahakali Production - Authentication & Session Types
// ==============================================================================

import { UserRole } from './database';

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_verified: boolean;
  phone?: string | null;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: UserRole;
  is_verified: boolean;
  iat?: number;
  exp?: number;
}

export interface PendingVerificationSession {
  userId: string;
  email: string;
  expiresAt: number;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  redirectTo?: string;
}
