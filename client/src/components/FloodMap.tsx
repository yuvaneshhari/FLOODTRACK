import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationScenario } from "@/lib/floodtrack-data";
import { RISK_META, scenarios } from "@/lib/floodtrack-data";

const markerIcon = (color: string, kind: "station" | "selected") =>
  L.divIcon({
    className: "floodtrack-marker",
    html: `<span class="marker-dot ${kind}" style="--marker-color:${color}"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

export default function FloodMap({ selected, onSelect }: { selected: LocationScenario; onSelect: (scenario: LocationScenario) => void }) {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;
    const map = L.map(mapNode.current, { zoomControl: false, attributionControl: false }).setView([12.99, 80.19], 11.5);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(map);
    L.control.attribution({ prefix: false, position: "bottomleft" }).addTo(map);
    layersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;
    layers.clearLayers();
    scenarios.forEach((scenario) => {
      const meta = RISK_META[scenario.risk];
      const isSelected = scenario.id === selected.id;
      L.circle([scenario.lat, scenario.lng], {
        radius: isSelected ? 1050 : 780,
        color: meta.color,
        fillColor: meta.color,
        fillOpacity: isSelected ? 0.25 : 0.13,
        weight: isSelected ? 2 : 1,
        dashArray: isSelected ? "6 6" : undefined,
      }).addTo(layers);
      const marker = L.marker([scenario.lat, scenario.lng], { icon: markerIcon(meta.color, isSelected ? "selected" : "station") }).addTo(layers);
      marker.bindPopup(`<div class="map-popup"><strong>${scenario.name}</strong><span>${scenario.risk} risk · ${scenario.probability}% inundation probability</span><span>${scenario.currentRainfall} mm/hr now · ${scenario.depth}</span></div>`);
      marker.on("click", () => onSelect(scenario));
    });
    map.setView([selected.lat, selected.lng], 12.1, { animate: true });
  }, [selected, onSelect]);

  return (
    <div className="map-frame">
      <div ref={mapNode} className="map-canvas" aria-label="Interactive Chennai rainfall and inundation map" />
      <div className="map-overlay map-title"><span className="eyebrow">LIVE OPERATIONS VIEW</span><strong>Chennai rainfall field</strong></div>
      <div className="map-overlay map-legend"><span className="eyebrow">RISK ZONES</span><div className="legend-items">{Object.entries(RISK_META).map(([label, meta]) => <span key={label}><i style={{ background: meta.color }} />{label}</span>)}</div></div>
      <div className="map-overlay map-source"><span className="pulse-dot" /> Radar composite · 16:32 IST</div>
    </div>
  );
}
