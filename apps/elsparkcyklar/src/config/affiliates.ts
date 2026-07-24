import type { AffiliateProduct } from "@affiliate/ui";

export interface ExtendedAffiliateProduct extends AffiliateProduct {
  isRoadLegal?: boolean;
  requiresInsurance?: boolean;
  motor?: string;
  motorWatts?: number;
  range?: string;
  rangeKm?: number;
  topSpeed?: string;
  topSpeedKmh?: number;
  weight?: string;
  weightKg?: number;
  ipRating?: string;
  category?: "budget" | "commuter" | "premium" | "power";
  honestCopy?: string;
  image?: string;
  bestFor?: string;
  summary?: string;
}

export const affiliates = {
  segway: {
    id: "segway-ninebot-max-g2",
    name: "Segway Ninebot Max G2",
    description: "Premium elsparkcykel med hydraulisk fjädring och 70 km räckvidd. Vårt toppval för 2026.",
    rating: 4.3,
    price: {
      amount: 8960,
      currency: "SEK",
    },
    pros: [
      "Bäst-i-klassen komfort — dubbel fjädring",
      "IPX5 vattentålighet — klarar regn",
      "Inbyggd 3A-laddare — smidig kabellösning",
      "Apple Find My-stöd för stöldskydd",
    ],
    cons: [
      "Tung (24 kg) — opraktisk att bära",
      "Tappar fart i branta backar (15°+)",
      "Kräver app för att låsa upp full hastighet",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/segway-ninebot-max-g2",
    badge: "Bäst i Test",
    features: ["70 km räckvidd", "900W motor", "25 km/h", "IPX5"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "450W",
    motorWatts: 450,
    range: "70 km",
    rangeKm: 70,
    topSpeed: "25 km/h",
    topSpeedKmh: 25,
    weight: "24.3 kg",
    weightKg: 24.3,
    ipRating: "IPX5",
    category: "premium",
    image: "https://www.mobilmarket.se/wp-content/uploads/2026/03/ninebot-kickscooter-max-g2-e-elektrisk-scooter-3-1024x768.jpg",
    bestFor: "Året-runt-pendlare som inte behöver bära den",
    summary: "Segways kvalitetsbygge med klassledande vattentålighet. Användare älskar komforten men klagar på vikten och att den tappar fart i riktigt branta backar.",
    honestCopy: "Användare älskar den långa räckvidden och stabiliteten, men vikten på 24 kg gör den svår att bära i trappor. Perfekt för längre pendling på asfalt.",
  },
  eWheelsE2S: {
    id: "e-wheels-e2s-v2",
    name: "E-Wheels E2S V2",
    description: "Populär budgetmodell som vunnit 'Bästa Köp' flera år.",
    rating: 4.2,
    price: {
      amount: 3990,
      currency: "SEK",
    },
    pros: [
      "Bra acceleration och backtagning",
      "Punkteringsfria solida däck",
      "Dubbel bakfjädring",
      "Oslagbart pris för prestandan",
    ],
    cons: [
      "Byggkvalitet kan variera — lösa skruvar rapporteras",
      "Endast frambroms kan kännas osäkert",
      "Räckvidden når sällan uppgivna 35 km",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/elsparkcykel/e-wheels-e2s-v2/",
    badge: "Bästa Köp",
    features: ["35 km räckvidd", "250W motor", "20 km/h", "IP54"],
    isRoadLegal: true,
    requiresInsurance: false,
    motor: "250W",
    motorWatts: 250,
    range: "35 km",
    rangeKm: 35,
    topSpeed: "20 km/h",
    topSpeedKmh: 20,
    weight: "14.5 kg",
    weightKg: 14.5,
    ipRating: "IP54",
    category: "budget",
    image: "https://www.ewheels.se/globalassets/feed-images/e2s-v2-lr---luft---til-nett-4.jpg?width=800&height=800&quality=80",
    bestFor: "Budgetmedvetna som accepterar lite underhåll",
    summary: "Populär budgetmodell som vunnit 'Bästa Köp' flera år. Användare älskar prestandan för priset, men rapporterar att man bör dra åt skruvar regelbundet och att räckvidden i verkligheten är kortare än utlovat.",
    honestCopy: "Bästa valet under 4000 kr – användare älskar prestandan för priset. Dra åt skruvarna regelbundet.",
  },
  xiaomi5Max: {
    id: "xiaomi-electric-scooter-5-max",
    name: "Xiaomi Electric Scooter 5 Max",
    description: "Xiaomis flaggskepp med fantastisk fjädring och blinkers.",
    rating: 4.4,
    price: {
      amount: 7990,
      currency: "SEK",
    },
    pros: [
      "Fantastisk fjädring — hydraulisk fram, fjäder bak",
      "1000W peak-motor klarar backar bra",
      "Ca 30 km verklig räckvidd i sportläge",
      "Blinkers och ambient-belysning",
    ],
    cons: [
      "Tung (22+ kg) — jobbig i trappor",
      "Bromsarna svaga för tyngre förare (75+ kg)",
      "Display svårläst när strålkastaren är på dagtid",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/elsparkcykel/xiaomi-electric-scooter-5-max/",
    badge: "Premium",
    features: ["60 km räckvidd", "400W motor", "25 km/h", "IPX4"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "400W",
    motorWatts: 400,
    range: "60 km",
    rangeKm: 60,
    topSpeed: "25 km/h",
    topSpeedKmh: 25,
    weight: "23.2 kg",
    weightKg: 23.2,
    ipRating: "IPX4",
    category: "premium",
    image: "https://www.ewheels.se/globalassets/feed-images/v2lr2025-solidblack-tilnettsiden-06.01.25-002.jpeg?width=800&height=800&quality=80",
    bestFor: "Pendlare under 80 kg som prioriterar komfort",
    summary: "Xiaomis flaggskepp får beröm för sin komfort och backtagningsförmåga. Användare varnar dock för vikten och att bromsarna kan kännas underdimensionerade för tyngre förare.",
    honestCopy: "Imponerande specifikationer och komfort, men tung att bära. Perfekt för längre pendling.",
  },
  xiaomi4Lite: {
    id: "xiaomi-electric-scooter-4-lite-2nd",
    name: "Xiaomi Electric Scooter 4 Lite 2nd Gen",
    description: "Billigaste vägen in i elsparkcykelvärlden.",
    rating: 3.8,
    price: {
      amount: 3000,
      currency: "SEK",
    },
    pros: [
      "Lägsta priset i testet",
      "Bara 11 kg — lätt att bära",
      "Snabb laddning (4 timmar)",
      "Bra för korta sträckor under 10 km",
    ],
    cons: [
      "Verklig räckvidd ofta bara 10-15 km",
      "Ingen fjädring — känner varje gupp",
      "Små hjul (8.1\") — instabil på ojämnt underlag",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/elsparkcykel/xiaomi-electric-scooter-4-lite-2nd-gen/",
    badge: "Budget",
    features: ["20 km räckvidd", "250W motor", "20 km/h", "IP54"],
    isRoadLegal: true,
    requiresInsurance: false,
    motor: "250W",
    motorWatts: 250,
    range: "20 km",
    rangeKm: 20,
    topSpeed: "20 km/h",
    topSpeedKmh: 20,
    weight: "11 kg",
    weightKg: 11,
    ipRating: "IP54",
    category: "budget",
    image: "https://www.proshop.se/Images/1600x1200/3255273_0a1c0e1ddeac.png",
    bestFor: "Sista-milen under 5 km, eller för att testa",
    summary: "Billigaste vägen in i elsparkcykelvärlden. Användare varnar för att den uppgivna räckvidden (20 km) sällan nås — räkna med 10-15 km i verkligheten. Bäst för mycket korta sträckor.",
    honestCopy: "Perfekt för att testa elsparkcykel utan stor investering. Förvänta dig 10-15 km räckvidd.",
  },
  xiaomi5Pro: {
    id: "xiaomi-electric-scooter-5-pro",
    name: "Xiaomi Electric Scooter 5 Pro",
    description: "Mellanklass från Xiaomi med bra prestanda.",
    rating: 4.0,
    price: {
      amount: 5555,
      currency: "SEK",
    },
    pros: [
      "Bra balans mellan pris och prestanda",
      "25-30 km verklig räckvidd i sportläge",
      "10-tums pneumatiska däck",
      "Smidig Xiaomi Home-app",
    ],
    cons: [
      "Rapporter om fabriksfel i framfjädringen",
      "Relativt tung (17 kg) för sin klass",
      "IPX4 — inte för kraftigt regn",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/elsparkcykel/xiaomi-electric-scooter-5-pro/",
    badge: "Prisvärd",
    features: ["45 km räckvidd", "350W motor", "25 km/h", "IPX4"],
    isRoadLegal: false,
    requiresInsurance: false,
    motor: "350W",
    motorWatts: 350,
    range: "45 km",
    rangeKm: 45,
    topSpeed: "25 km/h",
    topSpeedKmh: 25,
    weight: "17.1 kg",
    weightKg: 17.1,
    ipRating: "IPX4",
    category: "commuter",
    image: "https://cdn.cdon.com/cdn-cgi/image/width=600/https://images.sello.io/products/acc/49361/120276096/bab312bb204e151456cfaa4cc042d301.jpg",
    bestFor: "Mellansegmentet — om du får ett felfritt exemplar",
    summary: "Mellanklass från Xiaomi med bra prestanda. Användare gillar körupplevelsen men det finns rapporter om kvalitetsproblem med framfjädringen som servicecenter har svårt att åtgärda.",
    honestCopy: "Bra balans mellan pris och prestanda. Kontrollera framfjädringen vid leverans.",
  },
  eWheelsE4Max: {
    id: "e-wheels-e4-v2-max",
    name: "E-Wheels E4 V2 Max",
    description: "Kraftpaket för den som vill ha rå prestanda.",
    rating: 4.0,
    price: {
      amount: 16990,
      currency: "SEK",
    },
    pros: [
      "Extremt kraftig motor (1500W peak)",
      "Lång räckvidd — upp till 80 km",
      "Hydrauliska bromsar",
      "E-Wheels kundtjänst ofta snabb med reservdelar",
    ],
    cons: [
      "Mycket tung (30 kg)",
      "Byggkvalitet varierar — däckbyten behövs ofta",
      "Räckvidd och hastighet når inte alltid specen",
      "Ospärrad hastighet (50 km/h) är olaglig",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.ewheels.se/elsparkcykel/e-wheels-e4-v2-max/",
    badge: "Premium",
    features: ["80 km räckvidd", "1000W motor", "25 km/h", "IP55"],
    isRoadLegal: false,
    requiresInsurance: true,
    motor: "1000W",
    motorWatts: 1000,
    range: "80 km",
    rangeKm: 80,
    topSpeed: "25 km/h",
    topSpeedKmh: 25,
    weight: "30 kg",
    weightKg: 30,
    ipRating: "IP55",
    category: "power",
    image: "https://www.ewheels.se/globalassets/feed-images/ks-s2pro.4.jpg?width=800&height=800&quality=80",
    bestFor: "Entusiaster som vill ha kraft och accepterar underhåll",
    summary: "Kraftpaket för den som vill ha rå prestanda. Användare rapporterar att den är 'amazing' när den fungerar, men byggkvaliteten över tid får kritik. Förvänta dig underhåll.",
    honestCopy: "Oöverträffad kraft och räckvidd, men kräver underhåll. Förvänta dig att byta däck regelbundet.",
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
