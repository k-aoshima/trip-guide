import { Home, Library, Compass, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

type Tab = {
  to: string;
  label: string;
  icon: typeof Home;
  match?: (path: string) => boolean;
};

const TABS: Tab[] = [
  { to: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { to: "/library", label: "Library", icon: Library },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomTabBar() {
  const navigate = useNavigate();
  const loc = useLocation();

  return (
    <div style={{
      position: "fixed",
      bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
      left: 0, right: 0,
      display: "flex", justifyContent: "center",
      pointerEvents: "none",
      zIndex: 80,
    }}>
      <div style={{
        pointerEvents: "auto",
        display: "flex", alignItems: "center", gap: 4,
        background: "var(--bg-elev)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 999,
        padding: 6,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
      }}>
        {TABS.slice(0, 2).map((t) => (
          <TabButton key={t.to} tab={t} active={t.match ? t.match(loc.pathname) : loc.pathname.startsWith(t.to)} onClick={() => navigate(t.to)} />
        ))}

        <button
          onClick={() => navigate("/new")}
          style={{
            width: 50, height: 50, borderRadius: 999,
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            margin: "0 4px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        {TABS.slice(2).map((t) => (
          <TabButton key={t.to} tab={t} active={t.match ? t.match(loc.pathname) : loc.pathname.startsWith(t.to)} onClick={() => navigate(t.to)} />
        ))}
      </div>
    </div>
  );
}

function TabButton({ tab, active, onClick }: { tab: Tab; active: boolean; onClick: () => void }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      aria-label={tab.label}
      style={{
        width: 50, height: 50, borderRadius: 999,
        background: "transparent",
        border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        color: active ? "var(--fg)" : "var(--fg-muted)",
        transition: "color 0.2s",
      }}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </button>
  );
}
