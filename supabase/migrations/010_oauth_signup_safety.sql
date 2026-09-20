-- ---------------------------------------------------------------------------
-- 010 · Google/OAuth signup safety
--
-- A Google signup inserts a second auth.users row whenever the email cannot be
-- linked to an existing account. The old profile trigger then hit the unique
-- lower(email) index, the exception propagated into GoTrue, and the whole
-- signup failed with "Database error saving new user" — no Google identity was
-- ever created. Profiles are keyed by auth user id (the app upserts on id, not
-- on email), so the email uniqueness constraint only ever cost us signups.
-- ---------------------------------------------------------------------------

drop index if exists public.profiles_email_lower_idx;

create index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_name text;
begin
  resolved_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Aylopet'
  );

  insert into public.profiles (id, full_name, email, first_name, last_name)
  values (
    new.id,
    resolved_name,
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data->>'given_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'family_name'), '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    updated_at = now();

  return new;
exception
  when others then
    -- Never let profile bookkeeping abort an auth signup; the app upserts the
    -- profile again on first dashboard load.
    raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill accounts that were created while the trigger was failing.
insert into public.profiles (id, full_name, email)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(u.raw_user_meta_data->>'name'), ''),
    nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
    'Aylopet'
  ),
  coalesce(u.email, '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
