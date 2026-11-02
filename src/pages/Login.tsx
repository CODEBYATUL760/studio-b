// ==============================================================================
// MAHAKALI PRODUCTION - Auth Sign-In / Client Registration / Staff Gatekeeper
// Strict Single-Admin + Staff Approval Verification & Live Status Polling
// Pure Monochrome: #09090B & #121215
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Film,
  Camera,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStudioData } from '@/hooks/useStudioData';
import { BRAND_CONFIG } from '@/config/brand';
import { StaffRequest } from '@/types/database';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, demoLogin } = useAuth();
  const { submitStaffRequest, staffRequests } = useStudioData();

  // Mode: 'signin' | 'register' | 'staff_request'
  const [activeTab, setActiveTab] = useState<'signin' | 'staff_request'>('signin');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // Sign In / Register Fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Staff Request Fields
  const [staffName, setStaffName] = useState<string>('');
  const [staffEmail, setStaffEmail] = useState<string>('');
  const [staffPhone, setStaffPhone] = useState<string>('');
  const [staffRole, setStaffRole] = useState<string>('Lead Cinematographer');
  const [staffReason, setStaffReason] = useState<string>('');
  const [submittedStaffEmail, setSubmittedStaffEmail] = useState<string | null>(() => {
    return sessionStorage.getItem('mahakali_pending_staff_email') || null;
  });

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  // Find active staff request if submitted
  const activeStaffRequest: StaffRequest | undefined = submittedStaffEmail
    ? staffRequests.find(
        (s) => s.email.toLowerCase() === submittedStaffEmail.trim().toLowerCase()
      )
    : undefined;

  // Auto-poll approval status every 3 seconds if waiting for approval
  useEffect(() => {
    if (activeStaffRequest && activeStaffRequest.status === 'pending') {
      const interval = setInterval(() => {
        try {
          const raw = localStorage.getItem('mahakali_staff_requests_live');
          if (raw) {
            const list = JSON.parse(raw);
            const found = list.find(
              (s: StaffRequest) =>
                s.email.toLowerCase() === submittedStaffEmail?.trim().toLowerCase()
            );
            if (found && found.status === 'approved') {
              // Trigger sync
              window.dispatchEvent(new Event('mahakali_studio_sync_event'));
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeStaffRequest, submittedStaffEmail]);

  // Handle Sign-In & Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!fullName.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }

        const res = await register({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: 'client',
        });

        if (res.error) {
          setError(res.error);
        } else {
          navigate('/verify-email', {
            state: { email, message: 'Please enter the 6-digit verification code.' },
          });
        }
      } else {
        const res = await login(email, password);
        if (res.error) {
          setError(res.error);
        } else if (res.requireVerification) {
          navigate('/verify-email', {
            state: { email, message: 'Your account requires email verification.' },
          });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during authentication.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Staff Access Request Submission
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPhone) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const req = submitStaffRequest({
        fullName: staffName,
        email: staffEmail,
        phone: staffPhone,
        requestedRole: staffRole,
        reason: staffReason || 'Studio production crew member requesting admin access.',
      });
      sessionStorage.setItem('mahakali_pending_staff_email', req.email);
      setSubmittedStaffEmail(req.email);
    } catch (err) {
      setError('Failed to submit staff request.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter Studio after staff request approval
  const handleEnterAsApprovedStaff = async () => {
    if (!activeStaffRequest) return;
    setLoading(true);
    const res = await login(activeStaffRequest.email, 'Mahakali@2026');
    setLoading(false);
    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(res.error || 'Failed to authenticate approved staff.');
    }
  };

  const handleInstantDemo = (targetRole: 'admin' | 'client') => {
    demoLogin(targetRole);
    navigate(targetRole === 'admin' ? '/admin' : '/client-portal', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center items-center px-4 py-16 selection:bg-white/20 selection:text-white">
      {/* Quick Demo Pre-fill Bar */}
      <div className="w-full max-w-md mb-6 p-4 rounded-2xl bg-[#121215] border border-white/10 shadow-xl">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            Quick Access Switcher
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Verified Studio Access</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleInstantDemo('admin')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#09090B] text-zinc-200 hover:text-white border border-white/10 transition-all text-left"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Owner (Vishal)</span>
          </button>
          <button
            type="button"
            onClick={() => handleInstantDemo('client')}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#09090B] text-zinc-200 hover:text-white border border-white/10 transition-all text-left"
          >
            <Film className="w-3.5 h-3.5 text-white shrink-0" />
            <span>VIP Client</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/brand/logo-dark.png"
              alt="Mahakali Production"
              className="h-14 sm:h-16 w-auto object-contain mx-auto filter contrast-125"
            />
          </Link>

          {/* Toggle: Sign In vs Staff Access Request */}
          <div className="inline-flex p-1 rounded-xl bg-[#09090B] border border-white/10 mt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Studio Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('staff_request');
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 ${
                activeTab === 'staff_request'
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Staff Access</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* TAB 1: STUDIO SIGN IN & CLIENT REGISTER */}
        {activeTab === 'signin' && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-lg font-bold font-display uppercase tracking-tight text-white">
                {isRegisterMode ? 'Create Studio Account' : 'Studio Portal Sign In'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {isRegisterMode
                  ? 'Mandatory 6-digit OTP verification prior to activation'
                  : 'Primary Admin & Verified Client Portal'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Priya & Rahul Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mahakaliproduction.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 8719878719"
                    className="w-full px-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Send Verification Code' : 'Enter Studio Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-zinc-400">
              {isRegisterMode ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="text-white hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Need a new booking account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(true)}
                    className="text-white hover:underline font-semibold"
                  >
                    Register Now
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        {/* TAB 2: STAFF ACCESS REQUEST & LIVE APPROVAL STATUS SCREEN */}
        {activeTab === 'staff_request' && (
          <div>
            {/* If staff request is active and pending approval */}
            {activeStaffRequest && activeStaffRequest.status === 'pending' ? (
              <div className="text-center py-4 space-y-5">
                {/* Pulsing Aperture Radar Ring */}
                <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-75" />
                  <div className="w-16 h-16 rounded-full bg-[#09090B] border border-white/30 flex items-center justify-center text-white shadow-xl">
                    <Radio className="w-7 h-7 text-white animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                    <span>Awaiting Admin Approval</span>
                  </div>
                  <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white">
                    Request Under Review
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Your access request as <span className="text-white font-semibold">{activeStaffRequest.requestedRole}</span> has been transmitted to Creative Director <span className="text-white font-semibold">{BRAND_CONFIG.founder}</span>.
                  </p>
                </div>

                {/* Live Auto-Polling Status Badge */}
                <div className="p-3.5 rounded-xl bg-[#09090B] border border-white/10 text-left text-xs space-y-1.5">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Staff Applicant:</span>
                    <span className="text-white font-medium">{activeStaffRequest.fullName}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Registered Email:</span>
                    <span className="text-white font-mono">{activeStaffRequest.email}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Status Polling:</span>
                    <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live (3s)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('mahakali_pending_staff_email');
                    setSubmittedStaffEmail(null);
                  }}
                  className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
                >
                  Submit a different request &rarr;
                </button>
              </div>
            ) : activeStaffRequest && activeStaffRequest.status === 'approved' ? (
              /* Approved State */
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 shadow-xl">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                    Access Approved
                  </span>
                  <h2 className="text-lg font-bold font-display uppercase tracking-tight text-white mt-2">
                    Welcome to Studio Crew
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Creative Director {BRAND_CONFIG.founder} has unlocked your {activeStaffRequest.requestedRole} credentials.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleEnterAsApprovedStaff}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enter Studio Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Initial Staff Access Request Form */
              <div>
                <div className="text-center mb-6">
                  <h1 className="text-lg font-bold font-display uppercase tracking-tight text-white">
                    Request Staff Credentials
                  </h1>
                  <p className="text-xs text-zinc-400 mt-1">
                    For Cinematographers, Editors, and Drone Operators. Requires Single-Admin authorization.
                  </p>
                </div>

                <form onSubmit={handleStaffSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="e.g. Aman Sharma"
                      className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Staff Email
                    </label>
                    <input
                      type="email"
                      required
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="aman.cinema@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      placeholder="+91 98260 12345"
                      className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Requested Role
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#09090B] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Lead Cinematographer">Lead Cinematographer</option>
                      <option value="Senior Video Editor">Senior Video Editor</option>
                      <option value="Candid Photographer">Candid Photographer</option>
                      <option value="Drone Pilot">Drone Pilot</option>
                      <option value="Colorist & Sound Designer">Colorist & Sound Designer</option>
                      <option value="Production Assistant">Production Assistant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1">
                      Reason for Access / Portfolio Link
                    </label>
                    <textarea
                      rows={2}
                      value={staffReason}
                      onChange={(e) => setStaffReason(e.target.value)}
                      placeholder="Shooting upcoming Shujalpur wedding schedule..."
                      className="w-full px-3.5 py-2 bg-[#09090B] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 px-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Access Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
