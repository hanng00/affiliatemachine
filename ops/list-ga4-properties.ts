#!/usr/bin/env bun
/**
 * ops/list-ga4-properties.ts
 *
 * Lists all GA4 properties + measurement IDs under the AffiliateMachine account.
 * Useful for backfilling existing properties into packages/sites/src/index.ts.
 *
 * Usage:
 *   bun ops/list-ga4-properties.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const GA4_ACCOUNT_ID = "395315133";
const SA_KEY_PATH = resolve(import.meta.dir, "google-service-account.json");

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

async function getAccessToken(): Promise<string> {
  const key: ServiceAccountKey = JSON.parse(readFileSync(SA_KEY_PATH, "utf-8"));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const unsigned = `${encode(header)}.${encode(payload)}`;
  const { createSign } = await import("crypto");
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const sig = signer.sign(key.private_key, "base64url");
  const jwt = `${unsigned}.${sig}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const { access_token } = (await res.json()) as { access_token: string };
  return access_token;
}

async function main() {
  const token = await getAccessToken();

  // List properties
  const res = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:accounts/${GA4_ACCOUNT_ID}&pageSize=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const { properties = [] } = (await res.json()) as { properties: Array<{ name: string; displayName: string }> };

  for (const prop of properties) {
    const propertyId = prop.name.split("/")[1];

    // Get data streams to find measurementId
    const streamRes = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { dataStreams = [] } = (await streamRes.json()) as {
      dataStreams: Array<{ type: string; webStreamData?: { measurementId: string; defaultUri: string } }>;
    };

    const web = dataStreams.find((s) => s.type === "WEB_DATA_STREAM");
    const measurementId = web?.webStreamData?.measurementId ?? "(no web stream)";
    const uri = web?.webStreamData?.defaultUri ?? "";

    console.log(`${prop.displayName.padEnd(30)} propertyId: ${propertyId.padEnd(12)} ga4Id: ${measurementId.padEnd(14)} ${uri}`);
  }
}

main().catch((err) => { console.error(err.message); process.exit(1); });
