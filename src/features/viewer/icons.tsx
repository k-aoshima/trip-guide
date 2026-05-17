import {
  Landmark, UtensilsCrossed, Mountain,
  Plane, Hotel, TreePine, Droplets, ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import type { SpotIcon } from "@/types/trip";

type IconProps = { size?: number; color?: string };

export function ToriiIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16" />
      <path d="M3 3c0 0 2 3 9 3s9-3 9-3" />
      <path d="M6 5v17" />
      <path d="M18 5v17" />
      <path d="M4 9h16" />
    </svg>
  );
}

export function OnsenIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
      <path d="M50 100c-16.5 0-30-11.5-30-25.5C20 64 35 58 35 58s-2.5 10 0 16.5S42 85 50 85s12.5-4 15-10.5S65 58 65 58s15 6 15 16.5C80 88.5 66.5 100 50 100z" />
      <path d="M30 45c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" strokeWidth="6" stroke={color} fill="none" strokeLinecap="round" />
      <path d="M50 48c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" strokeWidth="6" stroke={color} fill="none" strokeLinecap="round" />
      <path d="M70 45c0 0 3-5 3-10s-3-10-3-15 3-10 3-15" strokeWidth="6" stroke={color} fill="none" strokeLinecap="round" />
    </svg>
  );
}

type CustomIcon = (p: IconProps) => React.ReactElement;
const ICON_MAP: Record<SpotIcon, LucideIcon | CustomIcon> = {
  landmark: Landmark,
  shrine: ToriiIcon,
  food: UtensilsCrossed,
  mountain: Mountain,
  onsen: OnsenIcon,
  plane: Plane,
  hotel: Hotel,
  tree: TreePine,
  water: Droplets,
  market: ShoppingBasket,
};

export function SpotIconComponent({ icon, size = 20, color = "currentColor" }: { icon: SpotIcon; size?: number; color?: string }) {
  const Icon = ICON_MAP[icon];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}

