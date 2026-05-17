import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { TripSchema, type Trip } from "@/types/trip";

const INTEREST_OPTIONS = ["温泉", "神社", "美術", "グルメ", "絶景", "ショッピング"];
const DURATIONS = ["日帰り", "1泊2日", "2泊3日", "3泊以上"];
const TRANSPORTS = ["電車", "車", "徒歩"];
const PACES = ["ゆったり", "標準", "詰込"] as const;
type Pace = (typeof PACES)[number];

type Stage = "form" | "generating" | "done" | "error";

export function NewTripPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const themeHint = params.get("theme") ?? "";

  const [destination, setDestination] = useState(themeHint);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [transport, setTransport] = useState(TRANSPORTS[1]);
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState<Pace>("標準");
  const [freeText, setFreeText] = useState("");

  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  const toggleInterest = (t: string) => {
    setInterests((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setStage("generating");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ destination, duration, transport, interests, pace, freeText }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? `HTTP ${res.status}`);
        setStage("error");
        return;
      }
      const parsed = TripSchema.safeParse(body.trip);
      if (!parsed.success) {
        setError("生成された旅程の形式が想定外でした");
        setStage("error");
        return;
      }
      setTrip(parsed.data);
      setStage("done");
    } catch (err) {
      setError((err as Error).message);
      setStage("error");
    }
  };

  return (
    <div style={{
      minHeight: "100dvh",
      maxWidth: 480, margin: "0 auto",
      background: "var(--bg)",
      color: "var(--fg)",
      display: "flex", flexDirection: "column",
      paddingTop: "env(safe-area-inset-top, 0px)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 18px",
      }}>
        <button onClick={() => navigate(-1)} aria-label="戻る" style={iconBtn}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "var(--fg-muted)", fontWeight: 600 }}>NEW TRIP</div>
          <div style={{
            fontSize: 18, fontWeight: 700,
            fontFamily: "'Noto Serif JP',serif",
          }}>プランを作る</div>
        </div>
      </div>

      {stage === "form" && (
        <form onSubmit={submit} style={{
          padding: "12px 22px 60px",
          display: "flex", flexDirection: "column", gap: 22,
        }}>
          <Field label="どこへ?">
            <input
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="箱根 / 京都 / 沖縄など"
              style={inputStyle}
            />
          </Field>

          <Field label="期間">
            <SegmentedPicker options={DURATIONS} value={duration} onChange={setDuration} />
          </Field>

          <Field label="移動手段">
            <SegmentedPicker options={TRANSPORTS} value={transport} onChange={setTransport} />
          </Field>

          <Field label="興味">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTEREST_OPTIONS.map((t) => {
                const on = interests.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleInterest(t)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: `1px solid ${on ? "var(--fg)" : "rgba(0,0,0,0.1)"}`,
                      background: on ? "var(--fg)" : "var(--bg-card)",
                      color: on ? "var(--bg)" : "var(--fg)",
                      fontSize: 13, fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="ペース">
            <SegmentedPicker options={PACES as unknown as string[]} value={pace} onChange={(v) => setPace(v as Pace)} />
          </Field>

          <Field label="自由欄 (任意)">
            <textarea
              rows={3}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="例: 雨でも楽しめる / 子連れ / 朝が苦手"
              style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical" }}
            />
          </Field>

          <button
            type="submit"
            style={{
              marginTop: 12,
              background: "var(--fg)",
              color: "var(--bg)",
              border: "none",
              padding: "16px",
              borderRadius: 999,
              fontSize: 15, fontWeight: 700,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Sparkles size={16} />
            プランを作ってもらう
          </button>
        </form>
      )}

      {stage === "generating" && <Generating />}

      {stage === "done" && trip && (
        <div style={{ padding: "0 24px 60px" }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 20,
            padding: 22,
          }}>
            <div style={{ fontSize: 10, color: "var(--fg-muted)", letterSpacing: 3, fontWeight: 600 }}>READY</div>
            <div style={{
              fontSize: 22, fontWeight: 700,
              fontFamily: "'Noto Serif JP',serif",
              marginTop: 6,
            }}>{trip.title}</div>
            <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 4, letterSpacing: 2 }}>
              {trip.subtitle}
            </div>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 14, lineHeight: 1.7 }}>
              {trip.days.length}日 / {trip.days.reduce((s, d) => s + d.spots.length, 0)} スポット 生成完了。
              保存して詳細を見ましょう。
            </div>
          </div>

          <button
            onClick={() => {
              // Phase 1 完成時に: trip_id があれば /trip/:id へ。ここではサンプル表示
              navigate("/trip/preview", { state: { trip } });
            }}
            style={{
              marginTop: 18,
              background: "var(--fg)",
              color: "var(--bg)",
              border: "none",
              padding: "14px",
              borderRadius: 999,
              fontSize: 15, fontWeight: 700,
              cursor: "pointer", width: "100%",
            }}
          >
            プレビューを開く
          </button>
        </div>
      )}

      {stage === "error" && (
        <div style={{ padding: "0 24px 60px" }}>
          <div style={{
            background: "rgba(231, 76, 60, 0.08)",
            border: "1px solid rgba(231, 76, 60, 0.2)",
            borderRadius: 18,
            padding: 18,
            color: "#C0392B",
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>⚠ うまく生成できませんでした</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>{error ?? "原因不明"}</div>
          </div>
          <button
            onClick={() => setStage("form")}
            style={{
              marginTop: 18,
              background: "var(--bg-card)",
              color: "var(--fg)",
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "12px",
              borderRadius: 999,
              fontSize: 14, fontWeight: 600,
              cursor: "pointer", width: "100%",
            }}
          >
            もう一度試す
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 11, color: "var(--fg-muted)",
        letterSpacing: 1, fontWeight: 600,
        marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
}

function SegmentedPicker({
  options, value, onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{
      display: "flex", gap: 6,
      flexWrap: "wrap",
    }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            style={{
              padding: "9px 16px",
              borderRadius: 12,
              border: `1px solid ${on ? "var(--fg)" : "rgba(0,0,0,0.1)"}`,
              background: on ? "var(--fg)" : "var(--bg-card)",
              color: on ? "var(--bg)" : "var(--fg)",
              fontSize: 13, fontWeight: 600,
              cursor: "pointer",
            }}
          >{o}</button>
        );
      })}
    </div>
  );
}

function Generating() {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 32px", gap: 18,
    }}>
      <div className="pulse-dot" style={{
        width: 64, height: 64, borderRadius: 999,
        background: "radial-gradient(circle, var(--hero-base) 0%, var(--hero-highlight) 100%)",
        filter: "blur(2px)",
      }} />
      <div style={{
        fontSize: 18, fontWeight: 700,
        fontFamily: "'Noto Serif JP',serif",
      }}>旅程を考えています…</div>
      <div style={{ fontSize: 12, color: "var(--fg-muted)", textAlign: "center", lineHeight: 1.7 }}>
        AI が条件に合う観光地を選び、所要時間と移動経路を組み立てています。<br />
        30 秒ほどお待ちください。
      </div>
      <style>{`
        @keyframes pulse-soft {
          0%,100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .pulse-dot { animation: pulse-soft 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 12, width: 38, height: 38,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
  color: "var(--fg)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 14,
  padding: "13px 16px",
  fontSize: 15,
  outline: "none",
  color: "var(--fg)",
  fontFamily: "inherit",
};
