import { z } from "zod";

export const SPOT_ICONS = [
  "landmark",
  "shrine",
  "food",
  "mountain",
  "onsen",
  "plane",
  "hotel",
  "tree",
  "water",
  "market",
] as const;

export const SpotIconSchema = z.enum(SPOT_ICONS);
export type SpotIcon = z.infer<typeof SpotIconSchema>;

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const SpotSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^(\d{2}:\d{2}|—)$/),
  icon: SpotIconSchema,
  label: z.string().max(60),
  sub: z.string().max(80),
  note: z.string().max(200).nullable().optional(),
  desc: z.string().max(400),
  tags: z.array(z.string()).max(6).optional().default([]),
  drive: z.string().nullable().optional(),
  hours: z.string().max(60).optional(),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  url: z.string().url().optional(),
  images: z.array(z.string()).optional(),
  color: hexColor,
  // Phase 1+ で必須化、Phase 0 では fixture 互換のため optional
  address: z.string().optional(),
  query: z.string().optional(),
  // LLM には出させずサーバで Nominatim 解決する想定 (Phase 1+)
  // Phase 0 既存 fixture では事前に埋めてある
  lat: z.number().optional(),
  lng: z.number().optional(),
});
export type Spot = z.infer<typeof SpotSchema>;

export const DaySchema = z.object({
  label: z.string(),
  spots: z.array(SpotSchema).min(1).max(10),
});
export type Day = z.infer<typeof DaySchema>;

export const TripSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(40),
  subtitle: z.string().max(60),
  accent: hexColor,
  icon: SpotIconSchema,
  days: z.array(DaySchema).min(1).max(14),
});
export type Trip = z.infer<typeof TripSchema>;
