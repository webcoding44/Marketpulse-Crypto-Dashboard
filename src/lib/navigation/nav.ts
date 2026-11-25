import {
  Activity,
  Building2,
  Coins,
  Compass,
  Image as ImageIcon,
  Landmark,
  LayoutDashboard,
  Layers,
  ArrowLeftRight,
  PieChart,
  Wallet,
} from "lucide-react";
import type { NavGroup, NavLeaf } from "@/types";

export const NAV_TOP: (NavLeaf & { icon: typeof LayoutDashboard })[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "markets",
    label: "Markets",
    icon: Coins,
    href: "/markets/coins",
    match: ["/markets", "/coins"],
    children: [
      { label: "All Cryptocurrencies", href: "/markets/coins" },
      { label: "Trending Coins", href: "/markets/trending" },
      { label: "Top Gainers", href: "/markets/gainers" },
      { label: "Top Losers", href: "/markets/losers" },
      { label: "New Listings", href: "/markets/new", badge: "New" },
      { label: "Stablecoins", href: "/markets/stablecoins" },
      { label: "Categories", href: "/markets/categories" },
      { label: "Coin Comparison", href: "/markets/compare" },
      { label: "Coin Details", href: "/coins/bitcoin", pattern: /^\/coins\/[^/]+$/ },
    ],
  },
  {
    id: "exchanges",
    label: "Exchanges",
    icon: ArrowLeftRight,
    href: "/exchanges",
    match: ["/exchanges"],
    children: [
      { label: "All Exchanges", href: "/exchanges" },
      { label: "Top Exchanges", href: "/exchanges/top" },
      { label: "Exchange Details", href: "/exchanges/binance", pattern: /^\/exchanges\/(?!top$)[^/]+$/ },
      { label: "Trading Pairs", href: "/exchanges/binance/pairs", pattern: /^\/exchanges\/[^/]+\/pairs$/ },
    ],
  },
  {
    id: "derivatives",
    label: "Derivatives",
    icon: Activity,
    href: "/derivatives",
    match: ["/derivatives"],
    children: [
      { label: "Overview", href: "/derivatives" },
      { label: "Derivatives Exchanges", href: "/derivatives/exchanges" },
      { label: "Futures & Perpetuals", href: "/derivatives/futures" },
      { label: "Exchange Details", href: "/derivatives/exchanges/binance-futures", pattern: /^\/derivatives\/exchanges\/[^/]+$/ },
    ],
  },
  {
    id: "defi",
    label: "DeFi & On-chain",
    icon: Layers,
    href: "/defi",
    match: ["/defi"],
    children: [
      { label: "DeFi Overview", href: "/defi" },
      { label: "DEX Markets", href: "/defi/dex" },
      { label: "Blockchain Networks", href: "/defi/networks" },
      { label: "All Liquidity Pools", href: "/defi/pools" },
      { label: "Trending Pools", href: "/defi/pools/trending" },
      { label: "New Pools", href: "/defi/pools/new", badge: "New" },
      { label: "Pool Screener", href: "/defi/screener" },
      { label: "Token Explorer", href: "/defi/tokens" },
      { label: "Token Details", href: "/defi/tokens/weth", pattern: /^\/defi\/tokens\/[^/]+$/ },
      { label: "Pool Details", href: "/defi/pools/weth-usdc-uniswap-v3", pattern: /^\/defi\/pools\/(?!trending$|new$)[^/]+$/ },
      { label: "Token Holders", href: "/defi/tokens/weth/holders", pattern: /^\/defi\/tokens\/[^/]+\/holders$/ },
      { label: "On-chain Transactions", href: "/defi/transactions" },
    ],
  },
  {
    id: "nfts",
    label: "NFT Explorer",
    icon: ImageIcon,
    href: "/nfts",
    match: ["/nfts"],
    children: [
      { label: "NFT Overview", href: "/nfts" },
      { label: "All Collections", href: "/nfts/collections" },
      { label: "Trending Collections", href: "/nfts/trending" },
      { label: "Top Collections", href: "/nfts/top" },
      { label: "Collection Details", href: "/nfts/pudgy-penguins", pattern: /^\/nfts\/(?!collections$|trending$|top$)[^/]+$/ },
    ],
  },
  {
    id: "rwa",
    label: "Real World Assets",
    icon: Landmark,
    href: "/rwa",
    match: ["/rwa"],
    children: [
      { label: "RWA Overview", href: "/rwa" },
      { label: "Tokenized Stocks", href: "/rwa/stocks" },
      { label: "Tokenized Commodities", href: "/rwa/commodities" },
      { label: "Tokenized ETFs", href: "/rwa/etfs" },
      { label: "Asset Details", href: "/rwa/tsla", pattern: /^\/rwa\/(?!stocks$|commodities$|etfs$)[^/]+$/ },
    ],
  },
  {
    id: "wallet",
    label: "Wallet Explorer",
    icon: Wallet,
    href: "/wallet-explorer",
    match: ["/wallet-explorer"],
    children: [
      { label: "Wallet Overview", href: "/wallet-explorer" },
      { label: "Holdings", href: "/wallet-explorer/holdings" },
      { label: "Transactions", href: "/wallet-explorer/transactions" },
      { label: "Profit & Loss", href: "/wallet-explorer/pnl" },
      { label: "Token Transfers", href: "/wallet-explorer/transfers" },
    ],
  },
  {
    id: "treasury",
    label: "Treasury Tracker",
    icon: Building2,
    href: "/treasury",
    match: ["/treasury"],
    children: [
      { label: "Treasury Overview", href: "/treasury" },
      { label: "Public Companies", href: "/treasury/companies" },
      { label: "Government Holdings", href: "/treasury/governments" },
      { label: "Treasury Details", href: "/treasury/strategy", pattern: /^\/treasury\/(?!companies$|governments$)[^/]+$/ },
    ],
  },
  {
    id: "discover",
    label: "Search & Discovery",
    icon: Compass,
    href: "/discover",
    match: ["/discover"],
    children: [
      { label: "Global Search", href: "/discover" },
      { label: "Discover Coins", href: "/discover/coins" },
      { label: "Discover Tokens", href: "/discover/tokens" },
      { label: "Discover Categories", href: "/discover/categories" },
      { label: "Discover Exchanges", href: "/discover/exchanges" },
      { label: "Discover Pools", href: "/discover/pools" },
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: PieChart,
    href: "/portfolio",
    match: ["/portfolio"],
    children: [
      { label: "My Portfolio", href: "/portfolio" },
      { label: "My Watchlist", href: "/portfolio/watchlist" },
      { label: "Price Alerts", href: "/portfolio/alerts" },
      { label: "Analytics", href: "/portfolio/analytics" },
      { label: "Transactions", href: "/portfolio/transactions" },
      { label: "Profile Settings", href: "/portfolio/profile" },
      { label: "Account Settings", href: "/portfolio/account" },
    ],
  },
];

