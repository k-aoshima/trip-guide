import hakone from "../../fixtures/trips/hakone-day.json";
import hokkaido from "../../fixtures/trips/hokkaido-2days.json";
import { TripSchema, type Trip } from "@/types/trip";

export const SAMPLE_PLANS: Trip[] = [
  TripSchema.parse(hakone),
  TripSchema.parse(hokkaido),
];
