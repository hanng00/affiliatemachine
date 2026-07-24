import type { QuoteRequest } from "../../types";
import type { GjensidigeRequest, GjensidigeResponse, GjensidigePackageConfigs } from "./types";
import { gjensidigeResponseSchema, gjensidigePackageConfigsSchema } from "./types";
import { browserFetch } from "../../utils/browser-fetch";
import { getGjensidigeSession } from "./session";
import { mapYearlyKm, mapVagnskadaDeductible, mapDelkaskoDeductible, mapDriverUnder24 } from "./form-config";

const API_URL = "https://www.gjensidige.se/offer_gfseext/create";
const CONFIG_URL = "https://cdn.gjensidige.no/claims-sweden/sweden-core/maps/webshop-se/car/package-configurations.json";

function generateId(): string {
  return Math.random().toString(16).slice(2, 9);
}

export function buildGjensidigeRequest(request: QuoteRequest): GjensidigeRequest {
  return {
    cpr: request.personnummer.slice(0, 10),
    channel: "gjensidige",
    product: "car",
    attributeList: [
      { key: "regPlate", value: request.regno.toUpperCase().replace(/\s/g, "") },
      { key: "yearlyKm", value: mapYearlyKm(request.yearlyKm * 1000) }, // Convert from "thousands" to actual km
      { key: "vagnskadaSelfRisk", value: mapVagnskadaDeductible(request.deductible) },
      { key: "delkaskoSelfRisk", value: mapDelkaskoDeductible(request.deductible) },
      { key: "driverUnder24", value: mapDriverUnder24(request.driverUnder24) },
    ],
  };
}

export async function fetchGjensidigeQuote(
  request: QuoteRequest
): Promise<GjensidigeResponse> {
  const body = buildGjensidigeRequest(request);
  const cookies = await getGjensidigeSession();

  const response = await browserFetch(API_URL, {
    method: "POST",
    cookies,
    headers: {
      "Accept": "application/json, */*",
      "Content-Type": "application/json",
      "applikasjon": "GFSEWEBSHOP",
      "x-clientid": "webshop-frontend-se",
      "x-clientversion": "1.0.0",
      "x-requested-by": "invalid",
      "x-requestid": generateId(),
      "x-sessionid": generateId(),
      "Origin": "https://www.gjensidige.se",
      "Referer": "https://www.gjensidige.se/apps/webshop/",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Gjensidige API ${response.status}: ${text.slice(0, 200)}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Gjensidige invalid JSON: ${text.slice(0, 200)}`);
  }

  if (typeof data === "object" && data !== null && "calculationStatus" in data) {
    const status = (data as { calculationStatus?: { error?: boolean; message?: string } }).calculationStatus;
    if (status?.error) {
      const message = status.message?.replace(/<[^>]*>/g, "") || "Unknown error";
      throw new Error(`Gjensidige: ${message}`);
    }
  }

  const parsed = gjensidigeResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Gjensidige parse error. Got: ${JSON.stringify(data).slice(0, 300)}`);
  }

  return parsed.data;
}

export async function fetchGjensidigeConfigurations(): Promise<GjensidigePackageConfigs> {
  const response = await browserFetch(CONFIG_URL, {
    headers: {
      "Accept": "*/*",
      "Origin": "https://www.gjensidige.se",
      "Referer": "https://www.gjensidige.se/",
    },
  });

  if (!response.ok) {
    throw new Error(`Gjensidige config fetch error: ${response.status}`);
  }

  const data = await response.json();
  return gjensidigePackageConfigsSchema.parse(data);
}
