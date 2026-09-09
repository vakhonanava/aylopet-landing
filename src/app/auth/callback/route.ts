import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

/**
 * Supabase can land here in three different shapes and this route used to
 * understand only the first:
 *
 *  1. PKCE / OAuth      → `?code=...`
 *  2. Email links       → `?token_hash=...&type=recovery|signup|email_change|...`
 *  3. Provider failures → `?error=...&error_description=...`
 *
 * Recovery emails generated from the default Supabase template use shape 2, so
 * every password-reset link fell through to the "no code" branch and bounced the
 * user to `/auth/login?error=auth` instead of opening the new-password screen.
 */

const RECOVERY_NEXT = "/auth/reset-password";

/** Recovery links that fail verification belong on forgot-password, not login. */
function expiredRedirect(request: Request) {
  return NextResponse.redirect(
    new URL("/auth/forgot-password?error=expired", request.url),
  );
}

function safePath(next: string | null, fallback = "/dashboard"): string {
  if (!next) return fallback;
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const providerError =
    url.searchParams.get("error_description") ?? url.searchParams.get("error");
  const errorCode = url.searchParams.get("error_code");

  const isRecovery = type === "recovery";
  const safeNext = safePath(
    url.searchParams.get("next"),
    isRecovery ? RECOVERY_NEXT : "/dashboard",
  );

  // Supabase reports provider/OTP failures as query params rather than an
  // exception. Pass the reason through so the login screen can say what broke
  // instead of showing a bare "authorization failed".
  if (providerError) {
    if (isRecovery || errorCode === "otp_expired") {
      return expiredRedirect(request);
    }
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("error", "auth");
    loginUrl.searchParams.set("reason", providerError);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      return isRecovery
        ? expiredRedirect(request)
        : NextResponse.redirect(
            new URL(
              `/auth/login?error=auth&reason=${encodeURIComponent(error.message)}`,
              request.url,
            ),
          );
    }
    return NextResponse.redirect(new URL(safeNext, request.url));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return isRecovery
        ? expiredRedirect(request)
        : NextResponse.redirect(
            new URL(
              `/auth/login?error=auth&reason=${encodeURIComponent(error.message)}`,
              request.url,
            ),
          );
    }
    return NextResponse.redirect(new URL(safeNext, request.url));
  }

  // No code, no token: an implicit-flow link that put the tokens in the URL
  // fragment. The fragment never reaches the server, so hand off to a client
  // page that can read `window.location.hash` and establish the session there.
  return NextResponse.redirect(
    new URL(
      `/auth/callback/complete?next=${encodeURIComponent(safeNext)}`,
      request.url,
    ),
  );
}
