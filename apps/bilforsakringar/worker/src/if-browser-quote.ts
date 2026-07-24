import { launch } from "@cloudflare/playwright";
import type { Page } from "@cloudflare/playwright";
import {
  mapIfResponse,
  IF_RECAPTCHA_SITE_KEY,
  IF_QUOTE_PAGE_URL,
  IF_SALES_CHANNEL_ID,
  IF_SHOP_ID,
  formatIfPersonnummer,
  ifPriceResponseSchema,
  type QuoteRequest,
  type QuoteResult,
} from "@affiliate/insurance-providers";

type BrowserBinding = Parameters<typeof launch>[0];

/** Odysseus uses action "odysseus" — see bundle.sv-se.*.js */
const RECAPTCHA_ACTION = "odysseus";
const MAX_INIT_ATTEMPTS = 3;

interface InitAttemptResult {
  status: number;
  quotationId: string;
  correlationId: string;
  body: string;
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
    Odysseus_onReCaptchaLoad?: () => void;
  }
}

/**
 * IF validates reCAPTCHA score server-side. Tokens minted outside the page
 * context (curl / injected script) get ReCaptchaScoreIndicatesBot.
 *
 * The full initQuotation + price fetch must run inside Browser Run.
 * Provider docs: packages/insurance-providers/src/providers/if/README.md
 */
export async function fetchIfQuoteViaBrowser(
  browserBinding: BrowserBinding,
  request: QuoteRequest
): Promise<QuoteResult> {
  const regno = request.regno.toUpperCase().replace(/\s/g, "");
  const personnummer = formatIfPersonnummer(request.personnummer);
  const personnummerInput = personnummer.replace("-", "");

  const browser = await launch(browserBinding);

  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 900 },
    });

    await page.goto(IF_QUOTE_PAGE_URL, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });

    await page
      .locator("#onetrust-accept-btn-handler")
      .click({ timeout: 5_000 })
      .catch(() => {});

    await warmUpPage(page);
    await fillQuoteForm(page, regno, personnummerInput);
    await waitForRecaptchaReady(page);

    let init: InitAttemptResult | { error: string } | null = null;

    for (let attempt = 1; attempt <= MAX_INIT_ATTEMPTS; attempt++) {
      init = await initQuotationInPage(page, {
        regno,
        personnummer,
        siteKey: IF_RECAPTCHA_SITE_KEY,
        salesChannelId: IF_SALES_CHANNEL_ID,
        shopId: IF_SHOP_ID,
      });

      if ("error" in init) break;

      const isBotScore =
        init.status === 400 &&
        init.body.includes("ReCaptchaScoreIndicatesBot");

      if (!isBotScore) break;

      if (attempt < MAX_INIT_ATTEMPTS) {
        await page.waitForTimeout(2_000 * attempt);
        await waitForRecaptchaReady(page);
      }
    }

    if (!init || "error" in init) {
      return {
        success: false,
        error: {
          provider: "if",
          error: init?.error ?? "IF init failed",
          code: "CAPTCHA_ERROR",
        },
      };
    }

    if (init.status !== 200) {
      return {
        success: false,
        error: {
          provider: "if",
          error: `IF init ${init.status}: ${init.body.slice(0, 200)}`,
          code: "INIT_ERROR",
        },
      };
    }

    const priceId = parsePriceId(init.body, init.quotationId);
    const price = await page.evaluate(
      async ({ quotationId, correlationId }) => {
        const res = await fetch(
          `https://if.se/apps/waypoint/onlinesales/productdefinitions-api/api/price/${quotationId}`,
          {
            headers: {
              accept: "application/json",
              "x-cc-correlationid": correlationId,
            },
          }
        );
        return { status: res.status, body: await res.text() };
      },
      { quotationId: priceId, correlationId: init.correlationId }
    );

    if (price.status !== 200) {
      return {
        success: false,
        error: {
          provider: "if",
          error: `IF price ${price.status}: ${price.body.slice(0, 200)}`,
          code: "PRICE_ERROR",
        },
      };
    }

    let priceJson: unknown;
    try {
      priceJson = JSON.parse(price.body);
    } catch {
      return {
        success: false,
        error: {
          provider: "if",
          error: "IF price response is not valid JSON",
          code: "PARSE_ERROR",
        },
      };
    }

    const parsed = ifPriceResponseSchema.safeParse(priceJson);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          provider: "if",
          error: `IF price parse error: ${parsed.error.message}`,
          code: "PARSE_ERROR",
        },
      };
    }

    const mapped = mapIfResponse(parsed.data);
    if (mapped.packages.length === 0) {
      return {
        success: false,
        error: {
          provider: "if",
          error: "No insurance packages returned",
          code: "NO_PACKAGES",
        },
      };
    }

    return { success: true, data: mapped };
  } catch (err) {
    return {
      success: false,
      error: {
        provider: "if",
        error: err instanceof Error ? err.message : "Unknown browser error",
        code: "BROWSER_ERROR",
      },
    };
  } finally {
    await browser.close();
  }
}

