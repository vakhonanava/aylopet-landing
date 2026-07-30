-- Medical records module: pet identity fields, unified preventative care,
-- medical records, symptom logs, medications, vet report shares

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Pets: identity + body-condition fields
-- ---------------------------------------------------------------------------
alter table public.pets
  add column if not exists birth_date date,
  add column if not exists bcs_score integer check (bcs_score between 1 and 9),
  add column if not exists microchip_id text;

-- ---------------------------------------------------------------------------
-- Unify preventative care into pet_vaccines (vaccine / deworming / flea_tick)
-- ---------------------------------------------------------------------------
alter table public.pet_vaccines
  add column if not exists care_type text not null default 'vaccine'
    check (care_type in ('vaccine', 'deworming', 'flea_tick'));

-- ---------------------------------------------------------------------------
-- Medical record (single row per pet)
-- ---------------------------------------------------------------------------
create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null unique references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  chronic_conditions text[] not null default '{}',
  surgeries_and_traumas text,
  allergies text[] not null default '{}',
  genetic_risks text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.medical_records enable row level security;

drop policy if exists "Users can manage their own medical records" on public.medical_records;
create policy "Users can manage their own medical records"
  on public.medical_records for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Symptom logs
-- ---------------------------------------------------------------------------
create table if not exists public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  logged_at timestamptz not null default now(),
  symptom_type text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  notes text,
  attachments text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists symptom_logs_pet_id_idx
  on public.symptom_logs (pet_id, logged_at desc);

alter table public.symptom_logs enable row level security;

drop policy if exists "Users can manage their own symptom logs" on public.symptom_logs;
create policy "Users can manage their own symptom logs"
  on public.symptom_logs for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Medications
-- ---------------------------------------------------------------------------
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists medications_pet_id_idx
  on public.medications (pet_id, created_at desc);

alter table public.medications enable row level security;

drop policy if exists "Users can manage their own medications" on public.medications;
create policy "Users can manage their own medications"
  on public.medications for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Vet report shares (capability table). A row's token grants read access to
-- the pet's full medical data via the admin client (see src/lib/platform/vet-report.ts),
-- so the insert policy additionally verifies pet ownership, not just share-row
-- ownership. No policy grants anon/public select — the public share endpoint
-- reads this table exclusively through the service-role admin client, never RLS.
-- ---------------------------------------------------------------------------
create table if not exists public.vet_report_shares (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  expires_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists vet_report_shares_pet_id_idx
  on public.vet_report_shares (pet_id, created_at desc);

alter table public.vet_report_shares enable row level security;

drop policy if exists "Users can view their own vet report shares" on public.vet_report_shares;
create policy "Users can view their own vet report shares"
  on public.vet_report_shares for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Users can create their own vet report shares" on public.vet_report_shares;
create policy "Users can create their own vet report shares"
  on public.vet_report_shares for insert
  to authenticated
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.pets p
      where p.id = pet_id and p.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can update their own vet report shares" on public.vet_report_shares;
create policy "Users can update their own vet report shares"
  on public.vet_report_shares for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete their own vet report shares" on public.vet_report_shares;
create policy "Users can delete their own vet report shares"
  on public.vet_report_shares for delete
  to authenticated
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Private storage bucket for medical attachments (symptom photos/videos)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pet-medical-docs',
  'pet-medical-docs',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated users can upload medical docs to their folder" on storage.objects;
create policy "Authenticated users can upload medical docs to their folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pet-medical-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authenticated users can read their own medical docs" on storage.objects;
create policy "Authenticated users can read their own medical docs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'pet-medical-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authenticated users can delete their own medical docs" on storage.objects;
create policy "Authenticated users can delete their own medical docs"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'pet-medical-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
