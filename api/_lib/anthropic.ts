import Anthropic from "@anthropic-ai/sdk";
import { env, requireEnv } from "./env";
import { TripSchema, type Trip } from "../../src/types/trip";

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (_client) return _client;
  _client = new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") });
  return _client;
}

const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `あなたは日本国内に詳しい旅行プランナー AI です。
ユーザのテーマ・期間・興味から、TripSchema に準拠する旅程 JSON を返します。

# 厳守ルール
- generate_trip ツールを必ず 1 回だけ呼び出すこと
- 緯度経度 (lat / lng) は出力しないこと。サーバが住所から解決する
- 各スポットには日本語の住所 (address: 都道府県 + 市区町村 + 番地) と検索キーワード (query: 施設名) を必ず含める
- 時刻は HH:MM 形式、同 day 内で昇順かつ重複なし
- 1 day あたり 3〜8 スポット、1 旅行あたり 1〜7 day
- 観光地・施設名は実在するものだけ。曖昧なら含めない
- accent と各 spot の color は #RRGGBB
- icon は landmark / shrine / food / mountain / onsen / plane / hotel / tree / water / market のいずれか
- desc は 200 字以内、note は実用 Tips を 80 字程度
- tags は 3〜4 個`;

export type GenerateInput = {
  destination: string;
  duration: string;        // 例: "日帰り" / "1泊2日"
  transport?: string;      // 例: "車" / "電車"
  interests?: string[];    // 例: ["温泉", "神社"]
  pace?: "ゆったり" | "標準" | "詰込";
  freeText?: string;
};

export type GenerateResult = {
  trip: Trip;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_tokens?: number;
    cache_write_tokens?: number;
  };
  model: string;
};

const TRIP_TOOL = {
  name: "generate_trip",
  description: "ユーザの条件に合う旅行プランを TripSchema 準拠の JSON で返す",
  input_schema: {
    type: "object",
    required: ["title", "subtitle", "accent", "icon", "days"],
    properties: {
      title: { type: "string", description: "プラン名 (40 字以内、日本語)" },
      subtitle: { type: "string", description: "サブタイトル (英大文字、60 字以内)" },
      accent: { type: "string", description: "#RRGGBB" },
      icon: {
        type: "string",
        enum: ["landmark", "shrine", "food", "mountain", "onsen", "plane", "hotel", "tree", "water", "market"],
      },
      days: {
        type: "array",
        minItems: 1, maxItems: 7,
        items: {
          type: "object",
          required: ["label", "spots"],
          properties: {
            label: { type: "string", description: "例: Day 1" },
            spots: {
              type: "array",
              minItems: 3, maxItems: 8,
              items: {
                type: "object",
                required: ["time", "end", "icon", "label", "sub", "desc", "color", "address", "query"],
                properties: {
                  time: { type: "string", pattern: "^\\d{2}:\\d{2}$" },
                  end: { type: "string", pattern: "^(\\d{2}:\\d{2}|—)$" },
                  icon: {
                    type: "string",
                    enum: ["landmark", "shrine", "food", "mountain", "onsen", "plane", "hotel", "tree", "water", "market"],
                  },
                  label: { type: "string" },
                  sub: { type: "string" },
                  note: { type: "string" },
                  desc: { type: "string" },
                  tags: { type: "array", items: { type: "string" }, maxItems: 4 },
                  drive: { type: ["string", "null"] },
                  hours: { type: "string" },
                  color: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$" },
                  address: { type: "string", description: "都道府県+市区町村+番地" },
                  query: { type: "string", description: "施設名そのまま、検索キーワード" },
                },
              },
            },
          },
        },
      },
    },
  },
};

function buildUserMessage(input: GenerateInput): string {
  const parts: string[] = [];
  parts.push(`<requirements>`);
  parts.push(`行き先: ${input.destination}`);
  parts.push(`期間: ${input.duration}`);
  if (input.transport) parts.push(`移動手段: ${input.transport}`);
  if (input.interests?.length) parts.push(`興味: ${input.interests.join(", ")}`);
  if (input.pace) parts.push(`ペース: ${input.pace}`);
  if (input.freeText) parts.push(`自由欄: ${input.freeText.replace(/<\/?requirements>/g, "")}`);
  parts.push(`</requirements>`);
  return parts.join("\n");
}

/**
 * Claude Haiku 4.5 を Tool Use 経由で呼んで TripSchema を返す。
 * 失敗時は 1 回だけ自動リトライ (温度 0.3)。
 */
export async function generateTrip(input: GenerateInput): Promise<GenerateResult> {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const client = anthropic();

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 3072,
      temperature: attempt === 0 ? 0.7 : 0.3,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [TRIP_TOOL as never],
      tool_choice: { type: "tool", name: "generate_trip" },
      messages: [{ role: "user", content: buildUserMessage(input) }],
    });

    const toolUse = res.content.find((b) => b.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use" && toolUse.name === "generate_trip") {
      const parsed = TripSchema.safeParse(toolUse.input);
      if (parsed.success) {
        return {
          trip: parsed.data,
          model: MODEL,
          usage: {
            input_tokens: res.usage.input_tokens,
            output_tokens: res.usage.output_tokens,
            cache_read_tokens: res.usage.cache_read_input_tokens ?? 0,
            cache_write_tokens: res.usage.cache_creation_input_tokens ?? 0,
          },
        };
      }
      if (attempt === 1) {
        throw new Error(`zod validation failed: ${JSON.stringify(parsed.error.issues)}`);
      }
    } else if (attempt === 1) {
      throw new Error("no tool_use block in response");
    }
  }

  throw new Error("unreachable");
}
