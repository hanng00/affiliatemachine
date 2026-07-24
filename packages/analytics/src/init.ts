import { initGA4 } from "./ga4";
import { initGTM } from "./gtm";
import { initConsentDefaults } from "./consent";

/**
 * Single entry point each app calls at startup. Prefers GTM (which should host
 * the GA4 tag) and only falls back to loading GA4 directly when no GTM
 * container is configured — prevents double-counting when both ids are set.
 *
 * Consent Mode v2 defaults are set first (analytics denied until the user opts
 * in via <ConsentBanner/>), so tags load but withhold storage until granted.
 */
export function initAnalytics(config: { gtmId?: string; ga4Id?: string }): void {
  initConsentDefaults();

  if (config.gtmId) {
    initGTM({ containerId: config.gtmId });
  } else if (config.ga4Id) {
    initGA4({ measurementId: config.ga4Id });
  }
}
