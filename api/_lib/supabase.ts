import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, requireEnv } from "./env";

/**
 * service_role キーを使う admin クライアント。
 * **RLS をバイパスする**ので、サーバの確実な認可チェック後にだけ使うこと。
 */
export function adminClient(): SupabaseClient {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * リクエストのアクセストークン (Authorization: Bearer ...) で作る匿名クライアント。
 * RLS が効くので、auth.uid() に応じた行だけを読み書きできる。
 */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_ANON_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

export function supabaseAvailable(): boolean {
  return !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}
