-- ---------------------------------------------------------------------------
-- 011 · Referral tracking and points
--
-- Migration 009 added profiles.referral_code / referred_by_code, but nothing
-- ever wrote them: signup put a client-generated code into auth metadata only,
-- so no member had a code to share and no invite could be credited.
--
--   * Every profile gets a server-generated AYLO-XXXXXX code (backfilled).
--   * referrals     · who invited whom; one row per invited member.
--   * points_ledger · every point movement, auditable.
--   * An invite counts (and pays REFERRAL_POINTS to the inviter) only once
--     the invited member confirms their email, so throwaway signups earn
--     nothing.
--
-- Clients never write these tables. They read their own numbers through
-- get_my_referral_summary() and attach a code after OAuth signup through
-- claim_referral(); everything else runs inside security-definer functions.
-- Safe to re-run.
-- ---------------------------------------------------------------------------

-- Keep in sync with REFERRAL_POINTS in src/lib/referral/program.ts.
create or replace function public.referral_points()
returns integer
language sql
immutable
as $$ select 100 $$;

-- ---------------------------------------------------------------------------
-- Code generation · same unambiguous alphabet as src/lib/referral/codes.ts
-- ---------------------------------------------------------------------------
create or replace function public.generate_referral_code()
returns text
language plpgsql
volatile
set search_path = public
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate text;
begin
  loop
    candidate := 'AYLO-';
    for i in 1..6 loop
      candidate := candidate
        || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (
      select 1 from public.profiles where referral_code = candidate
    );
  end loop;
  return candidate;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_id uuid not null unique references public.profiles(id) on delete cascade,
  code text not null,
  status text not null default 'pending'
    check (status in ('pending', 'completed')),
  points_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint referrals_not_self check (referrer_id <> referred_id)
);

create index if not exists referrals_referrer_idx
  on public.referrals (referrer_id);

create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  reason text not null,
  referral_id uuid references public.referrals(id) on delete set null,
  created_at timestamptz not null default now(),
  -- a referral can only ever pay out once per reason
  constraint points_ledger_referral_once unique (referral_id, reason)
);

create index if not exists points_ledger_profile_idx
  on public.points_ledger (profile_id);

-- RLS on, no client policies: only the functions below (and the service role)
-- touch these rows.
alter table public.referrals enable row level security;
alter table public.points_ledger enable row level security;

-- ---------------------------------------------------------------------------
-- Clients may set their referral columns once (initial assignment) but never
-- rewrite them · otherwise a member could swap codes or re-point an invite.
-- ---------------------------------------------------------------------------
create or replace function public.protect_referral_columns()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') = 'authenticated' then
    if old.referral_code is not null then
      new.referral_code := old.referral_code;
    end if;
    if old.referred_by_code is not null then
      new.referred_by_code := old.referred_by_code;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_referral_columns on public.profiles;
create trigger protect_referral_columns
  before update on public.profiles
  for each row execute function public.protect_referral_columns();

