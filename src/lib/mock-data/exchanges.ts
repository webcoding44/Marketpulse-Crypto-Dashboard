import type { Exchange } from "@/types";
import { hashStr, rng, series } from "@/lib/utils";

type Row = [string, string, string, number, number, number, number, number, string, number, string, number];
// id, name, color, trust, vol($B), change, pairs, coins, country, founded, visits, reserves($B)
const ROWS: Row[] = [
  ["binance", "Binance", "#F0B90B", 10, 18.4, 3.2, 1620, 410, "Cayman Islands", 2017, "52.1M", 61.2],
  ["coinbase", "Coinbase", "#1652F0", 10, 3.8, -1.4, 540, 238, "United States", 2012, "38.6M", 24.8],
  ["okx", "OKX", "#151B2B", 9, 4.6, 2.1, 780, 320, "Seychelles", 2017, "14.2M", 17.3],
  ["bybit", "Bybit", "#F7A600", 9, 5.9, 5.4, 690, 460, "United Arab Emirates", 2018, "21.4M", 14.1],
  ["kraken", "Kraken", "#7132F5", 9, 1.2, 0.8, 410, 215, "United States", 2011, "9.8M", 8.9],
  ["bitget", "Bitget", "#00C4D9", 8, 3.1, 4.2, 820, 560, "Seychelles", 2018, "11.3M", 6.4],
  ["kucoin", "KuCoin", "#23AF91", 8, 1.7, -2.3, 1280, 780, "Seychelles", 2017, "13.7M", 5.2],
  ["gate", "Gate.io", "#2354E6", 8, 2.2, 1.1, 2650, 1700, "Cayman Islands", 2013, "10.9M", 7.6],
  ["htx", "HTX", "#1F4FD8", 7, 1.5, -3.6, 1050, 640, "Seychelles", 2013, "6.1M", 4.1],
  ["upbit", "Upbit", "#093687", 9, 2.4, 6.7, 480, 230, "South Korea", 2017, "8.4M", 5.8],
  ["bitfinex", "Bitfinex", "#16B157", 8, 0.64, -0.9, 360, 190, "British Virgin Islands", 2012, "3.2M", 3.3],
  ["crypto-com", "Crypto.com", "#103F68", 8, 0.92, 1.9, 520, 350, "Singapore", 2016, "17.6M", 6.7],
];

export const EXCHANGES: Exchange[] = ROWS.map((r, i) => ({
  id: r[0],
  rank: i + 1,
  name: r[1],
  color: r[2],
  trust: r[3],
  volume24h: r[4] * 1e9,
  volumeChange: r[5],
  pairs: r[6],
  coins: r[7],
  country: r[8],
  founded: r[9],
  visits: r[10],
  type: "CEX",
  reserves: r[11] * 1e9,
  spark: series(r[0], 28, r[5] * 1.5, 1.1),
}));

export const getExchange = (id: string) => EXCHANGES.find((e) => e.id === id);

export interface MarketPair {
  id: string;
  exchangeId: string;
  exchange: string;
  color: string;
  pair: string;
  price: number;
  spread: number;
  depthPlus: number;
  depthMinus: number;
  volume: number;
  share: number;
  trust: "green" | "yellow";
  updated: string;
}

export function buildPairs(base: string, price: number, volume: number, exchanges = EXCHANGES.slice(0, 9)): MarketPair[] {
  const quotes = ["USDT", "USD", "USDC", "EUR"];
  const r = rng(hashStr(base));
  let total = 0;
  const raw = exchanges.map((e, i) => {
    const v = volume * (0.22 / (i + 1)) * (0.6 + r() * 0.8);
    total += v;
    return { e, v, i };
  });
  return raw.map(({ e, v, i }) => ({
    id: `${e.id}-${base}-${i}`,
    exchangeId: e.id,
    exchange: e.name,
    color: e.color,
    pair: `${base}/${quotes[i % quotes.length]}`,
    price: price * (1 + (r() - 0.5) * 0.0016),
    spread: 0.01 + r() * 0.08,
    depthPlus: (0.4 + r() * 5) * 1e6,
    depthMinus: (0.4 + r() * 5) * 1e6,
    volume: v,
    share: (v / total) * 100,
    trust: r() > 0.15 ? "green" : "yellow",
    updated: r() > 0.4 ? "Recently" : `${Math.ceil(r() * 9)} min ago`,
  }));
}

export interface DerivExchange {
  id: string;
  rank: number;
  name: string;
  color: string;
  oi: number;
  volume24h: number;
  change: number;
  pairs: number;
  funding: number;
  longPct: number;
  founded: number;
  country: string;
  spark: number[];
}

