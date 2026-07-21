-- Aylopet · initial schema (waitlist + lab reports)
-- Run in Supabase Dashboard → SQL Editor, or via Supabase CLI.

-- ---------------------------------------------------------------------------
-- Waitlist / early adopter leads
-- ---------------------------------------------------------------------------
create table if not exists public.early_adopter_leads (
  id text primary key,
  owner_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  dog_name text not null,
  breed text not null,
  age_months integer not null check (age_months > 0),
  weight_kg numeric not null check (weight_kg > 0),
  neutered boolean not null default false,
  allergies text[] not null default '{}',
  primary_goal text not null,
  product_expectation text not null,
  product_interests text[] not null default '{}',
  feature_expectations text[] not null default '{}',
  feature_wishlist text not null,
  referral_source text not null,
  notes text,
  wants_dna_kit boolean not null default false,
  consent boolean not null default true,
  position integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'approved')),
  created_at timestamptz not null default now()
);

create unique index if not exists early_adopter_leads_email_lower_idx
  on public.early_adopter_leads (lower(email));

create index if not exists early_adopter_leads_created_at_idx
  on public.early_adopter_leads (created_at desc);

alter table public.early_adopter_leads enable row level security;

-- Server (service role) handles all lead writes; no public client access.
create policy "Service role manages leads"
  on public.early_adopter_leads
  for all
  using (false)
  with check (false);

-- ---------------------------------------------------------------------------
-- Lab report metadata (files live in Supabase Storage bucket lab-results)
-- ---------------------------------------------------------------------------
create table if not exists public.lab_reports (
  id text primary key,
  pet_id text not null,
  name text not null,
  size_bytes integer not null check (size_bytes > 0),
  mime_type text not null
    check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  storage_path text not null unique,
  status text not null default 'uploaded'
    check (status in ('uploaded')),
  uploaded_at timestamptz not null default now()
);

create index if not exists lab_reports_pet_id_idx
  on public.lab_reports (pet_id, uploaded_at desc);

alter table public.lab_reports enable row level security;

create policy "Service role manages lab reports"
  on public.lab_reports
  for all
  using (false)
  with check (false);

-- ---------------------------------------------------------------------------
-- Storage bucket (private · server-side uploads only)
-- Create bucket in Dashboard → Storage if this insert fails.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lab-results',
  'lab-results',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
