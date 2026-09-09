"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";
import { createClient } from "@/utils/supabase/client";

/**
 * Terminal step for Supabase links that use the implicit flow, where the tokens
 * arrive in the URL fragment (`#access_token=...&refresh_token=...`). A fragment
 * never reaches the server, so `/auth/callback` cannot handle those links and
 * hands off here — this page reads the hash, installs the session, and continues
 * to `next`. Without it, recovery links landed on the login screen with a bare
 * authorization error instead of the "create new password" screen.
 */

function parseHash(hash: string): Record<string, string> {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return Object.fromEntries(params.entries());
}

function safePath(next: string | null): string {
  if (!next) return "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function CallbackCompleteContent() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const params = useSearchParams();

  useEffect(() => {
    const next = safePath(params.get("next"));
    const hash = parseHash(window.location.hash);

    const fail = () => {
      const recovery =
        hash.type === "recovery" || next.startsWith("/auth/reset-password");
      window.location.replace(
        recovery ? "/auth/forgot-password?error=expired" : "/auth/login?error=auth",
      );
    };

    if (hash.error || hash.error_description) {
      fail();
      return;
    }

    if (!hash.access_token || !hash.refresh_token) {
      fail();
      return;
    }

    let cancelled = false;
    const supabase = (() => {
      try {
        return createClient();
      } catch {
        return null;
      }
    })();

    if (!supabase) {
      fail();
      return;
    }

    void supabase.auth
      .setSession({
        access_token: hash.access_token,
        refresh_token: hash.refresh_token,
      })
      .then(({ error }) => {
        if (cancelled) return;
        if (error) {
          fail();
          return;
        }
        // Drop the tokens from the address bar before moving on.
        window.history.replaceState(null, "", window.location.pathname);
        window.location.replace(next);
      });

    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)]">
      <p className="text-sm text-[var(--text-secondary)]">{a.loading}</p>
    </main>
  );
}

export default function AuthCallbackCompletePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)]">
          <p className="text-sm text-[var(--text-secondary)]">Loading…</p>
        </main>
      }
    >
      <CallbackCompleteContent />
    </Suspense>
  );
}
