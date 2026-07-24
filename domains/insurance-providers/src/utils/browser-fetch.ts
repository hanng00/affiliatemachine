const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
];

const ACCEPT_LANGUAGES = [
  "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
  "en-US,en;q=0.9,sv-SE;q=0.8",
  "sv,en-US;q=0.9,en;q=0.8",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface BrowserFetchOptions extends RequestInit {
  cookies?: string;
}

/**
 * Wraps fetch() to look like a regular browser request.
 * Adds User-Agent, Accept-Language, and other standard headers.
 * Pass `cookies` to include a Cookie header.
 * Follows redirects manually to collect all Set-Cookie headers.
 */
export async function browserFetch(
  url: string,
  options: BrowserFetchOptions = {}
): Promise<Response> {
  const { cookies, headers: extraHeaders, ...fetchOpts } = options;

  const headers: Record<string, string> = {
    "User-Agent": pick(USER_AGENTS),
    "Accept-Language": pick(ACCEPT_LANGUAGES),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Cache-Control": "no-cache",
    ...(cookies ? { Cookie: cookies } : {}),
    ...(extraHeaders instanceof Headers
      ? Object.fromEntries(extraHeaders.entries())
      : (extraHeaders as Record<string, string>) || {}),
  };

  return fetch(url, { ...fetchOpts, headers, redirect: "follow" });
}

/**
 * Like browserFetch, but follows redirects manually to collect all cookies.
 * Returns { response, cookies } where cookies includes all Set-Cookie values
 * from every hop.
 */
export async function browserFetchWithCookies(
  url: string,
  options: BrowserFetchOptions = {}
): Promise<{ response: Response; cookies: string }> {
  const { cookies: initialCookies, headers: extraHeaders, ...fetchOpts } = options;

  let currentUrl = url;
  let cookies = initialCookies || "";
  let response: Response;
  let hops = 0;

  while (hops < 5) {
    const headers: Record<string, string> = {
      "User-Agent": pick(USER_AGENTS),
      "Accept-Language": pick(ACCEPT_LANGUAGES),
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Cache-Control": "no-cache",
      ...(cookies ? { Cookie: cookies } : {}),
      ...(extraHeaders instanceof Headers
        ? Object.fromEntries(extraHeaders.entries())
        : (extraHeaders as Record<string, string>) || {}),
    };

    response = await fetch(currentUrl, { ...fetchOpts, headers, redirect: "manual" });
    cookies = mergeCookies(cookies, extractCookies(response));

    const location = response.headers.get("location");
    if (location && response.status >= 300 && response.status < 400) {
      currentUrl = new URL(location, currentUrl).href;
      hops++;
    } else {
      break;
    }
  }

  return { response: response!, cookies };
}

/**
 * Collects Set-Cookie values from a response.
 */
export function extractCookies(response: Response): string[] {
  const cookies: string[] = [];
  // getSetCookie() returns all Set-Cookie headers as an array
  const raw = (response.headers as any).getSetCookie?.() as string[] | undefined;
  if (raw) {
    for (const cookie of raw) {
      const nameValue = cookie.split(";")[0];
      if (nameValue) cookies.push(nameValue);
    }
  }
  return cookies;
}

/**
 * Merges new cookies into existing cookie string, deduplicating by name.
 */
export function mergeCookies(existing: string, newCookies: string[]): string {
  const map = new Map<string, string>();

  for (const c of existing.split("; ").filter(Boolean)) {
    const [name] = c.split("=");
    if (name) map.set(name, c);
  }

  for (const c of newCookies) {
    const [name] = c.split("=");
    if (name) map.set(name, c);
  }

  return Array.from(map.values()).join("; ");
}
