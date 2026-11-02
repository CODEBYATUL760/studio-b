// ==============================================================================
// MAHAKALI PRODUCTION - Mandatory Email OTP Verification Screen
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BRAND_CONFIG } from '@/config/brand';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOtp, resendOtp, pendingEmail, user } = useAuth();

  const emailToVerify = pendingEmail || user?.email || 'your registered email';

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(45);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');

    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        newDigits[i] = char;
      });
      setDigits(newDigits);
      const targetIndex = Math.min(pasted.length, 5);
      inputRefs.current[targetIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned[0];
    setDigits(newDigits);

    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = digits.join('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const result = await verifyOtp(emailToVerify, fullOtp);

      if (!result.success) {
        setError(result.error || 'Verification failed. Please check the code.');
      } else {
        setInfoMessage('Account successfully activated! Redirecting to studio portal...');
        setTimeout(() => {
          navigate(result.role === 'admin' ? '/admin' : '/client-portal', { replace: true });
        }, 600);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(null);
    setInfoMessage(null);

    try {
      const result = await resendOtp(emailToVerify);
      if (result.success) {
        setInfoMessage('A new 6-digit verification code has been dispatched.');
        setCountdown(60);
      } else {
        setError(result.error || 'Failed to dispatch new verification code.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center items-center px-4 py-16 selection:bg-white/20 selection:text-white">
      <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative">
        <div className="w-14 h-14 rounded-2xl bg-[#09090B] border border-white/10 flex items-center justify-center text-white mx-auto mb-5 shadow-lg">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>

        <h1 className="text-2xl font-bold font-display tracking-tight text-white uppercase">
          Email Verification
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          We have sent a 6-digit verification code to{' '}
          <span className="text-white font-medium">{emailToVerify}</span>. Enter the code below
          to activate your portal access.
        </p>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {infoMessage && (
          <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-start gap-2.5 text-left">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white mt-0.5" />
            <p className="leading-relaxed">{infoMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex justify-center gap-2.5 sm:gap-3 mb-6">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-mono font-bold bg-[#09090B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-white transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || fullOtp.length !== 6}
            className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Verifying Passkey...</span>
            ) : (
              <>
                <span>Confirm & Activate Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-400">
            Did not receive the verification passkey?{' '}
            <button
              type="button"
              disabled={countdown > 0 || resending}
              onClick={handleResend}
              className="text-white hover:underline font-semibold disabled:text-zinc-600 disabled:cursor-not-allowed inline-flex items-center gap-1 ml-1"
            >
              {resending ? (
                <span>Sending...</span>
              ) : countdown > 0 ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend Code</span>
                </>
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
