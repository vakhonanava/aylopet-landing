import type { SupabaseClient, User } from "@supabase/supabase-js";
import { formatAuthError } from "@/lib/auth/display";
import type { AuthErrorCode } from "@/lib/content/auth";

export function isEmailVerified(user: User | null | undefined): boolean {
  return Boolean(user?.email_confirmed_at);
}

/** Ensures a live session exists right after sign-up (no OTP gate). */
export async function establishSessionAfterSignUp(
  supabase: SupabaseClient,
  email: string,
  password: string,
): Promise<{ userId: string | null; error: AuthErrorCode | null }> {
  const normalizedEmail = email.trim().toLowerCase();

  const {
    data: { user: existingUser },
  } = await supabase.auth.getUser();

  if (existingUser?.id) {
    return { userId: existingUser.id, error: null };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (signInError) {
    return { userId: null, error: formatAuthError(signInError) };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return { userId: null, error: "account_not_created" };
  }

  return { userId: user.id, error: null };
}