type DRow = [string, string, string, number, number, number, number, number, number, number, string];
const D: DRow[] = [
  ["binance-futures", "Binance Futures", "#F0B90B", 18.6, 62.4, 3.1, 640, 0.0102, 52.4, 2019, "Cayman Islands"],
  ["bybit", "Bybit", "#F7A600", 11.2, 38.8, 5.6, 520, 0.0087, 50.8, 2018, "United Arab Emirates"],
  ["okx", "OKX", "#151B2B", 13.4, 29.6, 1.2, 410, 0.0094, 51.5, 2017, "Seychelles"],
  ["bitget", "Bitget", "#00C4D9", 6.3, 21.4, 4.4, 480, 0.0071, 49.6, 2018, "Seychelles"],
  ["hyperliquid", "Hyperliquid", "#25C7A3", 4.9, 14.8, 12.7, 190, 0.0125, 54.1, 2023, "Decentralized"],
  ["deribit", "Deribit", "#2DD4BF", 12.1, 6.2, -2.4, 120, 0.0064, 55.3, 2016, "Panama"],
  ["cme", "CME Group", "#0A3A70", 14.8, 8.1, 0.6, 24, 0.0, 58.2, 1898, "United States"],
  ["dydx", "dYdX", "#6966FF", 0.62, 2.4, -6.1, 210, 0.0058, 48.7, 2017, "Decentralized"],
];

export const DERIV_EXCHANGES: DerivExchange[] = D.map((r, i) => ({
  id: r[0],
  rank: i + 1,
  name: r[1],
  color: r[2],
  oi: r[3] * 1e9,
  volume24h: r[4] * 1e9,
  change: r[5],
  pairs: r[6],
  funding: r[7],
  longPct: r[8],
  founded: r[9],
  country: r[10],
  spark: series(r[0] + "d", 28, r[5] * 1.4, 1.1),
}));

export const getDerivExchange = (id: string) => DERIV_EXCHANGES.find((e) => e.id === id);

export interface Contract {
  id: string;
  symbol: string;
  base: string;
  color: string;
  exchange: string;
  type: "Perpetual" | "Futures";
  price: number;
  c24h: number;
  funding: number;
  oi: number;
  volume: number;
  basis: number;
  expiry: string;
}

const CONTRACT_ROWS: [string, string, string, string, "Perpetual" | "Futures", number, number, number, number, number, number, string][] = [
  ["BTCUSDT", "BTC", "#F7931A", "Binance Futures", "Perpetual", 62841.2, 1.9, 0.0102, 9.8, 18.4, 0.02, "—"],
  ["ETHUSDT", "ETH", "#627EEA", "Binance Futures", "Perpetual", 3246.1, 2.4, 0.0088, 5.2, 9.1, 0.03, "—"],
  ["SOLUSDT", "SOL", "#9945FF", "Bybit", "Perpetual", 142.4, 4.8, 0.0165, 1.8, 4.2, 0.05, "—"],
  ["BTC-27JUN25", "BTC", "#F7931A", "Deribit", "Futures", 63410.0, 1.8, 0, 2.4, 0.9, 0.91, "Jun 27, 2025"],
  ["XRPUSDT", "XRP", "#23292F", "OKX", "Perpetual", 0.5233, -1.4, -0.0021, 0.7, 1.4, 0.01, "—"],
  ["DOGEUSDT", "DOGE", "#C2A633", "Bybit", "Perpetual", 0.1585, 6.2, 0.0231, 0.9, 2.2, 0.07, "—"],
  ["ETH-27JUN25", "ETH", "#627EEA", "Deribit", "Futures", 3281.5, 2.3, 0, 1.3, 0.5, 1.09, "Jun 27, 2025"],
  ["AVAXUSDT", "AVAX", "#E84142", "Bitget", "Perpetual", 35.84, 3.2, 0.0094, 0.3, 0.7, 0.04, "—"],
  ["LINKUSDT", "LINK", "#2A5ADA", "OKX", "Perpetual", 14.63, 3.8, 0.0112, 0.28, 0.6, 0.03, "—"],
  ["PEPEUSDT", "PEPE", "#4C9A2A", "Hyperliquid", "Perpetual", 0.00000843, 9.8, 0.0312, 0.22, 0.9, 0.09, "—"],
  ["BTC-26SEP25", "BTC", "#F7931A", "CME Group", "Futures", 64580.0, 1.7, 0, 4.1, 1.8, 2.76, "Sep 26, 2025"],
  ["NEARUSDT", "NEAR", "#00A878", "Bybit", "Perpetual", 5.25, 5.1, 0.0141, 0.14, 0.4, 0.06, "—"],
];

export const CONTRACTS: Contract[] = CONTRACT_ROWS.map((r) => ({
  id: r[0],
  symbol: r[0],
  base: r[1],
  color: r[2],
  exchange: r[3],
  type: r[4],
  price: r[5],
  c24h: r[6],
  funding: r[7],
  oi: r[8] * 1e9,
  volume: r[9] * 1e9,
  basis: r[10],
  expiry: r[11],
}));
