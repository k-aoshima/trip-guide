import { useEffect, useState } from "react";
import { Menu, Headphones, Play } from "lucide-react";
import { MotionArt } from "./MotionArt";
import { getGreeting, formatDate } from "./utils";

type Props = {
  displayName: string;
  savedCount: number;
  onMenu: () => void;
  onCreate: () => void;
};

export function HeroCard({ displayName, savedCount, onMenu, onCreate }: Props) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const greeting = getGreeting(now);
  const date = formatDate(now, "en");

  return (
    <div style={{
      position: "relative",
      height: "46vh",
      minHeight: 320,
      overflow: "hidden",
      flexShrink: 0,
      borderRadius: "0 0 28px 28px",
    }}>
      <MotionArt />

      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "calc(env(safe-area-inset-top, 0px) + 14px) 18px 0",
        zIndex: 2,
      }}>
        <div style={{
          fontSize: 17, fontWeight: 700,
          color: "var(--hero-ink)",
          fontFamily: "'Fraunces','Noto Serif JP',serif",
          letterSpacing: 0.3,
          textShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}>Trip Guide</div>
        <button onClick={onMenu} style={{
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          borderRadius: 12, width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: "var(--hero-ink)",
        }}>
          <Menu size={18} />
        </button>
      </div>

      {/* Center content */}
      <div style={{
        position: "absolute",
        left: 0, right: 0, top: "50%",
        transform: "translateY(-50%)",
        padding: "0 24px",
        display: "flex", flexDirection: "column", alignItems: "center",
        zIndex: 2,
        color: "var(--hero-ink)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 34, fontWeight: 600,
          fontFamily: "'Fraunces','Noto Serif JP',serif",
          letterSpacing: -0.5,
          lineHeight: 1.1,
          textShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}>
          {greeting.text},
          <br />
          {displayName}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 500,
          marginTop: 10,
          opacity: 0.82,
          letterSpacing: 1.6,
          fontFamily: "'Inter',sans-serif",
        }}>
          {date}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        bottom: 28,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        zIndex: 2,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: "rgba(255,255,255,0.85)",
          background: "rgba(0,0,0,0.22)",
          backdropFilter: "blur(10px)",
          padding: "5px 12px",
          borderRadius: 999,
          fontWeight: 500,
          letterSpacing: 0.4,
        }}>
          <Headphones size={12} />
          <span>{savedCount} プラン</span>
        </div>
        <button onClick={onCreate} style={{
          background: "var(--cta-bg)",
          color: "var(--cta-fg)",
          border: "none",
          padding: "14px 36px",
          borderRadius: 999,
          fontSize: 15, fontWeight: 700,
          letterSpacing: 0.3,
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 10px 32px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.18)",
        }}>
          <Play size={18} fill="currentColor" />
          今日の旅を始める
        </button>
      </div>
    </div>
  );
}
