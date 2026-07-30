# Aylopet Landing — Claude Code Instructions

Read `AGENTS.md` first. This is **Next.js 16** with breaking changes — check `node_modules/next/dist/docs/` before using APIs from training data.

---

## Project summary

**Aylopet** is a Next.js 16 marketing site + product prototype (Georgian/English i18n):

- Landing, products, DNA journey, knowledge hub
- **Platform onboarding** (`/onboarding/platform`) — waitlist, auth, pet creation, document upload
- **Dashboard** (`/dashboard`) — pet profiles, health logbook, lab uploads (auth required)
- Supabase for auth, pets, vaccines, profile history, file storage
- Production: **https://aylopet.com** (Vercel auto-deploy from `main`)

**GitHub:** `https://github.com/vakhonanava/aylopet-landing`  
**Supabase project ref:** `bqwvonzygplmnotnfbga`

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill Supabase keys
npm run dev                  # http://localhost:3000
npm run build                # verify before push
npm run lint
```

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser/client key (legacy: `NEXT_PUBLIC_SUPABASE_ANON_KEY`) |
| `SUPABASE_SECRET_KEY` | Server-only (legacy: `SUPABASE_SERVICE_ROLE_KEY`) |
| `ADMIN_SECRET` | Protects `/admin/leads` |
| `BLOB_READ_WRITE_TOKEN` | Fallback lab upload storage (Vercel Blob) |

Set the same keys in **Vercel → Settings → Environment Variables** for Production.

**Supabase Auth URLs** (Authentication → URL Configuration):

- Site URL: `https://aylopet.com` (not `ayiopet.com`)
- Redirect: `https://aylopet.com/auth/callback`, `http://localhost:3000/auth/callback`

---

## Supabase migrations (CRITICAL)

Run in **Supabase SQL Editor** if tables/columns are missing.

| File | What it creates |
|------|-----------------|
| `supabase/migrations/001_initial.sql` | Leads, lab reports, storage |
| `supabase/migrations/002_profiles_pets_platform.sql` | profiles, pets |
| `supabase/migrations/003_unify_platform.sql` | Platform unification |
| `supabase/migrations/004_pet_dashboard_extensions.sql` | **activity, temperament, avatar_url** on pets; **pet_vaccines**; **pet_profile_snapshots** |
| `supabase/migrations/005_medical_module.sql` | **birth_date, bcs_score, microchip_id** on pets; **care_type** on pet_vaccines (unifies vaccine/deworming/flea_tick); **medical_records**, **symptom_logs**, **medications**, **vet_report_shares**; **pet-medical-docs** storage bucket |

**One-shot:** run `supabase/RUN_ALL_MIGRATIONS.sql` (001→005 consolidated).

**CLI helpers:**

```bash
npm run apply:supabase    # applies 002+003 via script
npm run verify:supabase   # checks connection + tables
```

If migration **004** is not applied, dashboard save/vaccines/history will fail in Supabase (errors shown in UI on save).

---

## Two onboarding flows (do not confuse)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/onboarding/platform` | `AyliopetOnboarding.tsx` | Public waitlist flow: register → create pet in Supabase → upload docs |
| `/dashboard/onboarding` | `OnboardingForm.tsx` | In-dashboard: add another pet (uses `DashboardStore`) |

**Dashboard pet features are NOT on `/onboarding/platform`.** They live on:

```
/dashboard/pets/[id]
```

---

## Dashboard architecture

### User flow (production)

1. Login: `/auth/login`
2. Dashboard home: `/dashboard` — list of pets
3. **Click pet card** → `/dashboard/pets/{uuid}` — full profile UI
4. Edit fields → **„შენახვა“** appears (draft mode; only when dirty)
5. Lab upload, vaccines, history are on the pet profile page

### Auth & middleware

- `/dashboard/**` is protected — unauthenticated users redirect to `/auth/login?next=...`
- Middleware: `src/middleware.ts` → `src/utils/supabase/middleware.ts`
- Guest localStorage mode in `DashboardStore` only applies when Supabase env is missing locally; production always requires login.

### Key files

| Area | Path |
|------|------|
| Pet profile page | `src/app/dashboard/pets/[id]/page.tsx` |
| Save + history UI | `src/components/dashboard/PetProfileCard.tsx` |
| State + persist | `src/components/dashboard/DashboardStore.tsx` |
| Supabase CRUD | `src/lib/platform/pet-persistence.ts` |
| Load pets/files/vaccines/snapshots | `src/lib/platform/dashboard-sync.ts` |
| Vaccines UI | `src/components/dashboard/LogbookTabs.tsx` |
| Lab upload | `src/components/dashboard/LabResultsUpload.tsx` |
| Breed picker | `src/components/dashboard/FormControls.tsx` → `BreedCombobox` |
| Breed data (294 FCI) | `src/lib/content/dog-breeds.ts` |
| Types/constants | `src/lib/dashboard.ts` |
| Medical module (symptoms, record, meds, export) | `src/components/dashboard/medical/` |
| Medical Supabase CRUD | `src/lib/platform/medical-persistence.ts` |
| Vet report data assembly (auth + public share) | `src/lib/platform/vet-report.ts` |
| Platform onboarding | `src/components/onboarding/AyliopetOnboarding.tsx` |
| Header nav | `src/components/layout/GlobalHeader.tsx` — `DASHBOARD_HREF = "/dashboard"` |

