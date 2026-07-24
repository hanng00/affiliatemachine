#!/usr/bin/env bun
/**
 * ops/adtraction.ts
 *
 * Thin wrapper over the Adtraction partner API (v2) for the revenue loop.
 * The API lets us READ programs/commissions and MINT tracking URLs once a
 * channel is approved. Applying to programs and creating channels are
 * dashboard actions (no public write endpoint) — those stay as escalations.
 *
 * Token: never hardcoded. Read from ADTRACTION_TOKEN env, or ops/.env.
 *
 * Usage:
 *   ADTRACTION_TOKEN=... bun ops/adtraction.ts channels
 *   ADTRACTION_TOKEN=... bun ops/adtraction.ts discover   # -> ops/adtraction-programs.json
 *   ADTRACTION_TOKEN=... bun ops/adtraction.ts applications
 *   ADTRACTION_TOKEN=... bun ops/adtraction.ts program <programId>
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const BASE = "https://api.adtraction.net/v2";
const SE_MARKET_ID = 1; // live value (the published v2 example uses 12, but SE is 1)

function getToken(): string {
  if (process.env.ADTRACTION_TOKEN) return process.env.ADTRACTION_TOKEN.trim();
  const envPath = resolve(import.meta.dir, ".env");
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, "utf-8")
      .split("\n")
      .find((l) => l.startsWith("ADTRACTION_TOKEN="));
    if (line) return line.slice("ADTRACTION_TOKEN=".length).trim();
  }
  console.error("Missing ADTRACTION_TOKEN (env or ops/.env). Aborting.");
  process.exit(1);
}

const TOKEN = getToken();

async function get<T>(path: string): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE}${path}${sep}token=${TOKEN}`, {
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

// Category IDs (SE market) mapped to the sites that can monetize them.
// Discovered live via /partner/programs/categories/1.
const TARGET_CATEGORIES: Record<number, { name: string; sites: string[] }> = {
  2: { name: "Automotive", sites: ["bilforsakringar", "elsparkcyklar"] },
  3: { name: "Electronics", sites: ["robotdammsugare", "elsparkcyklar"] },
  7: { name: "Home & Garden", sites: ["robotdammsugare", "solceller"] },
  8: { name: "Insurance", sites: ["bilforsakringar"] },
  13: { name: "Utilities", sites: ["solceller"] },
  16: { name: "Sport & Outdoors", sites: ["elsparkcyklar", "bastaelcykeln"] },
};

interface DirectoryProgram {
  categoryId: number;
  categoryName: string;
  programId: number;
  programName: string;
  programUrl: string;
  logoUrl?: string;
  market: string;
}

async function discover() {
  const all: Array<DirectoryProgram & { sites: string[] }> = [];
  for (const [catId, meta] of Object.entries(TARGET_CATEGORIES)) {
    const programs = await get<DirectoryProgram[]>(
      `/partner/programs/directory/${SE_MARKET_ID}/${catId}/`
    );
    for (const p of programs) all.push({ ...p, sites: meta.sites });
    console.log(`  ${meta.name.padEnd(18)} (cat ${catId}): ${programs.length} programs`);
  }
  const out = resolve(import.meta.dir, "adtraction-programs.json");
  writeFileSync(out, JSON.stringify(all, null, 2));
  console.log(`\nWrote ${all.length} programs -> ${out}`);
  console.log("Review and pick programIds, then apply in the Adtraction dashboard.");
}

async function channels() {
  const data = await get<unknown>(`/partner/channels/`);
  console.log(JSON.stringify(data, null, 2));
}

async function applications() {
  const data = await get<unknown>(`/partner/applications/`);
  console.log(JSON.stringify(data, null, 2));
}

async function program(programId: string) {
  // v2 GET program info incl. trackingURL (works once a channel exists/approved)
  const data = await get<unknown>(
    `/partner/programs/?market=SE&programId=${programId}&approvalStatus=1`
  );
  console.log(JSON.stringify(data, null, 2));
}

async function commissions(programId: string) {
  // Standard-segment commissions (no channelId needed) — works pre-approval.
  const data = await get<unknown>(`/partner/programs/commissions/${programId}/`);
  console.log(JSON.stringify(data, null, 2));
}

const [cmd, arg] = process.argv.slice(2);
const run = async () => {
  switch (cmd) {
    case "discover":
      return discover();
    case "channels":
      return channels();
    case "applications":
      return applications();
    case "program":
      if (!arg) throw new Error("Usage: adtraction.ts program <programId>");
      return program(arg);
    case "commissions":
      if (!arg) throw new Error("Usage: adtraction.ts commissions <programId>");
      return commissions(arg);
    default:
      console.log("Commands: discover | channels | applications | program <id> | commissions <id>");
  }
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
