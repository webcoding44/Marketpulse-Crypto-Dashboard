"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeftRight, BarChart3, Coins, Landmark, LineChart, ShieldCheck, TrendingUp, Users, Gem, Building2 } from "lucide-react";
import { RWA_ASSETS, getRwa, type RwaAsset, type RwaCategory } from "@/lib/mock-data/rwa";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SelectDropdown } from "@/components/ui/dropdown";
import { MetricCard } from "@/components/shared/metric-card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterBar } from "@/components/shared/filter-bar";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { KeyStats } from "@/components/shared/key-stats";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { NetworkChip } from "@/features/defi/defi-tables";
import { formatNumber, formatPrice, usdCompact } from "@/lib/utils";

const CAT_META: Record<RwaCategory, { title: string; singular: string; desc: string; icon: typeof Coins }> = {
  stocks: { title: "Tokenized Stocks", singular: "Stock", desc: "On-chain representations of publicly listed equities, tradable 24/7.", icon: Building2 },
  commodities: { title: "Tokenized Commodities", singular: "Commodity", desc: "Gold, silver and other physical commodities backed by vaulted reserves.", icon: Gem },
  etfs: { title: "Tokenized ETFs & Funds", singular: "ETF / Fund", desc: "Tokenized ETFs, money-market and Treasury funds with on-chain settlement.", icon: Landmark },
};

export function TokenizedBadge() {
  return <StatusBadge tone="accent">Tokenized</StatusBadge>;
}

function Disclosure() {
  return (
    <div className="flex gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-[13px] text-ink">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
      <p><b>Tokenized ≠ traditional.</b> Tokens shown here are blockchain-based claims issued by third parties. They track an underlying security or commodity but may not confer shareholder rights, and liquidity, custody and regulatory protections differ from traditional markets.</p>
    </div>
  );
}

