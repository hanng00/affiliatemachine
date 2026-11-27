declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AffiliateClickEvent = {
  event: "affiliate_click";
  affiliate_link_id: string;
  affiliate_program?: string;
  placement?: string;
  destination_url: string;
  /** Attribution token forwarded to the affiliate network (Adtraction `epi`). */
  sub_id?: string;
};

export type PageViewEvent = {
  event: "page_view";
  page_path: string;
  page_title: string;
};

/**
 * The moment a visitor reaches a page's *value*, i.e. the mid-funnel signal
 * between landing and an affiliate click. One shared event with a site-defined
 * `kind` so the worker query + dashboard stay uniform while the meaning is
 * local (samlalanet: "loan_edited"; solceller: "roof_drawn"; …). Fire it once
 * per session (see `trackActivationOnce`) so it reads as a clean rate, not a
 * noisy counter.
 */
export type ActivationEvent = {
  event: "activation";
  kind: string;
  /** Optional magnitude (e.g. SEK shown) for later segmentation. */
  value?: number;
};

/**
 * Own-lead funnel (sites that capture the lead themselves). `lead_step` marks
 * progress through a multi-step form; `generate_lead` is GA4's recommended
 * event name for a successful submit, so it can be marked as a key event.
 */
export type LeadEvent = {
  event: "lead_step" | "generate_lead";
  /** Which form/page variant (e.g. "villa", "brf"). */
  form: string;
  /** Step name for `lead_step` (e.g. "timeline_selected"). */
  step?: string;
  /** Optional magnitude (e.g. annual saving shown) for segmentation. */
  value?: number;
};

export type AnalyticsEvent = AffiliateClickEvent | PageViewEvent | ActivationEvent | LeadEvent;

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  // GTM: push the raw event onto the dataLayer so container triggers can fire.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);

  // GA4 gtag.js: also fire directly when gtag is present (no GTM container).
  if (typeof window.gtag === "function") {
    const { event: eventName, ...params } = event;
    window.gtag("event", eventName, params);
  }
}

/**
 * Build a deterministic sub-id used for revenue attribution. Encodes which
 * site/placement/link drove the click so the admin can map Adtraction revenue
 * back to a placement. Sanitised + length-capped for tracking-url safety.
 */
export function buildSubId(site: string, placement: string | undefined, linkId: string): string {
  return [site, placement ?? "na", linkId].join("__").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
}

/** Append the sub-id to an affiliate tracking url as Adtraction's `epi` param. */
export function appendSubId(url: string, subId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("epi", subId);
    return u.toString();
  } catch {
    return url;
  }
}

export function trackAffiliateClick(params: Omit<AffiliateClickEvent, "event">): void {
  trackEvent({ event: "affiliate_click", ...params });
}

export function trackPageView(path: string, title: string): void {
  trackEvent({ event: "page_view", page_path: path, page_title: title });
}

export function trackLead(params: LeadEvent): void {
  trackEvent(params);
}

export function trackActivation(params: Omit<ActivationEvent, "event">): void {
  trackEvent({ event: "activation", ...params });
}

/**
 * Fire an `activation` at most once per session+kind. Backed by sessionStorage
 * so reloads within a tab session don't re-count; degrades to "always fire"
 * if storage is unavailable. Returns true if it actually fired.
 */
export function trackActivationOnce(params: Omit<ActivationEvent, "event">): boolean {
  if (typeof window === "undefined") return false;
  const storageKey = `activation:${params.kind}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return false;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // no storage (private mode / disabled) — fall through and fire anyway
  }
  trackActivation(params);
  return true;
}
