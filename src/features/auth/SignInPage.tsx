import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // Phase 1 で Supabase Auth に置換
  const onMagic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };
  const onGoogle = () => {
    alert("Phase 1 完了時に Supabase Auth Google OAuth を有効化します");
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--bg)",
      color: "var(--fg)",
      maxWidth: 480, margin: "0 auto",
      display: "flex", flexDirection: "column",
      paddingTop: "env(safe-area-inset-top, 0px)",
    }}>
      <div style={{ padding: "14px 18px" }}>
        <button
          onClick={() => navigate(-1)}
          aria-label="戻る"
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 12, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--fg)",
          }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div style={{ padding: "40px 28px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontSize: 12, color: "var(--fg-muted)",
          letterSpacing: 3, fontWeight: 600,
        }}>SIGN IN</div>
        <h1 style={{
          fontSize: 32, fontWeight: 600,
          fontFamily: "'Fraunces','Noto Serif JP',serif",
          marginTop: 12, marginBottom: 12,
          lineHeight: 1.1,
          letterSpacing: -0.5,
        }}>
          旅のしおりを<br />あなたのものに
        </h1>
        <p style={{
          fontSize: 14, color: "var(--fg-muted)",
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          サインインすると、AI が作る旅程を保存・編集・共有できます。共有された旅程はサインインなしで誰でも見られます。
        </p>

        {sent ? (
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 18,
            padding: "20px 18px",
            fontSize: 14, lineHeight: 1.7,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>📬 リンクを送信しました</div>
            <div style={{ color: "var(--fg-muted)" }}>
              {email} 宛のメールに記載のリンクをタップしてサインインを完了してください。
            </div>
          </div>
        ) : (
          <form onSubmit={onMagic} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ fontSize: 12, color: "var(--fg-muted)", fontWeight: 600 }}>メールアドレス</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 14,
                padding: "14px 16px",
                fontSize: 15,
                outline: "none",
                color: "var(--fg)",
              }}
            />
            <button
              type="submit"
              style={{
                marginTop: 8,
                background: "var(--fg)",
                color: "var(--bg)",
                border: "none",
                borderRadius: 999,
                padding: "14px",
                fontSize: 15, fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Mail size={16} />
              メールでリンクを受け取る
            </button>
          </form>
        )}

        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          margin: "28px 0",
          fontSize: 11, color: "var(--fg-muted)",
          letterSpacing: 1,
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          OR
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        </div>

        <button
          onClick={onGoogle}
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 999,
            padding: "13px",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer",
            color: "var(--fg)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          <GoogleG />
          Google で続ける
        </button>

        <div style={{
          marginTop: "auto",
          padding: "30px 0 24px",
          fontSize: 11, color: "var(--fg-muted)",
          textAlign: "center", lineHeight: 1.7,
        }}>
          サインインすることで、利用規約・プライバシーポリシーに同意したものとみなします
        </div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.5l-6.6-5.6C29.6 34.4 26.9 35 24 35c-5.3 0-9.7-3.3-11.3-8L6 31.5C9.3 38.4 16 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.6 5.6C41.4 36 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}
