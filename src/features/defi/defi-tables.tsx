"use client";

import Link from "next/link";
import { ArrowUpRight, Copy, ExternalLink } from "lucide-react";
import { ageLabel, type OnchainToken, type Pool, HOLDERS, TRANSACTIONS } from "@/lib/mock-data/defi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/shared/key-stats";
import { NETWORKS } from "@/lib/mock-data/defi";
import { formatNumber, formatPrice, shortAddress, usdCompact } from "@/lib/utils";

export const networkColor = (name: string) => NETWORKS.find((n) => n.name === name)?.color ?? "#8B5CF6";

export function PairLogo({ base, baseColor, quote, quoteColor, size = 30 }: { base: string; baseColor: string; quote: string; quoteColor: string; size?: number }) {
  return (
    <span className="flex shrink-0 -space-x-2">
      <span className="rounded-full ring-2 ring-card"><CoinLogo symbol={base} color={baseColor} size={size} /></span>
      <span className="rounded-full ring-2 ring-card"><CoinLogo symbol={quote} color={quoteColor} size={size} /></span>
    </span>
  );
}

export function NetworkChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink">
      <span className="size-2 rounded-full" style={{ background: networkColor(name) }} />
      {name}
    </span>
  );
}

export function CopyAddress({ value, short = true }: { value: string; short?: boolean }) {
  return (
    <button type="button" onClick={() => navigator.clipboard?.writeText(value)} title="Copy address" className="inline-flex items-center gap-1.5 rounded-md bg-soft px-2 py-1 font-mono text-xs text-muted transition-colors hover:text-ink">
      {short ? shortAddress(value) : value}
      <Copy className="size-3" />
    </button>
  );
}

export function PoolsTable({ pools, pageSize = 8, showAge = true }: { pools: Pool[]; pageSize?: number; showAge?: boolean }) {
  const columns: Column<Pool>[] = [
    { key: "i", header: "#", className: "w-10 text-muted tabular-nums", render: (_p, i) => i + 1 },
    {
      key: "pool",
      header: "Pool",
      sticky: true,
      sort: (p) => p.base,
      render: (p) => (
        <Link href={`/defi/pools/${p.id}`} className="flex items-center gap-3">
          <PairLogo base={p.base} baseColor={p.baseColor} quote={p.quote} quoteColor={p.quoteColor} />
          <span className="leading-tight">
            <span className="block font-semibold text-ink">{p.base} <span className="font-normal text-muted">/ {p.quote}</span></span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted"><span>{p.dex}</span><span className="rounded bg-soft px-1 font-medium">{p.fee}</span></span>
          </span>
        </Link>
      ),
    },
    { key: "net", header: "Network", render: (p) => <NetworkChip name={p.network} /> },
    { key: "price", header: "Price", align: "right", sort: (p) => p.price, className: "font-semibold tabular-nums text-ink", render: (p) => formatPrice(p.price) },
    ...(showAge ? [{ key: "age", header: "Age", align: "right", sort: (p: Pool) => p.ageH, className: "text-muted tabular-nums", render: (p: Pool) => ageLabel(p.ageH) } as Column<Pool>] : []),
    { key: "txns", header: "Txns 24h", align: "right", sort: (p) => p.txns, className: "tabular-nums", render: (p) => formatNumber(p.txns) },
    { key: "c1h", header: "1h", align: "right", sort: (p) => p.c1h, render: (p) => <PriceChangeIndicator value={p.c1h} /> },
    { key: "c24h", header: "24h", align: "right", sort: (p) => p.c24h, render: (p) => <PriceChangeIndicator value={p.c24h} /> },
    { key: "vol", header: "Volume 24h", align: "right", sort: (p) => p.volume, className: "tabular-nums text-ink", render: (p) => usdCompact(p.volume) },
    { key: "liq", header: "Liquidity", align: "right", sort: (p) => p.liquidity, className: "tabular-nums text-ink", render: (p) => usdCompact(p.liquidity) },
    { key: "chart", header: "Trend", align: "right", render: (p) => <SparklinePlaceholder data={p.spark} positive={p.c24h >= 0} width={88} height={30} /> },
  ];
  return <DataTable columns={columns} rows={pools} rowKey={(p) => p.id} pageSize={pageSize} minWidth={1100} emptyTitle="No pools match these filters" />;
}

