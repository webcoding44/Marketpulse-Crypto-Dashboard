import { series } from "@/lib/utils";

export type RwaCategory = "stocks" | "commodities" | "etfs";

export interface RwaAsset {
  id: string;
  name: string;
  symbol: string;
  category: RwaCategory;
  issuer: string;
  color: string;
  price: number;
  c24h: number;
  c7d: number;
  mcap: number;
  volume: number;
  underlying: string;
  underlyingPrice: number;
  chain: string;
  custodian: string;
  holders: number;
  yield?: number;
  spark: number[];
}

type R = [string, string, string, RwaCategory, string, string, number, number, number, number, number, string, number, string, string, number, number?];
const ROWS: R[] = [
  ["tsla", "Tesla Inc.", "TSLAx", "stocks", "Backed Finance", "#E31937", 248.3, 1.6, 4.2, 84e6, 12.4e6, "TSLA · NASDAQ", 248.1, "Solana", "Maple Custody", 18400],
  ["aapl", "Apple Inc.", "AAPLx", "stocks", "Backed Finance", "#6B7280", 214.8, 0.4, 1.1, 62e6, 9.8e6, "AAPL · NASDAQ", 214.7, "Solana", "Maple Custody", 15200],
  ["nvda", "NVIDIA Corp.", "NVDAx", "stocks", "Backed Finance", "#76B900", 128.6, 3.1, 8.4, 71e6, 14.1e6, "NVDA · NASDAQ", 128.4, "Ethereum", "Maple Custody", 21300],
  ["msft", "Microsoft Corp.", "MSFTx", "stocks", "Backed Finance", "#0078D4", 441.2, 0.7, 2.2, 38e6, 5.2e6, "MSFT · NASDAQ", 441.0, "Solana", "Maple Custody", 8900],
  ["amzn", "Amazon.com", "AMZNx", "stocks", "Dinari", "#FF9900", 186.4, -0.5, 1.4, 29e6, 4.1e6, "AMZN · NASDAQ", 186.5, "Arbitrum", "Interactive Brokers", 6400],
  ["coin", "Coinbase Global", "COINx", "stocks", "Dinari", "#1652F0", 246.9, 2.8, 6.6, 22e6, 6.7e6, "COIN · NASDAQ", 246.5, "Base", "Interactive Brokers", 7700],
  ["paxg", "PAX Gold", "PAXG", "commodities", "Paxos", "#E8B923", 2338.4, 0.6, 2.4, 612e6, 38e6, "1 troy oz LBMA gold", 2337.9, "Ethereum", "Brink's London vaults", 54200],
  ["xaut", "Tether Gold", "XAUt", "commodities", "Tether", "#D4A017", 2336.1, 0.6, 2.3, 784e6, 44e6, "1 troy oz gold bar", 2335.8, "Ethereum", "Swiss vault", 41800],
  ["kag", "Kinesis Silver", "KAG", "commodities", "Kinesis", "#9CA3AF", 29.84, 1.2, 3.8, 41e6, 3.2e6, "1 troy oz silver", 29.81, "Kinesis", "Loomis International", 12100],
  ["kau", "Kinesis Gold", "KAU", "commodities", "Kinesis", "#EAB308", 75.2, 0.6, 2.3, 58e6, 4.1e6, "1 gram gold", 75.1, "Kinesis", "Loomis International", 14800],
  ["buidl", "BlackRock USD Institutional Digital Liquidity Fund", "BUIDL", "etfs", "BlackRock / Securitize", "#111827", 1.0, 0.0, 0.1, 2.1e9, 82e6, "US Treasury bills & repo", 1.0, "Ethereum", "BNY Mellon", 82, 4.6],
  ["ousg", "Ondo Short-Term US Government Bond", "OUSG", "etfs", "Ondo Finance", "#2563EB", 108.4, 0.0, 0.1, 612e6, 18e6, "BlackRock SHV ETF", 108.3, "Ethereum", "Coinbase Custody", 1240, 4.4],
  ["spyx", "SPDR S&P 500 ETF", "SPYx", "etfs", "Backed Finance", "#0F766E", 548.2, 0.5, 1.6, 96e6, 22e6, "SPY · NYSE Arca", 548.0, "Solana", "Maple Custody", 19500],
  ["qqqx", "Invesco QQQ Trust", "QQQx", "etfs", "Backed Finance", "#7C3AED", 478.6, 0.9, 2.4, 74e6, 16e6, "QQQ · NASDAQ", 478.4, "Solana", "Maple Custody", 14100],
  ["usdy", "Ondo US Dollar Yield", "USDY", "etfs", "Ondo Finance", "#0EA5E9", 1.06, 0.0, 0.1, 548e6, 9.4e6, "Short-term Treasuries + bank deposits", 1.06, "Ethereum", "Ankura Trust", 22400, 5.1],
];

export const RWA_ASSETS: RwaAsset[] = ROWS.map((r) => ({
  id: r[0],
  name: r[1],
  symbol: r[2],
  category: r[3],
  issuer: r[4],
  color: r[5],
  price: r[6],
  c24h: r[7],
  c7d: r[8],
  mcap: r[9],
  volume: r[10],
  underlying: r[11],
  underlyingPrice: r[12],
  chain: r[13],
  custodian: r[14],
  holders: r[15],
  yield: r[16],
  spark: series(r[0] + "rwa", 28, r[8] * 2, 0.8),
}));

export const getRwa = (id: string) => RWA_ASSETS.find((a) => a.id === id);
