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

export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("provider is not enabled") || lower.includes("unsupported provider")) {
    return "Google შესვლა ჯერ არ არის ჩართული Supabase-ში. სცადე ელ. ფოსტით ან ჩართე Google provider.";
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
