#!/usr/bin/env node
/**
 * Applies platform Supabase migrations (002 + 003) to the linked remote project.
 *
 * Option A — Supabase personal access token (recommended):
 *   1. Create token: https://supabase.com/dashboard/account/tokens
 *   2. Add to .env.local: SUPABASE_ACCESS_TOKEN=sbp_...
 *   3. Run: npm run apply:supabase
 *
 * Option B — Direct Postgres URL:
 *   Add SUPABASE_DB_URL from Dashboard → Settings → Database → Connection string (URI)
 */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.error("Missing .env.local — add Supabase keys first.");
    process.exit(1);
  }
}

loadEnvLocal();

const projectRef =
  process.env.SUPABASE_PROJECT_REF ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/,
  )?.[1];

const accessToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();
const dbUrl = process.env.SUPABASE_DB_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!projectRef) {
  console.error("Could not detect project ref from NEXT_PUBLIC_SUPABASE_URL.");
  process.exit(1);
}

if (!accessToken && !dbUrl) {
  console.error("Set SUPABASE_ACCESS_TOKEN or SUPABASE_DB_URL in .env.local, then rerun.");
  console.error("  Token: https://supabase.com/dashboard/account/tokens");
  console.error("  DB URL: Supabase → Settings → Database → Connection string");
  process.exit(1);
}

const migrationFiles = ["002_profiles_pets_platform.sql", "003_unify_platform.sql"];

function readMigration(name) {
  return readFileSync(
    resolve(process.cwd(), "supabase/migrations", name),
    "utf8",
  );
}

async function runViaManagementApi(sql) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    },
  );

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Management API (${response.status}): ${body}`);
  }
}

async function runViaPostgres(sql) {
  const pg = await import("pg");
  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

async function runSql(sql) {
  if (accessToken) {
    await runViaManagementApi(sql);
    return;
  }
  await runViaPostgres(sql);
}

async function disableEmailConfirmation() {
  if (!accessToken) {
    console.log("Skip auth config (needs SUPABASE_ACCESS_TOKEN).");
    console.log("In Supabase → Authentication → Providers → Email: turn OFF Confirm email.");
    return;
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mailer_autoconfirm: true,
        external_email_enabled: true,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    console.warn(`Auth config warning (${response.status}): ${body}`);
    return;
  }

  console.log("OK Auth: email confirmation disabled (instant signup).");
}

async function main() {
  console.log(`Applying platform migrations to ${projectRef}...`);

  for (const file of migrationFiles) {
    console.log(`→ ${file}`);
    await runSql(readMigration(file));
    console.log(`  OK`);
  }

  await disableEmailConfirmation();

  console.log("\nDone. Run: npm run verify:supabase");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
