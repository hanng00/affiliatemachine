/**
 * Verified-installer directory — the legal "Momondo" data layer.
 *
 * CRITICAL (see JOURNAL 2026-06-18): we do NOT scrape review platforms (Reco,
 * Trustpilot, Google) — their ToS ban it, reviews are copyrighted, and review
 * author identity is personal data under GDPR. Instead, firms come ONLY from
 * FREE official sources that expose non-personal company facts:
 *   - Bolagsverket "värdefulla datamängder" API (name, org-nr, verksamhet, status)
 *   - SCB företagsregister API (F-skatt/moms/arbetsgivar-registrering, ort, SNI)
 * We filter to active, F-skatt-verified firms by SNI (VVS/värme/borrning) × kommun.
 * Ratings, if ever shown, come only via an official partner/affiliate widget —
 * never scraped review text.
 *
 * The production loader (ops tooling) writes the verified set into KV/D1 keyed by
 * kommun. The seed below lets the spine pages render and typecheck before that
 * pipeline is wired; `verified: true` means "active F-skatt per SCB", which is a
 * factual, sourceable claim — not a quality endorsement.
 */

export interface Installer {
  /** Organisationsnummer (the stable key from Bolagsverket/SCB). */
  orgNr: string;
  name: string;
  /** Kommun slug, e.g. "linkoping". */
  kommun: string;
  /** SNI codes (industry), e.g. "43.221" VVS. Used to match to a system type. */
  sniCodes: string[];
  /** Active F-skatt per SCB — a factual status, not an endorsement. */
  verified: boolean;
}

/** SNI codes relevant per heat-pump system (for matching firms → system pages). */
export const sniBySystem: Record<string, string[]> = {
  "luft-luft": ["43.221", "43.222"],
  "luft-vatten": ["43.221", "43.222"],
  bergvarme: ["43.221", "42.210", "43.130"],
};

/** Seed only — replaced by the Bolagsverket+SCB loader in production (see DOMAIN.md). */
const seed: Installer[] = [
  { orgNr: "556000-0001", name: "Exempel VVS & Värme AB", kommun: "linkoping", sniCodes: ["43.221"], verified: true },
  { orgNr: "556000-0002", name: "Östgöta Bergvärme AB", kommun: "linkoping", sniCodes: ["43.221", "42.210"], verified: true },
  { orgNr: "556000-0003", name: "Linköpings Värmepumpsservice AB", kommun: "linkoping", sniCodes: ["43.222"], verified: true },
];

/** F-skatt-verified installers in a kommun that service the given system. */
export function installersFor(system: string, kommun: string): Installer[] {
  const sni = sniBySystem[system] ?? [];
  return seed.filter(
    (i) =>
      i.verified &&
      i.kommun === kommun &&
      i.sniCodes.some((code) => sni.includes(code))
  );
}
