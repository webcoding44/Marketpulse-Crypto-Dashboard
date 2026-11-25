import type { Coin } from "@/types";
import { series } from "@/lib/utils";

/* id, name, symbol, color, price, 1h, 24h, 7d, volume($B), mcap($B), supply(M), maxSupply(M|0), categories */
type Row = [string, string, string, string, number, number, number, number, number, number, number, number, string[]];

const ROWS: Row[] = [
  ["bitcoin", "Bitcoin", "BTC", "#F7931A", 62840.5, 0.12, 1.95, 4.82, 28.4, 1238, 19.7, 21, ["Layer 1", "Store of Value"]],
  ["ethereum", "Ethereum", "ETH", "#627EEA", 3245.8, 0.21, 2.41, 3.12, 14.2, 390, 120.2, 0, ["Layer 1", "Smart Contracts"]],
  ["tether", "Tether", "USDT", "#26A17B", 1.0, 0.0, 0.01, -0.02, 41.6, 112, 112000, 0, ["Stablecoins"]],
  ["bnb", "BNB", "BNB", "#F3BA2F", 584.2, -0.1, 0.82, 2.24, 1.9, 85.1, 145.9, 200, ["Exchange Token", "Layer 1"]],
  ["solana", "Solana", "SOL", "#9945FF", 142.35, 0.4, 4.82, 9.64, 3.4, 65.4, 459.4, 0, ["Layer 1", "Smart Contracts"]],
  ["usd-coin", "USD Coin", "USDC", "#2775CA", 1.0, 0.0, -0.01, 0.01, 8.9, 34.2, 34200, 0, ["Stablecoins"]],
  ["xrp", "XRP", "XRP", "#23292F", 0.5231, -0.2, -1.38, -2.9, 1.2, 28.9, 55300, 100000, ["Payments"]],
  ["dogecoin", "Dogecoin", "DOGE", "#C2A633", 0.1584, 0.6, 6.21, 12.4, 2.1, 22.9, 144600, 0, ["Meme"]],
  ["toncoin", "Toncoin", "TON", "#0098EA", 6.92, 0.1, 1.14, -3.41, 0.42, 17.6, 2540, 5100, ["Layer 1"]],
  ["cardano", "Cardano", "ADA", "#0033AD", 0.4521, -0.3, -2.14, -4.7, 0.38, 16.1, 35600, 45000, ["Layer 1", "Smart Contracts"]],
  ["avalanche", "Avalanche", "AVAX", "#E84142", 35.82, 0.5, 3.2, 6.1, 0.54, 14.2, 396, 720, ["Layer 1", "Smart Contracts"]],
  ["shiba-inu", "Shiba Inu", "SHIB", "#FFA409", 0.00001842, 0.4, 2.7, 8.9, 0.62, 10.9, 589000000, 0, ["Meme"]],
  ["tron", "TRON", "TRX", "#EB0029", 0.1243, 0.0, 0.52, 1.8, 0.48, 10.8, 87200, 0, ["Layer 1"]],
  ["polkadot", "Polkadot", "DOT", "#E6007A", 6.84, -0.2, -1.62, -3.3, 0.21, 9.8, 1430, 0, ["Layer 0"]],
  ["chainlink", "Chainlink", "LINK", "#2A5ADA", 14.62, 0.3, 3.82, 7.2, 0.58, 8.9, 608, 1000, ["Oracle", "DeFi"]],
  ["polygon", "Polygon", "POL", "#8247E5", 0.5812, 0.1, 1.9, -1.2, 0.24, 5.8, 9990, 10000, ["Layer 2"]],
  ["near-protocol", "NEAR Protocol", "NEAR", "#00A878", 5.24, 0.7, 5.1, 11.3, 0.31, 5.7, 1090, 0, ["Layer 1", "AI"]],
  ["litecoin", "Litecoin", "LTC", "#345D9D", 82.4, 0.0, -0.4, 0.9, 0.36, 6.1, 74.7, 84, ["Payments"]],
  ["uniswap", "Uniswap", "UNI", "#FF007A", 7.92, -0.4, -2.8, 2.4, 0.14, 4.7, 600, 1000, ["DeFi", "DEX"]],
  ["internet-computer", "Internet Computer", "ICP", "#29ABE2", 11.84, 0.2, 1.4, -5.2, 0.12, 5.5, 465, 0, ["Layer 1", "AI"]],
  ["aptos", "Aptos", "APT", "#00BFA6", 8.31, 0.3, 2.2, 4.1, 0.19, 3.6, 435, 0, ["Layer 1"]],
  ["arbitrum", "Arbitrum", "ARB", "#28A0F0", 1.08, 0.1, -0.9, -3.8, 0.33, 3.3, 3050, 10000, ["Layer 2"]],
  ["optimism", "Optimism", "OP", "#FF0420", 2.41, 0.5, 4.3, 8.4, 0.29, 2.9, 1210, 4290, ["Layer 2"]],
  ["cosmos", "Cosmos", "ATOM", "#6F7390", 7.54, -0.1, -1.1, -2.2, 0.18, 2.9, 390, 0, ["Layer 0"]],
  ["stellar", "Stellar", "XLM", "#14B6E7", 0.1122, 0.2, 0.9, 1.3, 0.09, 3.3, 29500, 50000, ["Payments"]],
  ["filecoin", "Filecoin", "FIL", "#0090FF", 5.42, 0.4, 2.9, 3.6, 0.17, 3.1, 573, 0, ["Storage"]],
  ["injective", "Injective", "INJ", "#0AA5C2", 24.6, 0.9, 7.2, 14.8, 0.22, 2.4, 97.6, 100, ["DeFi", "Layer 1"]],
  ["render", "Render", "RNDR", "#E5484D", 8.12, 0.6, 6.4, 15.2, 0.35, 3.1, 388, 644, ["AI", "Infrastructure"]],
  ["maker", "Maker", "MKR", "#1AAB9B", 2840.0, -0.2, -0.8, 1.2, 0.08, 2.6, 0.92, 1, ["DeFi"]],
  ["aave", "Aave", "AAVE", "#B6509E", 98.4, 0.3, 2.1, 5.9, 0.16, 1.5, 14.9, 16, ["DeFi", "Lending"]],
  ["dai", "Dai", "DAI", "#F5AC37", 1.0, 0.0, 0.0, 0.01, 0.42, 5.3, 5300, 0, ["Stablecoins", "DeFi"]],
  ["sui", "Sui", "SUI", "#4DA2FF", 1.62, 0.8, 5.6, 13.1, 0.45, 4.4, 2720, 10000, ["Layer 1"]],
  ["sei", "Sei", "SEI", "#9B1C1C", 0.4812, 0.4, 3.1, 6.4, 0.14, 1.4, 2900, 10000, ["Layer 1"]],
  ["pepe", "Pepe", "PEPE", "#4C9A2A", 0.00000842, 1.1, 9.8, 21.6, 1.1, 3.5, 420690000, 0, ["Meme"]],
  ["bonk", "Bonk", "BONK", "#F59E0B", 0.00002214, 0.9, 7.1, 18.2, 0.31, 1.6, 72000000, 0, ["Meme"]],
  ["jupiter", "Jupiter", "JUP", "#31C48D", 0.9812, 0.5, 4.4, 10.1, 0.21, 1.3, 1350, 10000, ["DeFi", "DEX"]],
  ["pyth-network", "Pyth Network", "PYTH", "#7C3AED", 0.3841, 0.4, 3.3, 6.7, 0.1, 1.4, 3600, 10000, ["Oracle"]],
  ["first-digital-usd", "First Digital USD", "FDUSD", "#3B82F6", 0.9998, 0.0, -0.02, 0.0, 3.1, 2.6, 2600, 0, ["Stablecoins"]],
  ["ethena-usde", "Ethena USDe", "USDe", "#4B5563", 1.0004, 0.0, 0.03, 0.04, 0.38, 3.4, 3400, 0, ["Stablecoins", "DeFi"]],
  ["worldcoin", "Worldcoin", "WLD", "#2D3748", 2.84, -0.6, -3.4, -6.2, 0.29, 1.1, 390, 10000, ["AI", "Identity"]],
];

