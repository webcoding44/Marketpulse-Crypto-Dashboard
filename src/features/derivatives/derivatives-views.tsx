"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, BarChart3, Download, Flame, Layers, Percent, Scale, Zap } from "lucide-react";
import { CONTRACTS, DERIV_EXCHANGES, type Contract, type DerivExchange } from "@/lib/mock-data/exchanges";
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
import { KeyStats } from "@/components/shared/key-stats";
import { ExchangeLogo } from "@/features/exchanges/exchange-table";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { cn, formatNumber, formatPrice, usdCompact } from "@/lib/utils";

export function LongShortBar({ long, className }: { long: number; className?: string }) {
  return (
    <div className={cn("w-full min-w-[110px]", className)}>
      <div className="flex h-2 overflow-hidden rounded-full bg-danger">
        <div className="h-full bg-success" style={{ width: `${long}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] font-medium tabular-nums">
        <span className="text-success">{long.toFixed(1)}%</span>
        <span className="text-danger">{(100 - long).toFixed(1)}%</span>
      </div>
    </div>
  );
}

const fundingTone = (f: number) => (f > 0 ? "text-success" : f < 0 ? "text-danger" : "text-muted");

export function DerivExchangeTable({ rows, pageSize = 8 }: { rows: DerivExchange[]; pageSize?: number }) {
  const columns: Column<DerivExchange>[] = [
    { key: "rank", header: "#", sort: (e) => e.rank, className: "w-12 text-muted tabular-nums", render: (e) => e.rank },
    {
      key: "name",
      header: "Exchange",
      sticky: true,
      sort: (e) => e.name,
      render: (e) => (
        <Link href={`/derivatives/exchanges/${e.id}`} className="flex items-center gap-3">
          <ExchangeLogo name={e.name} color={e.color} />
          <span className="leading-tight"><span className="block font-semibold text-ink">{e.name}</span><span className="block text-xs text-muted">{e.country}</span></span>
        </Link>
      ),
    },
    { key: "oi", header: "Open Interest", align: "right", sort: (e) => e.oi, className: "font-semibold tabular-nums text-ink", render: (e) => usdCompact(e.oi) },
    { key: "vol", header: "24h Volume", align: "right", sort: (e) => e.volume24h, className: "tabular-nums", render: (e) => usdCompact(e.volume24h) },
    { key: "chg", header: "Volume Δ", align: "right", sort: (e) => e.change, render: (e) => <PriceChangeIndicator value={e.change} /> },
    { key: "fund", header: "Avg. Funding", align: "right", sort: (e) => e.funding, className: "tabular-nums", render: (e) => <span className={fundingTone(e.funding)}>{e.funding.toFixed(4)}%</span> },
    { key: "pairs", header: "Contracts", align: "right", sort: (e) => e.pairs, className: "tabular-nums", render: (e) => formatNumber(e.pairs) },
    { key: "ls", header: "Long / Short", render: (e) => <LongShortBar long={e.longPct} className="ml-auto max-w-[140px]" /> },
    { key: "chart", header: "OI 7d", align: "right", render: (e) => <SparklinePlaceholder data={e.spark} positive={e.change >= 0} width={96} height={32} /> },
    { key: "go", header: <span className="sr-only">Open</span>, align: "right", render: (e) => <Link href={`/derivatives/exchanges/${e.id}`} aria-label={`Open ${e.name}`} className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-primary-soft hover:text-primary"><ArrowUpRight className="size-4" /></Link> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(e) => e.id} pageSize={pageSize} minWidth={1100} initialSort={{ key: "rank", dir: "asc" }} />;
}

export function ContractsTable({ rows, pageSize = 8 }: { rows: Contract[]; pageSize?: number }) {
  const columns: Column<Contract>[] = [
    {
      key: "sym",
      header: "Contract",
      sticky: true,
      sort: (c) => c.symbol,
      render: (c) => (
        <span className="flex items-center gap-3">
          <CoinLogo symbol={c.base} color={c.color} size={30} />
          <span className="leading-tight"><span className="block font-semibold text-ink">{c.symbol}</span><span className="block text-xs text-muted">{c.exchange}</span></span>
        </span>
      ),
    },
    { key: "type", header: "Type", render: (c) => <StatusBadge tone={c.type === "Perpetual" ? "primary" : "accent"}>{c.type}</StatusBadge> },
    { key: "price", header: "Price", align: "right", sort: (c) => c.price, className: "font-semibold tabular-nums text-ink", render: (c) => formatPrice(c.price) },
    { key: "chg", header: "24h", align: "right", sort: (c) => c.c24h, render: (c) => <PriceChangeIndicator value={c.c24h} /> },
    { key: "fund", header: "Funding / 8h", align: "right", sort: (c) => c.funding, className: "tabular-nums", render: (c) => (c.type === "Futures" ? <span className="text-muted">—</span> : <span className={fundingTone(c.funding)}>{c.funding.toFixed(4)}%</span>) },
    { key: "basis", header: "Basis", align: "right", sort: (c) => c.basis, className: "tabular-nums", render: (c) => `${c.basis.toFixed(2)}%` },
    { key: "oi", header: "Open Interest", align: "right", sort: (c) => c.oi, className: "tabular-nums", render: (c) => usdCompact(c.oi) },
    { key: "vol", header: "24h Volume", align: "right", sort: (c) => c.volume, className: "tabular-nums", render: (c) => usdCompact(c.volume) },
    { key: "exp", header: "Expiry", align: "right", className: "text-muted", render: (c) => c.expiry },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} pageSize={pageSize} minWidth={980} />;
}

export function DerivativesOverviewView() {
  const funding = CONTRACTS.filter((c) => c.type === "Perpetual").slice(0, 7);
  return (
    <div className="space-y-6">
      <PageHeader title="Derivatives Overview" description="Open interest, volume, funding and positioning across the leading futures and perpetual venues." actions={<Button icon={<Download className="size-4" />}>Export data</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Open Interest" value="$69.4B" change={2.8} icon={<Layers />} sparkSeed="oi" />
        <MetricCard label="24h Volume" value="$183.7B" change={-4.1} icon={<BarChart3 />} sparkSeed="dvol-d" />
        <MetricCard label="Avg. Funding Rate" value="0.0098%" change={0.4} icon={<Percent />} hint="per 8h" changeLabel="" />
        <MetricCard label="Long / Short" value="51.8 / 48.2" change={0.6} icon={<Scale />} hint="BTC accounts" changeLabel="" />
        <MetricCard label="24h Liquidations" value="$182M" change={-12.4} icon={<Zap />} sparkSeed="liq-d" className="sm:col-span-2 xl:col-span-1" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartContainer title="Aggregate Open Interest" subtitle="All contracts · USD" hideToolbar timeframes={["24H", "7D", "1M", "1Y"]} defaultTimeframe="1M" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">$69.4B</span><PriceChangeIndicator value={2.8} /></div>}>
          <ChartPlaceholder variant="area" height={240} seed="agg-oi" trend={14} yLabels={["$75B", "$70B", "$65B", "$60B", "$55B"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <ChartContainer title="Trading Volume" subtitle="Perpetual + futures · daily" hideToolbar timeframes={["24H", "7D", "1M", "1Y"]} defaultTimeframe="7D" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">$183.7B</span><PriceChangeIndicator value={-4.1} /></div>}>
          <ChartPlaceholder variant="bars" height={240} seed="deriv-vol" yLabels={["$250B", "$190B", "$130B", "$70B", "0"]} xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
        </ChartContainer>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader title="Funding Rates" subtitle="Perpetual contracts · 8h interval" icon={<Percent />} action={<Button size="xs" variant="ghost" href="/derivatives/futures">All contracts</Button>} />
          <div className="mt-4"><ContractsTable rows={funding} pageSize={7} /></div>
        </Card>
        <Card>
          <CardHeader title="Long / Short Ratio" subtitle="Top trader accounts" icon={<Scale />} />
          <ul className="space-y-5 p-5">
            {[["BTC", "#F7931A", 51.8], ["ETH", "#627EEA", 54.2], ["SOL", "#9945FF", 58.9], ["XRP", "#23292F", 47.1], ["DOGE", "#C2A633", 61.3], ["AVAX", "#E84142", 49.4]].map(([s, c, l]) => (
              <li key={s as string} className="flex items-center gap-3">
                <CoinLogo symbol={s as string} color={c as string} size={28} />
                <span className="w-10 text-[13px] font-semibold text-ink">{s}</span>
                <LongShortBar long={l as number} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Exchange Rankings" subtitle="By open interest" icon={<Activity />} action={<Button size="xs" variant="ghost" href="/derivatives/exchanges">View all</Button>} />
        <div className="mt-4"><DerivExchangeTable rows={DERIV_EXCHANGES.slice(0, 5)} pageSize={5} /></div>
      </Card>
    </div>
  );
}

export function DerivExchangesListView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Derivatives Exchanges" description="Ranking of futures and perpetual venues by open interest and verified volume." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total Open Interest" value="$81.9B" change={2.1} icon={<Layers />} sparkSeed="toi" />
        <MetricCard label="24h Derivatives Volume" value="$183.7B" change={-4.1} icon={<BarChart3 />} sparkSeed="tdv-d" />
        <MetricCard label="Active Contracts" value="2,634" change={0.7} icon={<Flame />} />
      </div>
      <Card className="overflow-hidden"><DerivExchangeTable rows={DERIV_EXCHANGES} /></Card>
    </div>
  );
}

export function FuturesView() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [ex, setEx] = useState("All exchanges");
  const exchanges = ["All exchanges", ...Array.from(new Set(CONTRACTS.map((c) => c.exchange)))];
  const rows = useMemo(() => CONTRACTS.filter((c) => (type === "all" || c.type.toLowerCase().startsWith(type)) && (ex === "All exchanges" || c.exchange === ex) && c.symbol.toLowerCase().includes(q.toLowerCase())), [q, type, ex]);
  return (
    <div className="space-y-6">
      <PageHeader title="Futures & Perpetual Contracts" description="Search every derivatives contract by funding, basis, open interest and volume." />
      <Card className="overflow-hidden">
        <FilterBar>
          <SearchInput value={q} onChange={setQ} placeholder="Search contracts" className="w-full sm:w-64" />
          <Tabs ariaLabel="Contract type" value={type} onChange={setType} items={[{ id: "all", label: "All" }, { id: "perp", label: "Perpetual" }, { id: "fut", label: "Futures" }]} />
          <SelectDropdown options={exchanges} value={ex} onChange={setEx} />
          <span className="ml-auto text-[13px] text-muted">{rows.length} contracts</span>
        </FilterBar>
        <ContractsTable rows={rows} pageSize={10} />
      </Card>
    </div>
  );
}

export function DerivExchangeDetailView({ exchange: e }: { exchange: DerivExchange }) {
  const rows = CONTRACTS.filter((c) => c.exchange.toLowerCase().includes(e.name.split(" ")[0].toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader
        leading={<ExchangeLogo name={e.name} color={e.color} size={56} />}
        title={e.name}
        badge={<span className="flex gap-1.5"><StatusBadge tone="primary">Rank #{e.rank}</StatusBadge><StatusBadge>Derivatives</StatusBadge></span>}
        description={`${e.country} · Founded ${e.founded} · ${formatNumber(e.pairs)} listed contracts`}
        actions={<Button href="/derivatives/exchanges">All derivatives exchanges</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open Interest" value={usdCompact(e.oi)} change={e.change * 0.6} icon={<Layers />} sparkSeed={e.id} />
        <MetricCard label="24h Volume" value={usdCompact(e.volume24h)} change={e.change} icon={<BarChart3 />} sparkSeed={e.id + "v"} />
        <MetricCard label="Avg. Funding" value={`${e.funding.toFixed(4)}%`} icon={<Percent />} hint="per 8h" changeLabel="" />
        <Card className="flex flex-col justify-between p-5"><span className="text-[13px] font-medium text-muted">Long / Short</span><LongShortBar long={e.longPct} className="mt-3" /></Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Open Interest" subtitle={`${e.name} · USD`} hideToolbar defaultTimeframe="1M" timeframes={["24H", "7D", "1M", "1Y"]}>
          <ChartPlaceholder variant="area" height={280} seed={e.id + "oi"} trend={e.change * 2} yLabels={["$25B", "$20B", "$15B", "$10B", "$5B"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Exchange Info" />
          <div className="px-5 pb-3 pt-1"><KeyStats items={[{ label: "Country", value: e.country }, { label: "Founded", value: e.founded }, { label: "Contracts", value: formatNumber(e.pairs) }, { label: "Max leverage", value: "125×" }, { label: "Insurance fund", value: usdCompact(e.oi * 0.08) }, { label: "Maker / Taker", value: "0.02% / 0.05%" }]} /></div>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Contract Markets" subtitle={`Top contracts on ${e.name}`} icon={<Activity />} />
        <div className="mt-4"><ContractsTable rows={rows.length ? rows : CONTRACTS.slice(0, 6)} pageSize={8} /></div>
      </Card>
    </div>
  );
}
