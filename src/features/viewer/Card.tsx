import { SpotIconComponent } from "./icons";
import { hexToRgb } from "@/lib/hexToRgb";
import type { Spot } from "@/types/trip";

type Props = {
  s: Spot;
  isCurrent: boolean;
  onTap: () => void;
  onFocus: () => void;
};

export function Card({ s, isCurrent, onTap, onFocus }: Props) {
  const colorRgb = hexToRgb(s.color);
  return (
    <div onClick={onFocus} style={{ cursor: "pointer",
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRadius: 22, padding: "0 20px 16px",
      border: "1px solid rgba(255,255,255,0.5)",
      boxShadow: isCurrent
        ? `0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)`
        : `0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4)`,
      height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 0.3s, transform 0.3s",
      transform: isCurrent ? "scale(1)" : "scale(0.96)",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, borderRadius: "0 0 3px 3px", background: s.color, opacity: 0.6 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, marginTop: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: `rgba(${colorRgb},0.12)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <SpotIconComponent icon={s.icon} size={22} color={s.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Noto Serif JP',serif", lineHeight: 1.2 }}>{s.label}</div>
          <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{s.sub}</div>
        </div>
        <div style={{
          background: `rgba(${colorRgb},0.1)`,
          borderRadius: 12, padding: "6px 12px", textAlign: "center",
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.time}</div>
          <div style={{ fontSize: 9, color: "#aaa", marginTop: 2 }}>– {s.end}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, margin: 0, flex: 1 }}>{s.desc}</p>

      <div onClick={(e) => { e.stopPropagation(); onTap(); }} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 4, marginTop: 12, padding: "8px 0 2px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        fontSize: 12, fontWeight: 600, color: s.color,
      }}>
        詳細を見る
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
