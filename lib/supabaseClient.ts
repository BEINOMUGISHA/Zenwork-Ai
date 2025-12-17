import { createClient } from '@supabase/supabase-js';

// Access environment variables safely
// Note: In a real deployment, ensure these are set in your .env file
const supabaseUrl = typeof process !== 'undefined' && process.env ? (process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL) : '';
const supabaseAnonKey = typeof process !== 'undefined' && process.env ? (process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) : '';

// Only create the client if keys are present
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = !!supabase;