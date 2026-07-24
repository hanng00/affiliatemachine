// Address search + geocoding for the roof tool.
//
// Primary: Google Places API (New) — Autocomplete + Place Details. It resolves
// small/partial Swedish addresses far better than Nominatim, especially in
// less-populated areas. Falls back to Nominatim (OpenStreetMap) automatically
// when no `VITE_GOOGLE_MAPS_API_KEY` is configured, so the tool keeps working
// (with weaker results) in a key-less / zero-cost build.

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const PLACES_BASE = "https://places.googleapis.com/v1/places";

export interface AddressSuggestion {
  /** Opaque id used to resolve coordinates via `getCoordinates`. */
  id: string;
  /** Street line, e.g. "Sämskarbogatan 11". */
  primary: string;
  /** Locality line, e.g. "Enköping". */
  secondary: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export function hasGoogleKey(): boolean {
  return Boolean(GOOGLE_KEY);
}

/**
 * A Places Autocomplete session groups the keystroke-by-keystroke
 * autocomplete calls with the final Place Details call so Google bills them
 * as one session. Create one per "search", reuse the same token until a
 * selection is made, then discard it.
 */
export function newSessionToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------------------------------------------------------------------------
// Google Places API (New)
// ---------------------------------------------------------------------------

interface GooglePrediction {
  placePrediction?: {
    /** Resource name, e.g. "places/ChIJ…" — preferred for Place Details. */
    place?: string;
    placeId: string;
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
    text?: { text?: string };
  };
}

async function googleAutocomplete(
  query: string,
  sessionToken: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const res = await fetch(`${PLACES_BASE}:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY!,
    },
    signal,
    body: JSON.stringify({
      input: query,
      sessionToken,
      languageCode: "sv",
      regionCode: "SE",
      includedRegionCodes: ["SE"],
    }),
  });
  if (!res.ok) throw new Error(`Places autocomplete failed: ${res.status}`);
  const data = (await res.json()) as { suggestions?: GooglePrediction[] };
  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<GooglePrediction["placePrediction"]> => Boolean(p?.placeId))
    .map((p) => ({
      // Prefer the resource name (already "places/…"); fall back to placeId.
      id: p.place ?? p.placeId,
      primary: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
      secondary: p.structuredFormat?.secondaryText?.text ?? "",
    }));
}

async function googlePlaceCoordinates(
  placeRef: string,
  sessionToken: string
): Promise<Coordinates | null> {
  // `placeRef` may be a resource name ("places/ChIJ…") or a bare place id.
  const resource = placeRef.startsWith("places/") ? placeRef : `places/${placeRef}`;
  const url = new URL(`https://places.googleapis.com/v1/${resource}`);
  url.searchParams.set("sessionToken", sessionToken);
  const res = await fetch(url.toString(), {
    headers: {
      "X-Goog-Api-Key": GOOGLE_KEY!,
      "X-Goog-FieldMask": "location",
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { location?: { latitude: number; longitude: number } };
  if (!data.location) return null;
  return { lat: data.location.latitude, lon: data.location.longitude };
}

/** One-shot geocode of free text (used for the "Sök" button). */
async function googleGeocodeText(query: string): Promise<Coordinates | null> {
  const res = await fetch(`${PLACES_BASE}:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY!,
      "X-Goog-FieldMask": "places.location",
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "sv",
      regionCode: "SE",
      maxResultCount: 1,
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    places?: Array<{ location?: { latitude: number; longitude: number } }>;
  };
  const loc = data.places?.[0]?.location;
  return loc ? { lat: loc.latitude, lon: loc.longitude } : null;
}

// ---------------------------------------------------------------------------
// Nominatim (OpenStreetMap) fallback
// ---------------------------------------------------------------------------

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id?: number;
  address?: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
}

function nominatimUrl(query: string, limit: number): string {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("countrycodes", "se");
  url.searchParams.set("addressdetails", "1");
  return url.toString();
}

function nominatimToSuggestion(r: NominatimResult): AddressSuggestion {
  const addr = r.address;
  const road = addr?.road || addr?.neighbourhood || addr?.suburb || "";
  const number = addr?.house_number || "";
  const city = addr?.city || addr?.town || addr?.village || addr?.municipality || "";
  const primary = number ? `${road} ${number}` : road || r.display_name.split(",")[0];
  // Encode coordinates in the id so the fallback path can resolve without a 2nd call.
  return {
    id: `osm:${r.lat},${r.lon}`,
    primary: primary.trim(),
    secondary: city,
  };
}

async function nominatimAutocomplete(
  query: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const res = await fetch(nominatimUrl(query, 5), {
    headers: { "Accept-Language": "sv" },
    signal,
  });
  if (!res.ok) return [];
  const data = (await res.json()) as NominatimResult[];
  return data.map(nominatimToSuggestion);
}

async function nominatimGeocodeText(query: string): Promise<Coordinates | null> {
  const res = await fetch(nominatimUrl(query, 1), {
    headers: { "Accept-Language": "sv" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as NominatimResult[];
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Autocomplete suggestions for a partial address. */
export async function fetchSuggestions(
  query: string,
  sessionToken: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  if (query.trim().length < 3) return [];
  if (GOOGLE_KEY) return googleAutocomplete(query, sessionToken, signal);
  return nominatimAutocomplete(query, signal);
}

/** Resolve a suggestion (from `fetchSuggestions`) to coordinates. */
export async function getCoordinates(
  suggestion: AddressSuggestion,
  sessionToken: string
): Promise<Coordinates | null> {
  if (suggestion.id.startsWith("osm:")) {
    const [lat, lon] = suggestion.id.slice(4).split(",").map(Number);
    return Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
  }
  return googlePlaceCoordinates(suggestion.id, sessionToken);
}

/** One-shot free-text geocode (the "Sök" button without picking a suggestion). */
export async function geocodeText(query: string): Promise<Coordinates | null> {
  if (GOOGLE_KEY) return googleGeocodeText(query);
  return nominatimGeocodeText(query);
}