### Feature behavior

1. **Profile save (draft mode)**
   - Edits update local draft only until Save
   - Save button visible only when `isDirty`
   - Auth → Supabase (`updatePetProfileInSupabase`); guest → localStorage
   - Before save, previous version → `pet_profile_snapshots`

2. **Profile history**
   - Panel in `PetProfileCard`: compare (field-by-field), restore, delete snapshot
   - Stored in `pet_profile_snapshots.snapshot` (JSONB)

3. **Lab analysis upload**
   - Button: „ანალიზის ატვირთვა“ in `LabResultsUpload`
   - List: name, size, status; view (↗ new tab), delete
   - Storage: Supabase `pet-documents` bucket (auth) or Vercel Blob fallback

4. **Vaccines**
   - Add/edit/delete in `LogbookTabs`
   - Auth → `pet_vaccines` table via `upsertVaccineInSupabase` / `deleteVaccineInSupabase`

5. **New pet creation**
   - `OnboardingForm` / `createPetProfileInSupabase` saves **breed, weight, activity, temperament**

---

## Dog breeds

- **294 FCI breeds** with Georgian labels in `src/lib/content/dog-breeds.ts`
- Generator: `scripts/generate_dog_breeds.py` (source: FCI list)
- `BreedCombobox` used in: onboarding, dashboard profile edit, new pet forms
- Search: `searchDogBreeds(query, locale)` — bilingual

**Copy rule:** Use proper Georgian script only — no mixed Latin/Cyrillic letters (e.g. `უკვe` → `უკვე`).

---

## Deploy & git workflow

**Branch:** `main` → Vercel auto-deploy → `aylopet.com`

```bash
git status && git diff && git log -3 --oneline
git add <files>
git commit -m "message"
git push origin main
```

**Manual Vercel redeploy** (if auto-deploy lagging):

```bash
npx vercel deploy --prod --yes
```

Inspect: `https://vercel.com/theteam4/aylopet-landing`

**Only commit when user explicitly asks.** Never force-push `main`.

---

## Testing checklist

| Step | URL | Expected |
|------|-----|----------|
| Login | `/auth/login` | Redirect to dashboard when logged in |
| Pet list | `/dashboard` | Shows user's Supabase pets (not demo Rex) |
| Pet profile | `/dashboard/pets/{uuid}` | Profile card, lab upload, logbook tabs |
| Save | Edit name → Save | „შენახვა“ appears; success toast; Supabase updated |
| History | Save twice | „წინა მონაცემები“ with compare/restore/delete |
| Lab upload | Upload PDF | Listed with view + delete |
| Vaccine | Logbook → add | Persists after refresh (auth) |
| Onboarding finish | `/onboarding/platform` step 3 | Button → `/dashboard/pets/{petId}` |
| Header | Logged in → „ჩემი პანელი“ | Goes to `/dashboard` (not `/dashboard/pets/rex`) |
| Breeds | Breed picker | 294 breeds, Georgian search |

---

## Common pitfalls

1. **User looks at `/onboarding/platform`** — dashboard save/history/labs are on `/dashboard/pets/[id]`.
2. **Header used to link to `/dashboard/pets/rex`** — fixed; Rex is demo seed pet id, not Supabase UUID.
3. **Migration 004 not run** — save/vaccines/history fail silently or show error on save.
4. **Wrong Site URL in Supabase** — auth emails/redirects break.
5. **Save button** — only appears after editing a field (draft dirty state).
6. **Next.js 16** — middleware deprecated in favor of “proxy”; heed build warnings.
7. **Migration 005 not run** — Medical module (symptom tracker, medical record, medications, vet report export) fails on save/load; the „ვაქცინები“ tab will error too since it now depends on `care_type`.

---

## Recent commits (context)

```
01b6618 Fix dashboard navigation so pet profile features are discoverable.
62ebda1 Fix Georgian copy typos and add consolidated Supabase schema SQL.
6c3ac5b Add explicit pet profile save, history, vaccines, and lab upload UX.
68c4359 Wire full breed picker into new profile onboarding flows.
182d9da Add full FCI dog breed list with Georgian labels for breed picker.
```

---

## Code conventions

- Minimize scope — focused diffs only
- Match existing patterns (Tailwind, `var(--brand-primary)`, Georgian UI copy)
- Comments only for non-obvious logic
- i18n: `src/lib/i18n/locales/en.ts`, `ka.ts`
- Do not commit `.env.local`, secrets, or `tsconfig.tsbuildinfo`
- Read surrounding code before adding abstractions

---

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm run verify:supabase
npm run apply:supabase
npx vercel deploy --prod --yes
gh pr create   # if using feature branches
```

---

## When user reports “features not visible on site”

1. Confirm they are on `/dashboard/pets/[id]`, not `/onboarding/platform`
2. Confirm they are logged in
3. Confirm Supabase migration 004 ran
4. Confirm Vercel env vars set
5. Hard refresh / incognito after deploy
6. Check Vercel deployment succeeded for latest `main` commit
