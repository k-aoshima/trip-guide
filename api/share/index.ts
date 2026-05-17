import { Hono } from "hono";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireUser } from "../_lib/auth";
import { userClient } from "../_lib/supabase";
import { isHttpError } from "../_lib/ratelimit";
import { toVercelHandler } from "../_lib/handler";

const PostSchema = z.object({
  trip_id: z.string().uuid(),
});

const app = new Hono();

app.post("/api/share", async (c) => {
  try {
    const user = await requireUser(c);
    const body = PostSchema.parse(await c.req.json());
    const sb = userClient(user.accessToken);

    // 元 trip を取得 (RLS で owner_id チェック)
    const { data: trip, error: tripErr } = await sb
      .from("trips")
      .select("id, title, cover_color, content")
      .eq("id", body.trip_id)
      .maybeSingle();
    if (tripErr) return c.json({ error: tripErr.message }, 500);
    if (!trip) return c.json({ error: "trip not found" }, 404);

    // snapshot として shares に挿入
    const publicId = nanoid(10);
    const { error: insErr } = await sb.from("shares").insert({
      public_id: publicId,
      trip_id: trip.id,
      snapshot: trip.content,
      title: trip.title,
      cover_color: trip.cover_color,
    });
    if (insErr) return c.json({ error: insErr.message }, 500);

    return c.json({ public_id: publicId });
  } catch (e) {
    const status = isHttpError(e) ? e.status : 500;
    return c.json({ error: (e as Error).message }, status as 400 | 401 | 500);
  }
});

export default toVercelHandler(app);
