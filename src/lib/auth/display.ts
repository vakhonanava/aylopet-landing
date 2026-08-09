import type { User } from "@supabase/supabase-js";
import type { AuthErrorCode } from "@/lib/content/auth";

/**
 * Auth errors are returned as stable codes rather than prose: AuthProvider
 * sits outside LocaleProvider, so the message has to be resolved by the form
 * that renders it. See getAuthCopy().errors.
 */

export function getAuthDisplayName(user: User | null | undefined): string {
  if (!user) return "";

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    "";

  if (fullName.trim()) return fullName.trim();

  const email = user.email ?? "";
  return email.split("@")[0] ?? "";
}

/**
 * Greetings address the user by first name only. Prefers the dedicated
 * `first_name` metadata written at signup, and falls back to the leading word
 * of `full_name` for accounts created before the name split.
 */
export function getAuthFirstName(user: User | null | undefined): string {
  if (!user) return "";

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const firstName =
    typeof metadata?.first_name === "string" ? metadata.first_name.trim() : "";
  if (firstName) return firstName;

  return getAuthDisplayName(user).split(" ")[0] ?? "";
}

export function getAuthEmail(user: User | null | undefined): string {
  return user?.email ?? "";
}

function isUselessAuthMessage(message: string): boolean {
  const trimmed = message.trim();
  return !trimmed || trimmed === "{}" || trimmed === "[object Object]";
}

export function mapAuthError(message: string): AuthErrorCode {
  if (isUselessAuthMessage(message)) return "send_failed";

  const lower = message.toLowerCase();
  if (
    lower.includes("provider is not enabled") ||
    lower.includes("unsupported provider")
  ) {
    return "google_not_enabled";
  }
  if (lower.includes("email not confirmed")) return "email_not_confirmed";
  if (
    lower.includes("error sending") ||
    lower.includes("smtp") ||
    lower.includes("mailer") ||
    lower.includes("confirmation email")
  ) {
    return "send_failed";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "too_many_requests";
  }
  if (lower.includes("same password")) return "same_password";
  if (lower.includes("password should be at least")) return "password_too_short";
  if (lower.includes("invalid login credentials")) return "invalid_credentials";
  if (lower.includes("user already registered")) return "already_registered";
  if (lower.includes("password")) return "password_too_short";
  if (lower.includes("email")) return "invalid_email";
  return "unknown";
}

type AuthErrorLike = {
  message?: string;
  msg?: string;
  code?: string;
  error_description?: string;
};

export function formatAuthError(error: unknown): AuthErrorCode {
  if (!error) return "send_failed";
  if (typeof error === "string") return mapAuthError(error);

  const authError = error as AuthErrorLike;
  const code = authError.code?.toLowerCase() ?? "";

  if (code === "over_email_send_rate_limit") return "too_many_requests";
  if (code === "email_address_invalid") return "invalid_email";
  if (code === "email_not_confirmed") return "email_not_confirmed";
  if (code === "unexpected_failure") return "send_failed";

  const message =
    authError.message ?? authError.msg ?? authError.error_description ?? "";

  return mapAuthError(message);
}
