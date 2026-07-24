import { browserFetchWithCookies } from "../../utils/browser-fetch";

const SESSION_URLS = [
  "https://www.gjensidige.se/apps/webshop/",
  "https://www.gjensidige.se/offer_gfseext/",
];

/**
 * Visits Gjensidige's webshop pages to collect session cookies (JSESSIONID etc).
 * Returns a cookie string ready to use with the quote API.
 */
export async function getGjensidigeSession(): Promise<string> {
  let cookies = "";

  for (const url of SESSION_URLS) {
    const result = await browserFetchWithCookies(url, { cookies });
    cookies = result.cookies;
  }

  return cookies;
}