const NEW_IDS: Record<string, string> = { jupiter: "3 days ago", "pyth-network": "5 days ago", sei: "1 week ago", sui: "2 weeks ago", "ethena-usde": "9 days ago", worldcoin: "6 days ago", bonk: "12 days ago" };

export const COINS: Coin[] = ROWS.map((r, i) => {
  const [id, name, symbol, color, price, c1h, c24h, c7d, vol, mcap, supply, max, categories] = r;
  const stable = categories.includes("Stablecoins");
  return {
    id,
    rank: i + 1,
    name,
    symbol,
    color,
    price,
    c1h,
    c24h,
    c7d,
    volume: vol * 1e9,
    marketCap: mcap * 1e9,
    fdv: max ? (max / supply) * mcap * 1e9 : mcap * 1e9,
    supply: supply * 1e6,
    maxSupply: max ? max * 1e6 : null,
    ath: stable ? 1.08 : price * (1.4 + ((i * 7) % 13) / 10),
    athDate: ["Nov 10, 2021", "Mar 14, 2024", "Dec 17, 2017", "Apr 03, 2024", "Jan 19, 2025"][i % 5],
    atl: stable ? 0.92 : price / (6 + ((i * 11) % 40)),
    atlDate: ["Jul 05, 2013", "Oct 21, 2015", "Dec 29, 2022", "Mar 13, 2020", "Sep 11, 2020"][i % 5],
    categories,
    spark: series(id, 28, stable ? 0 : c7d * 1.4, stable ? 0.04 : 1 + (i % 3) * 0.4),
    stable,
    isNew: id in NEW_IDS,
    listed: NEW_IDS[id],
    description: `${name} (${symbol}) is a ${categories[0].toLowerCase()} asset designed for fast, low-cost settlement and an open developer ecosystem. It is secured by a globally distributed network of validators and is widely supported across leading exchanges, wallets and DeFi protocols. This is placeholder editorial content that will be replaced with live asset data.`,
  };
});

