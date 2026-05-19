export interface GTMConfig {
  containerId: string;
}

export function initGTM({ containerId }: GTMConfig): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
  document.head.appendChild(script);
}

export function GTMNoScript({ containerId }: GTMConfig): string {
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}
