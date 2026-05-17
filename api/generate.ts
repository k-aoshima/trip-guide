import { Hono } from "hono";
import { z } from "zod";
import { env } from "./_lib/env";
import { requireUser } from "./_lib/auth";
import { adminClient, supabaseAvailable } from "./_lib/supabase";
import { checkGenerationRateLimit, isHttpError } from "./_lib/ratelimit";
import { generateTrip } from "./_lib/anthropic";
import { geocodeBatch } from "./_lib/geocode";
import { pickFixtureForPrompt } from "./_lib/fixtures";
import { TripSchema } from "../src/types/trip";
import { toVercelHandler } from "./_lib/handler";

const PromptSchema = z.object({
  destination: z.string().min(1).max(120),
  duration: z.string().min(1).max(40),
  transport: z.string().max(40).optional(),
  interests: z.array(z.string().max(40)).max(10).optional(),
  pace: z.enum(["ゆったり", "標準", "詰込"]).optional(),
  freeText: z.string().max(500).optional(),
});

const app = new Hono();

app.post("/api/generate", async (c) => {
  let prompt;
  try {
    prompt = PromptSchema.parse(await c.req.json());
  } catch (e) {
    return c.json({ error: "invalid prompt", detail: (e as Error).message }, 400);
  }

  // Dev fixture mode は認証を緩める (ローカル開発のため)
  const dev = env.DEV_FIXTURE_MODE;

  let ownerId: string | null = null;
  if (!dev) {
    try {
      const user = await requireUser(c);
      ownerId = user.id;
      await checkGenerationRateLimit(ownerId);
    } catch (e) {
      const status = isHttpError(e) ? e.status : 500;
      return c.json({ error: (e as Error).message }, status as 401 | 429 | 500);
    }
  }

  // 1) 旅程本体を生成 (fixture or Anthropic)
  let trip;
  let usage: { input_tokens: number; output_tokens: number; cache_read_tokens?: number; cache_write_tokens?: number };
  let modelName: string;
  if (dev || !env.ANTHROPIC_API_KEY) {
    const fixture = pickFixtureForPrompt(`${prompt.destination} ${prompt.duration} ${prompt.freeText ?? ""}`);
    trip = TripSchema.parse(fixture);
    usage = { input_tokens: 0, output_tokens: 0 };
    modelName = "fixture";
  } else {
    const result = await generateTrip(prompt);
    trip = result.trip;
    usage = result.usage;
    modelName = result.model;
  }

  // 2) 座標解決 (Nominatim、直列)。fixture には既に lat/lng がある場合あり
  const allSpots = trip.days.flatMap((d) => d.spots);
  const needGeocode = allSpots.filter((s) => (s.lat == null || s.lng == null) && s.address);
  if (needGeocode.length > 0) {
    const coords = await geocodeBatch(needGeocode.map((s) => s.address as string));
    needGeocode.forEach((s, i) => {
      const c2 = coords[i];
      if (c2) {
        s.lat = c2.lat;
        s.lng = c2.lng;
      }
    });
  }

  // 3) DB に draft 保存 (supabase 接続できる場合のみ)
  let tripId: string | null = null;
  if (supabaseAvailable() && env.SUPABASE_SERVICE_ROLE_KEY && ownerId) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("trips")
      .insert({
        owner_id: ownerId,
        status: "draft",
        title: trip.title,
        cover_color: trip.accent,
        cover_icon: trip.icon,
        prompt,
        content: trip,
      })
      .select("id")
      .single();
    if (!error && data) tripId = data.id;

    await sb.from("generations").insert({
      owner_id: ownerId,
      prompt,
      model: modelName,
      input_tokens: usage.input_tokens,
      cache_read_tokens: usage.cache_read_tokens ?? 0,
      cache_write_tokens: usage.cache_write_tokens ?? 0,
      output_tokens: usage.output_tokens,
      trip_id: tripId,
      status: "success",
    });
  }

  return c.json({ trip, trip_id: tripId, model: modelName, usage });
});

export default toVercelHandler(app);
