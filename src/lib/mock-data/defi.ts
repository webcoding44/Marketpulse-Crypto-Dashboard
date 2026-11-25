import { hashStr, rng, series } from "@/lib/utils";

export function fakeAddress(seed: string, len = 40): string {
  const r = rng(hashStr(seed));
  let s = "0x";
  for (let i = 0; i < len; i++) s += "0123456789abcdef"[Math.floor(r() * 16)];
  return s;
}

export const NETWORKS = [
  { id: "ethereum", name: "Ethereum", color: "#627EEA", tvl: 62.4e9, volume: 4.8e9, pools: 48210, txns: 1.12e6, wallets: 0.62e6, gas: "14 gwei", change: 2.1 },
  { id: "solana", name: "Solana", color: "#9945FF", tvl: 8.9e9, volume: 3.6e9, pools: 112480, txns: 42.8e6, wallets: 2.9e6, gas: "0.00025 SOL", change: 5.4 },
  { id: "bnb", name: "BNB Chain", color: "#F3BA2F", tvl: 5.6e9, volume: 1.9e9, pools: 31540, txns: 4.6e6, wallets: 1.4e6, gas: "1 gwei", change: -0.8 },
  { id: "base", name: "Base", color: "#0052FF", tvl: 3.8e9, volume: 1.4e9, pools: 24870, txns: 8.1e6, wallets: 1.1e6, gas: "0.004 gwei", change: 7.2 },
  { id: "arbitrum", name: "Arbitrum", color: "#28A0F0", tvl: 3.1e9, volume: 0.92e9, pools: 14260, txns: 1.7e6, wallets: 0.38e6, gas: "0.01 gwei", change: 1.4 },
  { id: "polygon", name: "Polygon", color: "#8247E5", tvl: 1.2e9, volume: 0.41e9, pools: 9840, txns: 2.2e6, wallets: 0.52e6, gas: "32 gwei", change: -2.2 },
  { id: "avalanche", name: "Avalanche", color: "#E84142", tvl: 1.5e9, volume: 0.36e9, pools: 6120, txns: 0.8e6, wallets: 0.21e6, gas: "25 nAVAX", change: 0.9 },
  { id: "optimism", name: "Optimism", color: "#FF0420", tvl: 0.9e9, volume: 0.28e9, pools: 5480, txns: 0.6e6, wallets: 0.19e6, gas: "0.001 gwei", change: 3.3 },
];

export const DEXES = [
  { id: "uniswap-v3", name: "Uniswap v3", color: "#FF007A", networks: "Ethereum +5", volume: 3.4e9, tvl: 5.8e9, change: 3.2, pools: 18420, fee: "0.05–1%" },
  { id: "raydium", name: "Raydium", color: "#5A4FCF", networks: "Solana", volume: 2.1e9, tvl: 1.9e9, change: 6.8, pools: 62100, fee: "0.01–2%" },
  { id: "pancakeswap", name: "PancakeSwap", color: "#1FC7D4", networks: "BNB Chain +3", volume: 1.3e9, tvl: 2.2e9, change: -1.1, pools: 24780, fee: "0.01–1%" },
  { id: "aerodrome", name: "Aerodrome", color: "#2B6BFF", networks: "Base", volume: 0.94e9, tvl: 1.3e9, change: 8.4, pools: 4210, fee: "0.01–0.3%" },
  { id: "orca", name: "Orca", color: "#FFD15C", networks: "Solana", volume: 0.88e9, tvl: 0.74e9, change: 4.1, pools: 3140, fee: "0.01–2%" },
  { id: "curve", name: "Curve", color: "#E74C3C", networks: "Ethereum +8", volume: 0.62e9, tvl: 2.6e9, change: 0.7, pools: 1620, fee: "0.01–0.04%" },
  { id: "jupiter", name: "Jupiter", color: "#31C48D", networks: "Solana", volume: 0.58e9, tvl: 0.31e9, change: 2.6, pools: 940, fee: "Aggregator" },
  { id: "sushiswap", name: "SushiSwap", color: "#FA52A0", networks: "Ethereum +12", volume: 0.19e9, tvl: 0.42e9, change: -3.4, pools: 6120, fee: "0.01–1%" },
];

export interface Pool {
  id: string;
  base: string;
  baseColor: string;
  quote: string;
  quoteColor: string;
  dex: string;
  network: string;
  fee: string;
  price: number;
  c1h: number;
  c24h: number;
  volume: number;
  liquidity: number;
  txns: number;
  ageH: number;
  fdv: number;
  address: string;
  spark: number[];
}

