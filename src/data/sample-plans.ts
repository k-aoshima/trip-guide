import matsumotoHimi from "../../fixtures/trips/matsumoto-himi-3days.json";
import { TripSchema, type Trip } from "@/types/trip";

// 今は 10/12〜14 の松本・氷見の旅程だけを出す。
// 箱根・北海道・千葉の旅程は fixtures/trips/ に残してあるので、
// 戻すときはここに import と TripSchema.parse(...) を足す。
export const SAMPLE_PLANS: Trip[] = [
  TripSchema.parse(matsumotoHimi),
];
