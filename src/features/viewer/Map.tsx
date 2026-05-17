import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MARKER_SVG } from "./markers";
import type { Spot } from "@/types/trip";

type Props = {
  spots: Spot[];
  active: number;
  onTap: (i: number) => void;
  visible: boolean;
};

export function Map({ spots, active, onTap, visible }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const layers = useRef<L.Layer[]>([]);
  const onTapRef = useRef(onTap);

  useEffect(() => {
    onTapRef.current = onTap;
  }, [onTap]);

  useEffect(() => {
    if (!el.current) return;

    if (!map.current) {
      const m = L.map(el.current, { zoomControl: false, attributionControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(m);
      L.control.zoom({ position: "topright" }).addTo(m);
      L.control.attribution({ position: "bottomright", prefix: false }).addTo(m);
      map.current = m;
    }
    const m = map.current;

    layers.current.forEach((l) => m.removeLayer(l));
    layers.current = [];

    const usable = spots.filter((s) => typeof s.lat === "number" && typeof s.lng === "number");
    if (usable.length === 0) return;

    const coords = usable.map((s) => [s.lat as number, s.lng as number] as [number, number]);
    const shadow = L.polyline(coords, { color: "#000", weight: 7, opacity: 0.06, lineCap: "round", lineJoin: "round" }).addTo(m);
    const line = L.polyline(coords, { color: "#E74C3C", weight: 3, opacity: 0.8, lineCap: "round", lineJoin: "round" }).addTo(m);
    layers.current.push(shadow, line);

    usable.forEach((s, i) => {
      const icon = L.divIcon({
        className: "",
        iconSize: [0, 0],
        iconAnchor: [0, 40],
        html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translateX(-50%)">
          <div id="mb${i}" style="background:rgba(255,255,255,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#333;padding:4px 10px;border-radius:10px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,.18);border:2px solid ${s.color};transition:all .3s;font-family:'Noto Sans JP',sans-serif;display:flex;align-items:center;gap:3px">
            ${MARKER_SVG[s.icon] || ""}<span>${s.label}</span>
          </div>
          <div id="ma${i}" style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid rgba(255,255,255,.92);filter:drop-shadow(0 1px 2px rgba(0,0,0,.1));transition:all .3s"></div>
        </div>`,
      });
      const marker = L.marker([s.lat as number, s.lng as number], { icon })
        .addTo(m)
        .on("click", () => onTapRef.current(i));
      layers.current.push(marker);
    });

    m.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 14 });
  }, [spots]);

  useEffect(() => {
    if (!map.current || !spots) return;
    spots.forEach((s, i) => {
      const b = document.getElementById(`mb${i}`);
      const a = document.getElementById(`ma${i}`);
      if (!b || !a) return;
      const on = active === i;
      b.style.background = on ? s.color : "rgba(255,255,255,.92)";
      b.style.color = on ? "#fff" : "#333";
      b.style.transform = on ? "scale(1.15)" : "scale(1)";
      b.style.boxShadow = on ? `0 4px 20px ${s.color}66` : "0 2px 12px rgba(0,0,0,.18)";
      a.style.borderTopColor = on ? s.color : "rgba(255,255,255,.92)";
    });
    const target = spots[active];
    if (target && typeof target.lat === "number" && typeof target.lng === "number") {
      map.current.flyTo([target.lat, target.lng], 14, { duration: 0.5 });
    }
  }, [active, spots]);

  useEffect(() => {
    if (visible && map.current) {
      setTimeout(() => map.current?.invalidateSize(), 350);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return <div ref={el} style={{ width: "100%", height: "100%" }} />;
}
