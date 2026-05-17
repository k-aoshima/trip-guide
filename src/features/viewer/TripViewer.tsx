import { useCallback, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Map } from "./Map";
import { Card } from "./Card";
import { SwipeableDetail } from "./SwipeableDetail";
import { DayTabs } from "./DayTabs";
import { PlanMenu } from "./PlanMenu";
import type { Trip } from "@/types/trip";

type Props = {
  plans: Trip[];
};

export function TripViewer({ plans }: Props) {
  const [planIdx, setPlanIdx] = useState(0);
  const [dayIdx, setDayIdx] = useState(0);
  const [active, setActive] = useState(0);
  const [mapOpen, setMapOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lock = useRef(false);

  const plan = plans[planIdx];
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

  const handleSelectPlan = useCallback((i: number) => {
    setPlanIdx(i);
    setDayIdx(0);
    setActive(0);
    setMenuOpen(false);
  }, []);

  const handleSelectDay = useCallback((i: number) => {
    setDayIdx(i);
    setActive(0);
  }, []);

  return (
    <div style={{
      height: "100dvh", maxWidth: 430, margin: "0 auto",
      position: "relative", overflow: "hidden",
      fontFamily: "'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",
      background: "#f0ede8",
      display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`*::-webkit-scrollbar{display:none}`}</style>

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
          background: "linear-gradient(to bottom, transparent, #f0ede8)",
          pointerEvents: "none",
        }} />
      </div>

      <div style={{
        padding: mapOpen ? "10px 16px 6px" : "14px 16px 10px",
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0, transition: "padding 0.3s",
      }}>
        <button onClick={() => setMenuOpen(true)} style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12, width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <Menu size={18} color="#555" />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: mapOpen ? 16 : 20, fontWeight: 700, fontFamily: "'Noto Serif JP',serif", color: "#1a1a1a", transition: "font-size 0.3s", lineHeight: 1.1 }}>
            {plan.title}
          </div>
          <div style={{ fontSize: 9, color: "#999", letterSpacing: 3, marginTop: 2 }}>{plan.subtitle}</div>
        </div>

        {!mapOpen && (
          <button onClick={() => setMapOpen(true)} style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12, padding: "6px 12px",
            fontSize: 12, fontWeight: 600,
            color: "#555", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
              <path d="M15 5.764v15" /><path d="M9 3.236v15" />
            </svg>
            地図
          </button>
        )}
      </div>

      {multiDay && (
        <DayTabs days={plan.days} activeDay={dayIdx} onChange={handleSelectDay} accent={plan.accent} />
      )}

      {mapOpen ? (
        <>
          <div
            ref={scrollRef}
            onScroll={onScroll}
            key={`${planIdx}-${dayIdx}`}
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

          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
            padding: "16px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
            background: "linear-gradient(to bottom, rgba(240,237,232,0), rgba(240,237,232,1) 30%)",
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
        </>
      ) : (
        <>
          <SwipeableDetail key={`${planIdx}-${dayIdx}`} active={active} setActive={setActive} spots={spots} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
            padding: "16px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
            background: "linear-gradient(to bottom, rgba(240,237,232,0), rgba(240,237,232,1) 30%)",
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
        </>
      )}

      <PlanMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        plans={plans}
        currentPlanIndex={planIdx}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
}
