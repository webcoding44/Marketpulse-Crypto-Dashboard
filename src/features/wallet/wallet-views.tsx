"use client";

import { useState, type ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, Coins, Copy, Fuel, History, LineChart, Search, ShieldCheck, Trophy, Wallet, TrendingUp, Percent } from "lucide-react";
import { WALLET_ADDRESS, WALLET_HOLDINGS, WALLET_TRANSFERS, WALLET_TXS, holdingPnl, holdingPnlPct, holdingValue, type Holding } from "@/lib/mock-data/wallet-portfolio";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { ProgressBar } from "@/components/shared/key-stats";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { BarChartPlaceholder } from "@/components/charts/bar-chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { SelectDropdown } from "@/components/ui/dropdown";
import { cn, formatNumber, formatPrice, formatUsd, series, shortAddress, usdCompact } from "@/lib/utils";

const total = WALLET_HOLDINGS.reduce((s, h) => s + holdingValue(h), 0);
const totalPnl = WALLET_HOLDINGS.reduce((s, h) => s + holdingPnl(h), 0);

function WalletShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const [q, setQ] = useState(WALLET_ADDRESS);
  const [net, setNet] = useState("All networks");
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <label htmlFor="wallet-search" className="text-[13px] font-semibold text-ink">Wallet address or ENS</label>
            <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
              <SearchInput size="lg" value={q} onChange={setQ} placeholder="0x… or vitalik.eth" className="flex-1" ariaLabel="Wallet address" />
              <SelectDropdown options={["All networks", "Ethereum", "Arbitrum", "Base", "Solana"]} value={net} onChange={setNet} />
              <Button variant="primary" size="lg" icon={<Search className="size-4" />}>Analyze</Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">Try:
              {["vitalik.eth", "0x28C6…1d60", "whale-0x3f5C"].map((s) => <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-line bg-soft px-2.5 py-1 font-medium text-ink hover:border-primary/40">{s}</button>)}
            </div>
          </div>
        </div>
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white"><Wallet className="size-6" /></span>
          <div>
            <div className="flex items-center gap-2"><span className="font-mono text-sm font-semibold text-ink">{shortAddress(q.startsWith("0x") && q.length > 20 ? q : WALLET_ADDRESS, 10, 8)}</span><button type="button" aria-label="Copy address" className="text-muted hover:text-ink"><Copy className="size-3.5" /></button></div>
            <div className="mt-1.5 flex flex-wrap gap-1.5"><StatusBadge tone="primary">Active trader</StatusBadge><StatusBadge tone="success"><ShieldCheck className="size-3" /> Low risk</StatusBadge><StatusBadge>First seen 2.4y ago</StatusBadge></div>
          </div>
        </div>
        <div className="text-right"><div className="text-xs text-muted">Net worth</div><div className="text-2xl font-semibold tabular-nums tracking-tight text-ink">{formatUsd(total)}</div></div>
      </Card>
      {children}
    </div>
  );
}

