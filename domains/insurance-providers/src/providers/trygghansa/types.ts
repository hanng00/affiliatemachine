import { z } from "zod";

// Policy validation response types
export const tryggHansaVehicleSchema = z.object({
  registrationNumber: z.string(),
  makeAndModel: z.string(),
  modelCode: z.string().optional(),
  yearModel: z.number(),
  isDirectImport: z.boolean().optional(),
  vehicleType: z.string(),
  serviceWeight: z.number().optional(),
  enginePowerKw: z.number().optional(),
  firstRegistrationDate: z.string().optional(),
  bodyType: z.string().optional(),
  fuelType: z.string().optional(),
  commercialUsageType: z.string().optional(),
  hasDrivingBan: z.boolean().optional(),
  isDeregistered: z.boolean().optional(),
  isInsured: z.boolean().optional(),
  isCustomerVehicleOwner: z.boolean().optional(),
});

export const tryggHansaCustomerSchema = z.object({
  firstName: z.string(),
  partyId: z.string(),
  partyNumber: z.number(),
  customerInteractionRules: z.object({
    showAutogiroMonthlyPaymentOption: z.boolean().optional(),
    showAutogiroSigning: z.boolean().optional(),
    showEInvoiceMonthlyPaymentOption: z.boolean().optional(),
    showEInvoiceYearlyPaymentOption: z.boolean().optional(),
    showInvoiceHalfYearlyPaymentOption: z.boolean().optional(),
    showInvoiceYearlyPaymentOption: z.boolean().optional(),
    showDigitalCommunicationOption: z.boolean().optional(),
    selectableEInvoiceBanks: z.array(z.object({
      id: z.string(),
      name: z.string(),
    })).optional(),
  }).optional(),
});

export const tryggHansaValidationResponseSchema = z.object({
  responseCode: z.string(),
  customer: tryggHansaCustomerSchema,
  vehicle: tryggHansaVehicleSchema,
  vehicleTypeMemberships: z.array(z.object({
    vehicleType: z.string(),
    memberships: z.array(z.object({
      code: z.string(),
      name: z.string(),
      isUnionMembership: z.boolean(),
    })),
  })).optional(),
});

export type TryggHansaValidationResponse = z.infer<typeof tryggHansaValidationResponseSchema>;

// Policy calculation response types
export const tryggHansaPremiumsSchema = z.object({
  monthlyPremium: z.number(),
  halfYearlyPremium: z.number(),
  yearlyPremium: z.number(),
});

export const tryggHansaDeductibleSchema = z.object({
  id: z.number(),
  value: z.number(),
  isSelected: z.boolean(),
});

export const tryggHansaBaseProductSchema = z.object({
  productTypeCode: z.string(),
  selectableDeductibles: z.array(tryggHansaDeductibleSchema),
  premiums: tryggHansaPremiumsSchema,
});

export const tryggHansaAdditionalProductSchema = z.object({
  productTypeCode: z.string(),
  productElements: z.array(z.string()),
  premiums: tryggHansaPremiumsSchema,
  isSelected: z.boolean(),
});

export const tryggHansaDiscountSchema = z.object({
  monthlyAmountDiscount: z.number(),
  halfYearlyAmountDiscount: z.number(),
  yearlyAmountDiscount: z.number(),
  percentageDiscount: z.number().nullable(),
});

export const tryggHansaCampaignSchema = z.object({
  businessKey: z.string(),
  description: z.string(),
  percentageDiscount: z.number(),
});

export const tryggHansaProductPackageSchema = z.object({
  productPackageType: z.string(),
  baseProducts: z.array(tryggHansaBaseProductSchema),
  baseProductElements: z.array(z.string()),
  additionalProducts: z.array(tryggHansaAdditionalProductSchema),
  premiums: z.object({
    baseProductPremiums: tryggHansaPremiumsSchema,
    totalPremiums: tryggHansaPremiumsSchema,
    totalPremiumsBeforeDiscounts: tryggHansaPremiumsSchema,
  }),
  discounts: z.object({
    thDiscount: tryggHansaDiscountSchema,
    membershipDiscount: tryggHansaDiscountSchema,
    campaignDiscount: tryggHansaDiscountSchema,
    totalDiscounts: tryggHansaDiscountSchema,
  }),
  campaign: tryggHansaCampaignSchema.nullable().optional(),
});

export const tryggHansaCalculationResponseSchema = z.object({
  calculationResponseCode: z.string(),
  vehicleInformation: z.object({
    vehicleType: z.string(),
    brandCode: z.string().optional(),
    conceptBrand: z.string().nullable().optional(),
    conceptNumber: z.string().nullable().optional(),
  }).optional(),
  specialConditions: z.object({
    requiresTrackingDevice: z.boolean(),
    requiresImmobilizer: z.boolean(),
    requiresKeyCertificate: z.boolean(),
    requiresHighMarketValueCheck: z.boolean(),
  }).optional(),
  productPackages: z.array(tryggHansaProductPackageSchema),
  packagePreselection: z.string().optional(),
  trackingInformation: z.object({
    subscribingRepresentativeCode: z.string(),
    subscribingOrganizationCode: z.string(),
  }).optional(),
});

export type TryggHansaCalculationResponse = z.infer<typeof tryggHansaCalculationResponseSchema>;
export type TryggHansaProductPackage = z.infer<typeof tryggHansaProductPackageSchema>;

// Request types
export interface TryggHansaValidationRequest {
  socialSecurityNumber: string;
  registrationNumber: string;
}

export interface TryggHansaSalesContext {
  companyCode: string;
  membershipCode: string;
  salesChannel: string;
  subscribingRepresentativeCode: string;
  administratingRepresentativeCode: string;
  visitorId: string;
  partyId: string;
  partyNumber: number;
}

export interface TryggHansaCalculationRequest {
  socialSecurityNumber: string;
  vehicleRegistrationNumber: string;
  salesContext: TryggHansaSalesContext;
  conditionDate: string;
  startDate: string;
  yearlyMilage: number;
  hasYoungDrivers: boolean;
  trafficDeductibleAlternativeId: number;
  halfInsuranceDeductibleAlternativeId: number;
  vehicleDamageDeductibleAlternativeId: number;
}
