# How to Work on Aylopet Landing

Practical guide for developers working on this repo. For AI assistant context, see also [`CLAUDE.md`](./CLAUDE.md).

---

## 1. What this project is

**Aylopet Landing** is a Next.js 16 app that combines:

- **Marketing site** — landing, products, FAQ, knowledge hub (Georgian + English)
- **Platform onboarding** — waitlist, registration, first pet profile
- **User dashboard** — pet profiles, vaccines, lab uploads, health logbook
- **Supabase backend** — auth, database, file storage

| Environment | URL |
|-------------|-----|
| Production | https://aylopet.com |
| GitHub | https://github.com/vakhonanava/aylopet-landing |
| Vercel | https://vercel.com/theteam4/aylopet-landing |
| Supabase | project ref `bqwvonzygplmnotnfbga` |

**Deploy rule:** push to `main` → Vercel auto-deploys to production.

---

## 2. First-time setup

### Install and run locally

```bash
git clone https://github.com/vakhonanava/aylopet-landing.git
cd aylopet-landing
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

### Environment variables (`.env.local`)

Minimum for full local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bqwvonzygplmnotnfbga.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-secret-key
ADMIN_SECRET=local-dev-secret
```

Copy keys from **Supabase → Project Settings → API**.

Also set the same variables in **Vercel → Settings → Environment Variables** for production.

### Supabase database

Run migrations once in **Supabase SQL Editor**:

- **Fresh project:** paste all of `supabase/RUN_ALL_MIGRATIONS.sql`
- **Already on 001–003:** run only `supabase/migrations/004_pet_dashboard_extensions.sql`

Verify:

```bash
npm run verify:supabase
```

### Supabase Auth URLs

In **Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `https://aylopet.com` |
| Redirect URLs | `https://aylopet.com/auth/callback`, `http://localhost:3000/auth/callback` |

---

## 3. Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing home
│   ├── dashboard/          # Authenticated user panel
│   │   ├── page.tsx        # Pet list
│   │   ├── onboarding/     # Add new pet (in-dashboard)
│   │   └── pets/[id]/      # Pet profile (main feature page)
│   ├── onboarding/platform/  # Public waitlist + first pet flow
│   ├── auth/               # Login, register, password reset
│   ├── products/           # Product pages
│   └── api/                # API routes (lab upload, etc.)
├── components/
│   ├── dashboard/          # Dashboard UI (profiles, logbook, uploads)
│   ├── onboarding/         # Platform onboarding wizard
│   ├── marketing/          # Landing sections, FAQ, footer
│   ├── layout/             # Header, banners
│   └── i18n/               # Language toggle + provider
├── lib/
│   ├── dashboard.ts        # Pet types, seed data, constants
│   ├── platform/           # Supabase persistence + sync
│   ├── content/            # Static copy (breeds, FAQ, legal)
│   └── i18n/               # Translation dictionaries (en, ka)
└── utils/supabase/         # Supabase client, middleware helpers

