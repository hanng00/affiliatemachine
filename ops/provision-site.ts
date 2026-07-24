#!/usr/bin/env bun
/**
 * ops/provision-site.ts
 *
 * Provisions a new site's Google integrations and patches packages/sites/src/index.ts.
 *
 * Usage:
 *   bun ops/provision-site.ts --slug robotdammsugare
 *   bun ops/provision-site.ts --slug bilforsakringar
 *
 * What it does:
 *   1. Creates a GA4 property under the AffiliateMachine account
 *   2. Creates a web data stream → gets the G-XXXXXXXXXX measurement ID
 *   3. Adds the GSC site (domain must already be DNS-verified in Search Console)
 *   4. Patches packages/sites/src/index.ts with the new ga4Id + ga4PropertyId
 *
 * Prerequisites:
 *   - ops/google-service-account.json exists with editor access to:
 *       • GA4 account 395315133
 *       • Google Search Console (delegated via the owning Google account)
 *   - The domain is already DNS-verified in Search Console under the owning account
 *     and the service account has been added as a Full User on that property.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// ─── Config ──────────────────────────────────────────────────────────────────

const GA4_ACCOUNT_ID = "395315133";
const SA_KEY_PATH = resolve(import.meta.dir, "google-service-account.json");
const SITES_PATH = resolve(import.meta.dir, "../packages/sites/src/index.ts");

/**
 * GA4 industryCategory per site (cosmetic metadata on the property). Defaults to
 * FINANCE — the original portfolio (loans/insurance) — for any slug not listed.
 * Valid enum values: https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/IndustryCategory
 */
const INDUSTRY_BY_SLUG: Record<string, string> = {
  solceller: "HOME_AND_GARDEN",
  bastaelcykeln: "SHOPPING",
};
const DEFAULT_INDUSTRY = "FINANCE";

// ─── Google Auth ──────────────────────────────────────────────────────────────

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

async function getAccessToken(scopes: string[]): Promise<string> {
  const key: ServiceAccountKey = JSON.parse(readFileSync(SA_KEY_PATH, "utf-8"));

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: key.client_email,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsigned = `${encode(header)}.${encode(payload)}`;

  // Use Node's built-in crypto to sign with RS256
  const { createSign } = await import("crypto");
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(key.private_key, "base64url");

  const jwt = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth failed: ${err}`);
  }

  const { access_token } = (await res.json()) as { access_token: string };
  return access_token;
}

// ─── GA4 Admin API ────────────────────────────────────────────────────────────

async function createGA4Property(
  token: string,
  displayName: string,
  domain: string,
  industryCategory: string
): Promise<{ propertyId: string }> {
  const res = await fetch("https://analyticsadmin.googleapis.com/v1beta/properties", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayName,
      timeZone: "Europe/Stockholm",
      currencyCode: "SEK",
      industryCategory,
      parent: `accounts/${GA4_ACCOUNT_ID}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create GA4 property: ${err}`);
  }

  const data = (await res.json()) as { name: string };
  // name is like "properties/123456789"
  const propertyId = data.name.split("/")[1];
  console.log(`✓ GA4 property created: ${propertyId} (${displayName})`);
  return { propertyId };
}

async function createWebDataStream(
  token: string,
  propertyId: string,
  domain: string,
  displayName: string
): Promise<{ measurementId: string }> {
  const res = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "WEB_DATA_STREAM",
        displayName,
        webStreamData: {
          defaultUri: `https://${domain}`,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create data stream: ${err}`);
  }

  const data = (await res.json()) as { webStreamData: { measurementId: string } };
  const measurementId = data.webStreamData.measurementId;
  console.log(`✓ Web data stream created: ${measurementId}`);
  return { measurementId };
}

// ─── Search Console API ───────────────────────────────────────────────────────