-- ---------------------------------------------------------------------------
-- Pay out a pending referral once the invited member has confirmed email.
-- ---------------------------------------------------------------------------
create or replace function public.complete_referral(p_referred uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  ref public.referrals%rowtype;
  confirmed boolean;
  points integer := public.referral_points();
begin
  select (email_confirmed_at is not null) into confirmed
  from auth.users where id = p_referred;
  if not coalesce(confirmed, false) then
    return;
  end if;

  update public.referrals
  set status = 'completed', completed_at = now(), points_awarded = points
  where referred_id = p_referred and status = 'pending'
  returning * into ref;

  if ref.id is null then
    return;
  end if;

  insert into public.points_ledger (profile_id, amount, reason, referral_id)
  values (ref.referrer_id, points, 'referral', ref.id)
  on conflict on constraint points_ledger_referral_once do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- Attach an invite code to a member. Returns true when a referral was created.
-- ---------------------------------------------------------------------------
create or replace function public.link_referral(p_referred uuid, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := upper(trim(coalesce(p_code, '')));
  referrer uuid;
  inserted uuid;
begin
  if normalized = '' then
    return false;
  end if;

  select id into referrer
  from public.profiles
  where referral_code = normalized;

  if referrer is null or referrer = p_referred then
    return false;
  end if;

  insert into public.referrals (referrer_id, referred_id, code)
  values (referrer, p_referred, normalized)
  on conflict (referred_id) do nothing
  returning id into inserted;

  if inserted is null then
    return false;
  end if;

  update public.profiles
  set referred_by_code = normalized
  where id = p_referred and referred_by_code is null;

  perform public.complete_referral(p_referred);
  return true;
end;
$$;

-- ---------------------------------------------------------------------------
-- Signup: create the profile (as in 010), give it a code, link any invite.
-- The two blocks are separate so a referral problem can never roll back the
-- profile, and neither can abort the auth signup itself.
-- ---------------------------------------------------------------------------
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

    insert into public.profiles (id, full_name, email, first_name, last_name, referral_code)
    values (
      new.id,
      resolved_name,
      coalesce(new.email, ''),
      nullif(trim(new.raw_user_meta_data->>'given_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'family_name'), ''),
      public.generate_referral_code()
    )
    on conflict (id) do update set
      full_name = excluded.full_name,
      email = excluded.email,
      first_name = coalesce(excluded.first_name, public.profiles.first_name),
      last_name = coalesce(excluded.last_name, public.profiles.last_name),
      referral_code = coalesce(public.profiles.referral_code, excluded.referral_code),
      updated_at = now();
  exception
    when others then
      raise warning 'handle_new_user profile failed for %: %', new.id, sqlerrm;
      return new;
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

-- Email confirmation is what turns a pending invite into points.
create or replace function public.handle_user_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    begin
      perform public.complete_referral(new.id);
    exception
      when others then
        raise warning 'handle_user_confirmed failed for %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row execute function public.handle_user_confirmed();

-- ---------------------------------------------------------------------------
-- Client RPCs
-- ---------------------------------------------------------------------------

-- OAuth signups carry no metadata, so the client claims the stored invite code
-- right after the first sign-in. Only brand-new accounts may claim, so an
-- existing member cannot attach themselves to someone's code later.
create or replace function public.claim_referral(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  created timestamptz;
begin
  if uid is null then
    return false;
  end if;

  select created_at into created from auth.users where id = uid;
  if created is null or created < now() - interval '1 day' then
    return false;
  end if;

  return public.link_referral(uid, p_code);
end;
$$;

create or replace function public.get_my_referral_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_code text;
begin
  if uid is null then
    return null;
  end if;

  -- Safety net for any profile the backfill or trigger missed.
  update public.profiles
  set referral_code = public.generate_referral_code()
  where id = uid and referral_code is null;

  select referral_code into my_code from public.profiles where id = uid;

  return json_build_object(
    'code', my_code,
    'completed', (select count(*) from public.referrals
                  where referrer_id = uid and status = 'completed'),
    'pending', (select count(*) from public.referrals
                where referrer_id = uid and status = 'pending'),
    'earned_points', (select coalesce(sum(amount), 0) from public.points_ledger
                      where profile_id = uid),
    'points_per_invite', public.referral_points()
  );
end;
$$;

-- Supabase exposes public functions over RPC to anon/authenticated by default.
-- Only the two client RPCs may be called from the browser.
revoke all on function public.generate_referral_code() from public, anon, authenticated;
revoke all on function public.complete_referral(uuid) from public, anon, authenticated;
revoke all on function public.link_referral(uuid, text) from public, anon, authenticated;
revoke all on function public.handle_user_confirmed() from public, anon, authenticated;
revoke all on function public.claim_referral(text) from public, anon;
revoke all on function public.get_my_referral_summary() from public, anon;
grant execute on function public.claim_referral(text) to authenticated;
grant execute on function public.get_my_referral_summary() to authenticated;

-- ---------------------------------------------------------------------------
-- Backfill codes for existing members (one row at a time so each sees the
-- codes already assigned).
-- ---------------------------------------------------------------------------
do $$
declare
  pid uuid;
begin
  for pid in select id from public.profiles where referral_code is null loop
    update public.profiles
    set referral_code = public.generate_referral_code()
    where id = pid;
  end loop;
end;
$$;
