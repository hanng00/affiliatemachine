import { Shield, Flame, ShieldAlert, Car, Wrench, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Single source of truth for all editorial/comparison content on the site.
 *
 * TRUTHFULNESS GUARDRAIL (see docs/JOURNAL.md): we do NOT publish specific
 * per-company prices as fact. `priceRange` values are clearly-labelled
 * illustrative ranges to set expectations only — the real number always comes
 * from the live quote tool. Coverage scope (trafik/halv/hel) is factual: it
 * follows Swedish law (trafikförsäkring is mandatory) and standard market terms.
 */

export interface CoverageInfo {
  type: "trafik" | "halv" | "hel";
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  includes: string[];
}

export const coverageTypes: CoverageInfo[] = [
  {
    type: "trafik",
    name: "Trafikförsäkring",
    short: "Lagkrav",
    description:
      "Den lägsta nivån och obligatorisk enligt lag för alla bilar i trafik. Täcker personskador och skador du orsakar på andras egendom — men inte din egen bil.",
    icon: Scale,
    includes: [
      "Personskador på dig och andra",
      "Skador du orsakar på annans egendom",
      "Obligatorisk enligt trafikskadelagen",
    ],
  },
  {
    type: "halv",
    name: "Halvförsäkring",
    short: "Populärast",
    description:
      "Trafikförsäkring plus skydd för din egen bil vid stöld, brand och glasskador. Vanligast för bilar som är några år gamla.",
    icon: Flame,
    includes: [
      "Allt i trafikförsäkring",
      "Stöld och inbrott",
      "Brand",
      "Glasskador (ruta)",
      "Bärgning och assistans",
      "Rättsskydd",
      "Maskinskada (på nyare bilar)",
    ],
  },
  {
    type: "hel",
    name: "Helförsäkring",
    short: "Mest skydd",
    description:
      "Det mest omfattande skyddet. Täcker även skador på din egen bil vid kollision, dikeskörning och skadegörelse — rekommenderas för nya och leasade bilar.",
    icon: Shield,
    includes: [
      "Allt i halvförsäkring",
      "Vagnskada (kollision, dikeskörning)",
      "Skadegörelse",
      "Hyrbil vid skada (tillval)",
      "Krävs oftast vid billån eller leasing",
    ],
  },
];

export interface ProviderInfo {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  /** Illustrative monthly range (SEK/mån) for a typical halvförsäkring — NOT a quote. */
  priceRange: [number, number];
  strengths: string[];
}

/**
 * Providers covered. `id` aligns with the insurance-providers domain where a
 * live scraper exists (if, gjensidige, trygg-hansa). priceRange is illustrative.
 */
export const providers: ProviderInfo[] = [
  {
    id: "if",
    name: "If",
    slug: "if",
    blurb:
      "Nordens största försäkringsbolag. Känt för snabb skadehantering och ett brett digitalt erbjudande.",
    priceRange: [320, 680],
    strengths: ["Snabb skadehantering", "Stort verkstadsnätverk", "Tydlig app"],
  },
  {
    id: "trygg-hansa",
    name: "Trygg-Hansa",
    slug: "trygg-hansa",
    blurb:
      "Etablerat bolag med personlig service och Assistans-paket. Ofta konkurrenskraftigt för helförsäkring.",
    priceRange: [340, 720],
    strengths: ["Personlig service", "Assistanspaket", "Lång erfarenhet"],
  },
  {
    id: "gjensidige",
    name: "Gjensidige",
    slug: "gjensidige",
    blurb:
      "Nordiskt bolag som ofta ligger lågt i pris. Bra alternativ för den som jämför aktivt.",
    priceRange: [300, 640],
    strengths: ["Konkurrenskraftiga priser", "Enkel teckning online"],
  },
  {
    id: "folksam",
    name: "Folksam",
    slug: "folksam",
    blurb:
      "Ett av Sveriges största bolag med fokus på trygghet och hållbarhet. Ofta bra för familjebilar.",
    priceRange: [330, 700],
    strengths: ["Stort och stabilt", "Bra familjeerbjudanden"],
  },
  {
    id: "lansforsakringar",
    name: "Länsförsäkringar",
    slug: "lansforsakringar",
    blurb:
      "Lokalt förankrade bolag som regelbundet toppar mätningar av kundnöjdhet.",
    priceRange: [350, 740],
    strengths: ["Hög kundnöjdhet", "Lokal närvaro"],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

/** Home/jamfor FAQ — targets the "hur jämför man / vad kostar" head intent. */
export const generalFaq: FaqItem[] = [
  {
    question: "Hur hittar jag den billigaste bilförsäkringen?",
    answer:
      "Priset på bilförsäkring varierar kraftigt mellan bolag för exakt samma bil och förare. Det enda säkra sättet att hitta billigast är att jämföra flera bolags priser för just din bil och ditt personnummer — det gör du gratis här genom att ange ditt registreringsnummer.",
  },
  {
    question: "Vad kostar en bilförsäkring i Sverige?",
    answer:
      "En halvförsäkring landar ofta runt 300–700 kr per månad, men spannet är stort. Priset styrs av bilmodell, din ålder och bostadsort, körsträcka, självrisk och skadehistorik. Yngre förare och dyrare bilar betalar mer. Siffrorna här är vägledande — ditt faktiska pris får du i jämförelsen.",
  },
  {
    question: "Vad är skillnaden mellan trafik-, halv- och helförsäkring?",
    answer:
      "Trafikförsäkring är lagkrav och täcker skador på andra. Halvförsäkring lägger till skydd för din egen bil vid bland annat stöld, brand och glasskador. Helförsäkring täcker dessutom skador på din egen bil vid kollision och dikeskörning, och krävs ofta vid billån eller leasing.",
  },
  {
    question: "Kan jag byta bilförsäkring när som helst?",
    answer:
      "Du kan byta vid din försäkrings huvudförfallodag, och ofta även mitt i perioden om du säljer bilen eller om bolaget ändrar villkoren. Det nya bolaget hjälper dig oftast att säga upp den gamla. Att jämföra inför förfallodagen är det vanligaste sättet att sänka kostnaden.",
  },
  {
    question: "Är jämförelsen gratis och oberoende?",
    answer:
      "Ja. Tjänsten är gratis att använda. Vi kan få provision om du tecknar via våra länkar (annonssamarbete), men det påverkar inte priserna du ser eller ordningen i jämförelsen — den sorteras efter pris.",
  },
];

/** First-time / young-driver experiment cluster (no current GSC demand — see JOURNAL). */
export const firstTimeFaq: FaqItem[] = [
  {
    question: "Varför är bilförsäkring så dyr för unga och förstagångsbilägare?",
    answer:
      "Försäkringsbolagen prissätter efter statistisk risk. Förare under cirka 25 år och de utan tidigare försäkringshistorik har i snitt fler skador, vilket ger högre premie. Det betyder inte att du måste betala överpris — skillnaden mellan bolag är ofta störst just för unga förare, så jämförelse lönar sig mest här.",
  },
  {
    question: "Hur kan jag som ung förare sänka priset?",
    answer:
      "Välj en billigare och mindre motorstark bil, kör färre mil per år, höj självrisken om du har en buffert, och börja bygga skadefria år tidigt. Vissa bolag ger rabatt om en äldre förare står som ägare eller om du tecknar fler försäkringar i samma bolag. Jämför alltid flera bolag.",
  },
  {
    question: "Vilken försäkring behöver jag till min första bil?",
    answer:
      "Lägstanivån är trafikförsäkring (lagkrav). För en äldre, billig första bil räcker ofta trafik eller halvförsäkring. Är bilen nyare, lånefinansierad eller leasad behövs oftast helförsäkring. Räkna på vad bilen är värd — det styr om helförsäkringens vagnskadeskydd är värt premien.",
  },
];

/** Decision factors shown on guide/home — factual, no prices. */
export const priceFactors: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Car,
    title: "Bilmodell",
    text: "Dyrare och mer motorstarka bilar kostar mer att försäkra.",
  },
  {
    icon: ShieldAlert,
    title: "Ålder & ort",
    text: "Yngre förare och storstadsområden ger oftast högre premie.",
  },
  {
    icon: Wrench,
    title: "Självrisk",
    text: "Högre självrisk sänker månadskostnaden — men kostar mer vid skada.",
  },
];
