import { z } from "zod";

export const gjensidigeRequestSchema = z.object({
  cpr: z.string(),
  channel: z.literal("gjensidige"),
  product: z.literal("car"),
  attributeList: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
});

export type GjensidigeRequest = z.infer<typeof gjensidigeRequestSchema>;

export const gjensidigePackageSchema = z.object({
  packageName: z.string(),
  packageType: z.string(),
  selected: z.boolean(),
  selectable: z.boolean(),
  monthlyPrice: z.number(),
  currency: z.string(),
  priceFrequency: z.string(),
});

export const gjensidigeAdditionalPackageSchema = z.object({
  packageName: z.string(),
  monthlyPrice: z.number(),
  currency: z.string(),
  priceFrequency: z.string(),
  selectable: z.boolean(),
  selected: z.boolean(),
  plusPackagetype: z.string().optional(),
});

export const gjensidigeResponseSchema = z.object({
  customerName: z.string().optional(),
  customerNumber: z.string().optional(),
  vehicleDetails: z.string(),
  discountPercentage: z.number(),
  defaultPackage: z.string(),
  defaultPackagemessage: z.string().optional(),
  calculationStatus: z.object({
    error: z.boolean(),
    errorMessage: z.string().optional(),
  }),
  packages: z.array(gjensidigePackageSchema),
  additionalPackages: z.array(gjensidigeAdditionalPackageSchema).optional(),
  vehicleAge: z.number().optional(),
  vehicleType: z.number().optional(),
  agreementNumber: z.string().optional(),
  policyNumber: z.string().optional(),
  contractCode: z.string().optional(),
  productCode: z.string().optional(),
  paymentDegree: z.number().optional(),
  agentNumber: z.number().optional(),
  policyStartDate: z.string().optional(),
});

export type GjensidigeResponse = z.infer<typeof gjensidigeResponseSchema>;

const coverageDescriptionSchema = z.object({
  title: z.string(),
  details: z.string(),
});

const coverageSchema = z.object({
  name: z.string(),
  description: z.array(coverageDescriptionSchema),
});

const coveragesBlockSchema = z.object({
  coveragesHeading: z.string(),
  coverageList: z.array(coverageSchema),
});

export const gjensidigePackageConfigSchema = z.object({
  packageCode: z.string(),
  packageName: z.string(),
  defaultPackage: z.boolean(),
  defaultPackageMessage: z.string(),
  disabledMessage: z.string(),
  isSelected: z.boolean(),
  detailText: z.string(),
  monthlyPrice: z.string(),
  currency: z.string(),
  priceFrequency: z.string(),
  isPlusPackage: z.boolean(),
  isEnabled: z.boolean(),
  includedCoverages: coveragesBlockSchema,
  excludedCoverages: coveragesBlockSchema,
  packageSelectLabel: z.string(),
  packageSelectedLabel: z.string(),
});

export const gjensidigePackageConfigsSchema = z.array(gjensidigePackageConfigSchema);

export type GjensidigePackageConfig = z.infer<typeof gjensidigePackageConfigSchema>;
export type GjensidigePackageConfigs = z.infer<typeof gjensidigePackageConfigsSchema>;
