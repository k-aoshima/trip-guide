import { ChevronRight } from "lucide-react";
import { SpotIconComponent } from "@/features/viewer/icons";
import { hexToRgb } from "@/lib/hexToRgb";
import type { Trip } from "@/types/trip";

type Props = {
  plan: Trip;
  onClick: () => void;
};

export function PlanCard({ plan, onClick }: Props) {
  const rgb = hexToRgb(plan.accent);
  const totalSpots = plan.days.reduce((s, d) => s + d.spots.length, 0);
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: "var(--bg-card)",
        border: "1px solid rgba(0,0,0,0.04)",
        borderRadius: 18,
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer",
        color: "var(--fg)",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `linear-gradient(135deg, rgba(${rgb},0.22) 0%, rgba(${rgb},0.5) 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <SpotIconComponent icon={plan.icon} size={26} color={plan.accent} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 700,
          fontFamily: "'Noto Serif JP',serif",
          lineHeight: 1.2,
          color: "var(--fg)",
        }}>{plan.title}</div>
        <div style={{
          fontSize: 9, color: "var(--fg-muted)",
          letterSpacing: 2, marginTop: 3,
          fontFamily: "'Inter',sans-serif",
        }}>{plan.subtitle}</div>
        <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 6 }}>
          {plan.days.length === 1 ? `${totalSpots} スポット` : `${plan.days.length}日 / ${totalSpots} スポット`}
        </div>
      </div>
      <ChevronRight size={18} color="var(--fg-muted)" />
    </button>
  );
}