export function TokensTable({ tokens, pageSize = 10 }: { tokens: OnchainToken[]; pageSize?: number }) {
  const columns: Column<OnchainToken>[] = [
    { key: "i", header: "#", className: "w-10 text-muted tabular-nums", render: (_t, i) => i + 1 },
    {
      key: "token",
      header: "Token",
      sticky: true,
      sort: (t) => t.name,
      render: (t) => (
        <Link href={`/defi/tokens/${t.id}`} className="flex items-center gap-3">
          <CoinLogo symbol={t.symbol} color={t.color} size={34} />
          <span className="leading-tight"><span className="block font-semibold text-ink">{t.name}</span><span className="block font-mono text-[11px] text-muted">{shortAddress(t.address)}</span></span>
        </Link>
      ),
    },
    { key: "net", header: "Network", render: (t) => <NetworkChip name={t.network} /> },
    { key: "price", header: "Price", align: "right", sort: (t) => t.price, className: "font-semibold tabular-nums text-ink", render: (t) => formatPrice(t.price) },
    { key: "c24h", header: "24h", align: "right", sort: (t) => t.c24h, render: (t) => <PriceChangeIndicator value={t.c24h} /> },
    { key: "vol", header: "Volume 24h", align: "right", sort: (t) => t.volume, className: "tabular-nums", render: (t) => usdCompact(t.volume) },
    { key: "liq", header: "Liquidity", align: "right", sort: (t) => t.liquidity, className: "tabular-nums", render: (t) => usdCompact(t.liquidity) },
    { key: "mcap", header: "Market Cap", align: "right", sort: (t) => t.mcap, className: "tabular-nums", render: (t) => usdCompact(t.mcap) },
    { key: "holders", header: "Holders", align: "right", sort: (t) => t.holders, className: "tabular-nums", render: (t) => formatNumber(t.holders) },
    { key: "chart", header: "Trend", align: "right", render: (t) => <SparklinePlaceholder data={t.spark} positive={t.c24h >= 0} width={88} height={30} /> },
  ];
  return <DataTable columns={columns} rows={tokens} rowKey={(t) => t.id} pageSize={pageSize} minWidth={1050} />;
}

export type Tx = (typeof TRANSACTIONS)[number];

export function TxTable({ rows, pageSize = 10 }: { rows: Tx[]; pageSize?: number }) {
  const tone = (t: Tx) => (t.type === "Swap" ? (t.side === "Buy" ? "success" : "danger") : t.type === "Add Liquidity" ? "primary" : "warning");
  const columns: Column<Tx>[] = [
    { key: "time", header: "Time", className: "whitespace-nowrap text-muted", render: (t) => t.time },
    { key: "type", header: "Type", render: (t) => <StatusBadge tone={tone(t)}>{t.type === "Swap" ? t.side : t.type}</StatusBadge> },
    { key: "pair", header: "Pair", className: "font-semibold text-ink", render: (t) => t.pair },
    { key: "usd", header: "Value", align: "right", sort: (t) => t.usd, className: "tabular-nums font-medium text-ink", render: (t) => `$${formatNumber(Math.round(t.usd))}` },
    { key: "amt", header: "Amount", align: "right", className: "tabular-nums", render: (t) => formatNumber(Math.round(t.amountBase)) },
    { key: "dex", header: "DEX", render: (t) => <span className="text-muted">{t.dex}</span> },
    { key: "net", header: "Network", render: (t) => <NetworkChip name={t.network} /> },
    { key: "wallet", header: "Wallet", render: (t) => <span className="font-mono text-xs text-primary">{shortAddress(t.wallet)}</span> },
    { key: "hash", header: "Tx Hash", align: "right", render: (t) => <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">{shortAddress(t.hash, 8, 6)} <ExternalLink className="size-3" /></span> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(t) => t.id} pageSize={pageSize} minWidth={1050} dense />;
}

export type Holder = (typeof HOLDERS)[number];

export function HoldersTable({ rows = HOLDERS, symbol, pageSize = 10 }: { rows?: Holder[]; symbol: string; pageSize?: number }) {
  const columns: Column<Holder>[] = [
    { key: "rank", header: "Rank", className: "w-14 text-muted tabular-nums", render: (h) => h.rank },
    {
      key: "addr",
      header: "Address",
      render: (h) => (
        <span className="flex items-center gap-2.5">
          <span className="font-mono text-[13px] text-primary">{shortAddress(h.address, 8, 6)}</span>
          {h.label !== "Whale" ? <StatusBadge tone="primary">{h.label}</StatusBadge> : <StatusBadge tone="accent">🐋 Whale</StatusBadge>}
        </span>
      ),
    },
    { key: "bal", header: `Balance (${symbol})`, align: "right", sort: (h) => h.balance, className: "tabular-nums text-ink", render: (h) => formatNumber(Math.round(h.balance)) },
    {
      key: "pct",
      header: "% of Supply",
      align: "right",
      sort: (h) => h.pct,
      render: (h) => (
        <span className="ml-auto flex w-36 items-center justify-end gap-2.5">
          <ProgressBar value={h.pct * 6} className="w-16" height={5} />
          <span className="w-12 text-right font-medium tabular-nums text-ink">{h.pct}%</span>
        </span>
      ),
    },
    { key: "txns", header: "Txns", align: "right", sort: (h) => h.txns, className: "tabular-nums", render: (h) => formatNumber(h.txns) },
    { key: "since", header: "Holding since", align: "right", className: "text-muted", render: (h) => h.since },
    { key: "go", header: <span className="sr-only">Explorer</span>, align: "right", render: (h) => <Link href="/wallet-explorer" aria-label="Explore wallet" className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-primary-soft hover:text-primary"><ArrowUpRight className="size-4" /></Link> },
  ];
  return <DataTable columns={columns} rows={rows} rowKey={(h) => h.address} pageSize={pageSize} minWidth={880} />;
}