type PR = [string, string, string, string, string, string, string, number, number, number, number, number, number, number, number];
const PR_ROWS: PR[] = [
  ["WETH", "#627EEA", "USDC", "#2775CA", "Uniswap v3", "Ethereum", "0.05%", 3245.8, 0.1, 2.3, 182.4, 241.6, 21400, 17500, 390e3],
  ["SOL", "#9945FF", "USDC", "#2775CA", "Raydium", "Solana", "0.25%", 142.35, 0.4, 4.8, 96.2, 118.4, 88200, 9800, 65e3],
  ["WBTC", "#F7931A", "WETH", "#627EEA", "Uniswap v3", "Ethereum", "0.30%", 19.37, -0.1, 0.9, 64.8, 188.2, 6200, 26000, 1238e3],
  ["WETH", "#627EEA", "USDC", "#2775CA", "Aerodrome", "Base", "0.05%", 3246.2, 0.2, 2.4, 58.1, 96.3, 14800, 8600, 390e3],
  ["WBNB", "#F3BA2F", "USDT", "#26A17B", "PancakeSwap", "BNB Chain", "0.01%", 584.2, -0.1, 0.8, 44.3, 72.9, 31200, 14200, 85e3],
  ["JUP", "#31C48D", "SOL", "#9945FF", "Orca", "Solana", "0.30%", 0.9812, 0.5, 4.4, 21.4, 18.8, 40500, 5200, 1.3e6],
  ["PEPE", "#4C9A2A", "WETH", "#627EEA", "Uniswap v3", "Ethereum", "0.30%", 0.00000842, 1.1, 9.8, 19.6, 22.1, 11300, 14000, 3.5e6],
  ["ARB", "#28A0F0", "WETH", "#627EEA", "Uniswap v3", "Arbitrum", "0.05%", 1.08, 0.1, -0.9, 14.2, 29.7, 7600, 9100, 3.3e6],
  ["BONK", "#F59E0B", "SOL", "#9945FF", "Raydium", "Solana", "0.25%", 0.00002214, 0.9, 7.1, 12.9, 14.2, 29800, 7100, 1.6e6],
  ["CRV", "#E74C3C", "WETH", "#627EEA", "Curve", "Ethereum", "0.04%", 0.5421, -0.4, -3.2, 8.3, 31.4, 3200, 21000, 0.6e6],
  ["AERO", "#2B6BFF", "USDC", "#2775CA", "Aerodrome", "Base", "0.30%", 1.21, 0.6, 5.7, 11.8, 24.6, 8400, 12000, 1.1e6],
  ["WIF", "#C084FC", "SOL", "#9945FF", "Orca", "Solana", "0.30%", 2.14, 1.8, 14.2, 38.4, 26.2, 52100, 52, 2.1e6],
  ["POPCAT", "#F472B6", "SOL", "#9945FF", "Raydium", "Solana", "0.25%", 0.6412, 3.4, 31.6, 22.9, 9.8, 38700, 31, 0.6e6],
  ["DEGEN", "#8B5CF6", "WETH", "#627EEA", "Uniswap v3", "Base", "1.00%", 0.0128, 2.2, 22.4, 9.6, 4.1, 17400, 22, 0.2e6],
  ["MOODENG", "#38BDF8", "SOL", "#9945FF", "Raydium", "Solana", "0.25%", 0.2214, 6.2, 48.9, 15.2, 3.6, 29600, 9, 0.22e6],
  ["OP", "#FF0420", "USDC", "#2775CA", "Velodrome", "Optimism", "0.05%", 2.41, 0.5, 4.3, 7.1, 16.8, 4900, 8800, 2.9e6],
];

export const POOLS: Pool[] = PR_ROWS.map((r, i) => ({
  id: `${r[0]}-${r[2]}-${r[4]}`.toLowerCase().replace(/\s+/g, "-"),
  base: r[0],
  baseColor: r[1],
  quote: r[2],
  quoteColor: r[3],
  dex: r[4],
  network: r[5],
  fee: r[6],
  price: r[7],
  c1h: r[8],
  c24h: r[9],
  volume: r[10] * 1e6,
  liquidity: r[11] * 1e6,
  txns: r[12],
  ageH: r[13],
  fdv: r[14] * 1e6,
  address: fakeAddress(`pool${i}`),
  spark: series(`pool${i}`, 28, r[9] * 1.2, 1.3),
}));

export const getPool = (id: string) => POOLS.find((p) => p.id === id);

export const ageLabel = (h: number) => (h < 24 ? `${h}h` : h < 24 * 30 ? `${Math.floor(h / 24)}d` : h < 24 * 365 ? `${Math.floor(h / 720)}mo` : `${Math.floor(h / 8760)}y`);

