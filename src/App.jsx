import { useState, useEffect, useRef, useCallback } from "react";
import { Landmark, UtensilsCrossed, Mountain } from "lucide-react";

// Custom torii gate icon
function ToriiIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16" /><path d="M3 3c0 0 2 3 9 3s9-3 9-3" /><path d="M6 5v17" /><path d="M18 5v17" /><path d="M4 9h16" />
    </svg>
  );
}

// Custom onsen (♨) icon - Japanese hot spring mark
function OnsenIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <path d="M50 100c-16.5 0-30-11.5-30-25.5C20 64 35 58 35 58s-2.5 10 0 16.5S42 85 50 85s12.5-4 15-10.5S65 58 65 58s15 6 15 16.5C80 88.5 66.5 100 50 100z"/>
      <path d="M30 45c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" strokeWidth="6" stroke={color} fill="none" strokeLinecap="round"/>
      <path d="M50 48c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" strokeWidth="6" stroke={color} fill="none" strokeLinecap="round"/>
      <path d="M70 45c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" strokeWidth="6" stroke={color} fill="none" strokeLinecap="round"/>
    </svg>
  );
}

const ICON_MAP = {
  landmark: Landmark,
  shrine: ToriiIcon,
  food: UtensilsCrossed,
  mountain: Mountain,
  onsen: OnsenIcon,
};

function SpotIcon({ icon, size = 20, color = "currentColor" }) {
  const Icon = ICON_MAP[icon];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={2} />;
}

// SVG strings for map markers
const MARKER_SVG = {
  landmark: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  shrine: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M3 3c0 0 2 3 9 3s9-3 9-3"/><path d="M6 5v17"/><path d="M18 5v17"/><path d="M4 9h16"/></svg>`,
  food: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c1.7 1.7 4.3 1.7 6 0"/><path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z"/></svg>`,
  mountain: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
  onsen: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 100 100" fill="currentColor"><path d="M50 100c-16.5 0-30-11.5-30-25.5C20 64 35 58 35 58s-2.5 10 0 16.5S42 85 50 85s12.5-4 15-10.5S65 58 65 58s15 6 15 16.5C80 88.5 66.5 100 50 100z"/><path d="M30 45c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" stroke-width="6" stroke="currentColor" fill="none" stroke-linecap="round"/><path d="M50 48c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" stroke-width="6" stroke="currentColor" fill="none" stroke-linecap="round"/><path d="M70 45c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" stroke-width="6" stroke="currentColor" fill="none" stroke-linecap="round"/></svg>`,
};

const SPOTS = [
  {
    id: 0, time: "10:00", end: "11:00", icon: "landmark", label: "箱根関所 旅物語館",
    sub: "Hakone Sekisho Tabimonogatarikan", note: "箱根町港駐車場に停めてここから徒歩",
    rating: 3.9, reviews: 7545, hours: "9:00–16:30",
    desc: "江戸時代の関所を復元。芦ノ湖を望む絶景ポイントでもあり、歴史と景色を同時に楽しめます。",
    lat: 35.1914, lng: 139.0265, color: "#C0392B",
    tags: ["歴史", "絶景", "徒歩圏内"], drive: null,
    images: ["/images/sekisho_1.jpg", "/images/sekisho_2.jpg", "/images/sekisho_3.jpg"],
    url: "https://www.shizutetsu-retailing.com/hakone/",
  },
  {
    id: 1, time: "11:15", end: "12:45", icon: "shrine", label: "箱根神社",
    sub: "Hakone Shrine", note: "車で移動、元箱根駐車場へ",
    rating: 4.4, reviews: 18984, hours: "24時間",
    desc: "杉の巨木に囲まれた荘厳な境内。芦ノ湖に浮かぶ平和の鳥居は必見の撮影スポット。",
    lat: 35.2048, lng: 139.0254, color: "#E74C3C",
    tags: ["パワスポ", "鳥居", "写真映え"], drive: "車 10分",
    images: ["/images/shrine_1.jpg", "/images/shrine_2.jpg", "/images/shrine_3.jpg"],
    url: "https://hakonejinja.or.jp/",
  },
  {
    id: 2, time: "13:00", end: "14:15", icon: "food", label: "深生そば",
    sub: "Shinshō Soba", note: "箱根神社からすぐ。水曜定休注意！",
    rating: 3.9, reviews: 1051, hours: "11:00–15:00",
    desc: "元箱根の人気蕎麦店。大きな海老天ぷらが名物。2階からの芦ノ湖ビューも◎",
    lat: 35.2012, lng: 139.0311, color: "#E67E22",
    tags: ["蕎麦", "天ぷら", "湖ビュー"], drive: "車 3分",
    images: ["/images/soba_1.jpg", "/images/soba_2.jpg"],
    url: "https://shinshou-soba.com/",
  },
  {
    id: 3, time: "14:30", end: "16:15", icon: "mountain", label: "大涌谷",
    sub: "Owakudani", note: "車で直接アクセス。黒たまご必食",
    rating: 4.4, reviews: 5652, hours: "9:00–16:20",
    desc: "噴煙が立ち上る火山活動を間近で体感。名物の黒たまごは寿命7年延長の言い伝え。晴れなら富士山も。",
    lat: 35.2430, lng: 139.0216, color: "#8E44AD",
    tags: ["火山", "黒たまご", "富士山"], drive: "車 25分",
    images: ["/images/owakudani_1.jpg", "/images/owakudani_2.jpg", "/images/owakudani_3.jpg"],
    url: "https://owakudani.com/",
  },
  {
    id: 4, time: "16:30", end: "18:45", icon: "onsen", label: "箱根湯寮",
    sub: "Hakone Yuryo", note: "大涌谷から箱根湯本方面へ戻る",
    rating: 4.3, reviews: 5364, hours: "10:00–20:00",
    desc: "森に囲まれた露天風呂とサウナで極上の「ととのい」体験。旅の締めくくりに最高。",
    lat: 35.2339, lng: 139.0957, color: "#2980B9",
    tags: ["サウナ", "露天風呂", "ととのい"], drive: "車 20分",
    images: ["/images/yuryo_1.jpg", "/images/yuryo_2.jpg", "/images/yuryo_3.jpg"],
    url: "https://www.hakoneyuryo.jp/",
  },
];