supabase/
├── migrations/             # 001 → 004 SQL migrations
└── RUN_ALL_MIGRATIONS.sql  # One-shot setup script
```

---

## 4. Important routes (don’t mix these up)

| Route | Who | What happens here |
|-------|-----|-------------------|
| `/` | Everyone | Marketing landing |
| `/onboarding/platform` | New users | Waitlist → register → create pet → upload docs |
| `/auth/login` | Everyone | Login (required for dashboard) |
| `/dashboard` | Logged in | List of your pets |
| `/dashboard/pets/[id]` | Logged in | **Profile edit, save, history, lab upload, vaccines** |
| `/dashboard/onboarding` | Logged in | Add another pet from inside dashboard |
| `/admin/leads?token=...` | Admin | View waitlist signups |

**Dashboard features (save, history, lab upload, vaccines) live only on `/dashboard/pets/[id]`.**  
They are **not** on `/onboarding/platform`.

---

## 5. Daily development workflow

### Start work

```bash
git pull origin main
npm install          # if package.json changed
npm run dev
```

### Before committing

```bash
npm run lint
npm run build        # catches TypeScript and Next.js errors
```

### Commit and deploy

```bash
git status
git diff
git add <files>
git commit -m "Short description of why, not just what."
git push origin main
```

Vercel deploys automatically. Check https://vercel.com/theteam4/aylopet-landing if deploy fails.

**Manual redeploy** (if needed):

```bash
npx vercel deploy --prod --yes
```

---

## 6. How major features work

### Pet profile (draft + save)

- **UI:** `src/components/dashboard/PetProfileCard.tsx`
- **State:** `src/components/dashboard/DashboardStore.tsx`
- **Persistence:** `src/lib/platform/pet-persistence.ts`

Flow:
1. User edits fields → local draft updates
2. „შენახვა“ button appears when there are unsaved changes
3. On save → previous version stored in `pet_profile_snapshots`, new data written to `pets` table

### Profile history

- Shown below profile card after at least one save
- Compare (field-by-field), restore, delete per snapshot
- Table: `pet_profile_snapshots`

### Lab analysis upload

- **UI:** `src/components/dashboard/LabResultsUpload.tsx`
- Button: „ანალიზის ატვირთვა“
- Files stored in Supabase Storage bucket `pet-documents` (or Vercel Blob fallback)

### Vaccines

- **UI:** `src/components/dashboard/LogbookTabs.tsx`
- CRUD persisted to `pet_vaccines` table when user is authenticated

### Dog breed picker

- **Data:** `src/lib/content/dog-breeds.ts` (294 FCI breeds, EN + KA)
- **Component:** `BreedCombobox` in `src/components/dashboard/FormControls.tsx`
- Used in onboarding and profile edit forms

### i18n

- Dictionaries: `src/lib/i18n/locales/en.ts`, `ka.ts`
- Toggle: `src/components/i18n/LanguageToggle.tsx`
- Most dashboard UI is Georgian-first; marketing pages support both locales

---

## 7. Supabase: when to touch the database

| Change | Action |
|--------|--------|
| New table or column | Add `supabase/migrations/00X_name.sql`, update `RUN_ALL_MIGRATIONS.sql` |
| RLS policy change | Same — new migration file |
| One-off fix on production | Run SQL in Supabase SQL Editor, then commit the same SQL to repo |

After schema changes, update:

- `src/lib/platform/pet-persistence.ts` — write operations
- `src/lib/platform/dashboard-sync.ts` — read/load operations
- `src/lib/dashboard.ts` — TypeScript types if needed

---

## 8. Coding conventions

- **Next.js 16** — read `node_modules/next/dist/docs/` before using APIs; this version differs from older Next.js
- **Small diffs** — change only what the task requires
- **Match existing style** — Tailwind, `var(--brand-primary)`, component patterns in nearby files
- **Georgian copy** — use proper Georgian letters only (no mixed Latin `e` in Georgian words)
- **Auth** — `/dashboard/**` is middleware-protected; test while logged in
- **Secrets** — never commit `.env.local`; server keys stay server-side only
- **No force-push to `main`**

---

## 9. Testing checklist

Use this after dashboard or Supabase changes:

```
□ npm run build passes
□ Login at /auth/login works
□ /dashboard shows your pets (not demo “Rex” when logged in)
□ Click pet → /dashboard/pets/{uuid} opens
□ Edit a field → „შენახვა“ appears → save succeeds
□ Save again → „წინა მონაცემები“ history appears
□ Upload PDF → appears in list with view + delete
□ Add vaccine → persists after page refresh
□ Breed picker searches in Georgian and English
□ /onboarding/platform completion → redirects to pet profile
```

---

## 10. Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Dashboard features not visible | Wrong page | Go to `/dashboard/pets/[id]`, not `/onboarding/platform` |
| „ძაღლი ვერ მოიძებნა“ | Wrong pet ID | Use UUID from `/dashboard` pet list, not `/dashboard/pets/rex` |
| Save fails with error | Migration 004 missing | Run `004_pet_dashboard_extensions.sql` in Supabase |
| Auth redirect loop | Wrong Site URL | Set `https://aylopet.com` in Supabase Auth settings |
| Login works locally, not prod | Missing Vercel env vars | Add Supabase keys in Vercel, redeploy |
| Old UI after deploy | Cache | Hard refresh or incognito; check Vercel deploy log |

---

## 11. Useful commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npm run verify:supabase  # Check Supabase connection + tables
npm run apply:supabase   # Apply platform migrations via CLI
npx vercel deploy --prod --yes   # Force production deploy
gh auth login            # GitHub CLI (for PRs)
```

---

## 12. Related docs

| File | Purpose |
|------|---------|
| [`README.md`](./README.md) | Quick start, storage fallbacks |
| [`CLAUDE.md`](./CLAUDE.md) | Full handoff for Claude Code / AI assistants |
| [`AGENTS.md`](./AGENTS.md) | Next.js 16 agent rules |
| [`.env.example`](./.env.example) | All environment variables |
| [`supabase/RUN_ALL_MIGRATIONS.sql`](./supabase/RUN_ALL_MIGRATIONS.sql) | Complete database setup |
