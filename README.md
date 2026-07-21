# Aylopet Landing

Next.js marketing site and product prototype for Aylopet — fresh pet food, AylopetAI, DNA platform, and smart collar.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub setup

This repo is ready to push to GitHub. From the project root:

```bash
# 1. Log in to GitHub CLI (one-time)
gh auth login

# 2. Create the remote repo and push
gh repo create aylopet-landing --public --source=. --remote=origin --push
```

If the repo already exists under your account:

```bash
git remote add origin https://github.com/YOUR_USERNAME/aylopet-landing.git
git push -u origin main
```

### Connect Vercel to GitHub

1. Open [vercel.com](https://vercel.com) → your project → **Settings** → **Git**
2. Connect the GitHub repository
3. Every push to `main` will auto-deploy to production

## Supabase setup (waitlist + lab uploads)

Supabase is the recommended production backend. When configured, the app uses:

- **`early_adopter_leads`** — waitlist signups with multi-select product interests
- **`lab_reports` + Storage bucket `lab-results`** — medical report uploads from the dashboard

### 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Copy from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose to the browser)

### 2. Run the database migration

Open **SQL Editor** in Supabase and run the contents of:

```
supabase/migrations/001_initial.sql
```

This creates tables, RLS policies, and the private `lab-results` storage bucket.

### 3. Add env vars locally and on Vercel

**Local:** add the three Supabase variables to `.env.local`

**Vercel:** Project → **Settings** → **Environment Variables** → add the same three keys for Production (and Preview if needed), then redeploy.

### 4. Verify

| Feature | URL | Expected storage mode |
|---------|-----|----------------------|
| Waitlist signup | `/early-access` | `supabase` (shown on `/admin/leads`) |
| Lab upload | `/dashboard/pets/[id]` | Supabase Storage |

Admin leads page shows the active storage backend: `supabase`, `blob`, or `file`.

## Storage fallback order

| Feature | Priority |
|---------|----------|
| Waitlist leads | Supabase → Vercel Blob → local `data/leads.json` |
| Lab file uploads | Supabase Storage → Vercel Blob |

Without Supabase, local dev still works using file storage and Vercel Blob (when `BLOB_READ_WRITE_TOKEN` is set).

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # run production build locally
npm run lint     # ESLint
```

## Deploy

Manual deploy via Vercel CLI:

```bash
npx vercel deploy --prod
```

Or push to GitHub if the project is connected for auto-deploys.
