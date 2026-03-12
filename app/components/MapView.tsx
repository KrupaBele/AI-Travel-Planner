"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
  type: "current" | "destination" | "place";
}

interface MapViewProps {
  destination: string;
  keyPlaces: string[];
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=en`,
      { headers: { "User-Agent": "AI-Trip-Planner/1.0" } }
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // fail silently
  }
  return null;
}

function makeIcon(color: string, size: number, pulse = false) {
  const ring = pulse
    ? `<div style="position:absolute;inset:-4px;border-radius:50%;background:${color}33;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></div>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;width:${size}px;height:${size}px">
      ${ring}
      <div style="position:absolute;inset:0;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>
    </div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

export default function MapView({ destination, keyPlaces }: MapViewProps) {
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    // Fix Leaflet default icon paths (needed in Next.js)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const load = async () => {
      const newPoints: GeoPoint[] = [];
      const placesToGeocode = keyPlaces.slice(0, 6);
      setTotal(placesToGeocode.length + 2); // current + destination + places

      // 1. Current location
      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              newPoints.push({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                label: "Your Current Location",
                type: "current",
              });
              resolve();
            },
            () => {
              setLocationDenied(true);
              resolve();
            },
            { timeout: 6000 }
          );
        });
      }
      setProgress((p) => p + 1);

      // 2. Geocode destination
      const destCoords = await geocode(destination);
      if (destCoords) {
        newPoints.push({
          ...destCoords,
          label: destination,
          type: "destination",
        });
        setMapCenter([destCoords.lat, destCoords.lng]);
        setMapZoom(13);
        setPoints([...newPoints]);
      }
      setProgress((p) => p + 1);
      setStatus("ready");

      // 3. Geocode key places (1 per second to respect Nominatim rate limit)
      for (const place of placesToGeocode) {
        await new Promise((r) => setTimeout(r, 1100));
        const coords = await geocode(`${place}, ${destination}`);
        if (coords) {
          newPoints.push({ ...coords, label: place, type: "place" });
          setPoints([...newPoints]);
        }
        setProgress((p) => p + 1);
      }
    };

    load();
  }, [destination, keyPlaces]);

  const currentIcon = makeIcon("#3b82f6", 18, true);
  const destIcon = makeIcon("#ef4444", 22, false);
  const placeIcon = makeIcon("#10b981", 14, false);

  const getIcon = (type: GeoPoint["type"]) => {
    if (type === "current") return currentIcon;
    if (type === "destination") return destIcon;
    return placeIcon;
  };

  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span>🗺️</span> Interactive Map
        </h3>
        <p className="text-violet-100 text-xs mt-0.5">
          Your location · Destination · Key places to visit
        </p>
      </div>

      {/* Loading bar */}
      {status === "loading" && (
        <div>
          <div className="h-1.5 bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="h-80 flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 rounded-full border-3 border-violet-300 border-t-violet-600 animate-spin" />
            <p className="font-medium text-slate-600">Loading map...</p>
            <p className="text-xs text-slate-400">Locating destination & places to visit</p>
          </div>
        </div>
      )}

      {/* Map */}
      {status === "ready" && (
        <>
          {/* Progress bar for places (still loading after map shows) */}
          {pct < 100 && (
            <div className="h-1 bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}

          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "420px", width: "100%" }}
            className="z-0"
            scrollWheelZoom={true}
          >
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((point, idx) => (
              <Marker
                key={idx}
                position={[point.lat, point.lng]}
                icon={getIcon(point.type)}
              >
                <Popup>
                  <div className="min-w-[140px]">
                    <div className="font-semibold text-slate-800 text-sm leading-snug">
                      {point.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {point.type === "current"
                        ? "📍 Your Current Location"
                        : point.type === "destination"
                        ? "🗺️ Destination"
                        : "✨ Place to Visit"}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend + info */}
          <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60">
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200 inline-block" />
                Your Location
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                Destination
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                Places to Visit
                {pct < 100 && (
                  <span className="text-slate-400 ml-0.5">
                    (loading...)
                  </span>
                )}
              </span>
            </div>
            {locationDenied && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <span>⚠️</span> Location access denied — only destination shown
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
