-- ---------------------------------------------------------------------------
-- 013 · Admin access by account instead of a shared secret
--
-- /admin used to open with ?token=ADMIN_SECRET, which put the secret in URLs,
-- browser history and a cookie. Admins now sign in with their normal account
-- and the page checks membership here. Rows are managed with SQL only: RLS is
-- on with no policies, so no client can read or grant admin.
-- Safe to re-run.
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Grant access in the SQL editor (kept out of this public repo):
--   insert into public.admin_users (user_id)
--   select id from auth.users where lower(email) = '<admin email>'
--   on conflict do nothing;
