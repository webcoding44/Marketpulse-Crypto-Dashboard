"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Compass, Flame, History, Search, Sparkles, TrendingUp } from "lucide-react";
import { COINS, MARKET_CATEGORIES } from "@/lib/mock-data/coins";
import { EXCHANGES } from "@/lib/mock-data/exchanges";
import { ONCHAIN_TOKENS, POOLS } from "@/lib/mock-data/defi";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { TrustScore } from "@/components/shared/trust-score";
import { CryptoTable } from "@/features/markets/crypto-table";
import { ExchangeLogo, ExchangeTable } from "@/features/exchanges/exchange-table";
import { PoolsTable, TokensTable, PairLogo } from "@/features/defi/defi-tables";
import { formatPrice, usdCompact } from "@/lib/utils";

function Hero({ q, setQ, placeholder, chips, children }: { q: string; setQ: (v: string) => void; placeholder: string; chips?: string[]; children?: ReactNode }) {
  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -left-10 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-10 -bottom-24 size-72 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Compass className="size-6" /></span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">What are you looking for?</h2>
        <SearchInput size="lg" value={q} onChange={setQ} placeholder={placeholder} className="mt-5 text-left" />
        {chips && <div className="mt-4 flex flex-wrap justify-center gap-2">{chips.map((c) => <button key={c} type="button" onClick={() => setQ(c)} className="rounded-full border border-line bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary">{c}</button>)}</div>}
        {children}
      </div>
    </Card>
  );
}

function Group({ title, href, children, empty }: { title: string; href: string; children: ReactNode; empty?: boolean }) {
  if (empty) return null;
  return (
    <Card>
      <CardHeader title={title} action={<Link href={href} className="text-xs font-semibold text-primary hover:underline">See more</Link>} />
      <div className="p-3 pt-4">{children}</div>
    </Card>
  );
}

const rowCls = "flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-soft";

