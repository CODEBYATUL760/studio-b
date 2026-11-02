// ==============================================================================
// MAHAKALI PRODUCTION - Client-Side Supabase Client (Vite SPA)
// ==============================================================================

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.test';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

export const isSupabaseConfigured = () => {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
  );
};
