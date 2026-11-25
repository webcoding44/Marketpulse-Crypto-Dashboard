"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { buildPairs, type MarketPair } from "@/lib/mock-data/exchanges";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ExchangeLogo } from "@/features/exchanges/exchange-table";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, formatPrice, usdCompact } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";

interface Props {
  base: string;
  price: number;
  volume: number;
  /** Provide to scope to a single exchange and show the full table with filters */
  filters?: boolean;
  title?: string;
  pageSize?: number;
}

export function MarketPairsTable({ base, price, volume, filters, title = "Market Pairs", pageSize = 6 }: Props) {
  const [q, setQ] = useState("");
  const [quote, setQuote] = useState("all");
  const all = useMemo(() => buildPairs(base, price, volume), [base, price, volume]);
  const rows = all.filter((p) => (quote === "all" || p.pair.endsWith(quote)) && p.exchange.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<MarketPair>[] = [
    {
      key: "ex",
      header: "Exchange",
      sticky: true,
      sort: (p) => p.exchange,
      render: (p) => (
        <Link href={`/exchanges/${p.exchangeId}`} className="flex items-center gap-2.5 font-semibold text-ink">
          <ExchangeLogo name={p.exchange} color={p.color} size={28} /> {p.exchange}
        </Link>
      ),
    },
    { key: "pair", header: "Pair", render: (p) => <span className="font-medium text-primary">{p.pair}</span> },
    { key: "price", header: "Price", align: "right", sort: (p) => p.price, className: "tabular-nums font-medium text-ink", render: (p) => formatPrice(p.price) },
    { key: "spread", header: "Spread", align: "right", sort: (p) => p.spread, className: "tabular-nums", render: (p) => `${p.spread.toFixed(2)}%` },
    { key: "d+", header: "+2% Depth", align: "right", className: "tabular-nums", render: (p) => usdCompact(p.depthPlus) },
    { key: "d-", header: "−2% Depth", align: "right", className: "tabular-nums", render: (p) => usdCompact(p.depthMinus) },
    { key: "vol", header: "24h Volume", align: "right", sort: (p) => p.volume, className: "tabular-nums font-medium text-ink", render: (p) => usdCompact(p.volume) },
    { key: "share", header: "Volume %", align: "right", sort: (p) => p.share, className: "tabular-nums", render: (p) => `${p.share.toFixed(2)}%` },
    {
      key: "trust",
      header: "Trust",
      align: "center",
      render: (p) => (
        <Tooltip content={p.trust === "green" ? "High liquidity & trust" : "Moderate trust score"}>
          <span className={cn("block size-2.5 rounded-full", p.trust === "green" ? "bg-success" : "bg-warning")} />
        </Tooltip>
      ),
    },
    { key: "upd", header: "Updated", align: "right", className: "text-muted", render: (p) => p.updated },
    {
      key: "trade",
      header: <span className="sr-only">Trade</span>,
      align: "right",
      render: () => (
        <Button size="xs" variant="soft" iconRight={<ExternalLink className="size-3" />}>
          Trade
        </Button>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader title={title} subtitle={`${rows.length} active markets for ${base}`} icon={<ArrowLeftRight />} className="pb-4" />
      <div className="flex flex-wrap items-center gap-2.5 border-b border-line px-5 pb-4">
        <Tabs variant="pill" ariaLabel="Quote currency" value={quote} onChange={setQuote} items={[{ id: "all", label: "All" }, { id: "USDT", label: "USDT" }, { id: "USD", label: "USD" }, { id: "USDC", label: "USDC" }, { id: "EUR", label: "EUR" }]} />
        {filters && <SearchInput value={q} onChange={setQ} placeholder="Search exchange" className="ml-auto w-full sm:w-56" />}
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} pageSize={pageSize} minWidth={1000} dense />
    </Card>
  );
}