export const getCoin = (id: string) => COINS.find((c) => c.id === id);

export const COIN_CATEGORIES = ["All", "Layer 1", "Layer 2", "DeFi", "Meme", "AI", "Stablecoins", "Oracle", "Payments"] as const;

export const GLOBAL_STATS = {
  marketCap: 2.31e12,
  marketCapChange: 2.14,
  volume: 98.6e9,
  volumeChange: -3.42,
  btcDominance: 53.6,
  btcDominanceChange: 0.21,
  ethDominance: 16.9,
  ethDominanceChange: -0.08,
  assets: 14829,
  assetsChange: 0.4,
  fearGreed: 62,
};

export const MARKET_CATEGORIES = [
  { name: "Layer 1", coins: 186, marketCap: 1.68e12, change: 2.4, volume: 41e9, top: ["BTC", "ETH", "SOL"] },
  { name: "Layer 2", coins: 74, marketCap: 38.2e9, change: -0.9, volume: 2.1e9, top: ["POL", "ARB", "OP"] },
  { name: "DeFi", coins: 312, marketCap: 96.4e9, change: 3.2, volume: 6.8e9, top: ["UNI", "LINK", "AAVE"] },
  { name: "Meme", coins: 428, marketCap: 61.5e9, change: 8.4, volume: 9.4e9, top: ["DOGE", "SHIB", "PEPE"] },
  { name: "AI", coins: 136, marketCap: 28.9e9, change: 5.7, volume: 3.2e9, top: ["RNDR", "NEAR", "WLD"] },
  { name: "Stablecoins", coins: 164, marketCap: 168e9, change: 0.02, volume: 62e9, top: ["USDT", "USDC", "DAI"] },
  { name: "Oracle", coins: 22, marketCap: 10.6e9, change: 3.5, volume: 0.7e9, top: ["LINK", "PYTH"] },
  { name: "Payments", coins: 58, marketCap: 38.4e9, change: -0.8, volume: 1.7e9, top: ["XRP", "LTC", "XLM"] },
  { name: "Layer 0", coins: 12, marketCap: 12.9e9, change: -1.4, volume: 0.4e9, top: ["DOT", "ATOM"] },
  { name: "Storage", coins: 18, marketCap: 4.1e9, change: 2.9, volume: 0.3e9, top: ["FIL"] },
];

export const DISTRIBUTION = [
  { label: "Bitcoin", value: 53.6, color: "#F7931A" },
  { label: "Ethereum", value: 16.9, color: "#627EEA" },
  { label: "Stablecoins", value: 7.2, color: "#26A17B" },
  { label: "BNB", value: 3.7, color: "#F3BA2F" },
  { label: "Solana", value: 2.8, color: "#9945FF" },
  { label: "Others", value: 15.8, color: "#B8C2D8" },
];

export const ACTIVITY = [
  { type: "whale", title: "Whale moved 4,200 BTC", meta: "Unknown wallet → Binance", time: "2m ago", tone: "warning" as const },
  { type: "listing", title: "JUP listed on Coinbase", meta: "New spot market · JUP/USD", time: "14m ago", tone: "primary" as const },
  { type: "surge", title: "RNDR up 6.4% in 24h", meta: "Volume spike · 3.1× average", time: "31m ago", tone: "success" as const },
  { type: "liquidation", title: "$48M longs liquidated", meta: "ETH perpetuals · past hour", time: "46m ago", tone: "danger" as const },
  { type: "etf", title: "Spot BTC ETF inflows +$312M", meta: "Net flow · previous session", time: "1h ago", tone: "accent" as const },
  { type: "upgrade", title: "Solana v2.0 validator release", meta: "Network upgrade announced", time: "2h ago", tone: "primary" as const },
];