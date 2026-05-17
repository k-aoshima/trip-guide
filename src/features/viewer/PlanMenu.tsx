import { X } from "lucide-react";
import { SpotIconComponent } from "./icons";
import { hexToRgb } from "@/lib/hexToRgb";
import type { Trip } from "@/types/trip";

type Props = {
  open: boolean;
  onClose: () => void;
  plans: Trip[];
  currentPlanIndex: number;
  onSelectPlan: (i: number) => void;
};

export function PlanMenu({ open, onClose, plans, currentPlanIndex, onSelectPlan }: Props) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
          zIndex: 100,
        }}
      />
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: 280, maxWidth: "82%",
        background: "rgba(252,250,247,0.96)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s cubic-bezier(.32,.72,.32,1)",
        zIndex: 101,
        boxShadow: open ? "4px 0 32px rgba(0,0,0,0.18)" : "none",
        display: "flex", flexDirection: "column",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#999", letterSpacing: 3, fontWeight: 600 }}>PLANS</div>
            <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'Noto Serif JP',serif", marginTop: 4 }}>旅のしおり</div>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "none", cursor: "pointer",
            width: 32, height: 32, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={20} color="#666" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {plans.map((p, i) => {
            const isActive = i === currentPlanIndex;
            const rgb = hexToRgb(p.accent);
            const totalSpots = p.days.reduce((sum, d) => sum + d.spots.length, 0);
            return (
              <div
                key={p.id ?? i}
                onClick={() => onSelectPlan(i)}
                style={{
                  padding: "14px 20px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                  background: isActive ? `rgba(${rgb},0.08)` : "transparent",
                  borderLeft: `3px solid ${isActive ? p.accent : "transparent"}`,
                  transition: "background 0.2s",
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: `rgba(${rgb},0.14)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <SpotIconComponent icon={p.icon} size={22} color={p.accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Noto Serif JP',serif", lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontSize: 9, color: "#aaa", letterSpacing: 2, marginTop: 3 }}>{p.subtitle}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
                    {p.days.length === 1 ? `${totalSpots}スポット` : `${p.days.length}日間 / ${totalSpots}スポット`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "12px 20px calc(env(safe-area-inset-bottom, 0px) + 14px)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 10, color: "#bbb", letterSpacing: 1 }}>TRIP GUIDE</div>
        </div>
      </div>
    </>
  );
}
