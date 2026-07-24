/**
 * Fetch-based IF API client (initQuotation → price).
 *
 * Requires `request.captchaToken` — tokens minted outside a loaded if.se page
 * get ReCaptchaScoreIndicatesBot. Production uses Browser Run instead; see
 * README.md and apps/bilforsakringar/worker/src/if-browser-quote.ts.
 */
import type { QuoteRequest } from "../../types";
import { browserFetch } from "../../utils/browser-fetch";
import {
  IF_SALES_CHANNEL_ID,
  IF_SHOP_ID,
  formatIfPersonnummer,
} from "./form-config";
import {
  IF_INPUT_IDS,
  ifInitErrorSchema,
  ifInitQuotationResponseSchema,
  ifPriceResponseSchema,
  type IfInitQuotationResponse,
  type IfPriceResponse,
} from "./types";

const INIT_URL =
  "https://if.se/apps/waypoint/onlinesales/odysseus-web/api/nautilus/initQuotation";
const PRICE_URL =
  "https://if.se/apps/waypoint/onlinesales/productdefinitions-api/api/price";

function generateUuid(): string {
  return crypto.randomUUID();
}

function buildInitUrl(quotationId: string): string {
  const params = new URLSearchParams({
    businessArea: "private",
    legalUnit: "SE",
    culture: "sv-SE",
    salesChannelId: IF_SALES_CHANNEL_ID,
    definition: "PrivateCar",
    shopId: IF_SHOP_ID,
    quotationId,
  });
  return `${INIT_URL}?${params.toString()}`;
}

const commonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Origin: "https://www.if.se",
  Referer: "https://www.if.se/",
};

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`IF invalid JSON: ${text.slice(0, 200)}`);
  }
}

export async function initIfQuotation(
  request: QuoteRequest,
  quotationId: string,
  correlationId: string
): Promise<IfInitQuotationResponse> {
  if (!request.captchaToken) {
    throw new Error(
      "IF requires in-browser reCAPTCHA (CaptchaTokenMissing). Use Browser Run in the worker or pass captchaToken."
    );
  }

  const regno = request.regno.toUpperCase().replace(/\s/g, "");
  const legalNumber = formatIfPersonnummer(request.personnummer);

  const body = {
    inputs: [
      {
        id: IF_INPUT_IDS.registrationNumber,
        value: regno,
        metadata: { validated: true, tags: ["IdentifiesInsuredObject"] },
      },
      {
        id: IF_INPUT_IDS.personnummer,
        value: legalNumber,
        metadata: { validated: true, tags: [] },
      },
    ],
    products: [],
    periodStart: new Date().toISOString(),
    legalNumber,
    salesContext: "MotorNewsales",
  };

  const response = await browserFetch(buildInitUrl(quotationId), {
    method: "POST",
    headers: {
      ...commonHeaders,
      "os-captcha-token": request.captchaToken,
      "x-cc-correlationid": correlationId,
    },
    body: JSON.stringify(body),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const err = ifInitErrorSchema.safeParse(data);
    const message = err.success
      ? err.data.errorMessage || err.data.reason || "Init quotation failed"
      : `IF init ${response.status}`;
    throw new Error(`IF: ${message}`);
  }

  const parsed = ifInitQuotationResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`IF init parse error: ${parsed.error.message}`);
  }

  return parsed.data;
}

export async function fetchIfPrice(
  quotationId: string,
  correlationId: string
): Promise<IfPriceResponse> {
  const response = await browserFetch(`${PRICE_URL}/${quotationId}`, {
    method: "GET",
    headers: {
      ...commonHeaders,
      "x-cc-correlationid": correlationId,
    },
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      `IF price API ${response.status}: ${JSON.stringify(data).slice(0, 200)}`
    );
  }

  const parsed = ifPriceResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`IF price parse error: ${parsed.error.message}`);
  }

  return parsed.data;
}

export async function fetchIfQuote(
  request: QuoteRequest
): Promise<{ init: IfInitQuotationResponse; price: IfPriceResponse }> {
  const quotationId = generateUuid();
  const correlationId = generateUuid();

  const init = await initIfQuotation(request, quotationId, correlationId);
  const priceId = init.quotationId || init.calculationId || quotationId;
  const price = await fetchIfPrice(priceId, correlationId);

  return { init, price };
}
