-- Aylopet · unify platform (extend waitlist + admin view + legacy bridge)
-- Run AFTER 002_profiles_pets_platform.sql

alter table public.waitlist
  add column if not exists city text,
  add column if not exists consent boolean not null default true,
  add column if not exists source text not null default 'platform';

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- Admin-only read model (service role bypasses RLS on base tables too)
create or replace view public.admin_signups_overview
with (security_invoker = false) as
select
  w.id,
  w.created_at,
  w.full_name as owner_name,
  w.email,
  w.phone,
  w.city,
  w.expectations,
  w.consent,
  w.source,
  w.user_id,
  p.pet_name as dog_name,
  p.breed,
  p.primary_goal,
  p.is_neutered,
  p.weight,
  p.weight_unit,
  (
    select count(*)::int
    from public.pet_files pf
    where pf.owner_id = w.user_id
  ) as file_count
from public.waitlist w
left join lateral (
  select pet_name, breed, primary_goal, is_neutered, weight, weight_unit
  from public.pets
  where owner_id = w.user_id
  order by created_at asc
  limit 1
) p on true
order by w.created_at desc;

revoke all on public.admin_signups_overview from public;
grant select on public.admin_signups_overview to service_role;

-- Optional: copy legacy rows into waitlist (safe · skips duplicates)
insert into public.waitlist (full_name, email, phone, city, expectations, consent, source, created_at)
select
  e.owner_name,
  lower(e.email),
  e.phone,
  e.city,
  coalesce(e.product_interests, '{}'),
  e.consent,
  'legacy_early_adopter',
  e.created_at
from public.early_adopter_leads e
where not exists (
  select 1 from public.waitlist w where lower(w.email) = lower(e.email)
);
