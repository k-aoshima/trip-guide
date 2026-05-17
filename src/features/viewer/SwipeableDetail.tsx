import { useEffect, useRef, useState } from "react";
import { DetailContent } from "./DetailContent";
import type { Spot } from "@/types/trip";

type Props = {
  active: number;
  setActive: (i: number) => void;
  spots: Spot[];
};

export function SwipeableDetail({ active, setActive, spots }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touch = useRef({ x: 0, y: 0, locked: false, isImg: false });
  const [drag, setDrag] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      if (transitioning) return;
      let target = e.target as HTMLElement | null;
      while (target && target !== el) {
        if (target.dataset && target.dataset.imgslider) {
          touch.current.isImg = true;
          return;
        }
        target = target.parentElement;
      }
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: false, isImg: false };
    };

    const onMove = (e: TouchEvent) => {
      if (touch.current.isImg || transitioning) return;
      const dx = e.touches[0].clientX - touch.current.x;
      const dy = e.touches[0].clientY - touch.current.y;
      if (!touch.current.locked) {
        if (Math.abs(dy) > Math.abs(dx)) {
          touch.current.isImg = true;
          return;
        }
        if (Math.abs(dx) > 8) touch.current.locked = true;
        else return;
      }
      e.preventDefault();
      const atEdge = (active === 0 && dx > 0) || (active === spots.length - 1 && dx < 0);
      setDrag(atEdge ? dx * 0.2 : dx);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
    };
  }, [active, spots.length, transitioning]);

  const onTouchEnd = () => {
    if (touch.current.isImg) {
      touch.current.isImg = false;
      return;
    }
    if (transitioning) return;
    const threshold = (containerRef.current?.offsetWidth || 300) * 0.2;
    let next = active;
    if (drag < -threshold && active < spots.length - 1) next = active + 1;
    else if (drag > threshold && active > 0) next = active - 1;

    if (next !== active) {
      setTransitioning(true);
      setDrag(0);
      setActive(next);
      setTimeout(() => setTransitioning(false), 400);
    } else {
      setDrag(0);
    }
    touch.current = { x: 0, y: 0, locked: false, isImg: false };
  };

  return (
    <div
      ref={containerRef}
      onTouchEnd={onTouchEnd}
      style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: 0 }}
    >
      <div style={{
        display: "flex",
        transform: `translateX(calc(${-active * 100}% + ${drag}px))`,
        transition: drag !== 0 ? "none" : "transform 0.4s cubic-bezier(.25,.8,.25,1)",
        height: "100%",
      }}>
        {spots.map((sp, i) => (
          <div key={sp.id ?? i} style={{
            flex: "0 0 100%", width: "100%",
            overflowY: "auto", scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}>
            <DetailContent s={sp} />
          </div>
        ))}
      </div>
    </div>
  );
}
