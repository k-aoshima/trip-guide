import { useCallback, useRef, useState } from "react";

type Props = { images: string[]; hero?: boolean };

export function ImageSlider({ images, hero }: Props) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const len = images.length;

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const i = Math.round(el.scrollLeft / w);
    setIdx(Math.max(0, Math.min(len - 1, i)));
  }, [len]);

  const h = hero ? 320 : 120;
  const radius = hero ? "0" : "22px 22px 14px 14px";

  return (
    <div
      data-imgslider="true"
      style={{
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        marginBottom: hero ? 0 : 12,
        flexShrink: 0,
        margin: hero ? 0 : "0 -20px 12px",
        WebkitTransform: "translateZ(0)",
      }}
    >
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
        }}
      >
        {images.map((src, i) => (
          <div key={i} style={{ flex: "0 0 100%", scrollSnapAlign: "start" }}>
            <img
              src={src}
              alt=""
              loading="lazy"
              style={{ width: "100%", height: h, objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
      {len > 1 && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
          display: "flex", justifyContent: "center", gap: 5,
          padding: hero ? "20px 0 14px" : "12px 0 8px",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))",
          WebkitTransform: "translateZ(0)",
        }}>
          {images.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
              background: i === idx ? "#fff" : "rgba(255,255,255,0.5)",
              transition: "all 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
