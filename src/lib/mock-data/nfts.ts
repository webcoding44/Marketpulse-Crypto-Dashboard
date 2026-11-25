import { fakeAddress } from "./defi";
import { rng, series } from "@/lib/utils";

export interface NftCollection {
  id: string;
  rank: number;
  name: string;
  colors: [string, string];
  floor: number;
  floorChange: number;
  volume: number;
  volumeChange: number;
  sales: number;
  owners: number;
  items: number;
  listedPct: number;
  topSale: number;
  chain: string;
  marketCap: number;
  spark: number[];
}

type R = [string, string, string, string, number, number, number, number, number, number, number, number, number, string];
const ROWS: R[] = [
  ["pudgy-penguins", "Pudgy Penguins", "#7DD3FC", "#6366F1", 11.8, 4.2, 842, 12.4, 61, 5120, 8888, 6.1, 420, "Ethereum"],
  ["bored-ape-yacht-club", "Bored Ape Yacht Club", "#FBBF24", "#B45309", 9.4, -1.8, 611, -6.2, 38, 5840, 10000, 4.8, 740, "Ethereum"],
  ["cryptopunks", "CryptoPunks", "#F472B6", "#7C3AED", 42.1, 1.1, 538, 3.4, 12, 3480, 10000, 3.1, 4200, "Ethereum"],
  ["azuki", "Azuki", "#F87171", "#7F1D1D", 3.9, 7.4, 402, 22.8, 74, 4980, 10000, 9.2, 380, "Ethereum"],
  ["degods", "DeGods", "#34D399", "#064E3B", 6.2, 2.6, 318, 8.1, 44, 3120, 9999, 5.4, 210, "Solana"],
  ["milady-maker", "Milady Maker", "#E879F9", "#4C1D95", 3.1, 5.9, 296, 14.3, 58, 4540, 9998, 7.3, 190, "Ethereum"],
  ["mad-lads", "Mad Lads", "#FB923C", "#9A3412", 142, 3.3, 274, 5.2, 39, 3620, 10000, 8.4, 2100, "Solana"],
  ["doodles", "Doodles", "#60A5FA", "#F472B6", 1.6, -3.1, 188, -9.7, 62, 5010, 10000, 2.2, 90, "Ethereum"],
  ["moonbirds", "Moonbirds", "#A78BFA", "#1E1B4B", 1.9, 0.9, 164, 1.1, 96, 5220, 10000, 1.8, 140, "Ethereum"],
  ["mutant-ape-yacht-club", "Mutant Ape Yacht Club", "#4ADE80", "#14532D", 1.3, -0.7, 152, -2.4, 115, 11800, 19420, 1.4, 80, "Ethereum"],
  ["cool-cats", "Cool Cats", "#38BDF8", "#0369A1", 0.46, 2.2, 74, 4.3, 148, 3680, 9933, 0.9, 20, "Ethereum"],
  ["parallel-alpha", "Parallel Alpha", "#FACC15", "#1F2937", 0.18, 9.4, 61, 31.2, 244, 6820, 10782, 0.6, 12, "Base"],
];

export const NFT_COLLECTIONS: NftCollection[] = ROWS.map((r, i) => ({
  id: r[0],
  rank: i + 1,
  name: r[1],
  colors: [r[2], r[3]],
  floor: r[4],
  floorChange: r[5],
  volume: r[6],
  volumeChange: r[7],
  sales: r[8] * 4,
  owners: r[9],
  items: r[10],
  listedPct: r[11],
  topSale: r[12],
  chain: r[13],
  marketCap: r[4] * r[10],
  spark: series(r[0], 28, r[5] * 2, 1.1),
}));

export const getCollection = (id: string) => NFT_COLLECTIONS.find((c) => c.id === id);

export const SALES = Array.from({ length: 12 }, (_, i) => {
  const r = rng(i + 301);
  const c = NFT_COLLECTIONS[i % 6];
  return {
    id: `sale${i}`,
    collection: c.name,
    collectionId: c.id,
    colors: c.colors,
    item: `#${Math.floor(r() * 9000 + 100)}`,
    price: +(c.floor * (0.9 + r() * 0.7)).toFixed(2),
    buyer: fakeAddress(`b${i}`),
    seller: fakeAddress(`s${i}`),
    market: ["OpenSea", "Blur", "Magic Eden", "OpenSea"][i % 4],
    time: i < 3 ? `${i * 2 + 1}m ago` : `${i - 1}h ago`,
    seed: Math.floor(r() * 1000),
  };
});
