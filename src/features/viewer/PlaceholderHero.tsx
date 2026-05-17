import { SpotIconComponent } from "./icons";
import type { Spot } from "@/types/trip";

type Props = { s: Spot; hero?: boolean };

export function PlaceholderHero({ s, hero }: Props) {
  const h = hero ? 320 : 120;
  const radius = hero ? "0" : "22px 22px 14px 14px";
  return (
    <div style={{
      height: h,
      borderRadius: radius,
      margin: hero ? 0 : "0 -20px 12px",
      background: `linear-gradient(135deg, ${s.color}22 0%, ${s.color}66 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ opacity: 0.4 }}>
        <SpotIconComponent icon={s.icon} size={hero ? 110 : 56} color={s.color} />
      </div>
      <div style={{
        position: "absolute", bottom: hero ? 16 : 8, right: hero ? 20 : 12,
        fontSize: 9, color: `${s.color}aa`, letterSpacing: 2, fontWeight: 700,
      }}>NO IMAGE</div>
    </div>
  );
}
