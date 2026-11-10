"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Map as LeafletMap, Marker, LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Day } from "@/lib/types";
import { getSlugString } from "@/lib/sanity/client";

interface PlacePoint {
  name: string;
  country: string;
  lat: number;
  lng: number;
  days: Day[];
}

interface EditorialMapProps {
  places: PlacePoint[];
}

const ALL = "Whole journey";

// Zoom level a pin click brings you to when the map is zoomed far out
const PLACE_ZOOM = 9;

function pinHtml(selected: boolean): string {
  const base =
    "display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;box-shadow:0 2px 6px rgba(24,23,21,.28);transition:all .2s;";
  const style = selected
    ? `${base}background:#A85D41;color:#fff;box-shadow:0 0 0 5px rgba(168,93,65,.22),0 2px 6px rgba(24,23,21,.28);transform:scale(1.2);`
    : `${base}background:#FCFAF7;color:#2B2824;border:1px solid #DCD5C9;`;
  return `<div style="${style}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></div>`;
}

function formatCoordinates(lat: number, lng: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

export function EditorialMap({ places }: EditorialMapProps) {
  // Filter out any place without valid coordinates
  const validPlaces = useMemo(
    () =>
      places.filter(
        (p) => typeof p.lat === "number" && typeof p.lng === "number" && !isNaN(p.lat) && !isNaN(p.lng)
      ),
    [places]
  );

  // Regions are derived from the data, so a new country appears on its own
  const regions = useMemo(() => {
    // Countries in the order they were first visited
    const first = new Map<string, number>();
    for (const p of validPlaces) {
      if (!p.country) continue;
      const earliest = Math.min(...p.days.map((d) => d.order ?? Infinity), Infinity);
      first.set(p.country, Math.min(first.get(p.country) ?? Infinity, earliest));
    }
    return [ALL, ...[...first.entries()].sort((a, b) => a[1] - b[1]).map(([c]) => c)];
  }, [validPlaces]);

  const [activeName, setActiveName] = useState<string | null>(validPlaces[0]?.name ?? null);
  const [region, setRegion] = useState<string>(ALL);
  const activePlace = validPlaces.find((p) => p.name === activeName) || null;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const activeNameRef = useRef(activeName);
  activeNameRef.current = activeName;
  const [ready, setReady] = useState(false);

  function boundsFor(regionName: string): LatLngBoundsExpression | null {
    const pts = validPlaces.filter((p) => regionName === ALL || p.country === regionName);
    if (pts.length === 0) return null;
    return pts.map((p) => [p.lat, p.lng] as [number, number]);
  }

  // Create the map once
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false, // enabled on click so the page can still scroll past the map
        zoomControl: true,
        minZoom: 2,
        maxZoom: 14,
        worldCopyJump: true,
      });
      mapRef.current = map;

      // OpenStreetMap standard tiles: no API key, attribution required
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());

      // Journey route: places in the order they were first visited
      const ordered = [...validPlaces]
        .filter((p) => p.days.length > 0)
        .sort(
          (a, b) =>
            Math.min(...a.days.map((d) => d.order ?? Infinity)) - Math.min(...b.days.map((d) => d.order ?? Infinity))
        );
      if (ordered.length > 1) {
        L.polyline(
          ordered.map((p) => [p.lat, p.lng] as [number, number]),
          { color: "#A85D41", weight: 1.5, opacity: 0.45, dashArray: "5 6", interactive: false }
        ).addTo(map);
      }

      for (const place of validPlaces) {
        const selected = place.name === activeNameRef.current;
        const marker = L.marker([place.lat, place.lng], {
          icon: L.divIcon({ html: pinHtml(selected), className: "", iconSize: [28, 28], iconAnchor: [14, 14] }),
          title: place.name,
          alt: `View entries for ${place.name}`,
          keyboard: true,
          zIndexOffset: selected ? 1000 : 0,
        })
          .bindTooltip(`${place.name} · ${place.days.length} ${place.days.length === 1 ? "entry" : "entries"}`, {
            direction: "top",
            offset: [0, -14],
            className: "journey-map-tooltip",
          })
          .on("click", () => {
            setActiveName(place.name);
            // Far out, nearby towns overlap: bring the reader in close enough to tell them apart
            if (map.getZoom() < PLACE_ZOOM - 2) map.flyTo([place.lat, place.lng], PLACE_ZOOM, { duration: 0.8 });
          })
          .addTo(map);
        markersRef.current[place.name] = marker;
      }

      const all = boundsFor(ALL);
      if (all) map.fitBounds(all, { padding: [40, 40] });
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validPlaces]);

  // Restyle pins when the selection changes
  useEffect(() => {
    const L = leafletRef.current;
    if (!L || !ready) return;
    for (const [name, marker] of Object.entries(markersRef.current)) {
      const selected = name === activeName;
      marker.setIcon(L.divIcon({ html: pinHtml(selected), className: "", iconSize: [28, 28], iconAnchor: [14, 14] }));
      marker.setZIndexOffset(selected ? 1000 : 0);
    }
  }, [activeName, ready]);

  function goToRegion(name: string) {
    setRegion(name);
    const map = mapRef.current;
    const b = boundsFor(name);
    if (!map || !b) return;
    map.flyToBounds(b, { padding: [50, 50], maxZoom: 10, duration: 0.9 });
  }

  return (
    <div className="space-y-8">
      {/* Region shortcuts */}
      {regions.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 font-sans text-xs">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => goToRegion(r)}
              aria-pressed={region === r}
              className={`px-4 py-2 rounded-full border tracking-[0.12em] uppercase transition-colors ${
                region === r
                  ? "bg-sage text-white border-sage"
                  : "bg-paper-50 text-ink-600 border-border-medium hover:border-sage hover:text-sage-dark"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Map */}
      <div className="relative isolate w-full h-[420px] sm:h-[560px] rounded-sm bg-paper-200 border border-border-subtle overflow-hidden shadow-sm">
        <div ref={containerRef} className="journey-map absolute inset-0" aria-label="Map of the places visited on the journey" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center font-serif italic text-ink-500 pointer-events-none">
            Loading the map…
          </div>
        )}
      </div>
      <p className="-mt-4 text-center font-sans text-[11px] tracking-wide text-ink-400">
        Drag to move · use + / − or double-click to zoom · click the map to zoom with the scroll wheel
      </p>

      <style>{`
        .journey-map { background: #F4F0E8; font-family: inherit; }
        .journey-map .leaflet-tile-pane { filter: sepia(0.28) saturate(0.7) brightness(1.03); }
        .journey-map-tooltip {
          background: rgba(24,23,21,.92); color: #fff; border: 0; border-radius: 4px;
          padding: 4px 10px; font-size: 11px; letter-spacing: .06em; box-shadow: 0 4px 10px rgba(24,23,21,.25);
        }
        .journey-map-tooltip::before { border-top-color: rgba(24,23,21,.92) !important; }
        .journey-map .leaflet-control-zoom a { color: #2B2824; background: #FCFAF7; border-color: #DCD5C9; }
        .journey-map .leaflet-control-attribution { background: rgba(252,250,247,.85); font-size: 10px; color: #635D53; }
        .journey-map .leaflet-marker-icon:focus-visible { outline: 2px solid #475B4B; outline-offset: 3px; border-radius: 9999px; }
      `}</style>

      {/* Selected Location Stories Drawer */}
      {activePlace && (
        <div className="p-6 sm:p-8 rounded-sm bg-paper-50 border border-border-subtle shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-border-subtle">
            <div className="space-y-1">
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-terracotta font-semibold">
                {activePlace.country}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink-900">
                {activePlace.name}
              </h2>
            </div>
            <span className="font-sans text-xs text-ink-400">
              Coordinates: {formatCoordinates(activePlace.lat, activePlace.lng)}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="font-display tracking-[0.18em] text-xs uppercase text-ink-500">
              Stories from {activePlace.name} ({activePlace.days.length}{" "}
              {activePlace.days.length === 1 ? "entry" : "entries"})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePlace.days.map((day) => {
                const daySlug = getSlugString(day.slug);
                return (
                  <Link
                    key={day._id}
                    href={`/story/${daySlug}`}
                    className="group p-4 rounded bg-paper-100 hover:bg-paper-200/80 border border-border-subtle hover:border-border-medium transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="font-serif italic text-xs text-ink-500">
                        {day.date}
                      </span>
                      <h4 className="font-serif text-base text-ink-900 group-hover:text-sage-dark font-medium line-clamp-1">
                        {day.title}
                      </h4>
                    </div>

                    <ArrowRight
                      size={14}
                      className="text-ink-400 group-hover:text-sage-dark group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
