export function getSupabaseUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    undefined
  );
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    undefined
  );
}

/** Supabase publishable (anon) key for browser + SSR auth clients. */
export function getSupabasePublishableKey(): string | undefined {
  return getSupabaseAnonKey();
}

/** New-format secret key (`sb_secret_...`) for @supabase/server admin client. */
export function getSupabaseSecretKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY?.trim() || undefined;
}

/** Legacy JWT service role key — still supported as fallback. */
export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined;
}

export function getSupabaseJwksUrl(): string | undefined {
  const explicit = process.env.SUPABASE_JWKS_URL?.trim();
  if (explicit) return explicit;

  const url = getSupabaseUrl();
  return url ? `${url}/auth/v1/.well-known/jwks.json` : undefined;
}

/** Server-side admin credential: prefer new secret key, fall back to JWT service role. */
export function getSupabaseAdminKey(): string | undefined {
  return getSupabaseSecretKey() || getSupabaseServiceRoleKey();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAdminKey());
}

export function isSupabasePublicConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

/** Env overrides for @supabase/server resolveEnv / createAdminClient. */
export function getSupabaseServerEnv(): {
  url?: string;
  publishableKeys?: Record<string, string>;
  secretKeys?: Record<string, string>;
  jwksUrl?: string;
} {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();
  const secretKey = getSupabaseAdminKey();

  return {
    ...(url ? { url } : {}),
    ...(publishableKey ? { publishableKeys: { default: publishableKey } } : {}),
    ...(secretKey ? { secretKeys: { default: secretKey } } : {}),
    ...(getSupabaseJwksUrl() ? { jwksUrl: getSupabaseJwksUrl() } : {}),
  };
}
