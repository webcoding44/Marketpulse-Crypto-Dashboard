"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, ArrowRightLeft, BarChart3, Droplets, Filter, Flame, Layers, Network as NetIcon, Rocket, ShieldCheck, Users, Wallet, Zap, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { DEXES, NETWORKS, ONCHAIN_TOKENS, POOLS, TRANSACTIONS, HOLDERS, ageLabel, type OnchainToken, type Pool } from "@/lib/mock-data/defi";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { SelectDropdown } from "@/components/ui/dropdown";
import { MetricCard } from "@/components/shared/metric-card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterBar } from "@/components/shared/filter-bar";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { KeyStats, ProgressBar } from "@/components/shared/key-stats";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { BarChartPlaceholder } from "@/components/charts/bar-chart-placeholder";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { CopyAddress, HoldersTable, NetworkChip, PairLogo, PoolsTable, TokensTable, TxTable, networkColor } from "./defi-tables";
import { cn, compact, formatNumber, formatPrice, usdCompact } from "@/lib/utils";

type Dex = (typeof DEXES)[number];
type Net = (typeof NETWORKS)[number];

function NetworkTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <Tabs variant="pill" ariaLabel="Network" value={value} onChange={onChange} items={[{ id: "All", label: "All networks" }, ...NETWORKS.map((n) => ({ id: n.name, label: n.name }))]} />
    </div>
  );
}

