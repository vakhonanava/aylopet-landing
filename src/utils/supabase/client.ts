import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env";

export function createClient() {
  if (!isSupabasePublicConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY on Vercel).",
    );
  }

  return createBrowserClient(getSupabaseUrl()!, getSupabasePublishableKey()!);
}

export function isBrowserSupabaseConfigured(): boolean {
  return isSupabasePublicConfigured();
}
