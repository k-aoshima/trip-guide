import { useLocation, useNavigate, useParams } from "react-router";
import { TripViewer } from "./TripViewer";
import { SAMPLE_PLANS } from "@/data/sample-plans";
import type { Trip } from "@/types/trip";

/**
 * /trip/:id 用ラッパ。
 * - location.state.trip があればそれを優先 (新規生成プレビュー時)
 * - そうでなければ :id でサンプルを検索
 * - 見つからなければ NotFound
 *
 * Phase 1 完成時に /api/trips/:id から fetch するよう書き換える。
 */
export function TripViewerPage() {
  const { id } = useParams();
  const loc = useLocation();
  const navigate = useNavigate();

  const stateTrip = (loc.state as { trip?: Trip } | null)?.trip;

  let plan: Trip | undefined = stateTrip;
  if (!plan) {
    plan = SAMPLE_PLANS.find((p) => p.id === id) ?? (id === "sample" ? SAMPLE_PLANS[0] : undefined);
  }

  if (!plan) {
    return (
      <div style={{
        minHeight: "100dvh",
        maxWidth: 480, margin: "0 auto",
        background: "var(--bg)", color: "var(--fg)",
        padding: "60px 24px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18,
      }}>
        <div style={{ fontSize: 60, opacity: 0.4 }}>🗺️</div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          fontFamily: "'Noto Serif JP',serif",
        }}>プランが見つかりません</div>
        <div style={{ fontSize: 13, color: "var(--fg-muted)", textAlign: "center" }}>
          このプランは削除されたか、まだ作成されていません。
        </div>
        <button onClick={() => navigate("/")} style={{
          marginTop: 16,
          background: "var(--fg)", color: "var(--bg)",
          border: "none", padding: "12px 28px",
          borderRadius: 999, fontSize: 14, fontWeight: 700,
          cursor: "pointer",
        }}>ホームへ戻る</button>
      </div>
    );
  }

  return <TripViewer plan={plan} />;
}
