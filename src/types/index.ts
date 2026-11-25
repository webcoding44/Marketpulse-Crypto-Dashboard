import type { LucideIcon } from "lucide-react";

export interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  color: string;
  price: number;
  c1h: number;
  c24h: number;
  c7d: number;
  volume: number;
  marketCap: number;
  fdv: number;
  supply: number;
  maxSupply: number | null;
  ath: number;
  athDate: string;
  atl: number;
  atlDate: string;
  categories: string[];
  spark: number[];
  stable?: boolean;
  isNew?: boolean;
  listed?: string;
  description: string;
}

export interface Exchange {
  id: string;
  rank: number;
  name: string;
  color: string;
  trust: number;
  volume24h: number;
  volumeChange: number;
  pairs: number;
  coins: number;
  country: string;
  founded: number;
  visits: string;
  type: "CEX" | "DEX";
  reserves: number;
  spark: number[];
}

export interface NavLeaf {
  label: string;
  href: string;
  pattern?: RegExp;
  badge?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  match: string[];
  children: NavLeaf[];
}

export type Tone = "success" | "danger" | "warning" | "primary" | "accent" | "neutral";
