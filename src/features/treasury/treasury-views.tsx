"use client";

import Link from "next/link";
import { ArrowUpRight, Banknote, Bitcoin, Building2, Flag, Landmark, PieChart, Trophy, Users } from "lucide-react";
import { BTC_PRICE, BTC_SUPPLY, COMPANIES, GOVERNMENTS, TREASURY, getTreasury, type TreasuryEntity } from "@/lib/mock-data/treasury";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { KeyStats, ProgressBar } from "@/components/shared/key-stats";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { formatNumber, formatUsd, usdCompact } from "@/lib/utils";

const val = (e: TreasuryEntity) => e.btc * BTC_PRICE;
const pct = (e: TreasuryEntity) => (e.btc / BTC_SUPPLY) * 100;

export function TreasuryTable({ rows, pageSize = 10 }: { rows: TreasuryEntity[]; pageSize?: number }) {
  const gov = rows[0]?.kind === "Government";
  const columns: Column<TreasuryEntity>[] = [
    { key: "i", header: "#", className: "w-10 text-muted tabular-nums", render: (_e, i) => i + 1 },
    { key: "n", header: gov ? "Country" : "Company", sticky: true, sort: (e) => e.name, render: (e) => <Link href={`/treasury/${e.id}`} className="flex items-center gap-3"><CoinLogo symbol={gov ? e.name.slice(0, 2) : (e.ticker ?? e.name).slice(0, 2)} color={e.color} size={36} rounded="xl" /><span className="leading-tight"><span className="block font-semibold text-ink">{e.name}</span><span className="text-xs text-muted">{e.ticker ?? e.country}</span></span></Link> },
    { key: "btc", header: "BTC Holdings", align: "right", sort: (e) => e.btc, className: "font-semibold tabular-nums text-ink", render: (e) => <span className="inline-flex items-center gap-1.5"><Bitcoin className="size-3.5 text-[#F7931A]" />{formatNumber(e.btc)}</span> },
    { key: "val", header: "Value (USD)", align: "right", sort: val, className: "tabular-nums text-ink", render: (e) => usdCompact(val(e)) },
    { key: "pct", header: "% of BTC Supply", align: "right", sort: pct, className: "tabular-nums", render: (e) => `${pct(e).toFixed(3)}%` },
    ...(gov ? [{ key: "src", header: "Source", className: "text-muted", render: (e: TreasuryEntity) => e.since } as Column<TreasuryEntity>] : [
      { key: "cost", header: "Avg. Cost", align: "right", sort: (e: TreasuryEntity) => e.costBasis, className: "tabular-nums", render: (e: TreasuryEntity) => formatUsd(e.costBasis) } as Column<TreasuryEntity>,
      { key: "pnl", header: "Unrealized P/L", align: "right", sort: (e: TreasuryEntity) => BTC_PRICE / e.costBasis, render: (e: TreasuryEntity) => <PriceChangeIndicator value={(BTC_PRICE / e.costBasis - 1) * 100} /> } as Column<TreasuryEntity>,
    ]),
    { key: "c30", header: "30d Δ", align: "right", sort: (e) => e.change30d, render: (e) => <PriceChangeIndicator value={e.change30d} /> },
    { key: "ch", header: "Holdings", align: "right", render: (e) => <SparklinePlaceholder data={e.spark} positive width={88} height={30} /> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(e) => e.id} pageSize={pageSize} minWidth={1000} initialSort={{ key: "btc", dir: "desc" }} />;
}

function EntityCard({ e }: { e: TreasuryEntity }) {
  return (
    <Link href={`/treasury/${e.id}`} className="group">
      <Card className="p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-pop">
        <div className="flex items-start justify-between"><CoinLogo symbol={(e.ticker ?? e.name).slice(0, 2)} color={e.color} size={44} rounded="xl" /><ArrowUpRight className="size-4 text-muted group-hover:text-primary" /></div>
        <div className="mt-4 font-semibold text-ink">{e.name}</div>
        <div className="text-xs text-muted">{e.ticker ?? e.country} · since {e.since}</div>
        <div className="mt-4 text-xl font-semibold tabular-nums text-ink">{formatNumber(e.btc)} <span className="text-sm font-medium text-muted">BTC</span></div>
        <div className="mt-1 text-xs text-muted">{usdCompact(val(e))} · {pct(e).toFixed(2)}% of supply</div>
        <ProgressBar className="mt-4" value={pct(e) * 40} color="#F7931A" />
      </Card>
    </Link>
  );
}

export function TreasuryOverviewView() {
  const comp = COMPANIES.reduce((s, e) => s + e.btc, 0);
  const gov = GOVERNMENTS.reduce((s, e) => s + e.btc, 0);
  const etf = 1_180_000;
  const total = comp + gov + etf;
  const segs = [{ label: "Spot ETFs", value: etf, color: "#315CF5" }, { label: "Public companies", value: comp, color: "#F7931A" }, { label: "Governments", value: gov, color: "#8B5CF6" }, { label: "Private & other", value: 2_620_000, color: "#B8C2D8" }];
  const assets = [["Bitcoin (BTC)", "BTC", "#F7931A", total * BTC_PRICE, 100], ["Ethereum (ETH)", "ETH", "#627EEA", 12.4e9, 18], ["Solana (SOL)", "SOL", "#9945FF", 1.9e9, 6], ["XRP", "XRP", "#23292F", 0.6e9, 3]] as const;
  return (
    <div className="space-y-6">
      <PageHeader title="Treasury Tracker" description="Institutional and sovereign cryptocurrency holdings — who owns what, and how it's changing." actions={<Button href="/treasury/companies" variant="primary" icon={<Building2 className="size-4" />}>Public companies</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Institutional Holdings" value={usdCompact(total * BTC_PRICE)} change={2.2} icon={<Banknote />} sparkSeed="tt" />
        <MetricCard label="Bitcoin Held" value={`${(total / 1e6).toFixed(2)}M BTC`} change={0.6} icon={<Bitcoin />} hint={`${((total / BTC_SUPPLY) * 100).toFixed(1)}% of supply`} />
        <MetricCard label="Public Companies" value={COMPANIES.length * 19} change={3.2} icon={<Building2 />} changeLabel="tracked" />
        <MetricCard label="Governments" value={GOVERNMENTS.length + 5} change={0} icon={<Flag />} changeLabel="with holdings" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Treasury Holdings Over Time" subtitle="Aggregate BTC held by tracked entities" hideToolbar timeframes={["3M", "1Y", "3Y", "ALL"]} defaultTimeframe="1Y" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">{(total / 1e6).toFixed(2)}M BTC</span><PriceChangeIndicator value={0.6} /></div>}>
          <ChartPlaceholder variant="area" height={250} seed="treasury-total" trend={22} yLabels={["4.8M", "4.6M", "4.4M", "4.2M", "4.0M"]} xLabels={["Q3", "Q4", "Q1", "Q2"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Treasury Distribution" subtitle="Holders of BTC" icon={<PieChart />} />
          <div className="flex flex-col items-center gap-5 p-5"><DonutChart size={150} thickness={16} segments={segs}><span className="text-[11px] text-muted">Total</span><span className="text-lg font-semibold text-ink">{(total / 1e6).toFixed(2)}M</span></DonutChart><div className="w-full"><Legend suffix="%" segments={segs.map((s) => ({ ...s, value: (s.value / (total + 2_620_000)) * 100 }))} /></div></div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2"><CardHeader title="Company Rankings" icon={<Trophy />} action={<Button size="xs" variant="ghost" href="/treasury/companies">All companies</Button>} /><div className="mt-4"><TreasuryTable rows={COMPANIES.slice(0, 5)} pageSize={5} /></div></Card>
        <Card><CardHeader title="Asset Holdings" subtitle="By asset, institutional" icon={<Landmark />} /><ul className="space-y-5 p-5">{assets.map(([n, s, c, v, w]) => <li key={s}><div className="mb-1.5 flex items-center justify-between text-[13px]"><span className="flex items-center gap-2 font-medium text-ink"><CoinLogo symbol={s} color={c} size={22} />{n}</span><span className="tabular-nums text-muted">{usdCompact(v)}</span></div><ProgressBar value={w} color={c} /></li>)}</ul></Card>
      </div>
      <section className="space-y-3"><h2 className="text-[15px] font-semibold text-ink">Featured Holders</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[TREASURY[0], TREASURY[1], TREASURY[10], TREASURY[15]].map((e) => <EntityCard key={e.id} e={e} />)}</div></section>
    </div>
  );
}

export function TreasuryListView({ kind }: { kind: "companies" | "governments" }) {
  const rows = kind === "companies" ? COMPANIES : GOVERNMENTS;
  const total = rows.reduce((s, e) => s + e.btc, 0);
  return (
    <div className="space-y-6">
      <PageHeader title={kind === "companies" ? "Public Companies" : "Government Holdings"} description={kind === "companies" ? "Publicly traded companies holding Bitcoin on their balance sheets." : "Nation-states and public entities with disclosed or estimated Bitcoin holdings."} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total BTC Held" value={formatNumber(total)} change={0.8} icon={<Bitcoin />} sparkSeed={kind} />
        <MetricCard label="Total Value" value={usdCompact(total * BTC_PRICE)} change={1.9} icon={<Banknote />} />
        <MetricCard label="Share of Supply" value={`${((total / BTC_SUPPLY) * 100).toFixed(2)}%`} icon={<Users />} changeLabel="" hint="of 21M cap" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{rows.slice(0, 4).map((e) => <EntityCard key={e.id} e={e} />)}</div>
      <Card className="overflow-hidden"><TreasuryTable rows={rows} /></Card>
    </div>
  );
}

export function TreasuryDetailView({ id }: { id: string }) {
  const e = getTreasury(id)!;
  const pnl = e.costBasis ? (BTC_PRICE / e.costBasis - 1) * 100 : 0;
  const buys = [["Jun 24, 2025", 4_020, 61_900], ["May 30, 2025", 12_100, 63_400], ["Apr 29, 2025", 5_900, 60_700], ["Mar 31, 2025", 7_450, 58_900], ["Feb 28, 2025", 3_300, 56_100]];
  return (
    <div className="space-y-6">
      <PageHeader leading={<CoinLogo symbol={(e.ticker ?? e.name).slice(0, 2)} color={e.color} size={56} rounded="xl" />} title={e.name} badge={<span className="flex gap-1.5"><StatusBadge tone="primary">{e.kind}</StatusBadge>{e.ticker && <StatusBadge>{e.ticker}</StatusBadge>}</span>} description={`${e.country} · Holding since ${e.since}`} actions={<Button href={e.kind === "Government" ? "/treasury/governments" : "/treasury/companies"}>Back to list</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Bitcoin Held" value={`${formatNumber(e.btc)} BTC`} change={e.change30d} changeLabel="30d" icon={<Bitcoin />} sparkSeed={e.id} />
        <MetricCard label="Current Value" value={usdCompact(val(e))} change={1.95} icon={<Banknote />} />
        <MetricCard label="% of BTC Supply" value={`${pct(e).toFixed(3)}%`} icon={<PieChart />} changeLabel="" hint="of 21M cap" />
        {e.costBasis ? <MetricCard label="Unrealized P/L" value={`${pnl >= 0 ? "+" : ""}${pnl.toFixed(1)}%`} change={pnl} icon={<Trophy />} hint={`avg. cost ${formatUsd(e.costBasis)}`} changeLabel="" /> : <MetricCard label="Cost Basis" value="Undisclosed" icon={<Trophy />} changeLabel="" hint="seized / mined" />}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Holdings History" subtitle="BTC balance over time" hideToolbar timeframes={["3M", "1Y", "3Y", "ALL"]} defaultTimeframe="1Y">
          <ChartPlaceholder variant="area" height={280} seed={e.id + "h"} trend={26} yLabels={[1, 0.8, 0.6, 0.4, 0.2].map((m) => formatNumber(Math.round(e.btc * m)))} xLabels={["Q3", "Q4", "Q1", "Q2"]} />
        </ChartContainer>
        <Card><CardHeader title="Overview" /><div className="px-5 pb-3 pt-1"><KeyStats items={[{ label: "Type", value: e.kind }, { label: "Jurisdiction", value: e.country }, ...(e.ticker ? [{ label: "Ticker", value: e.ticker }] : []), { label: "First acquired", value: e.since }, { label: "Holdings", value: `${formatNumber(e.btc)} BTC` }, { label: "Other assets", value: e.eth ? `${formatNumber(e.eth)} ETH` : "None disclosed" }]} /></div><p className="border-t border-line p-5 text-[13px] leading-relaxed text-muted">{e.note}</p></Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader title="Recent Acquisitions" subtitle="Disclosed purchases · illustrative" icon={<Landmark />} />
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-[13px]"><thead><tr className="bg-soft/70"><th className="border-y border-line px-5 py-3 text-left text-xs font-medium text-muted">Date</th><th className="border-y border-line px-4 py-3 text-right text-xs font-medium text-muted">BTC acquired</th><th className="border-y border-line px-4 py-3 text-right text-xs font-medium text-muted">Avg. price</th><th className="border-y border-line px-5 py-3 text-right text-xs font-medium text-muted">Total</th></tr></thead><tbody>{buys.map(([d, b, p]) => <tr key={d as string} className="border-b border-line/70 last:border-0 hover:bg-primary-soft/40"><td className="px-5 py-3.5 text-ink">{d}</td><td className="px-4 py-3.5 text-right tabular-nums">{formatNumber(Math.round((b as number) * (e.btc / 214400 + 0.04)))}</td><td className="px-4 py-3.5 text-right tabular-nums">{formatUsd(p as number)}</td><td className="px-5 py-3.5 text-right font-medium tabular-nums text-ink">{usdCompact((b as number) * (e.btc / 214400 + 0.04) * (p as number))}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
