import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/** Keeps the redirect on this origin so `next` cannot be used as an open redirect. */
function safePath(next: string | null): string {
  if (!next) return "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function loginRedirect(request: Request, next: string, reason: string) {
  const url = new URL("/auth/login", request.url);
  url.searchParams.set("error", "oauth");
  url.searchParams.set("next", next);
  // Surfaced in small print on the login page — without it every OAuth failure
  // (provider denial, unlinkable email, expired code) looks identical.
  if (reason) url.searchParams.set("reason", reason.slice(0, 200));
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safePath(url.searchParams.get("next"));

  const providerError =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error_code") ??
    url.searchParams.get("error");

  if (providerError) {
    return loginRedirect(request, next, providerError);
  }

  if (!code) {
    return loginRedirect(request, next, "missing_code");
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return loginRedirect(request, next, error.message);
    }
  } catch (cause) {
    // Missing PKCE verifier cookie or unconfigured env would otherwise render a
    // raw 500 page at the end of an otherwise successful Google sign-in.
    return loginRedirect(
      request,
      next,
      cause instanceof Error ? cause.message : "callback_failed",
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
