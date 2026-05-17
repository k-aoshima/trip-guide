import type { Context } from "hono";
import { adminClient } from "./supabase";
import { env } from "./env";

const SHORT_WINDOW_HOURS = 24;
const SHORT_WINDOW_LIMIT = 5;

/**
 * generations テーブルから直近 24h の成功生成回数を数え、上限超なら例外。
 * service_role を使うため RLS をバイパス。
 */
export async function checkGenerationRateLimit(ownerId: string): Promise<void> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return; // dev fixture mode などで未設定なら素通り

  const sb = adminClient();
  const since = new Date(Date.now() - SHORT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { count, error } = await sb
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId)
    .eq("status", "success")
    .gte("created_at", since);

  if (error) return;
  if ((count ?? 0) >= SHORT_WINDOW_LIMIT) {
    const e: Error & { status?: number } = new Error("rate limit: too many generations");
    e.status = 429;
    throw e;
  }
}

/** Hono のエラーレスポンス用ヘルパ */
export function isHttpError(e: unknown): e is Error & { status: number } {
  return !!(e && typeof e === "object" && "status" in (e as Record<string, unknown>));
}

/** クライアント識別子 (IP) を抽出 (将来の IP 単位制限用) */
export function clientId(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}
