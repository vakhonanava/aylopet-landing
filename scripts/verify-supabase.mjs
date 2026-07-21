#!/usr/bin/env node
/**
 * Verifies Supabase connectivity and whether the migration has been applied.
 * Run: node scripts/verify-supabase.mjs
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
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const adminKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !adminKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const restUrl = `${url.replace(/\/$/, "")}/rest/v1/early_adopter_leads?select=id&limit=1`;

const response = await fetch(restUrl, {
  headers: {
    apikey: adminKey,
    Authorization: `Bearer ${adminKey}`,
  },
});

if (response.ok) {
  console.log("OK Supabase connected. Table early_adopter_leads exists.");
  process.exit(0);
}

const body = await response.text();
if (body.includes("PGRST205") || body.includes("does not exist")) {
  console.error("Supabase connected, but tables are missing.");
  console.error("Run supabase/migrations/001_initial.sql in Supabase SQL Editor.");
  process.exit(2);
}

console.error(`Supabase check failed (${response.status}): ${body}`);
process.exit(1);
