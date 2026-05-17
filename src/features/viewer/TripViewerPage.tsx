import { useLocation, useNavigate, useParams } from "react-router";
import { TripViewer } from "./TripViewer";
import { SAMPLE_PLANS } from "@/data/sample-plans";
import type { Trip } from "@/types/trip";

/**
 * /trip/:id 用ラッパ。Phase 1.0 ではサンプルか location.state の trip にフォールバック。
 * Phase 1 完成時に /api/trips/:id から取得するよう書き換える。
 */
export function TripViewerPage() {
  const { id } = useParams();
  const loc = useLocation();
  const navigate = useNavigate();

  const stateTrip = (loc.state as { trip?: Trip } | null)?.trip;
  const plans: Trip[] = stateTrip
    ? [stateTrip]
    : SAMPLE_PLANS.filter((p) => !id || id === "sample" || p.id === id) ;

  if (plans.length === 0) {
    return (
      <div style={{ padding: 24, color: "var(--fg)", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontSize: 14, marginBottom: 16 }}>プランが見つかりません</div>
        <button onClick={() => navigate("/")} style={{
          background: "var(--fg)", color: "var(--bg)",
          border: "none", padding: "10px 16px",
          borderRadius: 999, fontWeight: 700, cursor: "pointer",
        }}>ホームへ</button>
      </div>
    );
  }

  return <TripViewer plans={plans} />;
}
