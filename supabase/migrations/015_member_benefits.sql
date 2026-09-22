-- ---------------------------------------------------------------------------
-- 015 · Founding-member benefits, recorded per member
--
-- The offer for the first 200 members was only marketing copy. Fulfilment
-- needs a record: who is inside the cap, what they were promised, and what
-- discount applies to them right now.
--
--   * profiles.ambassador_number · joining order, assigned once from a
--     sequence so it never shifts when a profile is deleted.
--   * benefit_plans   · the offer itself, so the terms are versioned in one
--     place instead of copied onto every member.
--   * member_benefits · the grant. Rows exist only for members inside the cap.
--   * admin_member_benefits · what fulfilment reads: current food discount,
--     confirmed invites, when the intro period ends. Service role only.
--
-- The 3-month intro discount runs from the member's first order, which does
-- not exist yet, so intro_started_at stays null until start_benefit_intro()
-- is called at that point.
-- Safe to re-run.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Joining order, frozen
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists ambassador_number integer;

create unique index if not exists profiles_ambassador_number_key
  on public.profiles (ambassador_number)
  where ambassador_number is not null;

create sequence if not exists public.ambassador_number_seq;

with ordered as (
  select id, row_number() over (order by created_at, id) as n
  from public.profiles
  where ambassador_number is null
)
update public.profiles p
set ambassador_number = o.n
from ordered o
where o.id = p.id;

select setval(
  'public.ambassador_number_seq',
  coalesce((select max(ambassador_number) from public.profiles), 0) + 1,
  false
);

-- ---------------------------------------------------------------------------
-- The offer
-- ---------------------------------------------------------------------------
create table if not exists public.benefit_plans (
  plan_key text primary key,
  founding_cap integer not null,
  food_intro_percent integer not null,
  food_intro_months integer not null,
  food_lifetime_percent integer not null,
  food_lifetime_boost_percent integer not null,
  boost_invites_required integer not null,
  ai_free_months integer not null,
  collar_percent integer not null,
  collar_free_months integer not null,
  dna_percent integer not null,
  created_at timestamptz not null default now()
);

insert into public.benefit_plans (
  plan_key, founding_cap,
  food_intro_percent, food_intro_months,
  food_lifetime_percent, food_lifetime_boost_percent, boost_invites_required,
  ai_free_months, collar_percent, collar_free_months, dna_percent
)
values ('founding_200', 200, 40, 3, 10, 20, 5, 3, 50, 3, 50)
on conflict (plan_key) do nothing;

create table if not exists public.member_benefits (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  plan_key text not null references public.benefit_plans(plan_key),
  ambassador_number integer not null,
  granted_at timestamptz not null default now(),
  /** Set when the member places their first order · the intro discount runs from there. */
  intro_started_at timestamptz,
  intro_ends_at timestamptz,
  note text
);

alter table public.benefit_plans enable row level security;
alter table public.member_benefits enable row level security;

