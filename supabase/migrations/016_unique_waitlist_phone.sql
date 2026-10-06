-- ---------------------------------------------------------------------------
-- 016 · One phone number, one waitlist registration
--
-- The onboarding form checked for a taken phone number in the browser only,
-- skipped the check for signed-in (Google) users, and compared raw digits,
-- so "+995 568 88 84 24" and "568 88 84 24" counted as different numbers.
-- The waitlist insert policy is open to anon, so the database has to be the
-- one that refuses the duplicate.
--
--   * normalize_phone() · digits only, with a leading 995 / 00995 country
--     code dropped from a 9-digit Georgian number. Mirrored by
--     normalizePhone() in src/app/onboarding/actions.ts.
--   * waitlist_phone_normalized_key · unique on the normalized number. Rows
--     without a phone normalize to null and are not constrained.
--
-- Fails if the waitlist already holds two rows with the same number; resolve
-- those first. Safe to re-run.
-- ---------------------------------------------------------------------------

create or replace function public.normalize_phone(raw text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select nullif(
    regexp_replace(
      regexp_replace(coalesce(raw, ''), '\D', '', 'g'),
      '^(00)?995(\d{9})$',
      '\2'
    ),
    ''
  );
$$;

create unique index if not exists waitlist_phone_normalized_key
  on public.waitlist (public.normalize_phone(phone));
