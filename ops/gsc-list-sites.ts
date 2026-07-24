/**
 * One-off diagnostic: list the Search Console properties the service account can
 * see, in the exact form Google stores them. Answers the åäö question directly —
 * whether you must use Unicode or punycode `sc-domain:` identifiers.
 *
 *   bun ops/gsc-list-sites.ts
 *
 * Requires ops/google-service-account.json (already gitignored).
 */
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

const key = JSON.parse(readFileSync("ops/google-service-account.json", "utf8"));

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function mintToken(): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat,
      exp: iat + 3600,
    })
  );
  const unsigned = `${header}.${payload}`;
  const signature = b64url(createSign("RSA-SHA256").update(unsigned).sign(key.private_key));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

const token = await mintToken();
const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
  headers: { Authorization: `Bearer ${token}` },
});
const data = (await res.json()) as { siteEntry?: { siteUrl: string; permissionLevel: string }[] };

console.log(`Service account: ${key.client_email}\n`);
if (!data.siteEntry?.length) {
  console.log("No properties visible. The service account has not been added to any GSC property yet.");
} else {
  console.log("Properties this service account can read:");
  for (const s of data.siteEntry) {
    console.log(`  ${s.siteUrl}   [${s.permissionLevel}]`);
  }
}
