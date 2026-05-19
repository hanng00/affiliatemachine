declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export type AffiliateClickEvent = {
  event: "affiliate_click";
  affiliate_link_id: string;
  affiliate_program?: string;
  placement?: string;
  destination_url: string;
};

export type PageViewEvent = {
  event: "page_view";
  page_path: string;
  page_title: string;
};

export type AnalyticsEvent = AffiliateClickEvent | PageViewEvent;

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined" || !window.gtag) {
    console.debug("[Analytics] gtag not available, skipping event:", event);
    return;
  }

  const { event: eventName, ...params } = event;
  window.gtag("event", eventName, params);
}

export function trackAffiliateClick(params: Omit<AffiliateClickEvent, "event">): void {
  trackEvent({ event: "affiliate_click", ...params });
}

export function trackPageView(path: string, title: string): void {
  trackEvent({ event: "page_view", page_path: path, page_title: title });
}
