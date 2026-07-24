#!/usr/bin/env node
/**
 * Verifies Supabase connectivity and platform schema readiness.
 * Run: npm run verify:supabase
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
    console.error("Missing .env.local — copy .env.example and fill in Supabase keys.");
    process.exit(1);
  }
}

loadEnvLocal();

const url =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const adminKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !adminKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

if (!publishableKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  process.exit(1);
}

const base = url.replace(/\/$/, "");
const headers = {
  apikey: adminKey,
  Authorization: `Bearer ${adminKey}`,
};

async function tableExists(table) {
  const response = await fetch(`${base}/rest/v1/${table}?select=id&limit=1`, {
    headers,
  });
  return response.ok;
}

async function rpcExists(name) {
  const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: "{}",
  });
  return response.ok;
}

async function main() {
  const platformTables = ["waitlist", "profiles", "pets", "pet_files"];
  const legacyTables = ["early_adopter_leads", "lab_reports"];

  const platformReady = (
    await Promise.all(platformTables.map(tableExists))
  ).every(Boolean);

  const waitlistCountOk = await rpcExists("get_waitlist_count");
  const adminViewOk = await tableExists("admin_signups_overview");

  if (platformReady && waitlistCountOk && adminViewOk) {
    console.log("OK Supabase platform is fully ready (002 + 003).");
    console.log("  Tables:", platformTables.join(", "));
    console.log("  RPC: get_waitlist_count");
    console.log("  View: admin_signups_overview");
    process.exit(0);
  }

  const legacyReady = (
    await Promise.all(legacyTables.map(tableExists))
  ).some(Boolean);

  if (legacyReady && !platformReady) {
    console.error("Supabase connected, but platform schema is missing.");
    console.error("Run: npm run apply:supabase");
    console.error("  (needs SUPABASE_ACCESS_TOKEN or SUPABASE_DB_URL in .env.local)");
    process.exit(2);
  }

  if (!legacyReady && !platformReady) {
    console.error("Supabase connected, but no Aylopet tables found.");
    console.error("Run migrations in supabase/migrations/ starting with 001_initial.sql");
    process.exit(2);
  }

  console.error("Supabase partially configured. Re-run: npm run apply:supabase");
  process.exit(2);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
