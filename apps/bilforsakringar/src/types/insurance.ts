import { z } from "zod";

export const vehicleSchema = z.object({
  regno: z.string(),
  vin: z.string().optional(),
  make: z.string(),
  model: z.string(),
  color: z.string().optional(),
  vehicleYear: z.number(),
  modelYear: z.number().optional(),
  fuelType: z.string().optional(),
  powerHp: z.number().optional(),
  powerKw: z.number().optional(),
  weight: z.number().optional(),
  co2: z.number().optional(),
  mileage: z.number().optional(),
  tax: z.number().optional(),
  numberOfOwners: z.number().optional(),
  firstRegistered: z.string().optional(),
  inspectionValidUntil: z.string().optional(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const regnoSchema = z
  .string()
  .min(2)
  .max(7)
  .transform((val) => val.toUpperCase().replace(/\s/g, ""))
  .refine(
    (val) => /^[A-Z]{3}\d{2}[A-Z0-9]$/.test(val) || /^[A-Z]{3}\d{3}$/.test(val),
    { message: "Ogiltigt registreringsnummer. Ange t.ex. ABC123 eller ABC12D" }
  );

export interface InsuranceQuote {
  provider: InsuranceProvider;
  coverageType: "trafik" | "halv" | "hel";
  monthlyPrice: number;
  yearlyPrice: number;
  deductible: number;
  features: string[];
  affiliateUrl: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  rating: number;
  reviewCount: number;
  description: string;
  affiliateUrl: string;
}

export const insuranceProviders: InsuranceProvider[] = [
  {
    id: "folksam",
    name: "Folksam",
    logo: "/logos/folksam.svg",
    color: "#00843d",
    rating: 4.2,
    reviewCount: 12453,
    description: "Sveriges största försäkringsbolag med fokus på hållbarhet och trygghet.",
    affiliateUrl: "https://www.folksam.se/forsakringar/bilforsakring",
  },
  {
    id: "if",
    name: "If",
    logo: "/logos/if.svg",
    color: "#0066b3",
    rating: 4.3,
    reviewCount: 9876,
    description: "Nordens ledande försäkringsbolag med snabb skadehantering.",
    affiliateUrl: "https://www.if.se/privat/forsakringar/bilforsakring",
  },
  {
    id: "trygg-hansa",
    name: "Trygg-Hansa",
    logo: "/logos/trygg-hansa.svg",
    color: "#e30613",
    rating: 4.1,
    reviewCount: 8234,
    description: "Trygghet sedan 1667 med personlig service och snabb hjälp.",
    affiliateUrl: "https://www.trygghansa.se/forsakringar/bilforsakring",
  },
  {
    id: "lansforsakringar",
    name: "Länsförsäkringar",
    logo: "/logos/lansforsakringar.svg",
    color: "#003366",
    rating: 4.4,
    reviewCount: 7654,
    description: "Lokalt förankrade med Sveriges nöjdaste kunder.",
    affiliateUrl: "https://www.lansforsakringar.se/privat/forsakring/bilforsakring/",
  },
  {
    id: "gjensidige",
    name: "Gjensidige",
    logo: "/logos/gjensidige.svg",
    color: "#00205b",
    rating: 4.0,
    reviewCount: 3421,
    description: "Norskt försäkringsbolag med konkurrenskraftiga priser.",
    affiliateUrl: "https://www.gjensidige.se/forsakring/bilforsakring",
  },
  {
    id: "dina-forsakringar",
    name: "Dina Försäkringar",
    logo: "/logos/dina.svg",
    color: "#e4002b",
    rating: 4.2,
    reviewCount: 2876,
    description: "Lokalt ägda försäkringsbolag med personlig service.",
    affiliateUrl: "https://www.dfrn.se/forsakringar/bilforsakring/",
  },
];

export type CoverageType = "trafik" | "halv" | "hel";

export interface CoverageInfo {
  type: CoverageType;
  name: string;
  description: string;
  includes: string[];
}

export const coverageTypes: CoverageInfo[] = [
  {
    type: "trafik",
    name: "Trafikförsäkring",
    description: "Obligatorisk försäkring som täcker skador du orsakar andra.",
    includes: [
      "Personskador på andra",
      "Sakskador på andras egendom",
      "Obligatorisk enligt lag",
    ],
  },
  {
    type: "halv",
    name: "Halvförsäkring",
    description: "Trafikförsäkring plus skydd för din egen bil vid stöld, brand och glasskador.",
    includes: [
      "Allt i trafikförsäkring",
      "Stöld och inbrott",
      "Brand",
      "Glasskador",
      "Bärgning",
      "Rättsskydd",
    ],
  },
  {
    type: "hel",
    name: "Helförsäkring",
    description: "Mest omfattande skyddet som även täcker skador på din egen bil.",
    includes: [
      "Allt i halvförsäkring",
      "Vagnskada (kollision, dikeskörning)",
      "Skadegörelse",
      "Maskinskada (tillval)",
      "Hyrbil vid skada",
    ],
  },
];
