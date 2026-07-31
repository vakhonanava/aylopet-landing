"use server";

import { createSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface WaitlistDuplicateCheck {
  emailTaken: boolean;
  phoneTaken: boolean;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function checkWaitlistDuplicate(
  email: string,
  phone: string,
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
    const { data: rows } = await supabase.from("waitlist").select("phone");
    phoneTaken = (rows ?? []).some(
      (row) => normalizePhone((row.phone as string | null) ?? "") === normalizedPhone,
    );
  }

  return { emailTaken: !!emailMatch, phoneTaken };
}
