"use server";

import { createSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface WaitlistDuplicateCheck {
  emailTaken: boolean;
  phoneTaken: boolean;
}

/**
 * Digits only, with a leading 995 / 00995 dropped from a 9-digit Georgian
 * number. Mirrors public.normalize_phone() (migration 016), whose unique index
 * is what actually refuses a second registration with the same number.
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^(?:00)?995(\d{9})$/, "$1");
}

/**
 * `ownUserId` is the signed-in caller: their own waitlist row does not count
 * as the number being taken.
 */
export async function checkWaitlistDuplicate(
  email: string,
  phone: string,
  ownUserId?: string,
): Promise<WaitlistDuplicateCheck> {
  if (!isSupabaseConfigured()) {
    return { emailTaken: false, phoneTaken: false };
  }

  const supabase = createSupabaseAdmin();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);

  const { data: emailMatch } = await supabase
    .from("waitlist")
    .select("id")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  let phoneTaken = false;
  if (normalizedPhone) {
    const { data: rows } = await supabase.from("waitlist").select("phone, user_id");
    phoneTaken = (rows ?? []).some(
      (row) =>
        (!ownUserId || row.user_id !== ownUserId) &&
        normalizePhone((row.phone as string | null) ?? "") === normalizedPhone,
    );
  }

  return { emailTaken: !!emailMatch, phoneTaken };
}