function HoldingsTable({ rows, pageSize = 8 }: { rows: Holding[]; pageSize?: number }) {
  const columns: Column<Holding>[] = [
    { key: "a", header: "Asset", sticky: true, sort: (h) => h.name, render: (h) => <span className="flex items-center gap-3"><CoinLogo symbol={h.symbol} color={h.color} size={34} /><span className="leading-tight"><span className="block font-semibold text-ink">{h.name}</span><span className="text-xs text-muted">{h.symbol}</span></span></span> },
    { key: "p", header: "Price", align: "right", sort: (h) => h.price, className: "tabular-nums", render: (h) => formatPrice(h.price) },
    { key: "c", header: "24h", align: "right", sort: (h) => h.c24h, render: (h) => <PriceChangeIndicator value={h.c24h} /> },
    { key: "b", header: "Balance", align: "right", sort: (h) => h.amount, className: "tabular-nums", render: (h) => `${formatNumber(h.amount)} ${h.symbol}` },
    { key: "v", header: "Value", align: "right", sort: holdingValue, className: "font-semibold tabular-nums text-ink", render: (h) => formatUsd(holdingValue(h)) },
    { key: "pnl", header: "Unrealized P/L", align: "right", sort: holdingPnl, render: (h) => <span className="leading-tight"><span className={cn("block font-medium tabular-nums", holdingPnl(h) >= 0 ? "text-success" : "text-danger")}>{holdingPnl(h) >= 0 ? "+" : "−"}{formatUsd(Math.abs(holdingPnl(h)))}</span><PriceChangeIndicator value={holdingPnlPct(h)} variant="text" className="!text-xs" /></span> },
    { key: "w", header: "Allocation", align: "right", sort: holdingValue, render: (h) => <span className="ml-auto flex w-36 items-center justify-end gap-2.5"><ProgressBar value={(holdingValue(h) / total) * 100} color={h.color} className="w-20" height={5} /><span className="w-10 text-right tabular-nums text-muted">{((holdingValue(h) / total) * 100).toFixed(1)}%</span></span> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(h) => h.symbol} pageSize={pageSize} minWidth={900} initialSort={{ key: "v", dir: "desc" }} />;
}

function TxTable({ rows, pageSize = 8 }: { rows: typeof WALLET_TXS; pageSize?: number }) {
  type T = (typeof WALLET_TXS)[number];
  const columns: Column<T>[] = [
    { key: "t", header: "Type", render: (t) => <StatusBadge tone={t.type.includes("In") ? "success" : t.type.includes("Out") ? "danger" : t.type === "Swap" ? "primary" : "neutral"}>{t.type}</StatusBadge> },
    { key: "h", header: "Tx Hash", render: (t) => <span className="font-mono text-xs text-primary">{shortAddress(t.hash, 8, 6)}</span> },
    { key: "a", header: "Amount", align: "right", className: "tabular-nums text-ink", render: (t) => (t.amount ? `${formatNumber(t.amount)} ${t.token}` : "—") },
    { key: "u", header: "Value", align: "right", sort: (t) => t.usd, className: "tabular-nums", render: (t) => (t.amount ? formatUsd(t.usd) : "—") },
    { key: "c", header: "Counterparty", render: (t) => <span className="font-mono text-xs text-muted">{shortAddress(t.counterparty)}</span> },
    { key: "f", header: "Fee", align: "right", className: "tabular-nums text-muted", render: (t) => <span className="inline-flex items-center gap-1"><Fuel className="size-3" />{t.fee} ETH</span> },
    { key: "s", header: "Status", render: (t) => <StatusBadge tone={t.status === "Success" ? "success" : "danger"} dot>{t.status}</StatusBadge> },
    { key: "time", header: "Time", align: "right", className: "whitespace-nowrap text-muted", render: (t) => t.time },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(t) => t.id} pageSize={pageSize} minWidth={960} dense />;
}

export function WalletOverviewView() {
  const segs = WALLET_HOLDINGS.slice(0, 5).map((h) => ({ label: h.symbol, value: (holdingValue(h) / total) * 100, color: h.color }));
  return (
    <WalletShell title="Wallet Explorer" description="Search any address to see balances, activity and performance — all in one place.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Net Worth" value={formatUsd(total)} change={2.14} icon={<Wallet />} sparkSeed="wallet-nw" />
        <MetricCard label="Unrealized P/L" value={usdCompact(totalPnl)} change={18.4} icon={<TrendingUp />} changeLabel="all time" />
        <MetricCard label="Tokens Held" value={WALLET_HOLDINGS.length + 14} icon={<Coins />} changeLabel="" hint="across 4 networks" />
        <MetricCard label="Total Transactions" value="2,418" change={0.6} icon={<History />} hint="last 30d: 142" changeLabel="" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Net Worth History" subtitle="Total portfolio value" hideToolbar timeframes={["7D", "1M", "3M", "1Y"]} defaultTimeframe="1M" headline={<div className="flex items-center gap-3"><span className="text-[26px] font-semibold tabular-nums tracking-tight text-ink">{formatUsd(total)}</span><PriceChangeIndicator value={2.14} /></div>}>
          <ChartPlaceholder variant="area" height={250} seed="wallet-nw" trend={20} yLabels={["$1.1M", "$1.0M", "$0.9M", "$0.8M", "$0.7M"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card><CardHeader title="Token Distribution" icon={<Coins />} /><div className="flex flex-col items-center gap-5 p-5"><DonutChart size={150} thickness={16} segments={segs}><span className="text-[11px] text-muted">Net worth</span><span className="text-base font-semibold text-ink">{usdCompact(total)}</span></DonutChart><div className="w-full"><Legend segments={segs} /></div></div></Card>
      </div>
      <Card className="overflow-hidden"><CardHeader title="Top Holdings" action={<Button size="xs" variant="ghost" href="/wallet-explorer/holdings">View all</Button>} /><div className="mt-4"><HoldingsTable rows={WALLET_HOLDINGS.slice(0, 5)} pageSize={5} /></div></Card>
      <Card className="overflow-hidden"><CardHeader title="Recent Transactions" action={<Button size="xs" variant="ghost" href="/wallet-explorer/transactions">View all</Button>} /><div className="mt-4"><TxTable rows={WALLET_TXS.slice(0, 5)} pageSize={5} /></div></Card>
    </WalletShell>
  );
}

export function WalletHoldingsView() {
  return (
    <WalletShell title="Wallet Holdings" description="Every token held by this wallet, valued at current market prices.">
      <Card className="overflow-hidden"><CardHeader title="Token Balances" subtitle={`${WALLET_HOLDINGS.length} assets · ${formatUsd(total)}`} icon={<Coins />} /><div className="mt-4"><HoldingsTable rows={WALLET_HOLDINGS} /></div></Card>
    </WalletShell>
  );
}

export function WalletTransactionsView() {
  return (
    <WalletShell title="Wallet Transactions" description="Chronological activity including swaps, transfers, approvals and contract calls.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Transactions (30d)" value="142" change={8.4} icon={<History />} sparkSeed="wt" />
        <MetricCard label="Gas Spent (30d)" value="0.42 ETH" change={-12} icon={<Fuel />} hint="≈ $1,363" changeLabel="" />
        <MetricCard label="Success Rate" value="98.6%" change={0.3} icon={<ShieldCheck />} />
      </div>
      <Card className="overflow-hidden"><CardHeader title="Transaction History" icon={<History />} /><div className="mt-4"><TxTable rows={WALLET_TXS} pageSize={10} /></div></Card>
    </WalletShell>
  );
}

export function WalletPnlView() {
  const best = [...WALLET_HOLDINGS].sort((a, b) => holdingPnlPct(b) - holdingPnlPct(a))[0];
  const monthly = series("pnl-m", 12, 0, 2).map((v, i) => (v - 100) * (i % 3 === 1 ? -1 : 1) + 4);
  return (
    <WalletShell title="Wallet Profit & Loss" description="Realized and unrealized performance, broken down by asset and period.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total P/L" value={usdCompact(totalPnl)} change={18.4} icon={<LineChart />} sparkSeed="pnl-t" />
        <MetricCard label="Realized P/L" value="$284.2K" change={6.2} icon={<TrendingUp />} changeLabel="30d" />
        <MetricCard label="Win Rate" value="64%" change={2.1} icon={<Percent />} hint="of closed trades" changeLabel="" />
        <MetricCard label="Best Performer" value={best.symbol} change={holdingPnlPct(best)} icon={<Trophy />} changeLabel="all time" />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Monthly P/L" subtitle="Realized + unrealized · USD" hideToolbar hideTimeframes>
          <BarChartPlaceholder data={monthly} signed height={220} labels={["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]} />
        </ChartContainer>
        <Card><CardHeader title="P/L by Asset" /><ul className="space-y-4 p-5">{WALLET_HOLDINGS.slice(0, 6).map((h) => <li key={h.symbol} className="flex items-center gap-3"><CoinLogo symbol={h.symbol} color={h.color} size={28} /><span className="flex-1 text-[13px] font-medium text-ink">{h.symbol}</span><span className={cn("text-[13px] font-semibold tabular-nums", holdingPnl(h) >= 0 ? "text-success" : "text-danger")}>{holdingPnl(h) >= 0 ? "+" : "−"}{usdCompact(Math.abs(holdingPnl(h)))}</span></li>)}</ul></Card>
      </div>
      <Card className="overflow-hidden"><CardHeader title="Position Performance" icon={<LineChart />} /><div className="mt-4"><HoldingsTable rows={WALLET_HOLDINGS} /></div></Card>
    </WalletShell>
  );
}

export function WalletTransfersView() {
  type T = (typeof WALLET_TRANSFERS)[number];
  const columns: Column<T>[] = [
    { key: "d", header: "Direction", render: (t) => <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", t.direction === "In" ? "text-success" : "text-danger")}><span className={cn("flex size-6 items-center justify-center rounded-full", t.direction === "In" ? "bg-success-soft" : "bg-danger-soft")}>{t.direction === "In" ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}</span>{t.direction === "In" ? "Received" : "Sent"}</span> },
    { key: "tok", header: "Token", render: (t) => <span className="font-semibold text-ink">{t.token}</span> },
    { key: "a", header: "Amount", align: "right", sort: (t) => t.amount, className: "tabular-nums text-ink", render: (t) => formatNumber(t.amount) },
    { key: "u", header: "Value", align: "right", sort: (t) => t.usd, className: "tabular-nums", render: (t) => formatUsd(t.usd) },
    { key: "f", header: "From", render: (t) => <span className="font-mono text-xs text-muted">{shortAddress(t.from)}</span> },
    { key: "to", header: "To", render: (t) => <span className="font-mono text-xs text-muted">{shortAddress(t.to)}</span> },
    { key: "n", header: "Network", className: "text-muted", render: (t) => t.network },
    { key: "t", header: "Time", align: "right", className: "whitespace-nowrap text-muted", render: (t) => t.time },
  ];
  return (
    <WalletShell title="Token Transfers" description="Inbound and outbound ERC-20 transfers for this wallet.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Inflow (30d)" value="$1.82M" change={12.4} icon={<ArrowDownLeft />} sparkSeed="inflow" />
        <MetricCard label="Outflow (30d)" value="$1.21M" change={-4.8} icon={<ArrowUpRight />} sparkSeed="outflow-d" />
        <MetricCard label="Net Flow" value="+$610K" change={22.1} icon={<TrendingUp />} />
      </div>
      <Card className="overflow-hidden"><CardHeader title="Transfer History" icon={<ArrowDownLeft />} /><div className="mt-4"><DataTable columns={columns} rows={WALLET_TRANSFERS} rowKey={(t) => t.id} pageSize={10} minWidth={900} dense /></div></Card>
    </WalletShell>
  );
}
