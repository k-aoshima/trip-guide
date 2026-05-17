# CLAUDE.md — trip-guide プロジェクトメモ

## 概要

旅のしおり (Trip Itinerary) アプリ。React 19 + Vite 8 + TypeScript の SPA。Phase 0 でハードコードビューアから汎用旅行プランナーへの土台整備を完了。Phase 1 以降で LLM 生成・Supabase 永続化・サインインを段階導入する。

完全な進化計画: `/Users/kosuke/.claude/plans/claude-code-api-delegated-wall.md`

## ディレクトリ構成

```
src/
├─ data/sample-plans.ts        # 起動時に fixtures から読み込むサンプル
├─ features/viewer/            # 既存しおりビュー (Map / Card / Detail / DayTabs / PlanMenu)
├─ lib/hexToRgb.ts             # hex → "r,g,b" ヘルパ
├─ types/trip.ts               # zod TripSchema / SpotSchema (Single Source of Truth)
├─ routes.tsx                  # react-router 7 ルート定義
├─ main.tsx                    # エントリ (QueryClientProvider + RouterProvider)
└─ index.css                   # CSS 変数によるデザイントークン

fixtures/trips/                # /gen-trip スラッシュコマンドで増やす
├─ hakone-day.json
└─ hokkaido-2days.json

scripts/
└─ validate-fixtures.ts        # zod による fixture 検証 CLI

.claude/commands/gen-trip.md   # Claude Code テストパス用スラッシュコマンド
```

## スクリプト

| コマンド | 役割 |
|---|---|
| `npm run dev` | Vite 開発サーバ (http://localhost:5173) |
| `npm run build` | TypeScript 型チェック + Vite 本番ビルド |
| `npm run type-check` | 型チェックのみ |
| `npm run lint` | ESLint (JS + TS) |
| `npm run validate:fixtures` | fixtures/trips/*.json を TripSchema で検証 |

## データの流れ (Phase 0)

```
fixtures/trips/*.json   ← 正本データ (JSON, /gen-trip で増やす)
        │ import (JSON module, Vite native)
        ▼
src/data/sample-plans.ts   ← TripSchema.parse() で型保証
        │
        ▼
src/routes.tsx → TripViewer  ← 既存 UI で表示
```

Phase 1 では `/api/generate` で LLM が同じ TripSchema を返し、Supabase の `trips` テーブルに JSONB 保存する。

## TripSchema の不変条件

- `lat` / `lng` は **Phase 1 以降サーバが Nominatim で埋める**。LLM には出させない (ハルシ防止)
- `address` / `query` は Phase 1 で必須化、現在は optional
- `time` は HH:MM、day 内で昇順かつ重複なし
- `accent` / `color` は `#RRGGBB`
- `icon` は 10 種類の enum (icons.tsx の `ICON_MAP` と完全一致)

## 設計トーン

- **viewer (既存しおり)**: 暖色 `#F0EDE8` + glass card、`Noto Serif JP` 見出し
- **home/list (Phase 1+)**: 白基調 + Huxe 風抽象モーションアートヒーロー
- 両方の design token は `src/index.css` の CSS 変数で定義済 (`--viewer-bg` vs `--bg`)

## Claude Code テストパス

API クレジットを消費せずに E2E 検証するための経路:

1. `/gen-trip <テーマ> <期間> [興味タグ]` で fixture JSON を生成
2. `npm run validate:fixtures` で zod 検証
3. dev サーバを再起動して即時反映 (Vite HMR でも可)
4. Phase 1 以降は `scripts/seed.ts` で Supabase にも投入

本番では `DEV_FIXTURE_MODE` を未設定にして dev エンドポイントを無効化する。

## デプロイ

- Vercel (`vercel.json`)
- 環境変数は `.env.example` に列挙、`.env.local` で実値を保持
- 本番デプロイ時、`ANTHROPIC_API_KEY` ほかは Vercel ダッシュボードに Secret 登録
