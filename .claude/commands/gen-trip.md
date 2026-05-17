---
description: TripSchema 形式の旅行プランを生成して fixtures/trips/ に保存する
argument-hint: <テーマ> <期間> [興味タグ ...]
---

# /gen-trip — 旅程 fixture を生成

引数 `$ARGUMENTS` から、`src/types/trip.ts` の `TripSchema` に完全準拠する旅程 JSON を作成し、`fixtures/trips/{slug}.json` に保存してください。

## 手順

1. `src/types/trip.ts` を読み、現在の `TripSchema`・`SpotSchema` を必ず確認する
2. 引数から slug (kebab-case の短い識別子) を決める。例: 「京都 1泊2日 寺メイン」→ `kyoto-temples-2days`
3. 既存の `fixtures/trips/hakone-day.json` と `fixtures/trips/hokkaido-2days.json` を参考に、構造を厳密に揃える
4. 完成した JSON を `fixtures/trips/{slug}.json` に Write する
5. 最後に `npm run validate:fixtures` を実行してスキーマ通過を確認する

## 必須要件

- 各 spot に `address` (Nominatim 用、都道府県 + 市区町村 + 番地) と `query` (検索キーワード、施設名そのまま) を必ず含める
- `lat`/`lng` は分かる範囲で正確に。曖昧な施設は出力しない (品質を落とすため)
- `time` は `HH:MM` 形式、昇順、同 day 内で重複なし
- `end` は `HH:MM` か `—` (チェックインなど終了未定の場合)
- `accent` と各 spot の `color` は `#RRGGBB` (大文字)
- `icon` は SpotIcon enum (`landmark` / `shrine` / `food` / `mountain` / `onsen` / `plane` / `hotel` / `tree` / `water` / `market`) のいずれか
- 1 day あたり 3〜8 spot、1 trip あたり 1〜7 day
- 移動先間の `drive` は徒歩 or 公共交通 or 車を判断して「車 約20分」「徒歩 5分」など人間が読む文字列で
- `desc` は 200 字以内、観光ガイドのトーンで親しみやすく
- `note` には地元の Tips・駐車場・営業注意点など実用情報を 80 字程度
- `tags` は 3〜4 個
- `hours`, `rating`, `reviews`, `url`, `images` は曖昧なら省略 (LLM ハルシ防止)
- 全フィールドの最大長は SpotSchema を超えないこと

## 役割

このコマンドは **本番 API (Claude Haiku 4.5) を消費せずに E2E 検証する経路**。fixture は `scripts/validate-fixtures.ts` で zod 検証され、Phase 1 以降 `scripts/seed.ts` で Supabase に投入されるサンプルデータとしても使われる。

引数: $ARGUMENTS