export function RwaTable({ rows, pageSize = 8 }: { rows: RwaAsset[]; pageSize?: number }) {
  const columns: Column<RwaAsset>[] = [
    { key: "a", header: "Asset", sticky: true, sort: (a) => a.name, render: (a) => <Link href={`/rwa/${a.id}`} className="flex items-center gap-3"><CoinLogo symbol={a.symbol.slice(0, 2)} color={a.color} size={36} rounded="xl" /><span className="min-w-0 leading-tight"><span className="block max-w-[220px] truncate font-semibold text-ink">{a.name}</span><span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">{a.symbol} <TokenizedBadge /></span></span></Link> },
    { key: "iss", header: "Issuer", className: "text-muted", render: (a) => a.issuer },
    { key: "p", header: "Token Price", align: "right", sort: (a) => a.price, className: "font-semibold tabular-nums text-ink", render: (a) => formatPrice(a.price) },
    { key: "c24", header: "24h", align: "right", sort: (a) => a.c24h, render: (a) => <PriceChangeIndicator value={a.c24h} /> },
    { key: "c7", header: "7d", align: "right", sort: (a) => a.c7d, render: (a) => <PriceChangeIndicator value={a.c7d} /> },
    { key: "u", header: "Underlying", render: (a) => <span className="leading-tight"><span className="block text-[13px] text-ink">{a.underlying}</span><span className="text-xs text-muted tabular-nums">Traditional: {formatPrice(a.underlyingPrice)}</span></span> },
    { key: "prem", header: "Premium", align: "right", sort: (a) => (a.price / a.underlyingPrice - 1) * 100, className: "tabular-nums", render: (a) => { const v = (a.price / a.underlyingPrice - 1) * 100; return <span className={v >= 0 ? "text-success" : "text-danger"}>{v >= 0 ? "+" : ""}{v.toFixed(2)}%</span>; } },
    { key: "mc", header: "Market Value", align: "right", sort: (a) => a.mcap, className: "tabular-nums text-ink", render: (a) => usdCompact(a.mcap) },
    { key: "v", header: "Volume 24h", align: "right", sort: (a) => a.volume, className: "tabular-nums", render: (a) => usdCompact(a.volume) },
    { key: "ch", header: "Chain", render: (a) => <NetworkChip name={a.chain} /> },
    { key: "t", header: "7d", align: "right", render: (a) => <SparklinePlaceholder data={a.spark} positive={a.c7d >= 0} width={84} height={30} /> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(a) => a.id} pageSize={pageSize} minWidth={1200} />;
}

export function RwaOverviewView() {
  const total = RWA_ASSETS.reduce((s, a) => s + a.mcap, 0);
  const by = (c: RwaCategory) => RWA_ASSETS.filter((a) => a.category === c).reduce((s, a) => s + a.mcap, 0);
  const segs = [{ label: "Tokenized ETFs & funds", value: by("etfs"), color: "#315CF5" }, { label: "Commodities", value: by("commodities"), color: "#E8A33C" }, { label: "Stocks", value: by("stocks"), color: "#8B5CF6" }];
  return (
    <div className="space-y-6">
      <PageHeader title="Real World Assets" description="Tokenized equities, commodities and funds — priced on-chain, benchmarked against their traditional counterparts." />
      <Disclosure />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total RWA Value" value={usdCompact(total)} change={3.4} icon={<Landmark />} sparkSeed="rwa-v" />
        <MetricCard label="24h Volume" value={usdCompact(RWA_ASSETS.reduce((s, a) => s + a.volume, 0))} change={7.9} icon={<BarChart3 />} sparkSeed="rwa-vol" />
        <MetricCard label="Tokenized Assets" value={RWA_ASSETS.length * 38} change={2.1} icon={<Coins />} changeLabel="this month" />
        <MetricCard label="Unique Holders" value="298K" change={4.6} icon={<Users />} sparkSeed="rwa-h" />
      </div>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(Object.keys(CAT_META) as RwaCategory[]).map((c) => {
          const M = CAT_META[c];
          const list = RWA_ASSETS.filter((a) => a.category === c);
          return (
            <Link key={c} href={`/rwa/${c}`} className="group">
              <Card className="h-full p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-pop">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><M.icon className="size-5" /></span>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">{M.title}</h3>
                <p className="mt-1 text-[13px] text-muted">{M.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-muted"><span>{list.length * 12} assets</span><b className="text-sm tabular-nums text-ink">{usdCompact(by(c))}</b></div>
              </Card>
            </Link>
          );
        })}
      </section>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Tokenized Asset Value" subtitle="Total on-chain value · USD" hideToolbar timeframes={["1M", "3M", "1Y", "ALL"]} defaultTimeframe="1Y" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">{usdCompact(total)}</span><PriceChangeIndicator value={3.4} /></div>}>
          <ChartPlaceholder variant="area" height={240} seed="rwa-total" trend={30} yLabels={["$7B", "$6B", "$5B", "$4B", "$3B"]} xLabels={["Q3", "Q4", "Q1", "Q2"]} />
        </ChartContainer>
        <Card><CardHeader title="Allocation by Category" /><div className="flex flex-col items-center gap-5 p-5"><DonutChart size={150} thickness={16} segments={segs}><span className="text-[11px] text-muted">Total</span><span className="text-lg font-semibold text-ink">{usdCompact(total)}</span></DonutChart><div className="w-full"><Legend segments={segs.map((s) => ({ ...s, value: (s.value / total) * 100 }))} /></div></div></Card>
      </div>
      <Card className="overflow-hidden"><CardHeader title="Top Tokenized Assets" icon={<TrendingUp />} /><div className="mt-4"><RwaTable rows={[...RWA_ASSETS].sort((a, b) => b.mcap - a.mcap)} pageSize={6} /></div></Card>
    </div>
  );
}

export function RwaCategoryView({ category }: { category: RwaCategory }) {
  const M = CAT_META[category];
  const [q, setQ] = useState("");
  const [chain, setChain] = useState("All chains");
  const list = RWA_ASSETS.filter((a) => a.category === category);
  const rows = useMemo(() => list.filter((a) => (chain === "All chains" || a.chain === chain) && (a.name + a.symbol).toLowerCase().includes(q.toLowerCase())), [list, q, chain]);
  const chains = ["All chains", ...Array.from(new Set(list.map((a) => a.chain)))];
  return (
    <div className="space-y-6">
      <PageHeader title={M.title} description={M.desc} badge={<TokenizedBadge />} />
      <Disclosure />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Category Value" value={usdCompact(list.reduce((s, a) => s + a.mcap, 0))} change={2.8} icon={<M.icon />} sparkSeed={category} />
        <MetricCard label="24h Volume" value={usdCompact(list.reduce((s, a) => s + a.volume, 0))} change={5.2} icon={<ArrowLeftRight />} sparkSeed={category + "v"} />
        <MetricCard label={category === "etfs" ? "Avg. Yield" : "Avg. Premium"} value={category === "etfs" ? "4.7%" : "+0.04%"} icon={<LineChart />} changeLabel="" hint={category === "etfs" ? "trailing 30d" : "vs. underlying"} />
      </div>
      <Card className="overflow-hidden">
        <FilterBar>
          <SearchInput value={q} onChange={setQ} placeholder={`Search ${M.singular.toLowerCase()}s`} className="w-full sm:w-64" />
          <SelectDropdown options={chains} value={chain} onChange={setChain} prefix="Chain:" />
          <span className="ml-auto text-[13px] text-muted">{rows.length} assets</span>
        </FilterBar>
        <RwaTable rows={rows} />
      </Card>
    </div>
  );
}

export function RwaDetailView({ id }: { id: string }) {
  const a = getRwa(id)!;
  const prem = (a.price / a.underlyingPrice - 1) * 100;
  return (
    <div className="space-y-6">
      <PageHeader leading={<CoinLogo symbol={a.symbol.slice(0, 2)} color={a.color} size={52} rounded="xl" />} title={<span className="flex items-center gap-2.5">{a.name}<span className="text-base font-medium text-muted">{a.symbol}</span></span>} badge={<span className="flex gap-1.5"><TokenizedBadge /><StatusBadge>{CAT_META[a.category].singular}</StatusBadge></span>} description={`Issued by ${a.issuer} on ${a.chain}`} actions={<><Button href={`/rwa/${a.category}`}>All {CAT_META[a.category].title.toLowerCase()}</Button><Button variant="primary" icon={<ShieldCheck className="size-4" />}>Proof of reserves</Button></>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Token Price" value={formatPrice(a.price)} change={a.c24h} icon={<Coins />} sparkSeed={a.id} />
        <MetricCard label="Market Value" value={usdCompact(a.mcap)} change={a.c7d} icon={<Landmark />} changeLabel="7d" />
        <MetricCard label="Volume 24h" value={usdCompact(a.volume)} icon={<BarChart3 />} changeLabel="" hint="on-chain" />
        <MetricCard label="Holders" value={formatNumber(a.holders)} change={1.4} icon={<Users />} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title={`${a.symbol} Price`} subtitle="Token vs. underlying" showTools defaultTimeframe="1M" timeframes={["1D", "7D", "1M", "1Y"]}>
          <ChartPlaceholder variant="line" height={320} seed={a.id + "r"} trend={a.c7d * 3} yLabels={[1.06, 1.03, 1, 0.97, 0.94].map((m) => formatPrice(a.price * m))} badge="TradingView mount point" />
        </ChartContainer>
        <Card>
          <CardHeader title="Tokenized vs Traditional" subtitle="Know the difference" icon={<ArrowLeftRight />} />
          <div className="space-y-3 p-5">
            <div className="rounded-xl border border-accent/30 bg-accent-soft p-4"><div className="flex items-center justify-between"><TokenizedBadge /><span className="text-xs text-muted">on {a.chain}</span></div><div className="mt-2 text-xl font-semibold tabular-nums text-ink">{formatPrice(a.price)}</div><div className="text-xs text-muted">24/7 on-chain trading · {a.symbol}</div></div>
            <div className="rounded-xl border border-line bg-soft p-4"><div className="flex items-center justify-between"><StatusBadge>Traditional</StatusBadge><span className="text-xs text-muted">{a.underlying}</span></div><div className="mt-2 text-xl font-semibold tabular-nums text-ink">{formatPrice(a.underlyingPrice)}</div><div className="text-xs text-muted">Market hours · exchange settled</div></div>
            <div className="flex items-center justify-between rounded-xl border border-line p-3 text-[13px]"><span className="text-muted">Premium / discount</span><b className={prem >= 0 ? "text-success" : "text-danger"}>{prem >= 0 ? "+" : ""}{prem.toFixed(2)}%</b></div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card><CardHeader title="Asset Information" /><div className="px-5 pb-3 pt-1"><KeyStats items={[{ label: "Underlying asset", value: a.underlying }, { label: "Issuer", value: a.issuer }, { label: "Custodian", value: a.custodian }, { label: "Network", value: <NetworkChip name={a.chain} /> }, { label: "Backing ratio", value: "1 : 1" }, ...(a.yield ? [{ label: "Current yield (APY)", value: `${a.yield}%` }] : []), { label: "Last attestation", value: "3 days ago" }]} /></div></Card>
        <Card><CardHeader title="Risk & Compliance" icon={<ShieldCheck />} /><ul className="space-y-3 p-5 text-[13px] text-muted">{["KYC / accredited-investor gating may apply to minting and redemption.", "Token holders do not receive voting rights or direct shareholder protections.", "On-chain price can deviate from the underlying outside market hours.", "Custody and redemption depend on the issuer and its legal structure."].map((t) => <li key={t} className="flex gap-2.5"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />{t}</li>)}</ul></Card>
      </div>
    </div>
  );
}
