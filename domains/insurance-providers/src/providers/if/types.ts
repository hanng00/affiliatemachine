import { z } from "zod";

export const ifInitQuotationResponseSchema = z.object({
  quotationId: z.string(),
  calculationId: z.string().optional(),
  businessArea: z.string().optional(),
  legalUnit: z.string().optional(),
  lineOfBusiness: z.string().optional(),
  existing: z.boolean().optional(),
});

export type IfInitQuotationResponse = z.infer<typeof ifInitQuotationResponseSchema>;

export const ifInitErrorSchema = z.object({
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  reason: z.string().optional(),
  reasonCode: z.string().optional(),
});

const ifPriceInfoSchema = z.object({
  priceWithoutDiscounts: z.number(),
  priceWithDiscounts: z.number(),
});

const ifDiscountInfoSchema = z.object({
  percentage: z.number().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
});

const ifProductPriceSchema = z.object({
  productId: z.number(),
  annualPremium: z.number(),
  monthlyPremium: z.number(),
  currency: z.string().optional(),
  priceInformation: z
    .object({
      annualPriceInfo: ifPriceInfoSchema.optional(),
      monthlyPriceInfo: ifPriceInfoSchema.optional(),
      discountsInfos: z.array(ifDiscountInfoSchema).optional(),
    })
    .optional(),
});

const ifMainProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string().optional(),
  recommended: z.boolean().optional(),
  selected: z.boolean().optional(),
});

const ifAddOnSchema = z.object({
  id: z.number(),
  name: z.string(),
  annualPremium: z.number(),
  monthlyPremium: z.number(),
});

const ifEditableElementSchema = z.object({
  id: z.number(),
  propertyName: z.string().nullable().optional(),
  value: z.union([z.string(), z.boolean(), z.number()]).optional(),
  displayValue: z.string().nullable().optional(),
});

export const ifPriceResponseSchema = z.object({
  id: z.string(),
  totalYearlyPrice: z.number().optional(),
  totalMonthlyPrice: z.number().optional(),
  insuredObjectDescription: z.string().optional(),
  mainProducts: z
    .object({
      items: z.array(ifMainProductSchema),
    })
    .optional(),
  productPrices: z
    .object({
      items: z.array(ifProductPriceSchema),
    })
    .optional(),
  addOns: z.array(ifAddOnSchema).optional(),
  editableInformationElements: z
    .object({
      items: z.array(ifEditableElementSchema),
    })
    .optional(),
  links: z
    .array(
      z.object({
        rel: z.string(),
        url: z.string().optional(),
        href: z.string().optional(),
      })
    )
    .optional(),
});

export type IfPriceResponse = z.infer<typeof ifPriceResponseSchema>;
export type IfMainProduct = z.infer<typeof ifMainProductSchema>;
export type IfProductPrice = z.infer<typeof ifProductPriceSchema>;

export const IF_MAIN_PRODUCT_IDS = {
  trafik: 30000155,
  halv: 30000156,
  hel: 30000158,
} as const;

export const IF_INPUT_IDS = {
  registrationNumber: 30020569,
  personnummer: 30020611,
  annualMileage: 40000034,
} as const;