/* ── Map ── */
function Map({ spots, active, onTap, visible }) {
  const el = useRef(null);
  const map = useRef(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (window.L) { setOk(true); return; }
    const c = document.createElement("link");
    c.rel = "stylesheet"; c.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(c);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    s.onload = () => setOk(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!ok || !el.current || map.current) return;
    const L = window.L;
    const m = L.map(el.current, { zoomControl: false, attributionControl: false }).setView([35.215, 139.05], 13);
    L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", { maxZoom: 18 }).addTo(m);
    L.control.zoom({ position: "topright" }).addTo(m);

    const coords = spots.map(s => [s.lat, s.lng]);
    L.polyline(coords, { color: "#000", weight: 7, opacity: 0.06, lineCap: "round", lineJoin: "round" }).addTo(m);
    L.polyline(coords, { color: "#E74C3C", weight: 3, opacity: 0.8, lineCap: "round", lineJoin: "round" }).addTo(m);

    spots.forEach((s, i) => {
      const icon = L.divIcon({
        className: "", iconSize: [0, 0], iconAnchor: [0, 40],
        html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translateX(-50%)">
          <div id="mb${i}" style="background:rgba(255,255,255,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#333;padding:4px 10px;border-radius:10px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 12px rgba(0,0,0,.18);border:2px solid ${s.color};transition:all .3s;font-family:'Noto Sans JP',sans-serif;display:flex;align-items:center;gap:3px">
            ${MARKER_SVG[s.icon] || ""}<span>${s.label}</span>
          </div>
          <div id="ma${i}" style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid rgba(255,255,255,.92);filter:drop-shadow(0 1px 2px rgba(0,0,0,.1));transition:all .3s"></div>
        </div>`,
      });
      L.marker([s.lat, s.lng], { icon }).addTo(m).on("click", () => onTap(i));
    });

    m.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 14 });
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, [ok]);

  useEffect(() => {
    if (!map.current) return;
    spots.forEach((s, i) => {
      const b = document.getElementById(`mb${i}`);
      const a = document.getElementById(`ma${i}`);
      if (!b || !a) return;
      const on = active === i;
      b.style.background = on ? s.color : "rgba(255,255,255,.92)";
      b.style.color = on ? "#fff" : "#333";
      b.style.transform = on ? "scale(1.15)" : "scale(1)";
      b.style.boxShadow = on ? `0 4px 20px ${s.color}66` : "0 2px 12px rgba(0,0,0,.18)";
      a.style.borderTopColor = on ? s.color : "rgba(255,255,255,.92)";
    });
    if (active != null) {
      map.current.flyTo([spots[active].lat, spots[active].lng], 14, { duration: 0.5 });
    }
  }, [active]);

  useEffect(() => {
    if (visible && map.current) {
      setTimeout(() => map.current.invalidateSize(), 350);
    }
  }, [visible]);

  return (
    <div ref={el} style={{ width: "100%", height: "100%" }}>
      {!ok && <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e8e4de", color: "#999", fontSize: 13 }}>読み込み中...</div>}
    </div>
  );
}

/* ── Image Slider ── */
function ImageSlider({ images, color, hero }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const wrapRef = useRef(null);
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
    <div ref={wrapRef} data-imgslider="true" style={{ position: "relative", borderRadius: radius, overflow: "hidden", marginBottom: hero ? 0 : 12, flexShrink: 0, margin: hero ? 0 : "0 -20px 12px", WebkitTransform: "translateZ(0)" }}>
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
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

/* ── Glass Card ── */
function Card({ s, isCurrent, onTap, onFocus }) {
  return (
    <div onClick={onFocus} style={{ cursor: "pointer",
      background: "rgba(255,255,255,0.72)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRadius: 22, padding: "0 20px 16px",
      border: "1px solid rgba(255,255,255,0.5)",
      boxShadow: isCurrent
        ? `0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)`
        : `0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.4)`,
      height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 0.3s, transform 0.3s",
      transform: isCurrent ? "scale(1)" : "scale(0.96)",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, borderRadius: "0 0 3px 3px", background: s.color, opacity: 0.6 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, marginTop: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: `rgba(${s.color === "#C0392B" ? "192,57,43" : s.color === "#E74C3C" ? "231,76,60" : s.color === "#E67E22" ? "230,126,34" : s.color === "#8E44AD" ? "142,68,173" : "41,128,185"},0.12)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><SpotIcon icon={s.icon} size={22} color={s.color} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Noto Serif JP',serif", lineHeight: 1.2 }}>{s.label}</div>
          <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{s.sub}</div>
        </div>
        <div style={{
          background: `rgba(${s.color === "#C0392B" ? "192,57,43" : s.color === "#E74C3C" ? "231,76,60" : s.color === "#E67E22" ? "230,126,34" : s.color === "#8E44AD" ? "142,68,173" : "41,128,185"},0.1)`,
          borderRadius: 12, padding: "6px 12px", textAlign: "center",
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.time}</div>
          <div style={{ fontSize: 9, color: "#aaa", marginTop: 2 }}>– {s.end}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, margin: 0, flex: 1 }}>{s.desc}</p>

      <div onClick={(e) => { e.stopPropagation(); onTap(); }} style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 4, marginTop: 12, padding: "8px 0 2px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        fontSize: 12, fontWeight: 600, color: s.color,
      }}>
        詳細を見る
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

/* ── Swipeable Detail Wrapper ── */
function SwipeableDetail({ active, setActive, spots }) {
  const containerRef = useRef(null);
  const touch = useRef({ x: 0, y: 0, locked: false, isImg: false });
  const [drag, setDrag] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e) => {
      if (transitioning) return;
      let target = e.target;
      while (target && target !== el) {
        if (target.dataset && target.dataset.imgslider) { touch.current.isImg = true; return; }
        target = target.parentElement;
      }
      touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: false, isImg: false };
    };

    const onMove = (e) => {
      if (touch.current.isImg || transitioning) return;
      const dx = e.touches[0].clientX - touch.current.x;
      const dy = e.touches[0].clientY - touch.current.y;
      if (!touch.current.locked) {
        if (Math.abs(dy) > Math.abs(dx)) { touch.current.isImg = true; return; }
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
    if (touch.current.isImg) { touch.current.isImg = false; return; }
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
        {spots.map((sp) => (
          <div key={sp.id} style={{
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

/* ── Full Detail Content ── */
function DetailContent({ s }) {
  const colorRgb = s.color === "#C0392B" ? "192,57,43" : s.color === "#E74C3C" ? "231,76,60" : s.color === "#E67E22" ? "230,126,34" : s.color === "#8E44AD" ? "142,68,173" : "41,128,185";

  return (
    <div>
      {/* Hero image slider */}
      {s.images && s.images.length > 0 && (
        <ImageSlider images={s.images} color={s.color} hero />
      )}

      <div style={{ padding: "16px 20px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: `rgba(${colorRgb},0.12)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><SpotIcon icon={s.icon} size={26} color={s.color} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", fontFamily: "'Noto Serif JP',serif", lineHeight: 1.2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{s.sub}</div>
            {s.url && (
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 10, color: s.color, textDecoration: "none", marginTop: 2,
                display: "inline-flex", alignItems: "center", gap: 3,
              }}>
                🔗 {s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
          <div style={{
            background: `rgba(${colorRgb},0.1)`,
            borderRadius: 14, padding: "8px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.time}</div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>– {s.end}</div>
          </div>
        </div>

        {/* Drive */}
        {s.drive && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.04)", borderRadius: 10,
            padding: "5px 12px", fontSize: 12, color: "#888",
            marginBottom: 12,
          }}>🚗 {s.drive}</div>
        )}

        {/* Note */}
        <div style={{
          background: "rgba(255,255,255,0.6)", borderRadius: 14,
          padding: "12px 16px", fontSize: 13, color: "#555",
          lineHeight: 1.7, marginBottom: 16,
          borderLeft: `4px solid ${s.color}66`,
        }}>📌 {s.note}</div>

        {/* Description */}
        <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: "0 0 16px" }}>{s.desc}</p>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {s.tags.map(t => (
            <span key={t} style={{
              fontSize: 11, padding: "5px 14px", borderRadius: 20,
              background: "rgba(255,255,255,0.7)",
              border: `1px solid ${s.color}30`,
              color: s.color, fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>

        {/* Rating */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 12, color: "#999",
          background: "rgba(255,255,255,0.5)", borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "#F39C12", fontSize: 14 }}>{"★".repeat(Math.floor(s.rating))}{s.rating % 1 >= 0.3 ? "☆" : ""}</span>
            <span style={{ fontWeight: 600, color: "#666" }}>{s.rating}</span>
            <span style={{ color: "#bbb" }}>({s.reviews.toLocaleString()}件)</span>
          </div>
          <span>🕐 {s.hours}</span>
        </div>

        {/* Google Maps link */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "rgba(255,255,255,0.7)", borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "10px 14px", fontSize: 12, fontWeight: 600,
            color: "#555", textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            marginBottom: 16,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Google マップで開く
        </a>

      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [active, setActive] = useState(0);
  const [mapOpen, setMapOpen] = useState(true);
  const scrollRef = useRef(null);
  const lock = useRef(false);

  const MAP_H = "45vh";

  const onScroll = useCallback(() => {
    if (lock.current) return;
    const el = scrollRef.current; if (!el) return;
    const cw = el.scrollWidth / SPOTS.length;
    const idx = Math.round(el.scrollLeft / cw);
    setActive(Math.max(0, Math.min(SPOTS.length - 1, idx)));
  }, []);

  const goTo = useCallback((i) => {
    setActive(i);
    if (!mapOpen) return;
    const el = scrollRef.current; if (!el) return;
    lock.current = true;
    const cw = el.scrollWidth / SPOTS.length;
    el.scrollTo({ left: cw * i, behavior: "smooth" });
    setTimeout(() => { lock.current = false; }, 600);
  }, [mapOpen]);

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

      {/* ── Map Panel (slides down from top) ── */}
      <div style={{
        height: mapOpen ? MAP_H : 0,
        transition: "height 0.4s cubic-bezier(.32,.72,.32,1)",
        overflow: "hidden", flexShrink: 0,
        position: "relative",
      }}>
        <div style={{ height: MAP_H, position: "relative" }}>
          <Map spots={SPOTS} active={active} onTap={goTo} visible={mapOpen} />
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 20,
          background: "linear-gradient(to bottom, transparent, #f0ede8)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Header ── */}
      <div style={{
        padding: mapOpen ? "10px 20px 6px" : "16px 20px 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, transition: "padding 0.3s",
      }}>
        <div>
          <div style={{ fontSize: mapOpen ? 16 : 20, fontWeight: 700, fontFamily: "'Noto Serif JP',serif", color: "#1a1a1a", transition: "font-size 0.3s" }}>箱根一日旅</div>
          <div style={{ fontSize: 9, color: "#999", letterSpacing: 3, marginTop: 2 }}>HAKONE DAY TRIP</div>
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
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
              <path d="M15 5.764v15" /><path d="M9 3.236v15" />
            </svg>
            地図
          </button>
        )}
      </div>

      {mapOpen ? (
        <>
          {/* ── Card Carousel (map mode) ── */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            style={{
              flex: 1, display: "flex",
              overflowX: "auto", scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              padding: "0 0 70px",
              minHeight: 0,
            }}
          >
            {SPOTS.map((sp, i) => (
              <div key={sp.id} style={{
                flex: "0 0 84%",
                scrollSnapAlign: "center",
                padding: "0 6px",
                boxSizing: "border-box",
                ...(i === 0 ? { marginLeft: "8%" } : {}),
                ...(i === SPOTS.length - 1 ? { marginRight: "8%" } : {}),
              }}>
                <Card s={sp} isCurrent={i === active} onTap={() => setMapOpen(false)} onFocus={() => goTo(i)} />
              </div>
            ))}
          </div>

          {/* ── Bottom dots (map mode) ── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
            padding: "16px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
            background: "linear-gradient(to bottom, rgba(240,237,232,0), rgba(240,237,232,1) 30%)",
            zIndex: 50,
          }}>
            {SPOTS.map((sp, i) => (
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
        /* ── Full Detail View (map closed) ── */
        <>
          <SwipeableDetail active={active} setActive={setActive} spots={SPOTS} />
          {/* Bottom dots */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
            padding: "16px 20px calc(env(safe-area-inset-bottom, 0px) + 16px)",
            background: "linear-gradient(to bottom, rgba(240,237,232,0), rgba(240,237,232,1) 30%)",
            zIndex: 50,
          }}>
            {SPOTS.map((sp, i) => (
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
    </div>
  );
}
