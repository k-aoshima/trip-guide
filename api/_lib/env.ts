/**
 * 環境変数を起動時に検証する。サーバサイド (Vercel Functions) でのみ参照される。
 * 必須/任意は段階導入のため緩めに。Phase 1 完成時に再評価。
 */
const optional = (k: string): string | undefined => process.env[k] || undefined;

export const env = {
  // LLM
  ANTHROPIC_API_KEY: optional("ANTHROPIC_API_KEY"),

  // Supabase
  SUPABASE_URL: optional("SUPABASE_URL"),
  SUPABASE_ANON_KEY: optional("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: optional("SUPABASE_SERVICE_ROLE_KEY"),

  // Nominatim
  NOMINATIM_USER_AGENT: optional("NOMINATIM_USER_AGENT") ?? "trip-guide/0.1 (dev@example.com)",

  // Dev fixture mode (本番にはセットしない)
  DEV_FIXTURE_MODE: optional("DEV_FIXTURE_MODE") === "true",
};

export function requireEnv<K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> {
  const v = env[key];
  if (v === undefined || v === null || v === "") {
    throw new Error(`[env] ${key} is not set. Add it to .env.local or Vercel project settings.`);
  }
  return v as NonNullable<(typeof env)[K]>;
}

export function isAnthropicAvailable(): boolean {
  return !!env.ANTHROPIC_API_KEY;
}

export function isSupabaseAvailable(): boolean {
  return !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}
