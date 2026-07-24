export interface GA4Config {
  measurementId: string;
  debug?: boolean;
}

export function initGA4({ measurementId, debug = false }: GA4Config): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  // gtag MUST push the native `arguments` object — the GA4 library only
  // recognises dataLayer entries of type `arguments` as commands. Pushing a
  // real array (e.g. `(...args) => push(args)`) makes the library silently
  // ignore js/config/event calls, so no hit is ever sent.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
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
