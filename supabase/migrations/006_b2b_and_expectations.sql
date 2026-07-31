-- B2B partnership inquiries + project-status expectations feedback.
-- Both tables are written exclusively by server actions via the service-role
-- (admin) client — no browser client ever touches them, so RLS locks out
-- every role entirely, matching early_adopter_leads' posture in 001_initial.sql.

create table if not exists public.b2b_requests (
  id text primary key,
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  partnership_type text not null
    check (partnership_type in ('vet-clinic', 'retail', 'corporate', 'breeder', 'manufacturer', 'other')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists b2b_requests_created_at_idx
  on public.b2b_requests (created_at desc);

alter table public.b2b_requests enable row level security;

drop policy if exists "Service role manages b2b requests" on public.b2b_requests;
create policy "Service role manages b2b requests"
  on public.b2b_requests
  for all
  using (false)
  with check (false);

create table if not exists public.project_expectations (
  id text primary key,
  option_id text not null
    check (option_id in ('fresh-food', 'aylopet-ai', 'dna', 'smart-collar', 'vet-consult', 'other')),
  session_id text not null,
  email text,
  note text,
  created_at timestamptz not null default now()
);

create unique index if not exists project_expectations_session_id_idx
  on public.project_expectations (session_id);

create index if not exists project_expectations_created_at_idx
  on public.project_expectations (created_at desc);

alter table public.project_expectations enable row level security;

drop policy if exists "Service role manages project expectations" on public.project_expectations;
create policy "Service role manages project expectations"
  on public.project_expectations
  for all
  using (false)
  with check (false);
