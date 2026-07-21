import { createAdminClient } from "@supabase/server/core";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseAdminKey,
  getSupabaseServerEnv,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

let adminClient: SupabaseClient | null = null;

export function createSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL + SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  if (!adminClient) {
    try {
      adminClient = createAdminClient({
        env: getSupabaseServerEnv(),
      });
    } catch {
      // Fallback for legacy JWT service role keys.
      adminClient = createClient(getSupabaseUrl()!, getSupabaseAdminKey()!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }

  return adminClient;
}
