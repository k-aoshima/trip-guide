import { hexToRgb } from "@/lib/hexToRgb";
import type { Day } from "@/types/trip";

type Props = {
  days: Day[];
  activeDay: number;
  onChange: (i: number) => void;
  accent: string;
};

export function DayTabs({ days, activeDay, onChange, accent }: Props) {
  const rgb = hexToRgb(accent);
  return (
    <div style={{
      display: "flex", gap: 6,
      padding: "0 20px 8px",
      flexShrink: 0,
    }}>
      {days.map((d, i) => {
        const on = i === activeDay;
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 12,
              border: `1px solid ${on ? accent : "rgba(0,0,0,0.08)"}`,
              background: on ? `rgba(${rgb},0.12)` : "rgba(255,255,255,0.6)",
              color: on ? accent : "#777",
              fontSize: 12, fontWeight: 700,
              fontFamily: "'Noto Sans JP',sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: 1 }}>{d.label}</span>
            <span style={{ fontSize: 9, opacity: 0.7 }}>{d.spots.length}</span>
          </button>
        );
      })}
    </div>
  );
}
