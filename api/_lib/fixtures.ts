import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { TripSchema, type Trip } from "../../src/types/trip";

const FIXTURES_DIR = join(process.cwd(), "fixtures", "trips");

let cache: Array<{ slug: string; trip: Trip }> | null = null;

export function listFixtures(): Array<{ slug: string; trip: Trip }> {
  if (cache) return cache;
  try {
    const files = readdirSync(FIXTURES_DIR).filter((f) => f.endsWith(".json"));
    cache = files.map((file) => {
      const slug = file.replace(/\.json$/, "");
      const raw = readFileSync(join(FIXTURES_DIR, file), "utf-8");
      const trip = TripSchema.parse(JSON.parse(raw));
      return { slug, trip };
    });
  } catch {
    cache = [];
  }
  return cache;
}

export function findFixture(slug: string): Trip | null {
  return listFixtures().find((f) => f.slug === slug)?.trip ?? null;
}

/**
 * 入力テキストから一番マッチしそうな fixture を選ぶ単純なヒューリスティック。
 * 主にローカル開発用。
 */
export function pickFixtureForPrompt(text: string): Trip {
  const fixtures = listFixtures();
  if (fixtures.length === 0) {
    throw new Error("no fixtures available");
  }
  const lowered = text.toLowerCase();
  const matched =
    fixtures.find((f) => lowered.includes("箱根") && f.slug.includes("hakone")) ||
    fixtures.find((f) => (lowered.includes("北海道") || lowered.includes("札幌") || lowered.includes("hokkaido")) && f.slug.includes("hokkaido"));
  return (matched ?? fixtures[0]).trip;
}