export function GlobalSearchView({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const n = q.trim().toLowerCase();
  const coins = useMemo(() => COINS.filter((c) => (c.name + c.symbol).toLowerCase().includes(n)).slice(0, 5), [n]);
  const tokens = useMemo(() => ONCHAIN_TOKENS.filter((t) => (t.name + t.symbol + t.address).toLowerCase().includes(n)).slice(0, 4), [n]);
  const pools = useMemo(() => POOLS.filter((p) => `${p.base}/${p.quote} ${p.dex}`.toLowerCase().includes(n)).slice(0, 4), [n]);
  const exs = useMemo(() => EXCHANGES.filter((e) => e.name.toLowerCase().includes(n)).slice(0, 4), [n]);
  const cats = useMemo(() => MARKET_CATEGORIES.filter((c) => c.name.toLowerCase().includes(n)).slice(0, 4), [n]);
  const total = coins.length + tokens.length + pools.length + exs.length + cats.length;

  return (
    <div className="space-y-6">
      <PageHeader title="Global Search" description="Search across coins, on-chain tokens, liquidity pools, exchanges and categories." />
      <Hero q={q} setQ={setQ} placeholder="Search coins, tokens, pools, exchanges…" chips={["Bitcoin", "Solana", "Uniswap", "Binance", "Meme"]} />
      {!n ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card><CardHeader title="Trending Searches" icon={<Flame />} /><ul className="p-3 pt-4">{COINS.slice(4, 9).map((c, i) => <li key={c.id}><Link href={`/coins/${c.id}`} className={rowCls}><span className="w-4 text-xs font-semibold text-muted">{i + 1}</span><CoinLogo symbol={c.symbol} color={c.color} size={30} /><span className="flex-1 text-[13px] font-semibold text-ink">{c.name}</span><PriceChangeIndicator value={c.c24h} /></Link></li>)}</ul></Card>
          <Card><CardHeader title="Recently Viewed" icon={<History />} /><ul className="p-3 pt-4">{[COINS[0], COINS[1], COINS[14], COINS[28], COINS[33]].map((c) => <li key={c.id}><Link href={`/coins/${c.id}`} className={rowCls}><CoinLogo symbol={c.symbol} color={c.color} size={30} /><span className="flex-1 text-[13px] font-semibold text-ink">{c.name}</span><span className="text-[13px] tabular-nums text-muted">{formatPrice(c.price)}</span></Link></li>)}</ul></Card>
          <Card><CardHeader title="Explore by Topic" icon={<Sparkles />} /><div className="flex flex-wrap gap-2 p-5">{MARKET_CATEGORIES.map((c) => <button key={c.name} type="button" onClick={() => setQ(c.name)} className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary hover:brightness-95">{c.name}</button>)}</div></Card>
        </div>
      ) : total === 0 ? (
        <Card><EmptyState icon={<Search />} title={`No results for “${q}”`} description="Check the spelling or try a different keyword, symbol or contract address." /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Group title={`Coins (${coins.length})`} href="/markets/coins" empty={!coins.length}>{coins.map((c) => <Link key={c.id} href={`/coins/${c.id}`} className={rowCls}><CoinLogo symbol={c.symbol} color={c.color} size={32} /><span className="flex-1 leading-tight"><span className="block text-[13px] font-semibold text-ink">{c.name}</span><span className="text-xs text-muted">{c.symbol} · #{c.rank}</span></span><span className="text-right text-[13px] tabular-nums text-ink">{formatPrice(c.price)}</span><PriceChangeIndicator value={c.c24h} /></Link>)}</Group>
          <Group title={`On-chain tokens (${tokens.length})`} href="/defi/tokens" empty={!tokens.length}>{tokens.map((t) => <Link key={t.id} href={`/defi/tokens/${t.id}`} className={rowCls}><CoinLogo symbol={t.symbol} color={t.color} size={32} /><span className="flex-1 leading-tight"><span className="block text-[13px] font-semibold text-ink">{t.name}</span><span className="text-xs text-muted">{t.network}</span></span><span className="text-[13px] tabular-nums text-ink">{formatPrice(t.price)}</span></Link>)}</Group>
          <Group title={`Liquidity pools (${pools.length})`} href="/defi/pools" empty={!pools.length}>{pools.map((p) => <Link key={p.id} href={`/defi/pools/${p.id}`} className={rowCls}><PairLogo base={p.base} baseColor={p.baseColor} quote={p.quote} quoteColor={p.quoteColor} size={28} /><span className="flex-1 leading-tight"><span className="block text-[13px] font-semibold text-ink">{p.base}/{p.quote}</span><span className="text-xs text-muted">{p.dex} · {p.network}</span></span><span className="text-[13px] tabular-nums text-ink">{usdCompact(p.liquidity)}</span></Link>)}</Group>
          <Group title={`Exchanges (${exs.length})`} href="/exchanges" empty={!exs.length}>{exs.map((e) => <Link key={e.id} href={`/exchanges/${e.id}`} className={rowCls}><ExchangeLogo name={e.name} color={e.color} size={32} /><span className="flex-1 text-[13px] font-semibold text-ink">{e.name}</span><TrustScore score={e.trust} /></Link>)}</Group>
          <Group title={`Categories (${cats.length})`} href="/markets/categories" empty={!cats.length}>{cats.map((c) => <Link key={c.name} href="/markets/categories" className={rowCls}><span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary"><TrendingUp className="size-4" /></span><span className="flex-1 text-[13px] font-semibold text-ink">{c.name}</span><span className="text-xs text-muted">{usdCompact(c.marketCap)}</span><PriceChangeIndicator value={c.change} /></Link>)}</Group>
        </div>
      )}
    </div>
  );
}

export function DiscoverCoinsView() {
  const [preset, setPreset] = useState("all");
  const coins = useMemo(() => {
    switch (preset) {
      case "under1": return COINS.filter((c) => c.price < 1 && !c.stable);
      case "volume": return [...COINS].filter((c) => !c.stable).sort((a, b) => b.volume / b.marketCap - a.volume / a.marketCap).slice(0, 20);
      case "large": return COINS.filter((c) => c.marketCap > 20e9);
      case "small": return COINS.filter((c) => c.marketCap < 5e9);
      case "movers": return COINS.filter((c) => Math.abs(c.c24h) >= 4);
      default: return COINS;
    }
  }, [preset]);
  return (
    <div className="space-y-6">
      <PageHeader title="Discover Coins" description="Find your next asset with smart presets, category filters and performance screens." />
      <Card className="p-4"><Tabs variant="pill" ariaLabel="Presets" value={preset} onChange={setPreset} items={[{ id: "all", label: "All coins" }, { id: "under1", label: "Under $1" }, { id: "volume", label: "High volume / cap" }, { id: "large", label: "Large cap" }, { id: "small", label: "Small cap" }, { id: "movers", label: "Big movers" }]} /></Card>
      <CryptoTable key={preset} coins={coins} pageSize={10} />
    </div>
  );
}

export function DiscoverTokensView() {
  const [q, setQ] = useState("");
  const rows = ONCHAIN_TOKENS.filter((t) => (t.name + t.symbol + t.address).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Discover Tokens" description="Explore on-chain tokens by network, liquidity and holder growth." />
      <Hero q={q} setQ={setQ} placeholder="Token name, symbol or contract address" chips={["WETH", "PEPE", "BONK", "0x…"]} />
      <Card className="overflow-hidden"><TokensTable tokens={rows} /></Card>
    </div>
  );
}

export function DiscoverCategoriesView() {
  const [q, setQ] = useState("");
  const rows = MARKET_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Discover Categories" description="Browse crypto sectors and narratives." />
      <Hero q={q} setQ={setQ} placeholder="Search categories, e.g. AI, DeFi, Layer 2" chips={["AI", "DeFi", "Meme", "Layer 2"]} />
      {rows.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <Link key={c.name} href="/markets/categories" className="group">
              <Card className="p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-pop">
                <div className="flex items-center justify-between"><h3 className="text-[15px] font-semibold text-ink">{c.name}</h3><PriceChangeIndicator value={c.change} /></div>
                <div className="mt-4 flex items-end justify-between"><div><div className="text-xs text-muted">Market cap</div><div className="text-xl font-semibold tabular-nums text-ink">{usdCompact(c.marketCap)}</div></div><span className="flex -space-x-2">{c.top.map((s) => <span key={s} className="rounded-full ring-2 ring-card"><CoinLogo symbol={s} color={COINS.find((x) => x.symbol === s)?.color ?? "#8B5CF6"} size={28} /></span>)}</span></div>
                <div className="mt-4 border-t border-line pt-3 text-xs text-muted">{c.coins} coins · Vol {usdCompact(c.volume)}</div>
              </Card>
            </Link>
          ))}
        </div>
      ) : <Card><EmptyState title="No categories found" description="Try a different keyword." /></Card>}
    </div>
  );
}

export function DiscoverExchangesView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Discover Exchanges" description="Compare venues by trust, liquidity and listed assets." />
      <ExchangeTable exchanges={EXCHANGES} pageSize={8} />
    </div>
  );
}

export function DiscoverPoolsView() {
  const [q, setQ] = useState("");
  const [chip, setChip] = useState("all");
  const rows = POOLS.filter((p) => `${p.base}/${p.quote}`.toLowerCase().includes(q.toLowerCase()) && (chip === "all" || (chip === "new" ? p.ageH < 168 : chip === "deep" ? p.liquidity > 50e6 : p.c24h > 5)));
  return (
    <div className="space-y-6">
      <PageHeader title="Discover On-chain Pools" description="Surface new, deep and fast-moving liquidity pools." />
      <Hero q={q} setQ={setQ} placeholder="Search pair, e.g. SOL/USDC" chips={["WETH", "SOL", "PEPE"]}>
        <div className="mt-5 flex justify-center"><Tabs ariaLabel="Pool filter" value={chip} onChange={setChip} items={[{ id: "all", label: "All" }, { id: "new", label: "New < 7d" }, { id: "deep", label: "Deep liquidity" }, { id: "hot", label: "Gainers > 5%" }]} /></div>
      </Hero>
      <Card className="overflow-hidden"><PoolsTable pools={rows} pageSize={10} /></Card>
    </div>
  );
}
