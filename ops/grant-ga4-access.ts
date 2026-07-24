#!/usr/bin/env bun
/**
 * ops/grant-ga4-access.ts
 *
 * One-time: grants the service account editor access to the GA4 account.
 * You already ran `gcloud auth application-default login` with analytics.edit scope.
 *
 * Usage:
 *   bun ops/grant-ga4-access.ts
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

const GA4_ACCOUNT_ID = "395315133";
const SA_KEY_PATH = resolve(import.meta.dir, "google-service-account.json");

const { client_email } = JSON.parse(readFileSync(SA_KEY_PATH, "utf-8"));

let userToken: string;
try {
  userToken = execSync("gcloud auth application-default print-access-token", { encoding: "utf-8" }).trim();
} catch {
  console.error("❌ Run this first:\n\n  gcloud auth application-default login \\\n    --client-id-file=ops/oauth-client.json \\\n    --scopes=https://www.googleapis.com/auth/analytics.edit,https://www.googleapis.com/auth/cloud-platform\n");
  process.exit(1);
}

console.log(`Granting editor access to: ${client_email}`);

const res = await fetch(
  `https://analyticsadmin.googleapis.com/v1alpha/accounts/${GA4_ACCOUNT_ID}/accessBindings`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: client_email,
      roles: ["predefinedRoles/viewer"],
    }),
  }
);

if (!res.ok) {
  const err = await res.text();
  if (err.includes("already exists")) {
    console.log(`✅ Service account already has access.`);
    process.exit(0);
  }
  console.error(`❌ Failed (${res.status}): ${err}`);
  process.exit(1);
}

const data = await res.json();
console.log(`✅ Access granted. Binding: ${(data as { name: string }).name}`);
