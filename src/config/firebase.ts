import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { createClient } from "@supabase/supabase-js";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Realtime Database
export const database = getDatabase(app);
export const storage = getStorage(app);

let SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || undefined;
let SUPABASE_ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || undefined;
let SUPABASE_SERVICE = (import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string | undefined) || undefined;
SUPABASE_URL = SUPABASE_URL ? SUPABASE_URL.replace(/[`'\"]/g, "").trim() : SUPABASE_URL;
let SUPABASE_KEY = (SUPABASE_ANON || SUPABASE_SERVICE)?.trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  try {
    const lsUrl = localStorage.getItem("SUPABASE_URL") || localStorage.getItem("VITE_SUPABASE_URL") || undefined;
    const lsAnon = localStorage.getItem("SUPABASE_ANON_KEY") || localStorage.getItem("VITE_SUPABASE_ANON_KEY") || undefined;
    const lsService = localStorage.getItem("SUPABASE_SERVICE_ROLE_KEY") || localStorage.getItem("VITE_SUPABASE_SERVICE_ROLE_KEY") || undefined;
    const candUrl = lsUrl ? lsUrl.replace(/[`'\"]/g, "").trim() : undefined;
    const candKey = (lsAnon || lsService)?.trim();
    if (candUrl && candKey) {
      SUPABASE_URL = candUrl;
      SUPABASE_KEY = candKey;
    }
  } catch {}
}

export const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : undefined;

export default app;
