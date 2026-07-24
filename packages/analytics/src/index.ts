export { initGA4, type GA4Config } from "./ga4";
export { initGTM, GTMNoScript, type GTMConfig } from "./gtm";
export { initAnalytics } from "./init";
export {
  initConsentDefaults,
  getStoredConsent,
  setConsent,
  type ConsentChoice,
} from "./consent";
export { ConsentBanner } from "./ConsentBanner";
export {
  trackEvent,
  trackAffiliateClick,
  trackPageView,
  trackActivation,
  trackActivationOnce,
  buildSubId,
  appendSubId,
  type AnalyticsEvent,
  type AffiliateClickEvent,
  type PageViewEvent,
  type ActivationEvent,
} from "./events";
export { usePageView } from "./hooks/usePageView";
export { useTrackClick } from "./hooks/useTrackClick";
export { useTrackActivation } from "./hooks/useTrackActivation";