async function addGSCSite(token: string, domain: string): Promise<void> {
  // GSC "site URL" for a domain property uses the sc-domain: prefix
  const siteUrl = `sc-domain:${domain}`;
  const encodedUrl = encodeURIComponent(siteUrl);

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedUrl}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (res.status === 204 || res.status === 200) {
    console.log(`✓ GSC site added: ${siteUrl}`);
    return;
  }

  // 403 usually means "already exists and you have access" or "not verified yet"
  if (res.status === 403) {
    const err = await res.text();
    if (err.includes("already")) {
      console.log(`ℹ GSC site already exists: ${siteUrl}`);
      return;
    }
    console.warn(
      `⚠ GSC site add returned 403 — domain may not be DNS-verified yet.\n` +
      `  Verify ${domain} at https://search.google.com/search-console/welcome\n` +
      `  then re-run this script.\n` +
      `  Raw: ${err}`
    );
    return;
  }

  const err = await res.text();
  throw new Error(`Failed to add GSC site: ${res.status} ${err}`);
}

// ─── Patch packages/sites/src/index.ts ───────────────────────────────────────

function patchSitesRegistry(
  slug: string,
  ga4Id: string,
  ga4PropertyId: string
): void {
  let src = readFileSync(SITES_PATH, "utf-8");

  // Find the block for this slug and replace the empty ga4Id / ga4PropertyId
  const slugPattern = new RegExp(
    `(slug:\\s*"${slug}"[\\s\\S]*?ga4Id:\\s*)"([^"]*)"([\\s\\S]*?ga4PropertyId:\\s*)"([^"]*)"`,
    "m"
  );

  if (!slugPattern.test(src)) {
    console.warn(`⚠ Could not find slug "${slug}" in sites registry — add IDs manually.`);
    console.log(`  ga4Id: "${ga4Id}"`);
    console.log(`  ga4PropertyId: "${ga4PropertyId}"`);
    return;
  }

  src = src.replace(slugPattern, `$1"${ga4Id}"$3"${ga4PropertyId}"`);
  writeFileSync(SITES_PATH, src, "utf-8");
  console.log(`✓ Patched packages/sites/src/index.ts for "${slug}"`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const slugIdx = args.indexOf("--slug");
  if (slugIdx === -1 || !args[slugIdx + 1]) {
    console.error("Usage: bun ops/provision-site.ts --slug <site-slug>");
    process.exit(1);
  }
  const slug = args[slugIdx + 1];

  // Import site registry dynamically to get domain + name
  const { sites } = await import("../packages/sites/src/index.ts");
  const site = sites.find((s) => s.slug === slug);
  if (!site) {
    console.error(`Unknown slug "${slug}". Add it to packages/sites/src/index.ts first.`);
    process.exit(1);
  }

  if (site.ga4PropertyId) {
    console.log(`ℹ "${slug}" already has ga4PropertyId: ${site.ga4PropertyId}`);
    console.log(`  Skipping GA4 provisioning. Re-run without --slug to force.`);
    // Still attempt GSC add in case that's missing
  }

  console.log(`\nProvisioning: ${site.name} (${site.domain})\n`);

  const token = await getAccessToken([
    "https://www.googleapis.com/auth/analytics.edit",
    "https://www.googleapis.com/auth/webmasters",
  ]);

  let ga4Id = site.ga4Id;
  let ga4PropertyId = site.ga4PropertyId;

  if (!ga4PropertyId) {
    const industry = INDUSTRY_BY_SLUG[slug] ?? DEFAULT_INDUSTRY;
    const { propertyId } = await createGA4Property(token, site.name, site.domain, industry);
    const { measurementId } = await createWebDataStream(token, propertyId, site.domain, site.name);
    ga4Id = measurementId;
    ga4PropertyId = propertyId;
    patchSitesRegistry(slug, ga4Id, ga4PropertyId);
  }

  await addGSCSite(token, site.domain);

  console.log(`\n✅ Done: ${site.name}`);
  console.log(`   GA4 Property ID : ${ga4PropertyId}`);
  console.log(`   Measurement ID  : ${ga4Id}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Add the GA4 snippet to apps/${slug} (if not using GTM)`);
  console.log(`  2. Run: bun run --cwd apps/admin db:sync-sites:prod`);
  console.log(`  3. Submit sitemap in GSC: https://${site.domain}/sitemap.xml`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
