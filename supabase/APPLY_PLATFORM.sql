-- Paste this entire file in Supabase → SQL Editor → Run
-- Project: bqwvonzygplmnotnfbga

-- Aylopet · platform schema (profiles, pets, private files, waitlist counter)
-- Run AFTER 001_initial.sql in Supabase SQL Editor.
-- Do NOT use public SELECT on waitlist — count is exposed via get_waitlist_count() only.

-- ---------------------------------------------------------------------------
-- Waitlist (public insert · count via RPC only)
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  expectations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_lower_idx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

drop policy if exists "Allow public insert to waitlist" on public.waitlist;
create policy "Allow public insert to waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (
    char_length(trim(full_name)) >= 2
    and char_length(trim(email)) >= 5
    and expectations <> '{}'
  );

drop policy if exists "Users can read own waitlist row" on public.waitlist;
create policy "Users can read own waitlist row"
  on public.waitlist for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Owner profiles (private · linked to auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

alter table public.profiles enable row level security;

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Pets (private · owner scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pet_name text not null,
  breed text not null,
  age_dob text,
  gender text check (gender in ('male', 'female')),
  is_neutered boolean not null default false,
  weight numeric,
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lbs')),
  health_history text[] not null default '{}',
  medical_notes text,
  primary_goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pets_owner_id_idx on public.pets (owner_id);

alter table public.pets enable row level security;

drop policy if exists "Users can insert their own pets" on public.pets;
create policy "Users can insert their own pets"
  on public.pets for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "Users can view their own pets" on public.pets;
create policy "Users can view their own pets"
  on public.pets for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Users can update their own pets" on public.pets;
create policy "Users can update their own pets"
  on public.pets for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete their own pets" on public.pets;
create policy "Users can delete their own pets"
  on public.pets for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Pet file metadata (private)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_files (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null unique,
  file_size integer not null check (file_size > 0),
  file_type text not null,
  category text not null check (
    category in ('vet_medical', 'dna_genetic', 'allergy_bloodwork', 'general')
  ),
  status text not null default 'uploaded',
  created_at timestamptz not null default now()
);

create index if not exists pet_files_pet_id_idx on public.pet_files (pet_id, created_at desc);

alter table public.pet_files enable row level security;

drop policy if exists "Users can insert their own pet files" on public.pet_files;
create policy "Users can insert their own pet files"
  on public.pet_files for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "Users can view their own pet files" on public.pet_files;
create policy "Users can view their own pet files"
  on public.pet_files for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Users can delete their own pet files" on public.pet_files;
create policy "Users can delete their own pet files"
  on public.pet_files for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Waitlist count (safe public counter — no PII leak)
-- ---------------------------------------------------------------------------
create or replace function public.get_waitlist_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*)::bigint from public.waitlist;
$$;

revoke all on function public.get_waitlist_count() from public;
grant execute on function public.get_waitlist_count() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.email, '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Private storage bucket for pet documents
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pet-documents',
  'pet-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can upload pet documents to their folder" on storage.objects;
create policy "Authenticated users can upload pet documents to their folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pet-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authenticated users can read their own pet documents" on storage.objects;
create policy "Authenticated users can read their own pet documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'pet-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authenticated users can delete their own pet documents" on storage.objects;
create policy "Authenticated users can delete their own pet documents"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pet-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

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
