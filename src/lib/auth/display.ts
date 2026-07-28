import type { User } from "@supabase/supabase-js";

export function getAuthDisplayName(user: User | null | undefined): string {
  if (!user) return "მომხმარებელი";

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const fullName =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    "";

  if (fullName.trim()) return fullName.trim();

  const email = user.email ?? "";
  const local = email.split("@")[0];
  return local || "მომხმარებელი";
}

export function getAuthEmail(user: User | null | undefined): string {
  return user?.email ?? "";
}

const EMAIL_DELIVERY_ERROR =
  "ელ. ფოსტის გაგზავნა ვერ მოხერხდა. შეამოწმე inbox/spam, ან სცადე ცოტა ხანში.";

function isUselessAuthMessage(message: string): boolean {
  const trimmed = message.trim();
  return !trimmed || trimmed === "{}" || trimmed === "[object Object]";
}

export function mapAuthError(message: string): string {
  if (isUselessAuthMessage(message)) {
    return EMAIL_DELIVERY_ERROR;
  }

  const lower = message.toLowerCase();
  if (lower.includes("provider is not enabled") || lower.includes("unsupported provider")) {
    return "Google შესვლა ჯერ არ არის ჩართული Supabase-ში. სცადე ელ. ფოსტით ან ჩართე Google provider.";
  }
  if (lower.includes("email not confirmed")) {
    return "ელ. ფოსტა ჯერ არ არის დადასტურებული. გახსენი inbox-ში დადასტურების ბმული, ან dashboard-იდან გაგზავნე ხელახლა.";
  }
  if (
    lower.includes("error sending") ||
    lower.includes("smtp") ||
    lower.includes("mailer") ||
    lower.includes("confirmation email")
  ) {
    return EMAIL_DELIVERY_ERROR;
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "ძალიან ბევრი მცდელობა. დაელოდე ერთ წუთს და სცადე თავიდან.";
  }
  if (lower.includes("same password")) {
    return "ახალი პაროლი უნდა განსხვავდებოდეს არსებულისგან.";
  }
  if (lower.includes("password should be at least")) {
    return "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.";
  }
  if (lower.includes("invalid login credentials")) {
    return "არასწორი ელ. ფოსტა ან პაროლი.";
  }
  if (lower.includes("user already registered")) {
    return "ეს ელ. ფოსტა უკვე რეგისტრირებულია. სცადე შესვლა.";
  }
  if (lower.includes("password")) {
    return "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.";
  }
  if (lower.includes("email")) {
    return "შეამოწმე ელ. ფოსტის ფორმატი.";
  }
  return message;
}

type AuthErrorLike = {
  message?: string;
  msg?: string;
  code?: string;
  error_description?: string;
};

export function formatAuthError(error: unknown): string {
  if (!error) return EMAIL_DELIVERY_ERROR;

  if (typeof error === "string") {
    return mapAuthError(error);
  }

  const authError = error as AuthErrorLike;
  const code = authError.code?.toLowerCase() ?? "";

  if (code === "over_email_send_rate_limit") {
    return "ძალიან ბევრი მცდელობა. დაელოდე ერთ წუთს და სცადე თავიდან.";
  }
  if (code === "email_address_invalid") {
    return "ელ. ფოსტის მისამართი არასწორია.";
  }
  if (code === "email_not_confirmed") {
    return mapAuthError("email not confirmed");
  }
  if (code === "unexpected_failure") {
    return EMAIL_DELIVERY_ERROR;
  }

  const message =
    authError.message ??
    authError.msg ??
    authError.error_description ??
    "";

  return mapAuthError(message);
}
