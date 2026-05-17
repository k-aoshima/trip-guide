import { SpotIconComponent } from "./icons";
import { ImageSlider } from "./ImageSlider";
import { PlaceholderHero } from "./PlaceholderHero";
import { hexToRgb } from "@/lib/hexToRgb";
import type { Spot } from "@/types/trip";

export function DetailContent({ s }: { s: Spot }) {
  const colorRgb = hexToRgb(s.color);
  const hasImages = s.images && s.images.length > 0;

  return (
    <div>
      {hasImages ? (
        <ImageSlider images={s.images!} hero />
      ) : (
        <PlaceholderHero s={s} hero />
      )}

      <div style={{ padding: "16px 20px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: `rgba(${colorRgb},0.12)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SpotIconComponent icon={s.icon} size={26} color={s.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Noto Serif JP',serif", lineHeight: 1.2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{s.sub}</div>
            {s.url && (
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 10, color: s.color, textDecoration: "none", marginTop: 2,
                display: "inline-flex", alignItems: "center", gap: 3,
              }}>
                🔗 {s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
          <div style={{
            background: `rgba(${colorRgb},0.1)`,
            borderRadius: 14, padding: "8px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.time}</div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>– {s.end}</div>
          </div>
        </div>

        {s.drive && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.04)", borderRadius: 10,
            padding: "5px 12px", fontSize: 12, color: "#888",
            marginBottom: 12,
          }}>🚗 {s.drive}</div>
        )}

        {s.note && (
          <div style={{
            background: "rgba(255,255,255,0.6)", borderRadius: 14,
            padding: "12px 16px", fontSize: 13, color: "#555",
            lineHeight: 1.7, marginBottom: 16,
            borderLeft: `4px solid ${s.color}66`,
          }}>📌 {s.note}</div>
        )}

        <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: "0 0 16px" }}>{s.desc}</p>

        {s.tags && s.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {s.tags.map((t) => (
              <span key={t} style={{
                fontSize: 11, padding: "5px 14px", borderRadius: 20,
                background: "rgba(255,255,255,0.7)",
                border: `1px solid ${s.color}30`,
                color: s.color, fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>
        )}

        {typeof s.rating === "number" && s.rating > 0 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 12, color: "#999",
            background: "rgba(255,255,255,0.5)", borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: "#F39C12", fontSize: 14 }}>
                {"★".repeat(Math.floor(s.rating))}
                {s.rating % 1 >= 0.3 ? "☆" : ""}
              </span>
              <span style={{ fontWeight: 600, color: "#666" }}>{s.rating}</span>
              {typeof s.reviews === "number" && s.reviews > 0 && (
                <span style={{ color: "#bbb" }}>({s.reviews.toLocaleString()}件)</span>
              )}
            </div>
            {s.hours && <span>🕐 {s.hours}</span>}
          </div>
        )}

        {typeof s.lat === "number" && typeof s.lng === "number" && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "rgba(255,255,255,0.7)", borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: "10px 14px", fontSize: 12, fontWeight: 600,
              color: "#555", textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              marginBottom: 16,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Google マップで開く
          </a>
        )}
      </div>
    </div>
  );
}
