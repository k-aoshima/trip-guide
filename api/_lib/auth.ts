import type { Context } from "hono";
import { userClient, supabaseAvailable } from "./supabase";

export type AuthedUser = {
  id: string;
  email?: string;
  accessToken: string;
};

/**
 * Authorization: Bearer ... または cookie から Supabase セッションを検証する。
 * Phase 1 完成時には @supabase/ssr の Cookie ベースに移行する想定。
 */
export async function getUser(c: Context): Promise<AuthedUser | null> {
  if (!supabaseAvailable()) return null;

  const auth = c.req.header("authorization") ?? c.req.header("Authorization");
  if (!auth?.toLowerCase().startsWith("bearer ")) return null;
  const accessToken = auth.slice(7).trim();
  if (!accessToken) return null;

  const sb = userClient(accessToken);
  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) return null;

  return {
    id: data.user.id,
    email: data.user.email ?? undefined,
    accessToken,
  };
}

export async function requireUser(c: Context): Promise<AuthedUser> {
  const user = await getUser(c);
  if (!user) {
    const err: Error & { status?: number } = new Error("unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}
