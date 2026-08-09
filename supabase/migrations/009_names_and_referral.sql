-- Split owner name into first/last, and add the referral code system.
--
--   * profiles.first_name / last_name  — greetings address the user by first
--     name only, so the two parts must be stored separately. full_name is kept
--     and backfilled so existing rows and Supabase auth metadata stay valid.
--   * profiles.referral_code           — this member's own shareable code.
--   * profiles.referred_by_code        — the code they entered when signing up.
--
-- Safe to re-run.

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists referral_code text,
  add column if not exists referred_by_code text;

-- Backfill: everything before the first space is the first name.
update public.profiles
set
  first_name = coalesce(first_name, nullif(split_part(coalesce(full_name, ''), ' ', 1), '')),
  last_name  = coalesce(
    last_name,
    nullif(trim(substring(coalesce(full_name, '') from position(' ' in coalesce(full_name, '')) + 1)), '')
  )
where first_name is null or last_name is null;

-- A referral code must be globally unique; this index is the real guarantee.
create unique index if not exists profiles_referral_code_key
  on public.profiles (referral_code)
  where referral_code is not null;

create index if not exists profiles_referred_by_code_idx
  on public.profiles (referred_by_code)
  where referred_by_code is not null;

comment on column public.profiles.referral_code is
  'This member''s own shareable Ambassador code (format AYLO-XXXXXX).';
comment on column public.profiles.referred_by_code is
  'Referral code this member entered at signup, if any.';