-- ---------------------------------------------------------------------------
-- Granting
-- ---------------------------------------------------------------------------
create or replace function public.grant_member_benefits(p_profile uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  member_number integer;
  cap integer;
begin
  select ambassador_number into member_number from public.profiles where id = p_profile;
  select founding_cap into cap from public.benefit_plans where plan_key = 'founding_200';
  if member_number is null or cap is null or member_number > cap then
    return;
  end if;

  insert into public.member_benefits (profile_id, plan_key, ambassador_number)
  values (p_profile, 'founding_200', member_number)
  on conflict (profile_id) do nothing;
end;
$$;

/** Starts the 3-month intro discount · called when the first order is placed. */
create or replace function public.start_benefit_intro(
  p_profile uuid,
  p_start timestamptz default now()
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  months integer;
begin
  select bp.food_intro_months into months
  from public.member_benefits mb
  join public.benefit_plans bp on bp.plan_key = mb.plan_key
  where mb.profile_id = p_profile;

  if months is null then
    return;
  end if;

  update public.member_benefits
  set intro_started_at = coalesce(intro_started_at, p_start),
      intro_ends_at = coalesce(intro_ends_at, p_start + make_interval(months => months))
  where profile_id = p_profile;
end;
$$;

-- Signup: profile, code, invite link (as in 011) and now number + benefits.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_name text;
begin
  begin
    resolved_name := coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Aylopet'
    );

    insert into public.profiles (
      id, full_name, email, first_name, last_name, referral_code, ambassador_number
    )
    values (
      new.id,
      resolved_name,
      coalesce(new.email, ''),
      nullif(trim(new.raw_user_meta_data->>'given_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'family_name'), ''),
      public.generate_referral_code(),
      nextval('public.ambassador_number_seq')
    )
    on conflict (id) do update set
      full_name = excluded.full_name,
      email = excluded.email,
      first_name = coalesce(excluded.first_name, public.profiles.first_name),
      last_name = coalesce(excluded.last_name, public.profiles.last_name),
      referral_code = coalesce(public.profiles.referral_code, excluded.referral_code),
      ambassador_number = coalesce(public.profiles.ambassador_number, excluded.ambassador_number),
      updated_at = now();
  exception
    when others then
      raise warning 'handle_new_user profile failed for %: %', new.id, sqlerrm;
      return new;
  end;

  begin
    perform public.grant_member_benefits(new.id);
  exception
    when others then
      raise warning 'handle_new_user benefits failed for %: %', new.id, sqlerrm;
  end;

  begin
    if nullif(trim(new.raw_user_meta_data->>'referred_by_code'), '') is not null then
      perform public.link_referral(new.id, new.raw_user_meta_data->>'referred_by_code');
    end if;
  exception
    when others then
      raise warning 'handle_new_user referral failed for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Fulfilment view · service role only (see 012: anon must never reach this).
-- ---------------------------------------------------------------------------
create or replace view public.admin_member_benefits
with (security_invoker = true) as
select
  p.ambassador_number,
  p.full_name,
  p.email,
  p.referral_code,
  mb.plan_key,
  mb.granted_at,
  mb.intro_started_at,
  mb.intro_ends_at,
  coalesce(inv.completed, 0) as confirmed_invites,
  case
    when mb.intro_started_at is null then null
    when now() < mb.intro_ends_at then bp.food_intro_percent
    when coalesce(inv.completed, 0) >= bp.boost_invites_required
      then bp.food_lifetime_boost_percent
    else bp.food_lifetime_percent
  end as food_discount_now,
  case
    when coalesce(inv.completed, 0) >= bp.boost_invites_required
      then bp.food_lifetime_boost_percent
    else bp.food_lifetime_percent
  end as food_discount_after_intro,
  bp.food_intro_percent,
  bp.food_intro_months,
  bp.ai_free_months,
  bp.collar_percent,
  bp.collar_free_months,
  bp.dna_percent
from public.member_benefits mb
join public.profiles p on p.id = mb.profile_id
join public.benefit_plans bp on bp.plan_key = mb.plan_key
left join (
  select referrer_id, count(*) as completed
  from public.referrals
  where status = 'completed'
  group by referrer_id
) inv on inv.referrer_id = mb.profile_id
order by p.ambassador_number;

revoke all on public.admin_member_benefits from anon, authenticated;
grant select on public.admin_member_benefits to service_role;

revoke all on function public.grant_member_benefits(uuid) from public, anon, authenticated;
revoke all on function public.start_benefit_intro(uuid, timestamptz) from public, anon, authenticated;

-- Existing members inside the cap.
do $$
declare
  pid uuid;
begin
  for pid in
    select id from public.profiles
    where ambassador_number <= (select founding_cap from public.benefit_plans where plan_key = 'founding_200')
  loop
    perform public.grant_member_benefits(pid);
  end loop;
end;
$$;

-- The summary now reads the stored number instead of counting rows, so a
-- member's number cannot shift when an earlier profile is deleted.
create or replace function public.get_my_referral_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_code text;
  my_number integer;
begin
  if uid is null then
    return null;
  end if;

  update public.profiles
  set referral_code = coalesce(referral_code, public.generate_referral_code()),
      ambassador_number = coalesce(ambassador_number, nextval('public.ambassador_number_seq'))
  where id = uid and (referral_code is null or ambassador_number is null);

  select referral_code, ambassador_number into my_code, my_number
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
    'ambassador_number', my_number
  );
end;
$$;

revoke all on function public.get_my_referral_summary() from public, anon;
grant execute on function public.get_my_referral_summary() to authenticated;

-- profiles.ambassador_number decides who sees the founding block, and members
-- may update their own row · keep it write-once for clients, like the
-- referral columns guarded in 011.
create or replace function public.protect_referral_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'authenticated' then
    if old.referral_code is not null then
      new.referral_code := old.referral_code;
    end if;
    if old.referred_by_code is not null then
      new.referred_by_code := old.referred_by_code;
    end if;
    if old.ambassador_number is not null then
      new.ambassador_number := old.ambassador_number;
    end if;
  end if;
  return new;
end;
$$;
