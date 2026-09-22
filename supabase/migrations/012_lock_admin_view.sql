-- ---------------------------------------------------------------------------
-- 012 · Close the public read path on admin_signups_overview
--
-- Migration 003 ran `revoke all ... from public`, but Supabase grants anon and
-- authenticated explicitly, not through PUBLIC, so both kept SELECT. The view
-- is SECURITY DEFINER, so it bypassed RLS: anyone holding the publishable key
-- that ships in the site's JS could list every signup over /rest/v1. Only the
-- admin page reads it, and it uses the service role.
-- ---------------------------------------------------------------------------

revoke all on public.admin_signups_overview from anon, authenticated;
grant select on public.admin_signups_overview to service_role;

-- Respect the caller's RLS from now on; service_role bypasses RLS anyway.
alter view public.admin_signups_overview set (security_invoker = true);

-- Advisor hygiene for functions added in 011.
alter function public.referral_points() set search_path = public;
alter function public.protect_referral_columns() set search_path = public;

-- Trigger functions are never meant to be called over RPC.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.handle_user_confirmed() from public, anon, authenticated;
