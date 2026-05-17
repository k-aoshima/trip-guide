import { Sparkles } from "lucide-react";

export type Suggestion = {
  id: string;
  title: string;
  hint: string;
  accent: string;
};

const FOR_YOU: Suggestion[] = [
  { id: "kyoto-spring", title: "桜の京都 1 泊", hint: "寺と桜並木をゆっくり巡る", accent: "#E78AAE" },
  { id: "kyushu-onsen", title: "九州 温泉 2 泊", hint: "由布院と黒川を車で", accent: "#B98EF2" },
  { id: "okinawa-3days", title: "沖縄 ビーチ 2 泊", hint: "美ら海と古宇利島", accent: "#3FB6D4" },
];

type Props = {
  onSelect: (s: Suggestion) => void;
};

export function SuggestionRow({ onSelect }: Props) {
  return (
    <div style={{ padding: "8px 0 4px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "0 20px 10px",
        fontSize: 11, color: "var(--fg-muted)",
        letterSpacing: 2, fontWeight: 600,
      }}>
        <Sparkles size={12} />
        <span>FOR YOU</span>
      </div>
      <div style={{
        display: "flex", gap: 12, overflowX: "auto",
        padding: "0 20px 6px",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
      }}>
        {FOR_YOU.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            style={{
              flex: "0 0 auto",
              minWidth: 220,
              scrollSnapAlign: "start",
              background: `linear-gradient(135deg, ${s.accent} 0%, ${s.accent}99 100%)`,
              border: "none",
              borderRadius: 18,
              padding: "16px 18px",
              color: "#fff",
              textAlign: "left",
              cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 6,
              boxShadow: `0 6px 20px ${s.accent}44`,
            }}
          >
            <div style={{
              fontSize: 15, fontWeight: 700,
              fontFamily: "'Noto Serif JP',serif",
              lineHeight: 1.2,
            }}>{s.title}</div>
            <div style={{ fontSize: 11, opacity: 0.92, lineHeight: 1.45 }}>{s.hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
