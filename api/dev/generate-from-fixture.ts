import { Hono } from "hono";
import { env } from "../_lib/env";
import { listFixtures, findFixture, pickFixtureForPrompt } from "../_lib/fixtures";
import { toVercelHandler } from "../_lib/handler";

const app = new Hono();

/**
 * GET  /api/dev/generate-from-fixture            → 利用可能な fixture 一覧
 * GET  /api/dev/generate-from-fixture?slug=hakone-day  → 特定 fixture を返す
 * POST /api/dev/generate-from-fixture { destination, freeText? }
 *      → プロンプトに近い fixture を返す
 *
 * 本番 (Vercel) では DEV_FIXTURE_MODE が未設定なので 403 で塞ぐ。
 */
app.get("/api/dev/generate-from-fixture", (c) => {
  if (!env.DEV_FIXTURE_MODE) return c.json({ error: "disabled" }, 403);

  const slug = c.req.query("slug");
  if (slug) {
    const trip = findFixture(slug);
    if (!trip) return c.json({ error: "not found", slug }, 404);
    return c.json({ trip, slug, source: "fixture" });
  }
  return c.json({ fixtures: listFixtures().map((f) => ({ slug: f.slug, title: f.trip.title })) });
});

app.post("/api/dev/generate-from-fixture", async (c) => {
  if (!env.DEV_FIXTURE_MODE) return c.json({ error: "disabled" }, 403);

  const body = await c.req.json().catch(() => ({}));
  const text = `${body.destination ?? ""} ${body.duration ?? ""} ${body.freeText ?? ""}`;
  const trip = pickFixtureForPrompt(text);
  return c.json({ trip, source: "fixture" });
});

export default toVercelHandler(app);
