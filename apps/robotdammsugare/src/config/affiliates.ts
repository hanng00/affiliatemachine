export interface AffiliateProduct {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  image?: string;
  rating?: number;
  price: {
    amount: number;
    currency?: string;
    period?: string;
    originalAmount?: number;
  };
  pros?: string[];
  cons?: string[];
  trackingUrl: string;
  badge?: string;
  features?: string[];
}

export interface RobotVacuumProduct extends AffiliateProduct {
  suctionPower?: string;
  batteryLife?: string;
  noiseLevel?: string;
  dustbinSize?: string;
  hasMopping?: boolean;
  hasSelfEmpty?: boolean;
  hasObstacleAvoidance?: boolean;
  petFriendly?: boolean;
  smartHomeIntegration?: string[];
  category?: "budget" | "midrange" | "premium";
}

export interface UserReview {
  text: string;
  author: string;
  location: string;
  source: string;
  rating?: number;
}

export const affiliates = {
  roborockS8ProUltra: {
    id: "roborock-s8-pro-ultra",
    name: "Roborock S8 Pro Ultra",
    description: "Premiummodell med självtömmande station, automatisk mopptvätt och 6000 Pa sugkraft. Vårt toppval för 2026.",
    logo: "/logos/roborock.svg",
    image: "https://m.media-amazon.com/images/I/61DvTl3xxbL._AC_SX679_.jpg",
    rating: 4.9,
    price: {
      amount: 13990,
      currency: "SEK",
    },
    pros: [
      "Självtömmande + automatisk mopptvätt",
      "6000 Pa sugkraft – bland de starkaste",
      "Utmärkt på djurhår",
      "Dubbla gummiborstar (trasslar inte)",
      "Lyfter moppen automatiskt på mattor",
    ],
    cons: [
      "Hög prislapp",
      "Stor dockningsstation",
      "Kan missa hörn ibland",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/roborock-s8-pro-ultra",
    badge: "Bäst i test",
    features: ["6000 Pa", "180 min batteri", "Självtömmande", "Mopp + tvätt"],
    suctionPower: "6000 Pa",
    batteryLife: "180 min",
    noiseLevel: "67 dB",
    dustbinSize: "400 ml",
    hasMopping: true,
    hasSelfEmpty: true,
    hasObstacleAvoidance: true,
    petFriendly: true,
    smartHomeIntegration: ["Google Home", "Alexa", "Apple HomeKit"],
    category: "premium",
  },
  roborockQRevo: {
    id: "roborock-q-revo",
    name: "Roborock Q Revo",
    description: "Utmärkt mellanklass med roterande moppar och självtömmande station. Bästa pris/prestanda 2026.",
    logo: "/logos/roborock.svg",
    image: "https://m.media-amazon.com/images/I/51e1NH1prJL._AC_UF1000,1000_QL80_.jpg",
    rating: 4.7,
    price: {
      amount: 7990,
      currency: "SEK",
    },
    pros: [
      "Roterande dubbelmoppar",
      "Självtömmande station",
      "Automatisk mopptvätt",
      "5500 Pa sugkraft",
      "Bra pris för funktionerna",
    ],
    cons: [
      "Sämre hinderdetektering än S8",
      "Kan fastna i sladdar",
      "Stor dockningsstation",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/roborock-q-revo",
    badge: "Prisvärd",
    features: ["5500 Pa", "180 min batteri", "Självtömmande", "Dubbelmoppar"],
    suctionPower: "5500 Pa",
    batteryLife: "180 min",
    noiseLevel: "67 dB",
    dustbinSize: "350 ml",
    hasMopping: true,
    hasSelfEmpty: true,
    hasObstacleAvoidance: true,
    petFriendly: true,
    smartHomeIntegration: ["Google Home", "Alexa"],
    category: "midrange",
  },
  dreameL20Ultra: {
    id: "dreame-l20-ultra",
    name: "Dreame L20 Ultra",
    description: "Kraftfull konkurrent med MopExtend-teknik som når in i hörn. 7000 Pa sugkraft.",
    logo: "/logos/dreame.svg",
    image: "https://placehold.co/400x400/4B5563/FFFFFF?text=L20+Ultra",
    rating: 4.7,
    price: {
      amount: 10990,
      currency: "SEK",
    },
    pros: [
      "MopExtend når in i hörn",
      "7000 Pa – starkast i testet",
      "Automatisk mopptvätt i 55°C",
      "Utmärkt på djurhår",
      "AI-navigering",
    ],
    cons: [
      "Stor och tung basstation",
      "Appen saknar svenska",
      "Dyr",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/dreame-l20-ultra",
    badge: "Starkast sugkraft",
    features: ["7000 Pa", "260 min batteri", "MopExtend", "55°C mopptvätt"],
    suctionPower: "7000 Pa",
    batteryLife: "260 min",
    noiseLevel: "65 dB",
    dustbinSize: "350 ml",
    hasMopping: true,
    hasSelfEmpty: true,
    hasObstacleAvoidance: true,
    petFriendly: true,
    smartHomeIntegration: ["Google Home", "Alexa"],
    category: "premium",
  },
  irobotRoombaj7Plus: {
    id: "irobot-roomba-j7-plus",
    name: "iRobot Roomba j7+",
    description: "Klassiker med utmärkt hinderdetektering. Undviker kablar och djurspillning pålitligt.",
    logo: "/logos/irobot.svg",
    image: "https://m.media-amazon.com/images/I/51ISjXVTKgL.jpg",
    rating: 4.5,
    price: {
      amount: 7990,
      currency: "SEK",
    },
    pros: [
      "Bäst på hinderdetektering",
      "Undviker djurspillning (P.O.O.P.)",
      "Pålitlig och beprövad",
      "Bra app med smarta funktioner",
      "Självtömmande CleanBase",
    ],
    cons: [
      "Ingen moppfunktion",
      "Lägre sugkraft än konkurrenter",
      "Kortare batteritid",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/irobot-roomba-j7",
    badge: "Bäst hinderdetektering",
    features: ["Självtömmande", "P.O.O.P.-teknik", "Smart kartläggning", "iRobot OS"],
    suctionPower: "2200 Pa",
    batteryLife: "75 min",
    noiseLevel: "68 dB",
    dustbinSize: "400 ml",
    hasMopping: false,
    hasSelfEmpty: true,
    hasObstacleAvoidance: true,
    petFriendly: true,
    smartHomeIntegration: ["Google Home", "Alexa"],
    category: "midrange",
  },
  xiaomiX10Plus: {
    id: "xiaomi-robot-vacuum-x10-plus",
    name: "Xiaomi Robot Vacuum X10+",
    description: "Budgetvänlig med självtömmande station och moppfunktion. Mycket för pengarna.",
    logo: "/logos/xiaomi.svg",
    image: "https://placehold.co/400x400/9CA3AF/1F2937?text=X10%2B",
    rating: 4.4,
    price: {
      amount: 4990,
      currency: "SEK",
    },
    pros: [
      "Utmärkt pris för funktionerna",
      "Självtömmande station",
      "Moppfunktion ingår",
      "4000 Pa sugkraft",
      "Bra app (Mi Home)",
    ],
    cons: [
      "Enklare hinderdetektering",
      "Moppen lyfts inte på mattor",
      "Mindre dammbehållare",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/xiaomi-x10-plus",
    badge: "Bäst budget",
    features: ["4000 Pa", "120 min batteri", "Självtömmande", "Mopp"],
    suctionPower: "4000 Pa",
    batteryLife: "120 min",
    noiseLevel: "65 dB",
    dustbinSize: "300 ml",
    hasMopping: true,
    hasSelfEmpty: true,
    hasObstacleAvoidance: false,
    petFriendly: true,
    smartHomeIntegration: ["Google Home", "Alexa"],
    category: "budget",
  },
  ecovacsDeebotX2Omni: {
    id: "ecovacs-deebot-x2-omni",
    name: "Ecovacs Deebot X2 Omni",
    description: "Fyrkantig design som når in i hörn. 8000 Pa sugkraft och OMNI-station.",
    logo: "/logos/ecovacs.svg",
    image: "https://placehold.co/400x400/111827/FFFFFF?text=X2+Omni",
    rating: 4.6,
    price: {
      amount: 8990,
      currency: "SEK",
    },
    pros: [
      "Fyrkantig – bäst i hörn",
      "8000 Pa sugkraft",
      "OMNI-station med varmvatten",
      "Slimmad design (9,5 cm)",
      "YIKO röstassistent",
    ],
    cons: [
      "Fyrkantig form kan fastna",
      "Dyr",
      "Komplex app",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/ecovacs-deebot-x2-omni",
    badge: "Bäst i hörn",
    features: ["8000 Pa", "143 min batteri", "Fyrkantig", "OMNI-station"],
    suctionPower: "8000 Pa",
    batteryLife: "143 min",
    noiseLevel: "70 dB",
    dustbinSize: "400 ml",
    hasMopping: true,
    hasSelfEmpty: true,
    hasObstacleAvoidance: true,
    petFriendly: true,
    smartHomeIntegration: ["Google Home", "Alexa"],
    category: "premium",
  },
  samsungJetBotAIPlus: {
    id: "samsung-jet-bot-ai-plus",
    name: "Samsung Jet Bot AI+",
    description: "Samsungs flaggskepp med AI-kamera och SmartThings-integration. Perfekt för Samsung-hem.",
    logo: "/logos/samsung.svg",
    image: "https://files.refurbed.com/pi/samsung-vr9500-jet-bot-ai-plus-1725362447.jpg?t=fitdesign&h=600&w=800",
    rating: 4.3,
    price: {
      amount: 11990,
      currency: "SEK",
    },
    pros: [
      "Utmärkt SmartThings-integration",
      "AI-kamera för hinderdetektering",
      "Självtömmande Clean Station",
      "Bra på djurhår",
      "Premium byggkvalitet",
    ],
    cons: [
      "Hög prislapp",
      "Ingen moppfunktion",
      "Bäst i Samsung-ekosystem",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/samsung-jet-bot-ai",
    badge: "Bäst smart hem",
    features: ["AI-kamera", "SmartThings", "Självtömmande", "LiDAR"],
    suctionPower: "2700 Pa",
    batteryLife: "90 min",
    noiseLevel: "72 dB",
    dustbinSize: "300 ml",
    hasMopping: false,
    hasSelfEmpty: true,
    hasObstacleAvoidance: true,
    petFriendly: true,
    smartHomeIntegration: ["SmartThings", "Google Home", "Alexa", "Bixby"],
    category: "premium",
  },
  electroluxPurei9: {
    id: "electrolux-pure-i9",
    name: "Electrolux Pure i9",
    description: "Svenskt märke med triangulär design för hörn. 3D Vision-navigering.",
    logo: "/logos/electrolux.svg",
    image: "https://placehold.co/400x400/0369A1/FFFFFF?text=Pure+i9",
    rating: 4.2,
    price: {
      amount: 5990,
      currency: "SEK",
    },
    pros: [
      "Svenskt märke – bra support",
      "Triangulär design för hörn",
      "3D Vision-navigering",
      "Bra på mattor",
      "Rimligt pris",
    ],
    cons: [
      "Ingen moppfunktion",
      "Kortare batteritid",
      "Äldre teknik",
    ],
    trackingUrl: "https://track.adtraction.com/t/t?a=PLACEHOLDER&as=PLACEHOLDER&t=2&tk=1&url=https://www.elgiganten.se/electrolux-pure-i9",
    badge: "Svenskt märke",
    features: ["3D Vision", "Triangulär", "PowerBrush", "60 min batteri"],
    suctionPower: "2100 Pa",
    batteryLife: "60 min",
    noiseLevel: "75 dB",
    dustbinSize: "700 ml",
    hasMopping: false,
    hasSelfEmpty: false,
    hasObstacleAvoidance: true,
    petFriendly: false,
    smartHomeIntegration: ["Google Home", "Alexa"],
    category: "midrange",
  },
} as const satisfies Record<string, RobotVacuumProduct>;

export const userReviews: Record<string, UserReview[]> = {
  "roborock-s8-pro-ultra": [
    {
      text: "Fantastisk på katthår! Kör den varje dag och den missar aldrig. Dockningsstationen är stor men värt det.",
      author: "Maria",
      location: "Göteborg",
      source: "Prisjakt",
      rating: 5,
    },
    {
      text: "Bästa köpet jag gjort. Två hundar hemma och golven är alltid rena nu. Moppfunktionen är bonus.",
      author: "Anders",
      location: "Malmö",
      source: "Elgiganten",
      rating: 5,
    },
  ],
  "roborock-q-revo": [
    {
      text: "Mycket för pengarna! Gör nästan allt som de dyrare modellerna. Enda nackdelen är att den ibland fastnar i sladdar.",
      author: "Erik",
      location: "Stockholm",
      source: "Amazon.se",
      rating: 4,
    },
    {
      text: "Perfekt för vår lägenhet på 80 kvm. Tyst nog att köra på natten.",
      author: "Lisa",
      location: "Uppsala",
      source: "Prisjakt",
      rating: 5,
    },
  ],
  "dreame-l20-ultra": [
    {
      text: "MopExtend-funktionen är genial! Äntligen en robot som faktiskt gör rent i hörnen.",
      author: "Johan",
      location: "Linköping",
      source: "Prisjakt",
      rating: 5,
    },
    {
      text: "Starkaste sugkraften jag testat. Tar upp allt hundhår utan problem.",
      author: "Karin",
      location: "Örebro",
      source: "NetOnNet",
      rating: 4,
    },
  ],
  "irobot-roomba-j7-plus": [
    {
      text: "Har hund och den har ALDRIG kört över något den inte ska. Värt varenda krona.",
      author: "Peter",
      location: "Helsingborg",
      source: "Elgiganten",
      rating: 5,
    },
    {
      text: "Pålitlig och enkel. Saknar moppfunktion men som ren dammsugare är den toppen.",
      author: "Anna",
      location: "Västerås",
      source: "Prisjakt",
      rating: 4,
    },
  ],
  "xiaomi-x10-plus": [
    {
      text: "Otroligt prisvärd! Gör 90% av vad de dyra modellerna gör för halva priset.",
      author: "Marcus",
      location: "Norrköping",
      source: "CDON",
      rating: 5,
    },
    {
      text: "Bra för pengarna men moppen är lite svag. Fungerar bäst som ren dammsugare.",
      author: "Emma",
      location: "Jönköping",
      source: "Prisjakt",
      rating: 4,
    },
  ],
  "ecovacs-deebot-x2-omni": [
    {
      text: "Fyrkantiga designen gör verkligen skillnad i hörnen. Imponerad!",
      author: "Niklas",
      location: "Lund",
      source: "Power",
      rating: 5,
    },
    {
      text: "Lite högljudd men städar verkligen rent. OMNI-stationen är smidig.",
      author: "Sara",
      location: "Umeå",
      source: "Elgiganten",
      rating: 4,
    },
  ],
  "samsung-jet-bot-ai-plus": [
    {
      text: "Perfekt för oss som har Samsung-grejer hemma. Allt synkar automatiskt.",
      author: "Daniel",
      location: "Stockholm",
      source: "Samsung.se",
      rating: 5,
    },
    {
      text: "Dyr men AI-kameran är imponerande. Undviker verkligen allt på golvet.",
      author: "Malin",
      location: "Göteborg",
      source: "Prisjakt",
      rating: 4,
    },
  ],
  "electrolux-pure-i9": [
    {
      text: "Skönt med svenskt märke och bra support. Triangelformen når in i hörn bra.",
      author: "Björn",
      location: "Sundsvall",
      source: "Elgiganten",
      rating: 4,
    },
    {
      text: "Enkel och pålitlig. Saknar moppfunktion men som dammsugare fungerar den utmärkt.",
      author: "Ingrid",
      location: "Karlstad",
      source: "NetOnNet",
      rating: 4,
    },
  ],
};

export type AffiliateId = keyof typeof affiliates;

export function getAffiliate(id: AffiliateId): RobotVacuumProduct {
  return affiliates[id];
}

export function getAllAffiliates(): RobotVacuumProduct[] {
  return Object.values(affiliates);
}

export function getAffiliatesByCategory(category: RobotVacuumProduct["category"]): RobotVacuumProduct[] {
  return Object.values(affiliates).filter((p) => p.category === category);
}

export function getPetFriendlyAffiliates(): RobotVacuumProduct[] {
  return Object.values(affiliates).filter((p) => p.petFriendly);
}

export function getSelfEmptyingAffiliates(): RobotVacuumProduct[] {
  return Object.values(affiliates).filter((p) => p.hasSelfEmpty);
}

export function getMoppingAffiliates(): RobotVacuumProduct[] {
  return Object.values(affiliates).filter((p) => p.hasMopping);
}

export function getReviewsForProduct(productId: string): UserReview[] {
  return userReviews[productId] || [];
}
