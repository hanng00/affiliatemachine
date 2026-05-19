import type { AffiliateProduct } from "@affiliate/ui";

export interface ExtendedAffiliateProduct extends AffiliateProduct {
  isRoadLegal?: boolean;
  requiresInsurance?: boolean;
  motor?: string;
  range?: string;
  topSpeed?: string;
  weight?: string;
  ipRating?: string;
  category?: "budget" | "commuter" | "premium" | "power";
}

export const affiliates = {
  segway: {
    id: "segway-ninebot-max-g2",
    name: "Segway Ninebot Max G2",
    description: "Premium elsparkcykel med hydraulisk fjädring och 70 km räckvidd. Vårt toppval för 2026.",
    rating: 5.0,
    price: {
      amount: 9999,
      currency: "SEK",
    },
    pros: [
      "Full hydraulisk fjädring",
      "70 km räckvidd – bäst i test",
      "Blinkers & trafikljus",
      "Traction control",
      "Självläkande däck",
    ],
    cons: ["Tung (24 kg)", "Ej optimal för grus"],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/segway-ninebot-max-g2",
    badge: "Bäst i test",
    features: ["70 km räckvidd", "900W motor", "25 km/h", "IPX5"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "900W",
    range: "70 km",
    topSpeed: "25 km/h",
    weight: "24.25 kg",
    ipRating: "IPX5",
    category: "premium",
  },
  xiaomiUltra: {
    id: "xiaomi-4-ultra",
    name: "Xiaomi Electric Scooter 4 Ultra",
    description: "Xiaomis flaggskepp med dubbel fjädring och IP55-skydd. Bäst i test 2026.",
    rating: 4.9,
    price: {
      amount: 8990,
      currency: "SEK",
    },
    pros: [
      "Dubbel fjädring",
      "Självläkande däck",
      "IP55 vattenskydd",
      "4 körlägen",
      "Klarar 25% lutning",
    ],
    cons: ["Pris varierar", "Ofta slutsåld"],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.netonnet.se/xiaomi-4-ultra",
    badge: "Bäst i test 2026",
    features: ["70 km räckvidd", "940W motor", "25 km/h", "IP55"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "940W max",
    range: "70 km",
    topSpeed: "25 km/h",
    weight: "24 kg",
    ipRating: "IP55",
    category: "premium",
  },
  niuKqi3Pro: {
    id: "niu-kqi3-pro",
    name: "NIU KQi3 Pro",
    description: "Laglig på väg! Premium-byggd med 250W motor och 20 km/h – uppfyller svenska regler.",
    rating: 4.7,
    price: {
      amount: 7495,
      currency: "SEK",
    },
    pros: [
      "LAGLIG PÅ VÄG (250W, 20 km/h)",
      "Premium byggkvalitet",
      "Dubbla skivbromsar",
      "Bluetooth-app",
      "Hopfällbar",
    ],
    cons: ["Tung (20 kg)", "Begränsad topphastighet"],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/niu-kqi3-pro",
    badge: "Laglig på väg",
    features: ["50 km räckvidd", "250W motor", "20 km/h", "Skivbromsar"],
    isRoadLegal: true,
    requiresInsurance: false,
    motor: "250W",
    range: "50 km",
    topSpeed: "20 km/h",
    weight: "20 kg",
    category: "commuter",
  },
  ninebotF2Pro: {
    id: "ninebot-f2-pro",
    name: "Ninebot F2 Pro",
    description: "Perfekt för pendling med självläkande däck och Apple Find My. F2 Pro D-versionen är laglig.",
    rating: 4.6,
    price: {
      amount: 7379,
      currency: "SEK",
    },
    pros: [
      "Självläkande däck",
      "Framfjädring",
      "Apple Find My",
      "3 körlägen",
      "F2 Pro D är väglaglig",
    ],
    cons: ["Snabbare versioner ej lagliga", "Medelmåttig acceleration"],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/ninebot-f2-pro",
    badge: "Bäst för pendling",
    features: ["55 km räckvidd", "450W motor", "20-32 km/h", "IPX5"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "450W (peak 900W)",
    range: "55 km",
    topSpeed: "20-32 km/h",
    weight: "17.5 kg",
    ipRating: "IPX5",
    category: "commuter",
  },
  xiaomi4Pro: {
    id: "xiaomi-4-pro-2nd-gen",
    name: "Xiaomi Electric Scooter 4 Pro (2nd Gen)",
    description: "Bästa pris/prestanda på marknaden. Solid byggkvalitet och bra acceleration.",
    rating: 4.5,
    price: {
      amount: 5590,
      currency: "SEK",
    },
    pros: [
      "Utmärkt pris/prestanda",
      "Solid byggkvalitet",
      "Bra acceleration",
      "10\" luftdäck",
      "Blinkers",
    ],
    cons: ["Svaga bromsar", "Ingen fjädring", "Tung (19 kg)", "EJ väglaglig"],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.netonnet.se/xiaomi-4-pro",
    badge: "Prisvärd",
    features: ["45-60 km räckvidd", "400W motor", "25 km/h", "IPX4"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "400W (peak 1000W)",
    range: "45-60 km",
    topSpeed: "25 km/h",
    weight: "19 kg",
    ipRating: "IPX4",
    category: "budget",
  },
  vsett9Plus: {
    id: "vsett-9-plus",
    name: "VSETT 9+",
    description: "Kraftpaket med dubbla motorer och 100 km räckvidd. För den som vill ha mest.",
    rating: 4.8,
    price: {
      amount: 14990,
      currency: "SEK",
    },
    pros: [
      "Dubbla motorer (1300W totalt)",
      "100 km räckvidd",
      "Full fjädring",
      "NFC-lås",
      "Extremt kraftfull",
    ],
    cons: ["KRÄVER FÖRSÄKRING", "Ej väglaglig", "Tung (26 kg)", "10 tim laddtid"],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/vsett-9-plus",
    badge: "Mest kraftfull",
    features: ["100 km räckvidd", "2x650W motor", "50 km/h", "Full fjädring"],
    isRoadLegal: false,
    requiresInsurance: true,
    motor: "Dual 650W (1300W totalt)",
    range: "100 km",
    topSpeed: "50 km/h",
    weight: "26 kg",
    category: "power",
  },
} as const satisfies Record<string, ExtendedAffiliateProduct>;

export type AffiliateId = keyof typeof affiliates;

export function getAffiliate(id: AffiliateId): ExtendedAffiliateProduct {
  return affiliates[id];
}

export function getAllAffiliates(): ExtendedAffiliateProduct[] {
  return Object.values(affiliates);
}

export function getAffiliatesByCategory(category: ExtendedAffiliateProduct["category"]): ExtendedAffiliateProduct[] {
  return Object.values(affiliates).filter((p) => p.category === category);
}

export function getRoadLegalAffiliates(): ExtendedAffiliateProduct[] {
  return Object.values(affiliates).filter((p) => p.isRoadLegal);
}
