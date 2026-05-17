/**
 * fixtures/trips/*.json を TripSchema で検証する CLI。
 * usage: npm run validate:fixtures
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { TripSchema } from "../src/types/trip";

const FIXTURES_DIR = join(process.cwd(), "fixtures", "trips");

const files = readdirSync(FIXTURES_DIR).filter((f) => f.endsWith(".json"));

if (files.length === 0) {
  console.warn("⚠ fixtures/trips に JSON ファイルがありません");
  process.exit(0);
}

let failed = 0;
for (const file of files) {
  const path = join(FIXTURES_DIR, file);
  const raw = readFileSync(path, "utf-8");
  try {
    const json = JSON.parse(raw);
    const result = TripSchema.safeParse(json);
    if (!result.success) {
      failed++;
      console.error(`✗ ${file}`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      const totalSpots = result.data.days.reduce((sum, d) => sum + d.spots.length, 0);
      console.log(`✓ ${file}  (${result.data.days.length} day, ${totalSpots} spot)`);
    }
  } catch (e) {
    failed++;
    console.error(`✗ ${file} — JSON parse error`);
    console.error(`  ${(e as Error).message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} / ${files.length} fixture が検証に失敗しました`);
  process.exit(1);
}
console.log(`\n${files.length} fixture すべてが TripSchema に準拠しています ✨`);