export interface OnchainToken {
  id: string;
  name: string;
  symbol: string;
  color: string;
  address: string;
  network: string;
  price: number;
  c24h: number;
  volume: number;
  liquidity: number;
  mcap: number;
  holders: number;
  txns: number;
  pools: number;
  spark: number[];
}

type TR = [string, string, string, string, string, number, number, number, number, number, number, number, number];
const TR_ROWS: TR[] = [
  ["weth", "Wrapped Ether", "WETH", "#627EEA", "Ethereum", 3245.8, 2.3, 612, 1840, 390e3, 4.9e6, 128000, 9800],
  ["usdc", "USD Coin", "USDC", "#2775CA", "Ethereum", 1.0, 0.0, 1210, 4120, 34.2e3, 6.2e6, 342000, 21800],
  ["wbtc", "Wrapped Bitcoin", "WBTC", "#F7931A", "Ethereum", 62820.4, 1.9, 184, 920, 11.2e3, 0.9e6, 38400, 4100],
  ["sol", "Wrapped SOL", "SOL", "#9945FF", "Solana", 142.35, 4.8, 482, 1120, 65.4e3, 3.1e6, 214000, 14200],
  ["pepe", "Pepe", "PEPE", "#4C9A2A", "Ethereum", 0.00000842, 9.8, 96, 188, 3.5e3, 0.32e6, 482000, 1840],
  ["uni", "Uniswap", "UNI", "#FF007A", "Ethereum", 7.92, -2.8, 41, 162, 4.7e3, 0.4e6, 340000, 2100],
  ["link", "Chainlink", "LINK", "#2A5ADA", "Ethereum", 14.62, 3.8, 58, 214, 8.9e3, 0.62e6, 780000, 2900],
  ["arb", "Arbitrum", "ARB", "#28A0F0", "Arbitrum", 1.08, -0.9, 74, 238, 3.3e3, 0.58e6, 612000, 1680],
  ["bonk", "Bonk", "BONK", "#F59E0B", "Solana", 0.00002214, 7.1, 62, 98, 1.6e3, 0.46e6, 890000, 940],
  ["aero", "Aerodrome", "AERO", "#2B6BFF", "Base", 1.21, 5.7, 32, 86, 1.1e3, 0.22e6, 128000, 410],
];

export const ONCHAIN_TOKENS: OnchainToken[] = TR_ROWS.map((r, i) => ({
  id: r[0],
  name: r[1],
  symbol: r[2],
  color: r[3],
  address: fakeAddress(`tok${r[0]}`),
  network: r[4],
  price: r[5],
  c24h: r[6],
  volume: r[7] * 1e6,
  liquidity: r[8] * 1e6,
  mcap: r[9] * 1e6,
  holders: r[10],
  txns: r[11],
  pools: r[12],
  spark: series(`tk${i}`, 28, r[6] * 1.2, 1.2),
}));

export const getOnchainToken = (id: string) => ONCHAIN_TOKENS.find((t) => t.id === id);

export const HOLDERS = Array.from({ length: 14 }, (_, i) => {
  const pct = [12.4, 8.1, 6.7, 4.9, 3.8, 3.1, 2.6, 2.2, 1.9, 1.6, 1.4, 1.2, 1.1, 0.9][i];
  const labels = ["Binance Hot Wallet", "Uniswap v3 Pool", "Coinbase Custody", "Treasury Multisig", "Whale", "Wintermute", "Whale", "Kraken", "Jump Trading", "Whale", "OKX", "Whale", "Bybit", "Whale"];
  return {
    rank: i + 1,
    address: fakeAddress(`holder${i}`),
    label: labels[i],
    pct,
    balance: pct * 1.2e6,
    txns: 40 + ((i * 97) % 900),
    since: ["2y", "1y", "3y", "8mo", "11mo", "2y", "4mo", "3y", "1y", "6mo", "2y", "5mo", "1y", "9mo"][i],
  };
});

export const TRANSACTIONS = Array.from({ length: 16 }, (_, i) => {
  const r = rng(i + 77);
  const type = (["Swap", "Swap", "Add Liquidity", "Swap", "Remove Liquidity", "Swap"] as const)[i % 6];
  const side = r() > 0.5 ? "Buy" : "Sell";
  const pool = POOLS[i % 8];
  const usd = 800 + r() * 180000;
  return {
    id: `tx${i}`,
    hash: fakeAddress(`txh${i}`, 64),
    type,
    side,
    pair: `${pool.base}/${pool.quote}`,
    network: pool.network,
    usd,
    amountBase: usd / pool.price,
    wallet: fakeAddress(`txw${i}`),
    time: i < 4 ? `${(i + 1) * 12}s ago` : i < 10 ? `${i - 2} min ago` : `${i - 8} h ago`,
    dex: pool.dex,
  };
});
