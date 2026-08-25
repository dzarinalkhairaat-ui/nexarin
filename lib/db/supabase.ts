import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseUrl.startsWith("https://") && supabaseAnonKey
);

let _supabaseClient: SupabaseClient | null = null;
let _supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return _supabaseClient;
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseServiceKey) return null;
  if (!_supabaseAdminClient) {
    _supabaseAdminClient = createClient(supabaseUrl!, supabaseServiceKey, {
      auth: { persistSession: false }
    });
  }
  return _supabaseAdminClient;
}
