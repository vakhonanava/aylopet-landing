-- Pet Health Profile & Online History module.
--
-- Adds one JSONB column holding the owner-authored history: reproductive
-- status, microchip registration, weight/BCS log, target weight range, diet
-- profile, primary vet contact and caretaker notes.
--
-- Why a document instead of columns + a weight_logs table: this blob is read
-- whole and written whole by a single screen, is semi-structured, and has no
-- cross-pet query requirement. Revisit if weight ever needs aggregate queries.
--
-- Machine-written feeds (DNA results, Smart Collar telemetry, AylopetAI
-- threads) intentionally live elsewhere so two writers never contend on this
-- column.
--
-- Safe to re-run.

alter table public.pets
  add column if not exists history jsonb;

comment on column public.pets.history is
  'Owner-authored pet health history (PetHistory in src/lib/pet-history/types.ts).';

-- Partial index: most pets have no history yet, so only index the ones that do.
create index if not exists pets_history_present_idx
  on public.pets ((history is not null))
  where history is not null;
