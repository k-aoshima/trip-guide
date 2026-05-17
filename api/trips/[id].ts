import { Hono } from "hono";
import { z } from "zod";
import { requireUser } from "../_lib/auth";
import { userClient } from "../_lib/supabase";
import { TripSchema } from "../../src/types/trip";
import { isHttpError } from "../_lib/ratelimit";
import { toVercelHandler } from "../_lib/handler";

const PatchSchema = z.object({
  status: z.enum(["draft", "saved", "archived"]).optional(),
  content: TripSchema.optional(),
});

const app = new Hono();

app.get("/api/trips/:id", async (c) => {
  try {
    const user = await requireUser(c);
    const id = c.req.param("id");
    const sb = userClient(user.accessToken);
    const { data, error } = await sb.from("trips").select("*").eq("id", id).maybeSingle();
    if (error) return c.json({ error: error.message }, 500);
    if (!data) return c.json({ error: "not found" }, 404);
    return c.json({ trip: data });
  } catch (e) {
    const status = isHttpError(e) ? e.status : 500;
    return c.json({ error: (e as Error).message }, status as 401 | 500);
  }
});

app.patch("/api/trips/:id", async (c) => {
  try {
    const user = await requireUser(c);
    const id = c.req.param("id");
    const body = PatchSchema.parse(await c.req.json());
    const update: Record<string, unknown> = {};
    if (body.status) update.status = body.status;
    if (body.content) {
      update.content = body.content;
      update.title = body.content.title;
      update.cover_color = body.content.accent;
      update.cover_icon = body.content.icon;
    }
    const sb = userClient(user.accessToken);
    const { error } = await sb.from("trips").update(update).eq("id", id);
    if (error) return c.json({ error: error.message }, 500);
    return c.json({ ok: true });
  } catch (e) {
    const status = isHttpError(e) ? e.status : 500;
    return c.json({ error: (e as Error).message }, status as 400 | 401 | 500);
  }
});

app.delete("/api/trips/:id", async (c) => {
  try {
    const user = await requireUser(c);
    const id = c.req.param("id");
    const sb = userClient(user.accessToken);
    const { error } = await sb.from("trips").delete().eq("id", id);
    if (error) return c.json({ error: error.message }, 500);
    return c.json({ ok: true });
  } catch (e) {
    const status = isHttpError(e) ? e.status : 500;
    return c.json({ error: (e as Error).message }, status as 401 | 500);
  }
});

export default toVercelHandler(app);