export function isLeafActive(leaf: NavLeaf, pathname: string): boolean {
  return leaf.pattern ? leaf.pattern.test(pathname) : pathname === leaf.href;
}

export function findGroup(pathname: string): NavGroup | undefined {
  return NAV_GROUPS.find((g) => g.match.some((m) => pathname === m || pathname.startsWith(`${m}/`)));
}

/** Labels for breadcrumb segments */
export const CRUMB_LABELS: Record<string, { label: string; href?: string }> = {
  dashboard: { label: "Overview" },
  markets: { label: "Markets", href: "/markets/coins" },
  coins: { label: "Coins", href: "/markets/coins" },
  exchanges: { label: "Exchanges", href: "/exchanges" },
  derivatives: { label: "Derivatives", href: "/derivatives" },
  defi: { label: "DeFi", href: "/defi" },
  nfts: { label: "NFTs", href: "/nfts" },
  rwa: { label: "Real World Assets", href: "/rwa" },
  "wallet-explorer": { label: "Wallet Explorer", href: "/wallet-explorer" },
  treasury: { label: "Treasury", href: "/treasury" },
  discover: { label: "Discover", href: "/discover" },
  portfolio: { label: "Portfolio", href: "/portfolio" },
  pnl: { label: "Profit & Loss" },
  dex: { label: "DEX Markets" },
  etfs: { label: "Tokenized ETFs" },
  stocks: { label: "Tokenized Stocks" },
  commodities: { label: "Tokenized Commodities" },
  governments: { label: "Government Holdings" },
  companies: { label: "Public Companies" },
  help: { label: "Help Center" },
};
