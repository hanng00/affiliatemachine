/**
 * Google Consent Mode v2. GDPR/ePrivacy: analytics storage is denied by default
 * and only granted after explicit user action. GA4/GTM may still load, but they
 * withhold cookies/identifiers until consent is granted.
 *
 * Swedish law (marknadsföringslagen + GDPR): consent must be opt-in, as easy to
 * refuse as to accept, and remembered. We persist the choice in localStorage.
 */

const STORAGE_KEY = "am_consent_v1";

export type ConsentChoice = "granted" | "denied";

type ConsentState = {
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  analytics_storage: ConsentChoice;
};

function gtag(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  // Push the native `arguments` object, not the rest-param array — GA4/Consent
  // Mode only processes dataLayer entries whose type is `arguments`. The
  // `_args` rest param exists only to type the call sites; we deliberately push
  // `arguments` instead.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Read a previously stored choice, or null if the user hasn't decided yet. */
export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

/**
 * Set Consent Mode defaults. MUST run before GA4/GTM init so the tags know to
 * wait. Honors a prior stored choice; otherwise defaults to denied.
 */
export function initConsentDefaults(): void {
  if (typeof window === "undefined") return;
  const stored = getStoredConsent();
  const choice: ConsentChoice = stored ?? "denied";
  applyConsent(choice, /* isDefault */ true);
}

function buildState(choice: ConsentChoice): ConsentState {
  return {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  };
}

function applyConsent(choice: ConsentChoice, isDefault: boolean): void {
  gtag("consent", isDefault ? "default" : "update", {
    ...buildState(choice),
    // Security headers / region can be added later; wait_for_update gives the
    // banner a moment to hydrate before tags assume the default.
    ...(isDefault ? { wait_for_update: 500 } : {}),
  });
}

/** Persist + apply a user's explicit choice (from the banner). */
export function setConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, choice);
  applyConsent(choice, /* isDefault */ false);
}
