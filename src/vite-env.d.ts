/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STUDIO_PHONE: string;
  readonly VITE_STUDIO_EMAIL: string;
  readonly VITE_STUDIO_LOCATION: string;
  readonly VITE_STUDIO_DIRECTOR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
