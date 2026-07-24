/**
 * If OnlineSales constants — shop IDs, reCAPTCHA site key, quote page URL.
 * Documented in README.md.
 */
/** IF shop constants from if.se online sales flow */
export const IF_SALES_CHANNEL_ID = "15d8c556-1cc3-4ed9-bac8-21760ab81586";
export const IF_SHOP_ID = "caba37cc-3028-44ea-a780-14cc34630936";

/** Loaded by Odysseus widget from google.com/recaptcha/api.js?render=... */
export const IF_RECAPTCHA_SITE_KEY =
  "6LcH85gsAAAAAM8VABLSexJcdIgRNCYgnmVFg25q";

/** Quote form page – loads the OnlineSales embed + reCAPTCHA */
export const IF_QUOTE_PAGE_URL =
  "https://www.if.se/privat/forsakringar/bilforsakring/teckna-bilforsakring";

/** Format 10-digit personnummer to YYYYMMDD-XXXX */
export function formatIfPersonnummer(personnummer: string): string {
  const clean = personnummer.replace(/\D/g, "");
  if (clean.length === 10) {
    return `${clean.slice(0, 6)}-${clean.slice(6)}`;
  }
  if (clean.length === 12) {
    return `${clean.slice(0, 8)}-${clean.slice(8)}`;
  }
  return clean;
}

/** Map yearly km (in thousands) to IF AnnualMileage option value */
export function mapYearlyKm(yearlyKmThousands: number): string {
  const km = yearlyKmThousands * 1000;

  if (km <= 10000) return "1";
  if (km <= 15000) return "2";
  if (km <= 20000) return "3";
  if (km <= 25000) return "4";
  return "5";
}