function DexTable({ rows, pageSize = 8 }: { rows: Dex[]; pageSize?: number }) {
  const columns: Column<Dex>[] = [
    { key: "i", header: "#", className: "w-10 text-muted tabular-nums", render: (_d, i) => i + 1 },
    { key: "n", header: "DEX", sort: (d) => d.name, sticky: true, render: (d) => <span className="flex items-center gap-3"><CoinLogo symbol={d.name.charAt(0)} color={d.color} size={32} rounded="xl" /><span className="leading-tight"><span className="block font-semibold text-ink">{d.name}</span><span className="block text-xs text-muted">{d.networks}</span></span></span> },
    { key: "v", header: "Volume 24h", align: "right", sort: (d) => d.volume, className: "font-semibold tabular-nums text-ink", render: (d) => usdCompact(d.volume) },
    { key: "c", header: "Δ 24h", align: "right", sort: (d) => d.change, render: (d) => <PriceChangeIndicator value={d.change} /> },
    { key: "t", header: "TVL", align: "right", sort: (d) => d.tvl, className: "tabular-nums", render: (d) => usdCompact(d.tvl) },
    { key: "p", header: "Pools", align: "right", sort: (d) => d.pools, className: "tabular-nums", render: (d) => formatNumber(d.pools) },
    { key: "f", header: "Fee tiers", align: "right", className: "text-muted", render: (d) => d.fee },
    { key: "ch", header: "Volume 7d", align: "right", render: (d) => <SparklinePlaceholder seed={d.id} positive={d.change >= 0} width={92} height={30} /> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(d) => d.id} pageSize={pageSize} minWidth={900} />;
}

export function DefiOverviewView() {
  const [net, setNet] = useState("All");
  const pools = useMemo(() => POOLS.filter((p) => net === "All" || p.network === net), [net]);
  const nets = net === "All" ? NETWORKS : NETWORKS.filter((n) => n.name === net);
  const tvl = nets.reduce((s, n) => s + n.tvl, 0);
  const vol = nets.reduce((s, n) => s + n.volume, 0);
  const txns = nets.reduce((s, n) => s + n.txns, 0);
  const wallets = nets.reduce((s, n) => s + n.wallets, 0);
  const poolCount = nets.reduce((s, n) => s + n.pools, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="DeFi Overview" description="Liquidity, DEX volume and on-chain activity across every major blockchain network." actions={<Button href="/defi/screener" variant="primary" icon={<Filter className="size-4" />}>Pool screener</Button>} />
      <NetworkTabs value={net} onChange={setNet} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Value Locked" value={usdCompact(tvl)} change={2.4} icon={<Layers />} sparkSeed={`tvl${net}`} />
        <MetricCard label="DEX Volume 24h" value={usdCompact(vol)} change={5.8} icon={<ArrowRightLeft />} sparkSeed={`dv${net}`} />
        <MetricCard label="Active Pools" value={compact(poolCount, 1)} change={1.2} icon={<Droplets />} hint="liquidity pools" changeLabel="" />
        <MetricCard label="Transactions 24h" value={compact(txns, 1)} change={3.7} icon={<Activity />} sparkSeed={`tx${net}`} />
        <MetricCard label="Active Wallets" value={compact(wallets, 1)} change={-0.9} icon={<Wallet />} sparkSeed={`aw${net}`} className="sm:col-span-2 xl:col-span-1" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Total Value Locked" subtitle={net === "All" ? "All networks" : net} hideToolbar timeframes={["7D", "1M", "3M", "1Y"]} defaultTimeframe="1M" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">{usdCompact(tvl)}</span><PriceChangeIndicator value={2.4} /></div>}>
          <ChartPlaceholder variant="area" height={260} seed={`tvl-${net}`} trend={18} yLabels={["$100B", "$90B", "$80B", "$70B", "$60B"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Volume by Network" subtitle="24h DEX volume share" icon={<NetIcon />} />
          <div className="flex flex-col items-center gap-5 p-5 sm:flex-row xl:flex-col 2xl:flex-row">
            <DonutChart size={140} thickness={15} segments={NETWORKS.slice(0, 6).map((n) => ({ label: n.name, value: n.volume, color: n.color }))}><span className="text-[11px] text-muted">24h</span><span className="text-base font-semibold text-ink">{usdCompact(NETWORKS.reduce((s, n) => s + n.volume, 0))}</span></DonutChart>
            <Legend suffix="" showValue={false} segments={NETWORKS.slice(0, 6).map((n) => ({ label: n.name, value: n.volume, color: n.color }))} />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader title="Trending Pools" subtitle="Highest activity in the last hour" icon={<Flame />} action={<Button size="xs" variant="ghost" href="/defi/pools/trending">View all</Button>} />
          <div className="mt-4"><PoolsTable pools={[...pools].sort((a, b) => b.txns - a.txns).slice(0, 6)} pageSize={6} /></div>
        </Card>
        <Card>
          <CardHeader title="Network Activity" subtitle="Last 24 hours" icon={<Zap />} />
          <ul className="space-y-4 p-5">
            {NETWORKS.slice(0, 6).map((n) => (
              <li key={n.id}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]"><NetworkChip name={n.name} /><span className="tabular-nums text-muted">{compact(n.txns, 1)} txns</span></div>
                <ProgressBar value={(n.txns / NETWORKS[1].txns) * 100} color={n.color} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Top DEXs" subtitle="By 24h volume" icon={<BarChart3 />} action={<Button size="xs" variant="ghost" href="/defi/dex">All DEX markets</Button>} />
        <div className="mt-4"><DexTable rows={DEXES.slice(0, 5)} pageSize={5} /></div>
      </Card>
    </div>
  );
}

export function DexMarketsView() {
  return (
    <div className="space-y-6">
      <PageHeader title="DEX Markets" description="Decentralized exchange rankings by trading volume, liquidity and pool count." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="DEX Trading Volume" subtitle="All networks · daily" hideToolbar timeframes={["7D", "1M", "3M", "1Y"]} defaultTimeframe="1M">
          <ChartPlaceholder variant="bars" height={250} seed="dex-vol" yLabels={["$15B", "$11B", "$7B", "$3B", "0"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Market Share" subtitle="24h volume" />
          <div className="flex flex-col items-center gap-5 p-5">
            <DonutChart size={150} thickness={16} segments={DEXES.slice(0, 5).map((d) => ({ label: d.name, value: d.volume, color: d.color }))} />
            <div className="w-full"><Legend suffix="" showValue={false} segments={DEXES.slice(0, 5).map((d) => ({ label: d.name, value: d.volume, color: d.color }))} /></div>
          </div>
        </Card>
      </div>
      <Card className="overflow-hidden"><DexTable rows={DEXES} /></Card>
    </div>
  );
}

export function NetworksView() {
  const columns: Column<Net>[] = [
    { key: "n", header: "Network", sticky: true, sort: (n) => n.name, render: (n) => <span className="flex items-center gap-3"><CoinLogo symbol={n.name.charAt(0)} color={n.color} size={32} rounded="xl" /><span className="font-semibold text-ink">{n.name}</span></span> },
    { key: "t", header: "TVL", align: "right", sort: (n) => n.tvl, className: "font-semibold tabular-nums text-ink", render: (n) => usdCompact(n.tvl) },
    { key: "c", header: "Δ 24h", align: "right", sort: (n) => n.change, render: (n) => <PriceChangeIndicator value={n.change} /> },
    { key: "v", header: "DEX Volume 24h", align: "right", sort: (n) => n.volume, className: "tabular-nums", render: (n) => usdCompact(n.volume) },
    { key: "p", header: "Pools", align: "right", sort: (n) => n.pools, className: "tabular-nums", render: (n) => formatNumber(n.pools) },
    { key: "tx", header: "Txns 24h", align: "right", sort: (n) => n.txns, className: "tabular-nums", render: (n) => compact(n.txns, 1) },
    { key: "w", header: "Active Wallets", align: "right", sort: (n) => n.wallets, className: "tabular-nums", render: (n) => compact(n.wallets, 1) },
    { key: "g", header: "Avg. Gas", align: "right", className: "text-muted", render: (n) => n.gas },
    { key: "ch", header: "TVL 7d", align: "right", render: (n) => <SparklinePlaceholder seed={n.id} positive={n.change >= 0} width={90} height={30} /> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Blockchain Networks" description="Compare network health, liquidity, throughput and user activity." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {NETWORKS.slice(0, 4).map((n) => (
          <Card key={n.id} className="p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3"><CoinLogo symbol={n.name.charAt(0)} color={n.color} size={36} rounded="xl" /><span className="font-semibold text-ink">{n.name}</span></span>
              <PriceChangeIndicator value={n.change} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-xs text-muted">
              <div>TVL<div className="mt-1 text-base font-semibold tabular-nums text-ink">{usdCompact(n.tvl)}</div></div>
              <div>Volume 24h<div className="mt-1 text-base font-semibold tabular-nums text-ink">{usdCompact(n.volume)}</div></div>
            </div>
            <SparklinePlaceholder seed={n.id + "c"} positive={n.change >= 0} width="100%" height={44} className="mt-4" />
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden"><DataTable columns={columns} rows={NETWORKS} rowKey={(n) => n.id} minWidth={950} /></Card>
    </div>
  );
}

export function PoolsListView({ variant }: { variant: "all" | "trending" | "new" }) {
  const [net, setNet] = useState("All");
  const [q, setQ] = useState("");
  const base = variant === "new" ? [...POOLS].sort((a, b) => a.ageH - b.ageH).slice(0, 8) : variant === "trending" ? [...POOLS].sort((a, b) => b.txns - a.txns) : POOLS;
  const rows = base.filter((p) => (net === "All" || p.network === net) && `${p.base}/${p.quote}`.toLowerCase().includes(q.toLowerCase()));
  const title = { all: "All Liquidity Pools", trending: "Trending Pools", new: "New Pools" }[variant];
  const desc = { all: "Every tracked liquidity pool across DEXs and networks.", trending: "Pools with the strongest swap activity and volume momentum right now.", new: "Freshly created pools — higher opportunity, higher risk. Always verify the token." }[variant];
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={desc} badge={variant === "new" ? <StatusBadge tone="warning">High risk</StatusBadge> : variant === "trending" ? <StatusBadge tone="warning" dot>Live</StatusBadge> : undefined} actions={<Button href="/defi/screener" icon={<Filter className="size-4" />}>Pool screener</Button>} />
      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-line p-5">
          <NetworkTabs value={net} onChange={setNet} />
          <SearchInput value={q} onChange={setQ} placeholder="Search pool or token" className="w-full sm:w-72" />
        </div>
        <PoolsTable pools={rows} pageSize={10} />
      </Card>
    </div>
  );
}

export function PoolScreenerView() {
  const [net, setNet] = useState("All networks");
  const [dex, setDex] = useState("All DEXs");
  const [liq, setLiq] = useState("Any");
  const [vol, setVol] = useState("Any");
  const [age, setAge] = useState("Any");
  const [q, setQ] = useState("");
  const min = (s: string) => ({ Any: 0, "> $10K": 1e4, "> $100K": 1e5, "> $1M": 1e6, "> $10M": 1e7, "> $50M": 5e7 })[s] ?? 0;
  const rows = POOLS.filter((p) => (net === "All networks" || p.network === net) && (dex === "All DEXs" || p.dex === dex) && p.liquidity >= min(liq) && p.volume >= min(vol) && (age === "Any" || (age === "< 24 hours" ? p.ageH < 24 : age === "< 7 days" ? p.ageH < 168 : p.ageH >= 720)) && `${p.base}/${p.quote}`.toLowerCase().includes(q.toLowerCase()));
  const reset = () => { setNet("All networks"); setDex("All DEXs"); setLiq("Any"); setVol("Any"); setAge("Any"); setQ(""); };
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (<div className="space-y-1.5"><label className="text-xs font-medium text-muted">{label}</label><div>{children}</div></div>);
  return (
    <div className="space-y-6">
      <PageHeader title="Pool Screener" description="Filter thousands of liquidity pools by network, DEX, liquidity, volume and age." actions={<Button icon={<RotateCcw className="size-4" />} onClick={reset}>Reset filters</Button>} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader title="Filters" icon={<Filter />} subtitle={`${rows.length} pools match`} />
          <div className="space-y-4 p-5">
            <Field label="Search"><SearchInput value={q} onChange={setQ} placeholder="Token or pair" /></Field>
            <Field label="Network"><SelectDropdown options={["All networks", ...NETWORKS.map((n) => n.name)]} value={net} onChange={setNet} /></Field>
            <Field label="DEX"><SelectDropdown options={["All DEXs", ...Array.from(new Set(POOLS.map((p) => p.dex)))]} value={dex} onChange={setDex} /></Field>
            <Field label="Liquidity"><SelectDropdown options={["Any", "> $10K", "> $100K", "> $1M", "> $10M", "> $50M"]} value={liq} onChange={setLiq} /></Field>
            <Field label="24h Volume"><SelectDropdown options={["Any", "> $10K", "> $100K", "> $1M", "> $10M", "> $50M"]} value={vol} onChange={setVol} /></Field>
            <Field label="Pool age"><SelectDropdown options={["Any", "< 24 hours", "< 7 days", "> 30 days"]} value={age} onChange={setAge} /></Field>
          </div>
        </Card>
        <Card className="overflow-hidden"><PoolsTable pools={rows} pageSize={10} /></Card>
      </div>
    </div>
  );
}

export function TokenExplorerView() {
  const [q, setQ] = useState("");
  const [net, setNet] = useState("All");
  const rows = ONCHAIN_TOKENS.filter((t) => (net === "All" || t.network === net) && (t.name + t.symbol + t.address).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader title="Token Explorer" description="Look up any on-chain token by name, symbol or contract address." />
      <Card className="p-5">
        <SearchInput size="lg" value={q} onChange={setQ} placeholder="Search by name, symbol or paste a contract address (0x…)" />
        <div className="mt-4"><NetworkTabs value={net} onChange={setNet} /></div>
      </Card>
      <Card className="overflow-hidden"><TokensTable tokens={rows} /></Card>
    </div>
  );
}

export function TokenDetailView({ token: t }: { token: OnchainToken }) {
  const pools = POOLS.filter((p) => p.base === t.symbol || p.quote === t.symbol).slice(0, 5);
  const checks = [["Contract verified", true], ["Liquidity locked", true], ["Ownership renounced", t.id !== "pepe"], ["No honeypot detected", true], ["Mint function disabled", t.id !== "bonk"]] as const;
  return (
    <div className="space-y-6">
      <PageHeader
        leading={<CoinLogo symbol={t.symbol} color={t.color} size={52} />}
        title={<span className="flex items-center gap-2.5">{t.name} <span className="text-base font-medium text-muted">{t.symbol}</span></span>}
        badge={<span className="flex items-center gap-2"><NetworkChip name={t.network} /><CopyAddress value={t.address} /></span>}
        actions={<><Button href={`/defi/tokens/${t.id}/holders`} icon={<Users className="size-4" />}>Holders</Button><Button variant="primary" href="/defi/transactions" icon={<Activity className="size-4" />}>Transactions</Button></>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Price" value={formatPrice(t.price)} change={t.c24h} icon={<Zap />} sparkSeed={t.id} />
        <MetricCard label="Market Cap" value={usdCompact(t.mcap)} icon={<BarChart3 />} changeLabel="" hint="fully diluted" />
        <MetricCard label="Liquidity" value={usdCompact(t.liquidity)} change={1.3} icon={<Droplets />} />
        <MetricCard label="Volume 24h" value={usdCompact(t.volume)} change={6.1} icon={<ArrowRightLeft />} />
        <MetricCard label="Holders" value={formatNumber(t.holders)} change={0.4} icon={<Users />} className="sm:col-span-2 xl:col-span-1" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title={`${t.symbol} / USD`} subtitle="On-chain price · aggregated pools" showTools icon={<CoinLogo symbol={t.symbol} color={t.color} size={34} rounded="xl" />} defaultTimeframe="24H" timeframes={["1H", "24H", "7D", "1M", "ALL"]}>
          <ChartPlaceholder variant="candles" height={340} seed={t.id + "c"} trend={t.c24h * 3} yLabels={[1.3, 1.15, 1, 0.85, 0.7].map((m) => formatPrice(t.price * m))} badge="TradingView mount point" />
        </ChartContainer>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Token Info" />
            <div className="px-5 pb-3 pt-1"><KeyStats items={[{ label: "Network", value: t.network }, { label: "Contract", value: <CopyAddress value={t.address} /> }, { label: "Active pools", value: formatNumber(t.pools) }, { label: "Txns 24h", value: formatNumber(t.txns) }, { label: "Deployed", value: "412 days ago" }]} /></div>
          </Card>
          <Card>
            <CardHeader title="Security Checks" icon={<ShieldCheck />} action={<StatusBadge tone="success">Low risk</StatusBadge>} />
            <ul className="space-y-1 p-5 pt-3">
              {checks.map(([l, ok]) => (
                <li key={l} className="flex items-center justify-between py-1.5 text-[13px]"><span className="text-ink">{l}</span>{ok ? <CheckCircle2 className="size-4 text-success" /> : <AlertTriangle className="size-4 text-warning" />}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Top Liquidity Pools" icon={<Droplets />} action={<Button size="xs" variant="ghost" href="/defi/pools">All pools</Button>} />
        <div className="mt-4"><PoolsTable pools={pools.length ? pools : POOLS.slice(0, 4)} pageSize={5} /></div>
      </Card>
    </div>
  );
}

export function PoolDetailView({ pool: p }: { pool: Pool }) {
  const txs = TRANSACTIONS.filter((t) => t.pair === `${p.base}/${p.quote}`);
  return (
    <div className="space-y-6">
      <PageHeader
        leading={<PairLogo base={p.base} baseColor={p.baseColor} quote={p.quote} quoteColor={p.quoteColor} size={44} />}
        title={<span>{p.base} <span className="text-muted">/ {p.quote}</span></span>}
        badge={<span className="flex flex-wrap items-center gap-2"><StatusBadge tone="primary">{p.dex}</StatusBadge><StatusBadge>{p.fee} fee</StatusBadge><NetworkChip name={p.network} /></span>}
        description={`Pool created ${ageLabel(p.ageH)} ago`}
        actions={<><CopyAddress value={p.address} /><Button variant="primary" icon={<Droplets className="size-4" />}>Add liquidity</Button></>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Price" value={formatPrice(p.price)} change={p.c24h} icon={<Zap />} sparkSeed={p.id} />
        <MetricCard label="Liquidity" value={usdCompact(p.liquidity)} change={1.8} icon={<Droplets />} />
        <MetricCard label="Volume 24h" value={usdCompact(p.volume)} change={p.c24h / 2} icon={<BarChart3 />} />
        <MetricCard label="FDV" value={usdCompact(p.fdv)} icon={<Layers />} changeLabel="" hint="fully diluted" />
        <MetricCard label="Txns 24h" value={formatNumber(p.txns)} change={4.2} icon={<Activity />} className="sm:col-span-2 xl:col-span-1" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title={`${p.base}/${p.quote}`} subtitle={`${p.dex} · ${p.network}`} showTools defaultTimeframe="1H" timeframes={["1M", "5M", "15M", "1H", "4H", "1D"]} icon={<PairLogo base={p.base} baseColor={p.baseColor} quote={p.quote} quoteColor={p.quoteColor} size={30} />}>
          <ChartPlaceholder variant="candles" height={340} seed={p.id} trend={p.c24h * 2} yLabels={[1.2, 1.1, 1, 0.9, 0.8].map((m) => formatPrice(p.price * m))} badge="TradingView mount point" />
        </ChartContainer>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Pool Composition" subtitle="Reserves" icon={<Droplets />} />
            <div className="space-y-4 p-5">
              {[[p.base, p.baseColor, 52], [p.quote, p.quoteColor, 48]].map(([s, c, v]) => (
                <div key={s as string}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]"><span className="flex items-center gap-2 font-medium text-ink"><CoinLogo symbol={s as string} color={c as string} size={22} />{s}</span><span className="tabular-nums text-muted">{usdCompact(p.liquidity * ((v as number) / 100))} · {v}%</span></div>
                  <ProgressBar value={v as number} color={c as string} />
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Pool Info" />
            <div className="px-5 pb-3 pt-1"><KeyStats items={[{ label: "Pool address", value: <CopyAddress value={p.address} /> }, { label: "DEX", value: p.dex }, { label: "Fee tier", value: p.fee }, { label: "Network", value: p.network }, { label: "Age", value: ageLabel(p.ageH) }]} /></div>
          </Card>
        </div>
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Recent Transactions" subtitle="Latest swaps and liquidity events" icon={<Activity />} />
        <div className="mt-4"><TxTable rows={txs.length ? txs : TRANSACTIONS.slice(0, 8).map((t) => ({ ...t, pair: `${p.base}/${p.quote}`, network: p.network, dex: p.dex }))} pageSize={8} /></div>
      </Card>
    </div>
  );
}

export function TokenHoldersView({ token: t }: { token: OnchainToken }) {
  const top10 = HOLDERS.slice(0, 10).reduce((s, h) => s + h.pct, 0);
  const segments = [
    { label: "Top 1–3", value: HOLDERS.slice(0, 3).reduce((s, h) => s + h.pct, 0), color: "#315CF5" },
    { label: "Top 4–10", value: HOLDERS.slice(3, 10).reduce((s, h) => s + h.pct, 0), color: "#8B5CF6" },
    { label: "Top 11–14", value: HOLDERS.slice(10).reduce((s, h) => s + h.pct, 0), color: "#16A879" },
    { label: "Everyone else", value: 100 - HOLDERS.reduce((s, h) => s + h.pct, 0), color: "#B8C2D8" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader leading={<CoinLogo symbol={t.symbol} color={t.color} size={48} />} title={`${t.symbol} Token Holders`} description={`Distribution and top wallets for ${t.name} on ${t.network}.`} actions={<Button href={`/defi/tokens/${t.id}`}>Back to token</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total Holders" value={formatNumber(t.holders)} change={0.4} icon={<Users />} sparkSeed={t.id + "h"} />
        <MetricCard label="Top 10 Concentration" value={`${top10.toFixed(1)}%`} change={-0.3} icon={<Layers />} changeLabel="of supply" />
        <MetricCard label="New Holders 24h" value="+3,284" change={5.1} icon={<Wallet />} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Holder Distribution" subtitle="% of circulating supply" />
          <div className="flex flex-col items-center gap-5 p-5">
            <DonutChart size={168} thickness={18} segments={segments}><span className="text-[11px] text-muted">Top 10</span><span className="text-xl font-semibold text-ink">{top10.toFixed(1)}%</span></DonutChart>
            <div className="w-full"><Legend segments={segments} /></div>
          </div>
        </Card>
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader title="Top Holders" icon={<Users />} />
          <div className="mt-4"><HoldersTable symbol={t.symbol} pageSize={8} /></div>
        </Card>
      </div>
    </div>
  );
}

export function TransactionsView() {
  const [type, setType] = useState("all");
  const [net, setNet] = useState("All");
  const rows = TRANSACTIONS.filter((t) => (type === "all" || (type === "swap" ? t.type === "Swap" : t.type !== "Swap")) && (net === "All" || t.network === net));
  return (
    <div className="space-y-6">
      <PageHeader title="On-chain Transactions" description="Real-time stream of swaps and liquidity events across tracked DEXs." badge={<StatusBadge tone="success" dot>Streaming</StatusBadge>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Transactions 24h" value="61.4M" change={3.7} icon={<Activity />} sparkSeed="tx-all" />
        <MetricCard label="Swap Volume" value="$11.9B" change={5.8} icon={<ArrowRightLeft />} sparkSeed="sv" />
        <MetricCard label="Liquidity Added" value="$842M" change={2.2} icon={<Droplets />} />
        <MetricCard label="Largest Swap" value="$4.8M" icon={<Rocket />} changeLabel="" hint="ETH → USDC" />
      </div>
      <Card className="overflow-hidden">
        <div className="space-y-3 border-b border-line p-5">
          <NetworkTabs value={net} onChange={setNet} />
          <Tabs ariaLabel="Type" value={type} onChange={setType} items={[{ id: "all", label: "All" }, { id: "swap", label: "Swaps" }, { id: "liq", label: "Liquidity" }]} />
        </div>
        <TxTable rows={rows} pageSize={10} />
      </Card>
    </div>
  );
}
