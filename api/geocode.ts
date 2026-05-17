import { Hono } from "hono";
import { z } from "zod";
import { requireUser } from "./_lib/auth";
import { geocodeBatch } from "./_lib/geocode";
import { isHttpError } from "./_lib/ratelimit";
import { env } from "./_lib/env";
import { toVercelHandler } from "./_lib/handler";

const ReqSchema = z.object({
  addresses: z.array(z.string().max(200)).min(1).max(20),
});

const app = new Hono();

app.post("/api/geocode", async (c) => {
  // 内部用エンドポイント。dev 以外は認証必須にする
  if (!env.DEV_FIXTURE_MODE) {
    try {
      await requireUser(c);
    } catch (e) {
      const status = isHttpError(e) ? e.status : 500;
      return c.json({ error: (e as Error).message }, status as 401 | 500);
    }
  }

  let parsed;
  try {
    parsed = ReqSchema.parse(await c.req.json());
  } catch (e) {
    return c.json({ error: "invalid", detail: (e as Error).message }, 400);
  }

  const results = await geocodeBatch(parsed.addresses);
  return c.json({ results });
});

export default toVercelHandler(app);
