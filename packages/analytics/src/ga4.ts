export interface GA4Config {
  measurementId: string;
  debug?: boolean;
}

export function initGA4({ measurementId, debug = false }: GA4Config): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    debug_mode: debug,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}
