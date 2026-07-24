#!/usr/bin/env bun
/**
 * One-time: mint a long-lived Google OAuth refresh token for the admin worker.
 *
 * Why this exists: the portfolio runs on a consumer @gmail account, so the
 * service account can't be granted Search Console access (GSC's "add user" UI
 * rejects iam.gserviceaccount.com addresses). Instead the worker authenticates
 * AS the owner — you're already a verified owner of every GSC property and GA4
 * account, so a refresh token minted here reads everything with no per-site grant.
 *
 * Run:   bun ops/mint-google-refresh-token.ts
 * Then:  follow the printed wrangler secret commands.
 *
 * Uses the loopback (http://localhost) flow of the existing desktop OAuth client
 * in ops/oauth-client.json. The refresh token it prints is the only durable
 * secret; the access tokens it implies are short-lived and minted on demand by
 * the worker.
 */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];

const clientPath = join(import.meta.dir, "oauth-client.json");
const { installed } = JSON.parse(readFileSync(clientPath, "utf8")) as {
  installed: { client_id: string; client_secret: string; token_uri: string };
};
const { client_id, client_secret, token_uri } = installed;

// Loopback redirect on an ephemeral port.
const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}`;

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline", // ← required to receive a refresh_token
    prompt: "consent", // ← force a fresh refresh_token even if previously granted
  }).toString();

console.log("\n1. Open this URL in the browser logged in as the OWNER account:\n");
console.log(authUrl);
console.log("\n2. Approve the scopes. The browser will redirect to localhost and this script will finish.\n");

const code: string = await new Promise((resolve, reject) => {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", REDIRECT_URI);
    const c = url.searchParams.get("code");
    const err = url.searchParams.get("error");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<html><body style="font-family:system-ui;padding:40px"><h2>${
        c ? "✓ Authorized — you can close this tab." : "✗ " + (err ?? "no code")
      }</h2></body></html>`
    );
    server.close();
    if (c) resolve(c);
    else reject(new Error(err ?? "no code returned"));
  });
  server.listen(PORT);
});

const tokenRes = await fetch(token_uri, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id,
    client_secret,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }).toString(),
});

const tokens = (await tokenRes.json()) as { refresh_token?: string; error?: string };
if (!tokens.refresh_token) {
  console.error("\n✗ No refresh_token returned:", tokens);
  console.error("If you've authorized before, revoke at https://myaccount.google.com/permissions and rerun.");
  process.exit(1);
}

console.log("\n✓ Refresh token obtained. Set these three secrets on the admin worker:\n");
console.log(`cd apps/admin`);
console.log(`echo '${client_id}' | npx wrangler secret put GOOGLE_OAUTH_CLIENT_ID`);
console.log(`echo '${client_secret}' | npx wrangler secret put GOOGLE_OAUTH_CLIENT_SECRET`);
console.log(`echo '${tokens.refresh_token}' | npx wrangler secret put GOOGLE_OAUTH_REFRESH_TOKEN`);
console.log("\n(Keep the refresh token out of git — it's a credential.)\n");
