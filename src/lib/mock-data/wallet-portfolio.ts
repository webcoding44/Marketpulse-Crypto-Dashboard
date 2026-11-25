import { fakeAddress } from "./defi";
import { rng } from "@/lib/utils";

export const WALLET_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

export interface Holding {
  symbol: string;
  name: string;
  color: string;
  amount: number;
  price: number;
  c24h: number;
  cost: number;
}

export const WALLET_HOLDINGS: Holding[] = [
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", amount: 84.2, price: 3245.8, c24h: 2.41, cost: 2410 },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", amount: 128400, price: 1, c24h: 0, cost: 1 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", color: "#F7931A", amount: 2.84, price: 62820, c24h: 1.9, cost: 48200 },
  { symbol: "LINK", name: "Chainlink", color: "#2A5ADA", amount: 4200, price: 14.62, c24h: 3.82, cost: 9.4 },
  { symbol: "UNI", name: "Uniswap", color: "#FF007A", amount: 6800, price: 7.92, c24h: -2.8, cost: 9.1 },
  { symbol: "ARB", name: "Arbitrum", color: "#28A0F0", amount: 24000, price: 1.08, c24h: -0.9, cost: 1.34 },
  { symbol: "PEPE", name: "Pepe", color: "#4C9A2A", amount: 480000000, price: 0.00000842, c24h: 9.8, cost: 0.0000041 },
  { symbol: "AAVE", name: "Aave", color: "#B6509E", amount: 120, price: 98.4, c24h: 2.1, cost: 74 },
];

export const PORTFOLIO_HOLDINGS: Holding[] = [
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A", amount: 2.84, price: 62840.5, c24h: 1.95, cost: 41200 },
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", amount: 34.6, price: 3245.8, c24h: 2.41, cost: 2480 },
  { symbol: "SOL", name: "Solana", color: "#9945FF", amount: 420, price: 142.35, c24h: 4.82, cost: 96 },
  { symbol: "LINK", name: "Chainlink", color: "#2A5ADA", amount: 2800, price: 14.62, c24h: 3.82, cost: 11.2 },
  { symbol: "AVAX", name: "Avalanche", color: "#E84142", amount: 610, price: 35.82, c24h: 3.2, cost: 28.4 },
  { symbol: "INJ", name: "Injective", color: "#0AA5C2", amount: 340, price: 24.6, c24h: 7.2, cost: 18.8 },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", amount: 24500, price: 1, c24h: 0, cost: 1 },
  { symbol: "DOGE", name: "Dogecoin", color: "#C2A633", amount: 52000, price: 0.1584, c24h: 6.21, cost: 0.11 },
];

export const holdingValue = (h: Holding) => h.amount * h.price;
export const holdingPnl = (h: Holding) => h.amount * (h.price - h.cost);
export const holdingPnlPct = (h: Holding) => ((h.price - h.cost) / h.cost) * 100;

export const WALLET_TXS = Array.from({ length: 14 }, (_, i) => {
  const r = rng(i + 900);
  const types = ["Swap", "Transfer In", "Transfer Out", "Approve", "Stake", "Swap", "Contract Call"] as const;
  const type = types[i % types.length];
  const sym = ["ETH", "USDC", "LINK", "UNI", "WBTC"][i % 5];
  return {
    id: `wtx${i}`,
    hash: fakeAddress(`wt${i}`, 64),
    type,
    token: sym,
    amount: type === "Approve" ? 0 : +(r() * (sym === "USDC" ? 40000 : 40)).toFixed(2),
    usd: r() * 60000,
    counterparty: fakeAddress(`wc${i}`),
    fee: +(0.0008 + r() * 0.006).toFixed(4),
    status: i === 6 ? "Failed" : "Success",
    time: i < 3 ? `${i * 7 + 3} min ago` : i < 8 ? `${i - 1} h ago` : `${i - 6} d ago`,
  };
});

export const WALLET_TRANSFERS = Array.from({ length: 12 }, (_, i) => {
  const r = rng(i + 1300);
  const sym = ["USDC", "ETH", "LINK", "UNI", "ARB", "WBTC"][i % 6];
  const inbound = i % 3 !== 1;
  return {
    id: `tr${i}`,
    token: sym,
    direction: inbound ? ("In" as const) : ("Out" as const),
    amount: +(r() * (sym === "USDC" ? 50000 : 25)).toFixed(2),
    usd: r() * 80000,
    from: inbound ? fakeAddress(`tf${i}`) : "0x71C7…976F",
    to: inbound ? "0x71C7…976F" : fakeAddress(`tt${i}`),
    network: ["Ethereum", "Arbitrum", "Base", "Ethereum"][i % 4],
    time: `${i + 1} ${i < 6 ? "h" : "d"} ago`,
  };
});

export const PORTFOLIO_TXS = Array.from({ length: 14 }, (_, i) => {
  const r = rng(i + 2100);
  const types = ["Buy", "Sell", "Buy", "Transfer", "Buy", "Sell", "Stake"] as const;
  const h = PORTFOLIO_HOLDINGS[i % 7];
  const amount = +(r() * (h.price > 1000 ? 1.2 : h.price > 10 ? 90 : 4000) + 0.1).toFixed(3);
  return {
    id: `ptx${i}`,
    type: types[i % types.length],
    symbol: h.symbol,
    name: h.name,
    color: h.color,
    amount,
    price: h.price * (0.9 + r() * 0.2),
    date: `Jun ${28 - i * 2 > 0 ? 28 - i * 2 : 30 - i}, 2025`,
    fee: +(r() * 12).toFixed(2),
    venue: ["Coinbase", "Binance", "Kraken", "Ledger Wallet", "Uniswap"][i % 5],
  };
});

export const ALERTS = [
  { id: "a1", symbol: "BTC", name: "Bitcoin", color: "#F7931A", condition: "Price rises above", target: 65000, current: 62840.5, active: true, channel: "Push + Email" },
  { id: "a2", symbol: "ETH", name: "Ethereum", color: "#627EEA", condition: "Price drops below", target: 3000, current: 3245.8, active: true, channel: "Push" },
  { id: "a3", symbol: "SOL", name: "Solana", color: "#9945FF", condition: "Price rises above", target: 150, current: 142.35, active: true, channel: "Push + Email" },
  { id: "a4", symbol: "LINK", name: "Chainlink", color: "#2A5ADA", condition: "24h change above", target: 10, current: 3.82, active: false, channel: "Email" },
  { id: "a5", symbol: "DOGE", name: "Dogecoin", color: "#C2A633", condition: "Price rises above", target: 0.2, current: 0.1584, active: true, channel: "Push" },
  { id: "a6", symbol: "AVAX", name: "Avalanche", color: "#E84142", condition: "Price drops below", target: 30, current: 35.82, active: false, channel: "Email" },
];
