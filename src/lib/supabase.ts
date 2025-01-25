import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Replace these with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  getUser: async () => {
    return await supabase.auth.getUser();
  },
};

// Database operations
export const db = {
  // User profiles
  profiles: {
    get: async (userId: string) => {
      return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    },
    update: async (userId: string, data: any) => {
      return await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);
    },
  },
  // Gaming sessions
  sessions: {
    create: async (data: any) => {
      return await supabase
        .from('gaming_sessions')
        .insert(data);
    },
    get: async (userId: string) => {
      return await supabase
        .from('gaming_sessions')
        .select('*')
        .eq('user_id', userId);
    },
  },
  // Gold transactions
  transactions: {
    create: async (data: any) => {
      return await supabase
        .from('gold_transactions')
        .insert(data);
    },
    getHistory: async (userId: string) => {
      return await supabase
        .from('gold_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
  },
};