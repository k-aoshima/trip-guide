import { Hono } from "hono";
import { z } from "zod";
import { requireUser } from "../_lib/auth";
import { userClient } from "../_lib/supabase";
import { TripSchema } from "../../src/types/trip";
import { isHttpError } from "../_lib/ratelimit";
import { toVercelHandler } from "../_lib/handler";

const PostSchema = z.object({
  content: TripSchema,
  status: z.enum(["draft", "saved"]).default("saved"),
  prompt: z.unknown().optional(),
});

const app = new Hono();

app.get("/api/trips", async (c) => {
  try {
    const user = await requireUser(c);
    const sb = userClient(user.accessToken);
    const { data, error } = await sb
      .from("trips")
      .select("id, status, title, cover_color, cover_icon, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) return c.json({ error: error.message }, 500);
    return c.json({ trips: data ?? [] });
  } catch (e) {
    const status = isHttpError(e) ? e.status : 500;
    return c.json({ error: (e as Error).message }, status as 401 | 500);
  }
});

app.post("/api/trips", async (c) => {
  try {
    const user = await requireUser(c);
    const body = PostSchema.parse(await c.req.json());
    const sb = userClient(user.accessToken);
    const { data, error } = await sb
      .from("trips")
      .insert({
        owner_id: user.id,
        status: body.status,
        title: body.content.title,
        cover_color: body.content.accent,
        cover_icon: body.content.icon,
        prompt: body.prompt ?? null,
        content: body.content,
      })
      .select("id")
      .single();
    if (error) return c.json({ error: error.message }, 500);
    return c.json({ id: data.id });
  } catch (e) {
    const status = isHttpError(e) ? e.status : 500;
    return c.json({ error: (e as Error).message }, status as 400 | 401 | 500);
  }
});

export default toVercelHandler(app);
