"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Exchange } from "@/types";
import { Card } from "@/components/ui/card";
import { SelectDropdown } from "@/components/ui/dropdown";
import { SearchInput } from "@/components/shared/search-input";
import { FilterBar } from "@/components/shared/filter-bar";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { TrustScore } from "@/components/shared/trust-score";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatNumber, usdCompact } from "@/lib/utils";

export function ExchangeLogo({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return <CoinLogo symbol={name.charAt(0)} color={color} size={size} rounded="xl" />;
}

export function ExchangeTable({ exchanges, pageSize = 10, withFilters = true }: { exchanges: Exchange[]; pageSize?: number; withFilters?: boolean }) {
  const [q, setQ] = useState("");
  const [trust, setTrust] = useState("All scores");
  const rows = useMemo(
    () =>
      exchanges.filter((e) => {
        if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (trust === "9–10") return e.trust >= 9;
        if (trust === "7–8") return e.trust >= 7 && e.trust <= 8;
        return true;
      }),
    [exchanges, q, trust],
  );

  const columns: Column<Exchange>[] = [
    { key: "rank", header: "#", sort: (e) => e.rank, className: "w-12 text-muted tabular-nums", render: (e) => e.rank },
    {
      key: "name",
      header: "Exchange",
      sort: (e) => e.name,
      sticky: true,
      render: (e) => (
        <Link href={`/exchanges/${e.id}`} className="flex items-center gap-3">
          <ExchangeLogo name={e.name} color={e.color} />
          <span className="leading-tight">
            <span className="block font-semibold text-ink">{e.name}</span>
            <span className="block text-xs text-muted">{e.country}</span>
          </span>
        </Link>
      ),
    },
    { key: "trust", header: "Trust Score", sort: (e) => e.trust, render: (e) => <TrustScore score={e.trust} /> },
    { key: "vol", header: "24h Volume", align: "right", sort: (e) => e.volume24h, className: "font-semibold tabular-nums text-ink", render: (e) => usdCompact(e.volume24h) },
    { key: "chg", header: "Volume 24h Δ", align: "right", sort: (e) => e.volumeChange, render: (e) => <PriceChangeIndicator value={e.volumeChange} /> },
    { key: "pairs", header: "Pairs", align: "right", sort: (e) => e.pairs, className: "tabular-nums", render: (e) => formatNumber(e.pairs) },
    { key: "coins", header: "Coins", align: "right", sort: (e) => e.coins, className: "tabular-nums", render: (e) => formatNumber(e.coins) },
    { key: "visits", header: "Monthly Visits", align: "right", className: "tabular-nums", render: (e) => e.visits },
    { key: "type", header: "Type", render: (e) => <StatusBadge tone="primary">{e.type}</StatusBadge> },
    { key: "chart", header: "Volume 7d", align: "right", render: (e) => <SparklinePlaceholder data={e.spark} positive={e.volumeChange >= 0} width={104} height={34} /> },
    {
      key: "go",
      header: <span className="sr-only">Open</span>,
      align: "right",
      render: (e) => (
        <Link href={`/exchanges/${e.id}`} aria-label={`Open ${e.name}`} className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted hover:bg-primary-soft hover:text-primary">
          <ArrowUpRight className="size-4" />
        </Link>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      {withFilters && (
        <FilterBar>
          <SearchInput value={q} onChange={setQ} placeholder="Search exchanges" className="w-full sm:w-64" />
          <SelectDropdown options={["All scores", "9–10", "7–8"]} value={trust} onChange={setTrust} prefix="Trust:" />
          <div className="ml-auto text-[13px] text-muted">{rows.length} exchanges</div>
        </FilterBar>
      )}
      <DataTable columns={columns} rows={rows} rowKey={(e) => e.id} pageSize={pageSize} minWidth={1100} initialSort={{ key: "rank", dir: "asc" }} emptyTitle="No exchanges found" />
    </Card>
  );
}
