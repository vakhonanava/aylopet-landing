-- B2B partnership form v2:
--   * adds 'shelter' as a first-class partnership type
--   * stores the free-text partnership kind submitted with type = 'other'
--
-- Safe to re-run.

alter table public.b2b_requests
  drop constraint if exists b2b_requests_partnership_type_check;

alter table public.b2b_requests
  add constraint b2b_requests_partnership_type_check
  check (
    partnership_type in (
      'vet-clinic',
      'shelter',
      'retail',
      'corporate',
      'breeder',
      'manufacturer',
      'other'
    )
  );

alter table public.b2b_requests
  add column if not exists custom_type text;
