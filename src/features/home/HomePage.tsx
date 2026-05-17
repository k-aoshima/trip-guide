import { useNavigate } from "react-router";
import { HeroCard } from "./HeroCard";
import { SuggestionRow, type Suggestion } from "./SuggestionRow";
import { PlanCard } from "./PlanCard";
import { BottomTabBar } from "./BottomTabBar";
import { SAMPLE_PLANS } from "@/data/sample-plans";

export function HomePage() {
  const navigate = useNavigate();
  const displayName = "ゲスト"; // Phase 1 で auth から取得

  const handleSuggestion = (s: Suggestion) => {
    navigate(`/new?theme=${encodeURIComponent(s.title)}`);
  };

  return (
    <div style={{
      maxWidth: 480, margin: "0 auto",
      minHeight: "100dvh",
      background: "var(--bg)",
      color: "var(--fg)",
      fontFamily: "'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <HeroCard
        displayName={displayName}
        savedCount={SAMPLE_PLANS.length}
        onMenu={() => navigate("/profile")}
        onCreate={() => navigate("/new")}
      />

      <SuggestionRow onSelect={handleSuggestion} />

      <div style={{ padding: "20px 20px 4px" }}>
        <div style={{
          fontSize: 11, color: "var(--fg-muted)",
          letterSpacing: 2, fontWeight: 600,
        }}>YOUR PLANS</div>
        <div style={{
          fontSize: 18, fontWeight: 700,
          marginTop: 6,
          fontFamily: "'Noto Serif JP',serif",
          color: "var(--fg)",
        }}>保存したプラン</div>
      </div>

      <div style={{
        padding: "12px 20px",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {SAMPLE_PLANS.map((p) => (
          <PlanCard
            key={p.id ?? p.title}
            plan={p}
            onClick={() => navigate(`/trip/${p.id ?? "sample"}`)}
          />
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}
