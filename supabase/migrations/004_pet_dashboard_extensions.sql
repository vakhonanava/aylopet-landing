-- Pet dashboard: extended profile fields, vaccines, profile history snapshots

alter table public.pets
  add column if not exists activity text check (activity in ('low', 'moderate', 'high')),
  add column if not exists temperament text[] not null default '{}',
  add column if not exists avatar_url text;

-- ---------------------------------------------------------------------------
-- Vaccines (per pet)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_vaccines (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  administered date not null,
  next_due date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pet_vaccines_pet_id_idx
  on public.pet_vaccines (pet_id, administered desc);

alter table public.pet_vaccines enable row level security;

drop policy if exists "Users can manage their own pet vaccines" on public.pet_vaccines;
create policy "Users can manage their own pet vaccines"
  on public.pet_vaccines for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Profile snapshots (history before each save)
-- ---------------------------------------------------------------------------
create table if not exists public.pet_profile_snapshots (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists pet_profile_snapshots_pet_id_idx
  on public.pet_profile_snapshots (pet_id, created_at desc);

alter table public.pet_profile_snapshots enable row level security;

drop policy if exists "Users can manage their own pet profile snapshots" on public.pet_profile_snapshots;
create policy "Users can manage their own pet profile snapshots"
  on public.pet_profile_snapshots for all
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
