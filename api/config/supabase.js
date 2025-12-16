import { createClient } from '@supabase/supabase-js';

// Read from backend SUPABASE_* first, then fallback to VITE_* if present
let SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
let SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Sanitize accidental quotes/backticks and spaces
SUPABASE_URL = String(SUPABASE_URL).replace(/[`'\"]/g, '').trim();
SUPABASE_SERVICE_ROLE_KEY = String(SUPABASE_SERVICE_ROLE_KEY).trim();

let supabaseAdmin;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
} else {
  console.warn('⚠️ Supabase admin config missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  // Minimal stub to prevent crashes if env is missing
  supabaseAdmin = {
    storage: {
      listBuckets: async () => ({ data: [], error: null }),
      createBucket: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      updateBucket: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
}

export { supabaseAdmin };
