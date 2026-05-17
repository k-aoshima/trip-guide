import { Hono } from "hono";
import { adminClient, supabaseAvailable } from "../_lib/supabase";
import { toVercelHandler } from "../_lib/handler";

const app = new Hono();

/**
 * 公開閲覧用 (認証不要)。shares.revoked_at IS NULL のものだけ返す。
 * service_role を使って view_count をインクリメント。
 */
app.get("/api/share/:public_id", async (c) => {
  if (!supabaseAvailable()) return c.json({ error: "service unavailable" }, 503);

  const publicId = c.req.param("public_id");
  const sb = adminClient();
  const { data, error } = await sb
    .from("shares")
    .select("public_id, snapshot, title, cover_color, view_count, revoked_at, created_at")
    .eq("public_id", publicId)
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 500);
  if (!data) return c.json({ error: "not found" }, 404);
  if (data.revoked_at) return c.json({ error: "revoked" }, 410);

  // best-effort で view_count を加算
  await sb.from("shares").update({ view_count: (data.view_count ?? 0) + 1 }).eq("public_id", publicId);

  return c.json({
    public_id: data.public_id,
    title: data.title,
    cover_color: data.cover_color,
    snapshot: data.snapshot,
    view_count: data.view_count,
    created_at: data.created_at,
  });
});

export default toVercelHandler(app);
