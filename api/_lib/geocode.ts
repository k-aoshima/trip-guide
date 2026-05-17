import { createHash } from "node:crypto";
import { env } from "./env";
import { adminClient } from "./supabase";

const CACHE_TTL_DAYS = 30;
const NOMINATIM_DELAY_MS = 250;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type GeocodeResult = { lat: number; lng: number } | null;

function normalize(addr: string): string {
  return addr.replace(/\s+/g, "").toLowerCase();
}
function hashOf(addr: string): string {
  return createHash("sha256").update(normalize(addr)).digest("hex");
}

async function fetchFromCache(addr: string): Promise<GeocodeResult> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const sb = adminClient();
  const queryHash = hashOf(addr);
  const { data } = await sb
    .from("geocode_cache")
    .select("lat, lng, expires_at")
    .eq("query_hash", queryHash)
    .maybeSingle();
  if (!data) return null;
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) return null;
  return { lat: Number(data.lat), lng: Number(data.lng) };
}

async function writeCache(addr: string, lat: number, lng: number, raw: unknown) {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return;
  const sb = adminClient();
  const expires = new Date(Date.now() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await sb
    .from("geocode_cache")
    .upsert({
      query_hash: hashOf(addr),
      lat,
      lng,
      raw,
      expires_at: expires,
    }, { onConflict: "query_hash" });
}

type NominatimHit = { lat: number; lng: number; raw: unknown };

async function fetchFromNominatim(addr: string): Promise<NominatimHit | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", addr);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("accept-language", "ja");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": env.NOMINATIM_USER_AGENT },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data?.[0]) return null;
  const lat = Number(data[0].lat);
  const lng = Number(data[0].lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng, raw: data[0] };
}

/**
 * 単一住所をジオコード。キャッシュ優先、Miss 時のみ Nominatim を叩く。
 * 規約のため呼び出し側は直列＋250ms 間隔を守ること。
 */
export async function geocodeOne(addr: string): Promise<GeocodeResult> {
  if (!addr) return null;
  const cached = await fetchFromCache(addr);
  if (cached) return cached;

  const fresh = await fetchFromNominatim(addr);
  if (!fresh) return null;
  await writeCache(addr, fresh.lat, fresh.lng, fresh.raw);
  return { lat: fresh.lat, lng: fresh.lng };
}

/**
 * 複数住所を直列で解決。Nominatim 規約遵守のため必ず直列に呼ぶ。
 */
export async function geocodeBatch(addresses: string[]): Promise<(GeocodeResult)[]> {
  const out: (GeocodeResult)[] = [];
  for (let i = 0; i < addresses.length; i++) {
    const r = await geocodeOne(addresses[i]);
    out.push(r);
    if (i < addresses.length - 1) await sleep(NOMINATIM_DELAY_MS);
  }
  return out;
}
