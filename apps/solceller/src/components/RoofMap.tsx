import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import L from "leaflet";
import area from "@turf/area";
import { polygon as turfPolygon } from "@turf/helpers";
import { geocodeText } from "@/lib/geocode";
import "leaflet/dist/leaflet.css";

export interface RoofMapHandle {
  search: (query: string) => Promise<boolean>;
  flyTo: (lat: number, lon: number) => void;
}

interface RoofMapProps {
  onAreaChange: (sqm: number) => void;
}

const SWEDEN_CENTER: L.LatLngTuple = [59.3293, 18.0686];
const POLY_STYLE: L.PathOptions = { color: "#F59E0B", weight: 3, fillOpacity: 0.2 };
const POLY_STYLE_SELECTED: L.PathOptions = { color: "#F59E0B", weight: 4, fillOpacity: 0.35 };

/** Draggable corner handle for editing a finished polygon. */
const VERTEX_ICON = L.divIcon({
  className: "",
  html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#fff;border:3px solid #F59E0B;box-shadow:0 1px 3px rgba(0,0,0,.4);cursor:move"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/** One finished roof area: its polygon, the draggable corner markers, and points. */
interface RoofPolygon {
  id: number;
  polygon: L.Polygon;
  vertexMarkers: L.Marker[];
  points: L.LatLng[];
  auto: boolean;
}

async function geocode(query: string): Promise<L.LatLngTuple | null> {
  const coords = await geocodeText(query);
  return coords ? [coords.lat, coords.lon] : null;
}

/** Query OSM Overpass for building footprint at a given point. */
async function fetchBuildingPolygon(lat: number, lon: number): Promise<L.LatLngTuple[] | null> {
  const query = `[out:json][timeout:5];(way["building"](around:30,${lat},${lon}););out body;>;out skel qt;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as {
      elements: Array<{ type: string; id: number; lat?: number; lon?: number; nodes?: number[] }>;
    };

    const nodes = new Map<number, [number, number]>();
    const ways: number[][] = [];

    for (const el of data.elements) {
      if (el.type === "node" && el.lat != null && el.lon != null) {
        nodes.set(el.id, [el.lat, el.lon]);
      } else if (el.type === "way" && el.nodes) {
        ways.push(el.nodes);
      }
    }

    if (ways.length === 0) return null;

    // Pick the closest building (first way, Overpass returns sorted by distance).
    const wayNodes = ways[0];
    const coords: L.LatLngTuple[] = [];
    for (const nid of wayNodes) {
      const c = nodes.get(nid);
      if (c) coords.push(c);
    }
    return coords.length >= 3 ? coords : null;
  } catch {
    return null;
  }
}

function computePolyArea(latlngs: L.LatLng[]): number {
  if (latlngs.length < 3) return 0;
  const ring: [number, number][] = latlngs.map((p) => [p.lng, p.lat]);
  ring.push(ring[0]);
  return Math.round(area(turfPolygon([ring])));
}

/** Lightweight, render-friendly view of a roof area for the UI list. */
interface RoofAreaInfo {
  id: number;
  sqm: number;
  auto: boolean;
}

const RoofMap = forwardRef<RoofMapHandle, RoofMapProps>(function RoofMap(
  { onAreaChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Finished roof areas (Leaflet layers live here; React state mirrors them).
  const roofsRef = useRef<RoofPolygon[]>([]);
  const idCounter = useRef(0);
  const selectedIdRef = useRef<number | null>(null);

  // In-progress drawing state.
  const pointsRef = useRef<L.LatLng[]>([]);
  const tempLineRef = useRef<L.Polyline | null>(null);
  const drawMarkersRef = useRef<L.CircleMarker[]>([]);

  const [mode, setMode] = useState<"idle" | "drawing" | "done">("idle");
  const [areas, setAreas] = useState<RoofAreaInfo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  /** Recompute total + push state up, and refresh the UI list from Leaflet truth. */
  function syncState() {
    const list: RoofAreaInfo[] = roofsRef.current.map((r) => ({
      id: r.id,
      sqm: computePolyArea(r.points),
      auto: r.auto,
    }));
    setAreas(list);
    onAreaChange(list.reduce((sum, a) => sum + a.sqm, 0));
  }

  function setSelected(id: number | null) {
    selectedIdRef.current = id;
    setSelectedId(id);
    for (const r of roofsRef.current) {
      const isSel = r.id === id;
      r.polygon.setStyle(isSel ? POLY_STYLE_SELECTED : POLY_STYLE);
      // Corner handles are only shown for the selected roof to keep the
      // common (single roof) case uncluttered.
      for (const m of r.vertexMarkers) {
        if (isSel) m.addTo(mapRef.current!);
        else mapRef.current!.removeLayer(m);
      }
    }
  }

  /** Build draggable corner markers for a finished roof and wire live editing. */
  function attachVertexHandles(roof: RoofPolygon) {
    const map = mapRef.current!;
    roof.vertexMarkers.forEach((m) => map.removeLayer(m));
    roof.vertexMarkers = roof.points.map((pt, i) => {
      const marker = L.marker(pt, { icon: VERTEX_ICON, draggable: true });
      marker.on("drag", () => {
        roof.points[i] = marker.getLatLng();
        roof.polygon.setLatLngs(roof.points);
        syncState();
      });
      return marker;
    });
  }

  function removeRoof(id: number) {
    const map = mapRef.current;
    if (!map) return;
    const roof = roofsRef.current.find((r) => r.id === id);
    if (!roof) return;
    map.removeLayer(roof.polygon);
    roof.vertexMarkers.forEach((m) => map.removeLayer(m));
    roofsRef.current = roofsRef.current.filter((r) => r.id !== id);

    if (selectedIdRef.current === id) {
      const next = roofsRef.current[roofsRef.current.length - 1]?.id ?? null;
      setSelected(next);
    }
    syncState();
    if (roofsRef.current.length === 0) setMode("idle");
  }

  function clearAllRoofs() {
    const map = mapRef.current;
    if (!map) return;
    for (const r of roofsRef.current) {
      map.removeLayer(r.polygon);
      r.vertexMarkers.forEach((m) => map.removeLayer(m));
    }
    roofsRef.current = [];
    selectedIdRef.current = null;
    setSelectedId(null);
    clearDrawing();
    setMode("idle");
    syncState();
  }

  /** Remove only the in-progress drawing visuals. */
  function clearDrawing() {
    const map = mapRef.current;
    if (!map) return;
    if (tempLineRef.current) { map.removeLayer(tempLineRef.current); tempLineRef.current = null; }
    drawMarkersRef.current.forEach((m) => map.removeLayer(m));
    drawMarkersRef.current = [];
    pointsRef.current = [];
  }

  /** Turn the in-progress points into a finished, editable roof area. */
  function commitRoof(points: L.LatLng[], auto: boolean) {
    const map = mapRef.current!;
    const polygon = L.polygon(points, POLY_STYLE).addTo(map);
    const id = ++idCounter.current;
    const roof: RoofPolygon = { id, polygon, vertexMarkers: [], points: [...points], auto };
    polygon.on("click", () => setSelected(id));
    attachVertexHandles(roof);
    roofsRef.current.push(roof);
    setSelected(id);
    syncState();
    setMode("done");
  }

  function finishPolygon() {
    const map = mapRef.current;
    const points = pointsRef.current;
    if (!map || points.length < 3) return;
    const snapshot = [...points];
    clearDrawing();
    map.off("click", handleDrawClick);
    map.off("dblclick", handleDrawDblClick);
    map.off("mousemove", handleDrawMove);
    map.getContainer().style.cursor = "";
    map.doubleClickZoom.enable();
    commitRoof(snapshot, false);
  }

  function handleDrawClick(e: L.LeafletMouseEvent) {
    const map = mapRef.current!;
    const points = pointsRef.current;

    // Close polygon if clicking near the first point
    if (points.length >= 3) {
      const first = map.latLngToContainerPoint(points[0]);
      const click = map.latLngToContainerPoint(e.latlng);
      if (first.distanceTo(click) < 15) {
        finishPolygon();
        return;
      }
    }

    points.push(e.latlng);

    // Visual: dot at each vertex
    const marker = L.circleMarker(e.latlng, {
      radius: 5, color: "#F59E0B", fillColor: "#fff", fillOpacity: 1, weight: 2,
    }).addTo(map);
    drawMarkersRef.current.push(marker);

    // Update temp line
    if (tempLineRef.current) map.removeLayer(tempLineRef.current);
    if (points.length > 1) {
      tempLineRef.current = L.polyline(points, { color: "#F59E0B", weight: 2, dashArray: "5,5" }).addTo(map);
    }
  }

  function handleDrawDblClick(e: L.LeafletMouseEvent) {
    L.DomEvent.stop(e as unknown as Event);
    finishPolygon();
  }

  function handleDrawMove(e: L.LeafletMouseEvent) {
    const points = pointsRef.current;
    const map = mapRef.current!;
    if (points.length === 0) return;

    // Show preview line from last point to cursor
    if (tempLineRef.current) map.removeLayer(tempLineRef.current);
    tempLineRef.current = L.polyline([...points, e.latlng], {
      color: "#F59E0B", weight: 2, dashArray: "5,5",
    }).addTo(map);
  }

  function startDraw() {
    const map = mapRef.current;
    if (!map) return;
    clearDrawing();
    setMode("drawing");
    map.doubleClickZoom.disable();
    map.getContainer().style.cursor = "crosshair";
    map.on("click", handleDrawClick);
    map.on("dblclick", handleDrawDblClick);
    map.on("mousemove", handleDrawMove);
  }

  /** Auto-draw building from OSM data as a new editable roof area. */
  async function autoDrawBuilding(lat: number, lon: number) {
    const coords = await fetchBuildingPolygon(lat, lon);
    if (!coords || !mapRef.current) return;
    const latlngs = coords.map(([la, lo]) => L.latLng(la, lo));
    commitRoof(latlngs, true);
  }

  useImperativeHandle(ref, () => ({
    async search(query: string) {
      if (!query.trim() || !mapRef.current) return false;
      const coords = await geocode(query.trim());
      if (!coords) return false;
      mapRef.current.setView(coords, 19);
      clearAllRoofs();
      autoDrawBuilding(coords[0], coords[1]);
      return true;
    },
    flyTo(lat: number, lon: number) {
      mapRef.current?.flyTo([lat, lon], 19, { duration: 1.5 });
      clearAllRoofs();
      autoDrawBuilding(lat, lon);
    },
  }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: SWEDEN_CENTER,
      zoom: 5,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer(
      "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      { maxZoom: 21, attribution: "Imagery &copy; Google" }
    ).addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const hasRoofs = areas.length > 0;
  const totalSqm = areas.reduce((sum, a) => sum + a.sqm, 0);
  const anyAuto = areas.some((a) => a.auto);

  return (
    <div className="isolate overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative">
        <div ref={containerRef} className="h-[340px] w-full lg:h-[460px]" />

        {mode === "idle" && (
          <button
            type="button"
            onClick={startDraw}
            className="absolute bottom-6 left-1/2 z-1000 flex min-h-[44px] -translate-x-1/2 items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg ring-2 ring-white/70 transition-all hover:scale-105 hover:opacity-90"
          >
            ✏️ Rita tak manuellt
          </button>
        )}

        {mode === "drawing" && (
          <div className="absolute bottom-6 left-1/2 z-1000 flex -translate-x-1/2 items-center gap-2">
            <div className="rounded-xl bg-foreground/80 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur">
              Klicka hörn för hörn · dubbelklicka för att stänga
            </div>
            {pointsRef.current.length >= 3 && (
              <button
                type="button"
                onClick={finishPolygon}
                className="flex min-h-[44px] items-center rounded-xl bg-grass px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90"
              >
                Klar ✓
              </button>
            )}
          </div>
        )}

        {mode === "done" && (
          <button
            type="button"
            onClick={startDraw}
            className="absolute bottom-6 left-1/2 z-1000 flex min-h-[44px] -translate-x-1/2 items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg ring-2 ring-white/70 transition-all hover:scale-105 hover:opacity-90"
          >
            + Lägg till takyta
          </button>
        )}
      </div>

      {/* Caption + roof-area list. Sits below the map so it never collides with
          the Leaflet zoom controls (top-left) or the overlay buttons. */}
      <div className="border-t border-border px-3 py-2.5 text-xs">
        {hasRoofs ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground">
                {areas.length === 1 ? "1 takyta" : `${areas.length} takytor`} · {totalSqm} m² totalt
              </span>
              <button
                type="button"
                onClick={clearAllRoofs}
                className="rounded-lg px-2 py-1 font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                Rensa alla
              </button>
            </div>

            <ul className="mt-2 space-y-1">
              {areas.map((a, i) => (
                <li key={a.id}>
                  <div
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${
                      a.id === selectedId ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(a.id)}
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">{a.sqm} m²</span>
                      {a.auto && (
                        <span className="rounded bg-grass/15 px-1.5 py-0.5 text-[10px] font-medium text-grass">
                          auto
                        </span>
                      )}
                      {a.id === selectedId && (
                        <span className="text-[10px] text-muted-foreground">· dra i hörnen för att justera</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRoof(a.id)}
                      aria-label={`Ta bort takyta ${i + 1}`}
                      className="rounded-md px-1.5 py-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      Ta bort
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {anyAuto && (
              <p className="mt-2 leading-relaxed text-muted-foreground">
                Vi hämtade byggnadens kontur automatiskt från OpenStreetMap. Dra i hörnen för att
                justera, eller rita om. Du kan lägga till flera takytor om taket har flera delar.
              </p>
            )}
          </>
        ) : (
          <p className="leading-relaxed text-muted-foreground">
            Sök en adress så ritar vi byggnadens kontur automatiskt — eller rita taket manuellt.
            Har taket flera delar kan du lägga till flera ytor.
          </p>
        )}
      </div>
    </div>
  );
});

export default RoofMap;
