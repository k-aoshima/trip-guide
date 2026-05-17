import { useCallback, useRef, useState } from "react";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Map } from "./Map";
import { Card } from "./Card";
import { SwipeableDetail } from "./SwipeableDetail";
import { DayTabs } from "./DayTabs";
import type { Trip } from "@/types/trip";

type Props = {
  plan: Trip;
};

export function TripViewer({ plan }: Props) {
  const navigate = useNavigate();
  const [dayIdx, setDayIdx] = useState(0);
  const [active, setActive] = useState(0);
  const [mapOpen, setMapOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lock = useRef(false);

  const day = plan.days[dayIdx];
  const spots = day.spots;
  const multiDay = plan.days.length > 1;

  const MAP_H = "45vh";

  const onScroll = useCallback(() => {
    if (lock.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const cw = el.scrollWidth / spots.length;
    const idx = Math.round(el.scrollLeft / cw);
    setActive(Math.max(0, Math.min(spots.length - 1, idx)));
  }, [spots.length]);

  const goTo = useCallback((i: number) => {
    setActive(i);
    if (!mapOpen) return;
    const el = scrollRef.current;
    if (!el) return;
    lock.current = true;
    const cw = el.scrollWidth / spots.length;
    el.scrollTo({ left: cw * i, behavior: "smooth" });
    setTimeout(() => { lock.current = false; }, 600);
  }, [mapOpen, spots.length]);

  const handleSelectDay = useCallback((i: number) => {
    setDayIdx(i);
    setActive(0);
  }, []);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div style={{
      height: "100dvh", maxWidth: 480, margin: "0 auto",
      position: "relative", overflow: "hidden",
      fontFamily: "'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",
      background: "var(--viewer-bg)",
      color: "var(--viewer-fg)",
      display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`*::-webkit-scrollbar{display:none}`}</style>

      {/* ── Map Panel ── */}
      <div style={{
        height: mapOpen ? MAP_H : 0,
        transition: "height 0.4s cubic-bezier(.32,.72,.32,1)",
        overflow: "hidden", flexShrink: 0,
        position: "relative",
      }}>
        <div style={{ height: MAP_H, position: "relative" }}>
          <Map spots={spots} active={active} onTap={goTo} visible={mapOpen} />
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 20,
          background: "linear-gradient(to bottom, transparent, var(--viewer-bg))",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Unified Header (back / title / map toggle) ── */}
      <div style={{
        padding: mapOpen ? "10px 14px 6px" : "calc(env(safe-area-inset-top, 0px) + 12px) 14px 10px",
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0, transition: "padding 0.3s",
      }}>
        <button
          onClick={goBack}
          aria-label="戻る"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 12, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            color: "var(--viewer-fg)",
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ flex: 1, minWidth: 0, textAlign: mapOpen ? "left" : "center" }}>
          <div style={{
            fontSize: mapOpen ? 15 : 18, fontWeight: 700,
            fontFamily: "'Noto Serif JP',serif",
            color: "var(--viewer-fg)",
            transition: "font-size 0.3s",
            lineHeight: 1.15,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {plan.title}
          </div>
          <div style={{
            fontSize: 9, color: "var(--viewer-fg-muted)",
            letterSpacing: 2.5, marginTop: 2,
            fontFamily: "'Inter',sans-serif",
          }}>{plan.subtitle}</div>
        </div>

        <button
          onClick={() => setMapOpen((v) => !v)}
          aria-label={mapOpen ? "地図を隠す" : "地図を表示"}
          style={{
            background: mapOpen ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 12, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            color: mapOpen ? "var(--viewer-fg)" : plan.accent,
          }}
        >
          <MapIcon size={18} />
        </button>
      </div>

      {multiDay && (
        <DayTabs days={plan.days} activeDay={dayIdx} onChange={handleSelectDay} accent={plan.accent} />
      )}

      {mapOpen ? (
        <>
          <div
            ref={scrollRef}
            onScroll={onScroll}
            key={dayIdx}
            style={{
              flex: 1, display: "flex",
              overflowX: "auto", scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              padding: "0 0 70px",
              minHeight: 0,
            }}
          >
            {spots.map((sp, i) => (
              <div key={sp.id ?? i} style={{
                flex: "0 0 84%",
                scrollSnapAlign: "center",
                padding: "0 6px",
                boxSizing: "border-box",
                ...(i === 0 ? { marginLeft: "8%" } : {}),
                ...(i === spots.length - 1 ? { marginRight: "8%" } : {}),
              }}>
                <Card s={sp} isCurrent={i === active} onTap={() => setMapOpen(false)} onFocus={() => goTo(i)} />
              </div>
            ))}
          </div>

          <BottomDots spots={spots} active={active} />
        </>
      ) : (
        <>
          <SwipeableDetail key={dayIdx} active={active} setActive={setActive} spots={spots} />
          <BottomDots spots={spots} active={active} />
        </>
      )}
    </div>
  );
}

function BottomDots({ spots, active }: { spots: Trip["days"][number]["spots"]; active: number }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
      padding: "16px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
      background: "linear-gradient(to bottom, transparent, var(--viewer-bg) 30%)",
      zIndex: 50,
    }}>
      {spots.map((sp, i) => (
        <div key={i} style={{
          width: i === active ? 24 : 7, height: 7, borderRadius: 4,
          background: i === active ? sp.color : "rgba(0,0,0,0.1)",
          transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
          boxShadow: i === active ? `0 2px 8px ${sp.color}44` : "none",
        }} />
      ))}
    </div>
  );
}