async function warmUpPage(page: Page): Promise<void> {
  await page.waitForTimeout(3_000);
  await page.mouse.move(400, 300);
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(1_000);
}

async function fillQuoteForm(
  page: Page,
  regno: string,
  personnummerInput: string
): Promise<void> {
  const regInput = page.locator('input[placeholder="ABC123"]');
  await regInput.waitFor({ state: "visible", timeout: 30_000 });
  await regInput.fill(regno);
  await page.waitForTimeout(800);
  await page.locator('input[placeholder="ååååmmddnnnn"]').fill(personnummerInput);
  await page.waitForTimeout(2_000);
}

async function waitForRecaptchaReady(page: Page): Promise<void> {
  await page.waitForFunction(
    () => typeof window.grecaptcha?.execute === "function",
    null,
    { timeout: 45_000 }
  );
  // Let reCAPTCHA v3 collect page signals before execute (Odysseus does the same)
  await page.waitForTimeout(2_500);
}

async function initQuotationInPage(
  page: Page,
  args: {
    regno: string;
    personnummer: string;
    siteKey: string;
    salesChannelId: string;
    shopId: string;
  }
): Promise<InitAttemptResult | { error: string }> {
  return page.evaluate(
    async ({ siteKey, regno, personnummer, salesChannelId, shopId, action }) => {
      if (!window.grecaptcha?.execute) {
        return { error: "reCAPTCHA not loaded" } as const;
      }

      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(async () => {
          try {
            resolve(
              await window.grecaptcha!.execute(siteKey, { action })
            );
          } catch (err) {
            reject(err);
          }
        });
      });

      const quotationId = crypto.randomUUID();
      const correlationId = crypto.randomUUID();
      const params = new URLSearchParams({
        businessArea: "private",
        legalUnit: "SE",
        culture: "sv-SE",
        salesChannelId,
        definition: "PrivateCar",
        shopId,
        quotationId,
      });

      const res = await fetch(
        `https://if.se/apps/waypoint/onlinesales/odysseus-web/api/nautilus/initQuotation?${params}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "os-captcha-token": token,
            "x-cc-correlationid": correlationId,
          },
          body: JSON.stringify({
            inputs: [
              {
                id: 30020569,
                value: regno,
                metadata: {
                  validated: true,
                  tags: ["IdentifiesInsuredObject"],
                },
              },
              {
                id: 30020611,
                value: personnummer,
                metadata: { validated: true, tags: [] },
              },
            ],
            products: [],
            periodStart: new Date().toISOString(),
            legalNumber: personnummer,
            salesContext: "MotorNewsales",
          }),
        }
      );

      return {
        status: res.status,
        quotationId,
        correlationId,
        body: await res.text(),
      };
    },
    { ...args, action: RECAPTCHA_ACTION }
  );
}

function parsePriceId(initBody: string, fallbackId: string): string {
  try {
    const json = JSON.parse(initBody) as {
      quotationId?: string;
      calculationId?: string;
    };
    return json.calculationId || json.quotationId || fallbackId;
  } catch {
    return fallbackId;
  }
}
