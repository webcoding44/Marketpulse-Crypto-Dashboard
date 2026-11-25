"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, BarChart3, Crown, Flame, Gem, Image as ImageIcon, Layers, ShoppingCart, Tag, Users } from "lucide-react";
import { NFT_COLLECTIONS, SALES, getCollection, type NftCollection } from "@/lib/mock-data/nfts";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { SelectDropdown } from "@/components/ui/dropdown";
import { MetricCard } from "@/components/shared/metric-card";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { KeyStats, ProgressBar } from "@/components/shared/key-stats";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { NetworkChip } from "@/features/defi/defi-tables";
import { cn, formatNumber, rng, shortAddress } from "@/lib/utils";

export function NftArt({ colors, seed = 1, className }: { colors: [string, string]; seed?: number; className?: string }) {
  const r = rng(seed * 7919 + 13);
  const blobs = Array.from({ length: 4 }, () => ({ cx: r() * 100, cy: r() * 100, r: 14 + r() * 30, o: 0.12 + r() * 0.25 }));
  const eye = 34 + r() * 8;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={cn("size-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`g${seed}-${colors[0].slice(1)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#g${seed}-${colors[0].slice(1)})`} />
      {blobs.map((b, i) => <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#fff" opacity={b.o} />)}
      <path d={`M0 ${78 + r() * 10} Q 30 ${60 + r() * 14} 55 ${76 + r() * 8} T 100 ${70 + r() * 10} V100 H0Z`} fill="#000" opacity="0.18" />
      {/* simple character mark */}
      <circle cx="50" cy="52" r="20" fill="#fff" opacity="0.92" />
      <circle cx={eye + 4} cy="49" r="3" fill={colors[1]} />
      <circle cx={100 - eye - 4} cy="49" r="3" fill={colors[1]} />
      <path d="M43 59 Q50 65 57 59" stroke={colors[1]} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function CollectionCard({ c }: { c: NftCollection }) {
  return (
    <Link href={`/nfts/${c.id}`} className="group block">
      <Card className="overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:shadow-pop">
        <div className="relative aspect-[5/4] overflow-hidden">
          <div className="size-full transition-transform duration-300 group-hover:scale-105"><NftArt colors={c.colors} seed={c.rank} /></div>
          <span className="absolute left-3 top-3 rounded-lg bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">#{c.rank}</span>
          <span className="absolute right-3 top-3 rounded-lg bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">{c.chain}</span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1.5"><h3 className="truncate text-sm font-semibold text-ink">{c.name}</h3><BadgeCheck className="size-4 shrink-0 text-primary" /></div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted">
            <div>Floor<div className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink">{c.floor} {c.chain === "Solana" ? "SOL" : "ETH"}</div></div>
            <div className="text-right">24h Vol<div className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink">{formatNumber(c.volume)} ETH</div></div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3"><span className="text-xs text-muted">Floor 24h</span><PriceChangeIndicator value={c.floorChange} /></div>
        </div>
      </Card>
    </Link>
  );
}

export function NftRankingTable({ rows, pageSize = 10 }: { rows: NftCollection[]; pageSize?: number }) {
  const columns: Column<NftCollection>[] = [
    { key: "rank", header: "#", sort: (c) => c.rank, className: "w-12 text-muted tabular-nums", render: (c) => c.rank },
    { key: "n", header: "Collection", sticky: true, sort: (c) => c.name, render: (c) => <Link href={`/nfts/${c.id}`} className="flex items-center gap-3"><span className="size-11 shrink-0 overflow-hidden rounded-xl"><NftArt colors={c.colors} seed={c.rank} /></span><span className="leading-tight"><span className="flex items-center gap-1 font-semibold text-ink">{c.name}<BadgeCheck className="size-3.5 text-primary" /></span><span className="text-xs text-muted">{c.chain}</span></span></Link> },
    { key: "floor", header: "Floor Price", align: "right", sort: (c) => c.floor, className: "font-semibold tabular-nums text-ink", render: (c) => `${c.floor} ${c.chain === "Solana" ? "SOL" : "ETH"}` },
    { key: "fc", header: "Floor Δ", align: "right", sort: (c) => c.floorChange, render: (c) => <PriceChangeIndicator value={c.floorChange} /> },
    { key: "vol", header: "Volume 24h", align: "right", sort: (c) => c.volume, className: "tabular-nums text-ink", render: (c) => `${formatNumber(c.volume)} ETH` },
    { key: "vc", header: "Volume Δ", align: "right", sort: (c) => c.volumeChange, render: (c) => <PriceChangeIndicator value={c.volumeChange} /> },
    { key: "sales", header: "Sales", align: "right", sort: (c) => c.sales, className: "tabular-nums", render: (c) => formatNumber(c.sales) },
    { key: "owners", header: "Owners", align: "right", sort: (c) => c.owners, className: "tabular-nums", render: (c) => formatNumber(c.owners) },
    { key: "listed", header: "Listed", align: "right", className: "tabular-nums", render: (c) => `${c.listedPct}%` },
    { key: "ch", header: "Floor 7d", align: "right", render: (c) => <SparklinePlaceholder data={c.spark} positive={c.floorChange >= 0} width={90} height={30} /> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} pageSize={pageSize} minWidth={1050} initialSort={{ key: "rank", dir: "asc" }} />;
}

function SalesFeed({ limit = 8 }: { limit?: number }) {
  return (
    <ul className="divide-y divide-line px-5">
      {SALES.slice(0, limit).map((s) => (
        <li key={s.id} className="flex items-center gap-3 py-3">
          <span className="size-11 shrink-0 overflow-hidden rounded-xl"><NftArt colors={s.colors as [string, string]} seed={s.seed} /></span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[13px] font-semibold text-ink">{s.collection} {s.item}</div>
            <div className="mt-0.5 truncate text-xs text-muted">{shortAddress(s.seller, 6, 4)} → {shortAddress(s.buyer, 6, 4)} · {s.market}</div>
          </div>
          <div className="text-right leading-tight"><div className="text-[13px] font-semibold tabular-nums text-ink">{s.price} ETH</div><div className="text-xs text-muted">{s.time}</div></div>
        </li>
      ))}
    </ul>
  );
}

export function NftOverviewView() {
  const trending = [...NFT_COLLECTIONS].sort((a, b) => b.volumeChange - a.volumeChange).slice(0, 4);
  return (
    <div className="space-y-6">
      <PageHeader title="NFT Overview" description="Market-wide NFT volume, floor prices, trending collections and live sales." actions={<Button variant="primary" href="/nfts/collections">Browse collections</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="NFT Market Cap" value="$5.24B" change={1.9} icon={<Gem />} sparkSeed="nft-mc" />
        <MetricCard label="24h Volume" value="$42.8M" change={8.4} icon={<BarChart3 />} sparkSeed="nft-v" />
        <MetricCard label="Sales 24h" value="18,420" change={-2.3} icon={<ShoppingCart />} sparkSeed="nft-s-d" />
        <MetricCard label="Active Traders" value="12.9K" change={4.1} icon={<Users />} sparkSeed="nft-t" />
      </div>
      <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><Flame className="size-4 text-warning" /> Trending now</h2><Button size="xs" variant="ghost" href="/nfts/trending">See all</Button></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{trending.map((c) => <CollectionCard key={c.id} c={c} />)}</div>
      </section>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="NFT Trading Volume" subtitle="All marketplaces · ETH" hideToolbar timeframes={["24H", "7D", "30D", "1Y"]} defaultTimeframe="30D">
          <ChartPlaceholder variant="bars" height={250} seed="nft-volume" yLabels={["60K", "45K", "30K", "15K", "0"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Volume by Chain" />
          <div className="flex flex-col items-center gap-5 p-5">
            <DonutChart size={150} thickness={16} segments={[{ label: "Ethereum", value: 61, color: "#627EEA" }, { label: "Solana", value: 22, color: "#9945FF" }, { label: "Base", value: 8, color: "#0052FF" }, { label: "Polygon", value: 5, color: "#8247E5" }, { label: "Others", value: 4, color: "#B8C2D8" }]} />
            <div className="w-full"><Legend segments={[{ label: "Ethereum", value: 61, color: "#627EEA" }, { label: "Solana", value: 22, color: "#9945FF" }, { label: "Base", value: 8, color: "#0052FF" }, { label: "Polygon", value: 5, color: "#8247E5" }, { label: "Others", value: 4, color: "#B8C2D8" }]} /></div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="overflow-hidden xl:col-span-3"><CardHeader title="Collection Rankings" icon={<Crown />} action={<Button size="xs" variant="ghost" href="/nfts/top">Full ranking</Button>} /><div className="mt-4"><NftRankingTable rows={NFT_COLLECTIONS.slice(0, 6)} pageSize={6} /></div></Card>
        <Card className="xl:col-span-2"><CardHeader title="Recent Sales" subtitle="Live marketplace activity" icon={<Tag />} /><div className="pt-2"><SalesFeed /></div></Card>
      </div>
    </div>
  );
}

export function CollectionsView({ mode }: { mode: "all" | "trending" | "top" }) {
  const [q, setQ] = useState("");
  const [chain, setChain] = useState("All chains");
  const [sort, setSort] = useState(mode === "trending" ? "Volume change" : "Volume");
  const [range, setRange] = useState("24h");
  const rows = useMemo(() => {
    const l = NFT_COLLECTIONS.filter((c) => (chain === "All chains" || c.chain === chain) && c.name.toLowerCase().includes(q.toLowerCase()));
    return [...l].sort((a, b) => (sort === "Floor price" ? b.floor - a.floor : sort === "Volume change" ? b.volumeChange - a.volumeChange : b.volume - a.volume));
  }, [q, chain, sort]);
  const titles = { all: ["All Collections", "Explore every verified NFT collection with floor price, volume and holder stats."], trending: ["Trending Collections", "Collections with the fastest-growing trading volume right now."], top: ["Top NFT Collections", "Ranking of the largest collections by trading volume and market capitalization."] }[mode];
  return (
    <div className="space-y-6">
      <PageHeader title={titles[0]} description={titles[1]} badge={mode === "trending" ? <StatusBadge tone="warning" dot>Hot</StatusBadge> : undefined} />
      <Card className="flex flex-wrap items-center gap-2.5 p-4">
        <SearchInput value={q} onChange={setQ} placeholder="Search collections" className="w-full sm:w-64" />
        <SelectDropdown options={["All chains", "Ethereum", "Solana", "Base"]} value={chain} onChange={setChain} prefix="Chain:" />
        <SelectDropdown options={["Volume", "Floor price", "Volume change"]} value={sort} onChange={setSort} prefix="Sort:" />
        <Tabs className="ml-auto" ariaLabel="Range" value={range} onChange={setRange} items={["24h", "7d", "30d", "All"].map((r) => ({ id: r, label: r }))} />
      </Card>
      {mode === "top" ? (
        <Card className="overflow-hidden"><NftRankingTable rows={rows} pageSize={12} /></Card>
      ) : rows.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{rows.map((c) => <CollectionCard key={c.id} c={c} />)}</div>
      ) : (
        <Card className="p-12 text-center text-sm text-muted">No collections match your filters.</Card>
      )}
    </div>
  );
}

export function CollectionDetailView({ id }: { id: string }) {
  const c = getCollection(id)!;
  const unit = c.chain === "Solana" ? "SOL" : "ETH";
  const items = Array.from({ length: 10 }, (_, i) => ({ n: 1200 + i * 317, price: +(c.floor * (1 + (i % 5) * 0.12)).toFixed(2), seed: c.rank * 31 + i }));
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-36 sm:h-48"><NftArt colors={c.colors} seed={c.rank + 40} className="scale-150 opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /></div>
        <div className="flex flex-wrap items-end justify-between gap-4 px-5 pb-5">
          <div className="-mt-12 flex items-end gap-4">
            <span className="size-24 shrink-0 overflow-hidden rounded-2xl ring-4 ring-card"><NftArt colors={c.colors} seed={c.rank} /></span>
            <div className="pb-1">
              <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-ink">{c.name}<BadgeCheck className="size-5 text-primary" /></h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted"><NetworkChip name={c.chain} /><span>·</span><span>{formatNumber(c.items)} items</span><span>·</span><span>Rank #{c.rank}</span></div>
            </div>
          </div>
          <div className="flex gap-2"><Button icon={<Layers className="size-4" />}>Watch</Button><Button variant="primary" icon={<ShoppingCart className="size-4" />}>View on marketplace</Button></div>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {[["Floor Price", `${c.floor} ${unit}`, c.floorChange], ["24h Volume", `${formatNumber(c.volume)} ETH`, c.volumeChange], ["Market Cap", `${formatNumber(Math.round(c.marketCap))} ETH`, undefined], ["Owners", formatNumber(c.owners), undefined], ["Listed", `${c.listedPct}%`, undefined], ["Top Sale", `${formatNumber(c.topSale)} ETH`, undefined]].map(([l, v, ch]) => (
          <Card key={l as string} className="p-4"><div className="text-xs text-muted">{l}</div><div className="mt-1.5 text-base font-semibold tabular-nums text-ink">{v}</div>{typeof ch === "number" && <div className="mt-1.5"><PriceChangeIndicator value={ch} /></div>}</Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Floor Price" subtitle={`${c.name} · ${unit}`} hideToolbar timeframes={["24H", "7D", "30D", "90D", "ALL"]} defaultTimeframe="30D">
          <ChartPlaceholder variant="area" height={280} seed={c.id} trend={c.floorChange * 3} yLabels={[1.2, 1.1, 1, 0.9, 0.8].map((m) => `${(c.floor * m).toFixed(1)}`)} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Market Statistics" />
          <div className="px-5 pb-3 pt-1"><KeyStats items={[{ label: "Total supply", value: formatNumber(c.items) }, { label: "Unique owners", value: `${formatNumber(c.owners)} (${((c.owners / c.items) * 100).toFixed(0)}%)` }, { label: "Sales 24h", value: formatNumber(c.sales) }, { label: "Avg. sale price", value: `${(c.volume / (c.sales || 1)).toFixed(2)} ETH` }, { label: "Royalty", value: "5%" }]} /></div>
          <div className="px-5 pb-5"><div className="mb-1.5 flex justify-between text-xs text-muted"><span>Listed</span><span>{c.listedPct}%</span></div><ProgressBar value={c.listedPct * 5} /></div>
        </Card>
      </div>
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><ImageIcon className="size-4 text-primary" /> Items for sale</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {items.map((it) => (
            <Card key={it.n} className="overflow-hidden"><div className="aspect-square"><NftArt colors={c.colors} seed={it.seed} /></div><div className="p-3"><div className="text-[13px] font-semibold text-ink">{c.name.split(" ")[0]} #{it.n}</div><div className="mt-1 text-xs text-muted">Price <b className="text-ink">{it.price} {unit}</b></div></div></Card>
          ))}
        </div>
      </section>
      <Card><CardHeader title="Sales Activity" subtitle="Recent transactions" icon={<Tag />} /><div className="pt-2"><SalesFeed limit={10} /></div></Card>
    </div>
  );
}
