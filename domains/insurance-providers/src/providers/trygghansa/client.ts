import type { QuoteRequest } from "../../types";
import type {
  TryggHansaValidationRequest,
  TryggHansaCalculationRequest,
  TryggHansaValidationResponse,
  TryggHansaCalculationResponse,
} from "./types";
import {
  tryggHansaValidationResponseSchema,
  tryggHansaCalculationResponseSchema,
} from "./types";
import { browserFetch } from "../../utils/browser-fetch";
import { mapYearlyKm, mapDeductibles } from "./form-config";

const VALIDATION_URL = "https://pl-vehicle-sales.bff.trygghansa.se/car/policy-validation";
const CALCULATION_URL = "https://pl-vehicle-sales.bff.trygghansa.se/car/policy-calculation";

function generateSessionId(): string {
  return crypto.randomUUID();
}

function generateVisitorId(): string {
  const hex = () => Math.random().toString(16).slice(2);
  return `019c${hex()}${hex()}`.slice(0, 47);
}

const commonHeaders = {
  "Accept": "text/plain",
  "Content-Type": "application/json",
  "Origin": "https://www.trygghansa.se",
  "x-th-csrf-protection": "true",
};

export async function fetchTryggHansaValidation(
  request: QuoteRequest,
  sessionId: string
): Promise<TryggHansaValidationResponse> {
  const body: TryggHansaValidationRequest = {
    socialSecurityNumber: request.personnummer,
    registrationNumber: request.regno.toUpperCase().replace(/\s/g, ""),
  };

  const response = await browserFetch(VALIDATION_URL, {
    method: "POST",
    headers: {
      ...commonHeaders,
      "session-id": sessionId,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Trygg-Hansa validation API ${response.status}: ${text.slice(0, 200)}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Trygg-Hansa invalid JSON: ${text.slice(0, 200)}`);
  }

  const parsed = tryggHansaValidationResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Trygg-Hansa validation parse error: ${parsed.error.message}`);
  }

  if (parsed.data.responseCode !== "Success") {
    throw new Error(`Trygg-Hansa validation failed: ${parsed.data.responseCode}`);
  }

  return parsed.data;
}

export async function fetchTryggHansaCalculation(
  request: QuoteRequest,
  validation: TryggHansaValidationResponse,
  sessionId: string
): Promise<TryggHansaCalculationResponse> {
  const now = new Date().toISOString();
  const deductibles = mapDeductibles(request.deductible);

  const body: TryggHansaCalculationRequest = {
    socialSecurityNumber: request.personnummer,
    vehicleRegistrationNumber: request.regno.toUpperCase().replace(/\s/g, ""),
    salesContext: {
      companyCode: "Th",
      membershipCode: "000",
      salesChannel: "Online",
      subscribingRepresentativeCode: "67713",
      administratingRepresentativeCode: "67713",
      visitorId: generateVisitorId(),
      partyId: validation.customer.partyId,
      partyNumber: validation.customer.partyNumber,
    },
    conditionDate: now,
    startDate: now,
    yearlyMilage: mapYearlyKm(request.yearlyKm),
    hasYoungDrivers: request.driverUnder24,
    trafficDeductibleAlternativeId: deductibles.traffic,
    halfInsuranceDeductibleAlternativeId: deductibles.half,
    vehicleDamageDeductibleAlternativeId: deductibles.vehicleDamage,
  };

  const response = await browserFetch(CALCULATION_URL, {
    method: "POST",
    headers: {
      ...commonHeaders,
      "session-id": sessionId,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Trygg-Hansa calculation API ${response.status}: ${text.slice(0, 200)}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Trygg-Hansa invalid JSON: ${text.slice(0, 200)}`);
  }

  const parsed = tryggHansaCalculationResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Trygg-Hansa calculation parse error: ${parsed.error.message}`);
  }

  if (parsed.data.calculationResponseCode !== "Success") {
    throw new Error(`Trygg-Hansa calculation failed: ${parsed.data.calculationResponseCode}`);
  }

  return parsed.data;
}

export async function fetchTryggHansaQuote(
  request: QuoteRequest
): Promise<{ validation: TryggHansaValidationResponse; calculation: TryggHansaCalculationResponse }> {
  const sessionId = generateSessionId();
  
  const validation = await fetchTryggHansaValidation(request, sessionId);
  const calculation = await fetchTryggHansaCalculation(request, validation, sessionId);
  
  return { validation, calculation };
}
