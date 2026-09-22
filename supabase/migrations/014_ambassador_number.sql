-- ---------------------------------------------------------------------------
-- 014 · Ambassador number
--
-- The dashboard shows founding-member benefits to the first EARLY_ADOPTER_CAP
-- members, so the summary now also returns where the member sits in joining
-- order. Replaces the function from 011; safe to re-run.
-- ---------------------------------------------------------------------------

create or replace function public.get_my_referral_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_code text;
  my_created timestamptz;
begin
  if uid is null then
    return null;
  end if;

  -- Safety net for any profile the backfill or trigger missed.
  update public.profiles
  set referral_code = public.generate_referral_code()
  where id = uid and referral_code is null;

  select referral_code, created_at into my_code, my_created
  from public.profiles where id = uid;

  return json_build_object(
    'code', my_code,
    'completed', (select count(*) from public.referrals
                  where referrer_id = uid and status = 'completed'),
    'pending', (select count(*) from public.referrals
                where referrer_id = uid and status = 'pending'),
    'earned_points', (select coalesce(sum(amount), 0) from public.points_ledger
                      where profile_id = uid),
    'points_per_invite', public.referral_points(),
    -- Joining order · the founding-member benefits are shown to the first N.
    'ambassador_number', (select count(*) from public.profiles
                          where created_at <= my_created)
  );
end;
$$;

revoke all on function public.get_my_referral_summary() from public, anon;
grant execute on function public.get_my_referral_summary() to authenticated;
