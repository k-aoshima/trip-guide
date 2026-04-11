import { useState, useEffect, useRef, useCallback } from "react";

const SPOTS = [
  {
    id: 0, time: "9:00", end: "10:00", icon: "⛩", label: "箱根関所 旅物語館",
    sub: "Hakone Sekisho Tabimonogatarikan", note: "箱根町港駐車場に停めてここから徒歩",
    rating: 3.9, reviews: 7545, hours: "9:00–16:30",
    desc: "江戸時代の関所を復元。芦ノ湖を望む絶景ポイントでもあり、歴史と景色を同時に楽しめます。",
    lat: 35.1914, lng: 139.0265, color: "#C0392B",
    tags: ["歴史", "絶景", "徒歩圏内"], drive: null,
    images: ["/images/sekisho_1.jpg", "/images/sekisho_2.jpg", "/images/sekisho_3.jpg"],
    url: "https://www.shizutetsu-retailing.com/hakone/",
  },
  {
    id: 1, time: "10:15", end: "11:45", icon: "⛩", label: "箱根神社",
    sub: "Hakone Shrine", note: "車で移動、元箱根駐車場へ",
    rating: 4.4, reviews: 18984, hours: "24時間",
    desc: "杉の巨木に囲まれた荘厳な境内。芦ノ湖に浮かぶ平和の鳥居は必見の撮影スポット。",
    lat: 35.2048, lng: 139.0254, color: "#E74C3C",
    tags: ["パワスポ", "鳥居", "写真映え"], drive: "車 10分",
    images: ["/images/shrine_1.jpg", "/images/shrine_2.jpg", "/images/shrine_3.jpg"],
    url: "https://hakonejinja.or.jp/",
  },
  {
    id: 2, time: "12:00", end: "13:15", icon: "🍜", label: "深生そば",
    sub: "Shinshō Soba", note: "箱根神社からすぐ。水曜定休注意！",
    rating: 3.9, reviews: 1051, hours: "11:00–15:00",
    desc: "元箱根の人気蕎麦店。大きな海老天ぷらが名物。2階からの芦ノ湖ビューも◎",
    lat: 35.2012, lng: 139.0311, color: "#E67E22",
    tags: ["蕎麦", "天ぷら", "湖ビュー"], drive: "車 3分",
    images: ["/images/soba_1.jpg", "/images/soba_2.jpg"],
    url: "https://shinshou-soba.com/",
  },
  {
    id: 3, time: "13:30", end: "15:15", icon: "🌋", label: "大涌谷",
    sub: "Owakudani", note: "車で直接アクセス。黒たまご必食",
    rating: 4.4, reviews: 5652, hours: "9:00–16:20",
    desc: "噴煙が立ち上る火山活動を間近で体感。名物の黒たまごは寿命7年延長の言い伝え。晴れなら富士山も。",
    lat: 35.2430, lng: 139.0216, color: "#8E44AD",
    tags: ["火山", "黒たまご", "富士山"], drive: "車 25分",
    images: ["/images/owakudani_1.jpg", "/images/owakudani_2.jpg", "/images/owakudani_3.jpg"],
    url: "https://owakudani.com/",
  },
  {
    id: 4, time: "15:30", end: "17:45", icon: "🔥", label: "箱根湯寮",
    sub: "Hakone Yuryo", note: "大涌谷から箱根湯本方面へ戻る",
    rating: 4.3, reviews: 5364, hours: "10:00–20:00",
    desc: "森に囲まれた露天風呂とサウナで極上の「ととのい」体験。旅の締めくくりに最高。",
    lat: 35.2339, lng: 139.0957, color: "#2980B9",
    tags: ["サウナ", "露天風呂", "ととのい"], drive: "車 20分",
    images: ["/images/yuryo_1.jpg", "/images/yuryo_2.jpg"],
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
            ${s.icon}<span>${s.label}</span>
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
    <div style={{ position: "relative", borderRadius: radius, overflow: "hidden", marginBottom: hero ? 0 : 12, flexShrink: 0, margin: hero ? 0 : "0 -20px 12px" }}>
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
          scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
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
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 5,
          padding: hero ? "20px 0 14px" : "12px 0 8px",
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))",
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
function Card({ s, isCurrent, onTap }) {
  return (
    <div onClick={onTap} style={{ cursor: "pointer",
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
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
        }}>{s.icon}</div>
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

      {s.drive && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "rgba(0,0,0,0.04)", borderRadius: 8,
          padding: "3px 10px", fontSize: 10, color: "#888",
          marginBottom: 8, alignSelf: "flex-start",
        }}>🚗 {s.drive}</div>
      )}

      <div style={{
        background: "rgba(0,0,0,0.03)", borderRadius: 12,
        padding: "9px 12px", fontSize: 12, color: "#555",
        lineHeight: 1.6, marginBottom: 10,
        borderLeft: `3px solid ${s.color}44`,
      }}>📌 {s.note}</div>

      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, margin: "0 0 10px", flex: 1 }}>{s.desc}</p>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
        {s.tags.map(t => (
          <span key={t} style={{
            fontSize: 10, padding: "3px 10px", borderRadius: 20,
            background: "rgba(255,255,255,0.6)",
            border: `1px solid ${s.color}30`,
            color: s.color, fontWeight: 600,
          }}>{t}</span>
        ))}
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 11, color: "#999",
        borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: "#F39C12", fontSize: 12 }}>{"★".repeat(Math.floor(s.rating))}{s.rating % 1 >= 0.3 ? "☆" : ""}</span>
          <span>{s.rating}</span>
          <span style={{ color: "#ccc" }}>({s.reviews.toLocaleString()})</span>
        </div>
        <span>🕐 {s.hours}</span>
      </div>
    </div>
  );
}

/* ── Swipeable Detail Wrapper ── */
function SwipeableDetail({ active, setActive, spots }) {
  const scrollRef = useRef(null);
  const lockRef = useRef(false);

  const onScroll = useCallback(() => {
    if (lockRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    if (w === 0) return;
    const idx = Math.round(el.scrollLeft / w);
    setActive(Math.max(0, Math.min(spots.length - 1, idx)));
  }, [spots.length, setActive]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    lockRef.current = true;
    el.scrollTo({ left: el.offsetWidth * active, behavior: "auto" });
    setTimeout(() => { lockRef.current = false; }, 100);
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      style={{
        flex: 1, display: "flex",
        overflowX: "auto", scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        minHeight: 0,
      }}
    >
      {spots.map((sp) => (
        <div key={sp.id} style={{
          flex: "0 0 100%", scrollSnapAlign: "start",
          overflowY: "auto", scrollbarWidth: "none",
        }}>
          <DetailContent s={sp} />
        </div>
      ))}
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
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>{s.icon}</div>
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

      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [active, setActive] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
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
        <button onClick={() => setMapOpen(!mapOpen)} style={{
          background: "none", border: "none", padding: 0,
          width: 32, height: 32,
          fontSize: 20, color: "#999", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.3s",
          transform: mapOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          ▾
        </button>
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
                <Card s={sp} isCurrent={i === active} onTap={() => setMapOpen(false)} />
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
