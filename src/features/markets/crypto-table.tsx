"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Download, SlidersHorizontal, Star } from "lucide-react";
import type { Coin } from "@/types";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { SelectDropdown } from "@/components/ui/dropdown";
import { SearchInput } from "@/components/shared/search-input";
import { TimeframeSelector } from "@/components/shared/timeframe-selector";
import { FilterBar } from "@/components/shared/filter-bar";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { StatusBadge } from "@/components/ui/status-badge";
import { COIN_CATEGORIES } from "@/lib/mock-data/coins";
import { cn, compact, formatPrice, usdCompact } from "@/lib/utils";

const PERFORMANCE = ["All assets", "Gainers", "Losers", "Big movers (±5%)", "Stable (±1%)"];

interface Props {
  coins: Coin[];
  pageSize?: number;
  title?: string;
  subtitle?: string;
  /** Dashboard embed: hides supply column and category pills */
  compactMode?: boolean;
  initialSort?: { key: string; dir: "asc" | "desc" };
  showListed?: boolean;
  showCategories?: boolean;
}

export function CryptoTable({ coins, pageSize = 10, title, subtitle, compactMode, initialSort = { key: "rank", dir: "asc" }, showListed, showCategories = true }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [perf, setPerf] = useState(PERFORMANCE[0]);
  const [tf, setTf] = useState("24H");
  const [watch, setWatch] = useState<Set<string>>(new Set(["bitcoin", "ethereum", "solana"]));

  const change = (c: Coin) => (tf === "1H" ? c.c1h : tf === "7D" ? c.c7d : c.c24h);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return coins.filter((c) => {
      if (needle && !(c.name.toLowerCase().includes(needle) || c.symbol.toLowerCase().includes(needle))) return false;
      if (cat !== "All" && !c.categories.includes(cat)) return false;
      const v = change(c);
      if (perf === "Gainers") return v > 0;
      if (perf === "Losers") return v < 0;
      if (perf === "Big movers (±5%)") return Math.abs(v) >= 5;
      if (perf === "Stable (±1%)") return Math.abs(v) <= 1;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins, q, cat, perf, tf]);

  const toggleWatch = (id: string) =>
    setWatch((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const columns: Column<Coin>[] = [
    {
      key: "watch",
      header: <span className="sr-only">Watchlist</span>,
      className: "w-10 !pr-0",
      render: (c) => (
        <button type="button" onClick={() => toggleWatch(c.id)} aria-pressed={watch.has(c.id)} aria-label={`${watch.has(c.id) ? "Remove" : "Add"} ${c.name} ${watch.has(c.id) ? "from" : "to"} watchlist`} className="rounded-md p-1 text-muted/60 transition-colors hover:text-warning">
          <Star className={cn("size-4", watch.has(c.id) && "fill-warning text-warning")} />
        </button>
      ),
    },
    { key: "rank", header: "#", sort: (c) => c.rank, className: "w-12 text-muted tabular-nums", render: (c) => c.rank },
    {
      key: "asset",
      header: "Asset",
      sort: (c) => c.name,
      sticky: true,
      render: (c) => (
        <Link href={`/coins/${c.id}`} className="flex items-center gap-3">
          <CoinLogo symbol={c.symbol} color={c.color} size={34} />
          <span className="leading-tight">
            <span className="block font-semibold text-ink">{c.name}</span>
            <span className="block text-xs text-muted">{c.symbol}</span>
          </span>
          {c.isNew && showListed && <StatusBadge tone="success">New</StatusBadge>}
        </Link>
      ),
    },
    { key: "price", header: "Price", align: "right", sort: (c) => c.price, className: "font-semibold tabular-nums text-ink", render: (c) => formatPrice(c.price) },
    { key: "c1h", header: "1h", align: "right", sort: (c) => c.c1h, render: (c) => <PriceChangeIndicator value={c.c1h} /> },
    { key: "c24h", header: "24h", align: "right", sort: (c) => c.c24h, render: (c) => <PriceChangeIndicator value={c.c24h} /> },
    { key: "c7d", header: "7d", align: "right", sort: (c) => c.c7d, render: (c) => <PriceChangeIndicator value={c.c7d} /> },
    { key: "volume", header: "24h Volume", align: "right", sort: (c) => c.volume, className: "tabular-nums text-ink", render: (c) => usdCompact(c.volume) },
    { key: "mcap", header: "Market Cap", align: "right", sort: (c) => c.marketCap, className: "tabular-nums text-ink", render: (c) => usdCompact(c.marketCap) },
    ...(compactMode
      ? []
      : [
          showListed
            ? ({ key: "listed", header: "Listed", align: "right", sort: (c: Coin) => c.rank, className: "text-muted", render: (c: Coin) => c.listed ?? "—" } as Column<Coin>)
            : ({
                key: "supply",
                header: "Circulating Supply",
                align: "right",
                sort: (c: Coin) => c.supply,
                className: "tabular-nums",
                render: (c: Coin) => (
                  <span className="inline-flex flex-col items-end gap-1">
                    <span className="text-ink">{compact(c.supply, 1)} {c.symbol}</span>
                    {c.maxSupply ? (
                      <span className="h-1 w-20 overflow-hidden rounded-full bg-soft">
                        <span className="block h-full rounded-full bg-primary/60" style={{ width: `${Math.min((c.supply / c.maxSupply) * 100, 100)}%` }} />
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">No max supply</span>
                    )}
                  </span>
                ),
              } as Column<Coin>),
        ]),
    {
      key: "chart",
      header: "Last 7 Days",
      align: "right",
      render: (c) => (
        <span className="inline-flex justify-end">
          <SparklinePlaceholder data={c.spark} positive={c.c7d >= 0} width={112} height={36} />
        </span>
      ),
    },
    {
      key: "action",
      header: <span className="sr-only">Actions</span>,
      align: "right",
      render: (c) => (
        <Link href={`/coins/${c.id}`} aria-label={`View ${c.name}`} className="inline-flex size-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary">
          <ArrowUpRight className="size-4" />
        </Link>
      ),
    },
  ];

  return (
    <Card className="overflow-hidden">
      {title && (
        <CardHeader
          title={title}
          subtitle={subtitle}
          icon={<SlidersHorizontal />}
          className="pb-4"
          action={
            <>
              <Button size="sm" icon={<Download className="size-3.5" />} className="max-sm:hidden">Export</Button>
              <Button size="sm" variant="soft" href="/markets/coins">View all</Button>
            </>
          }
        />
      )}
      <FilterBar className={title ? "pt-0" : ""} bordered={false}>
        <SearchInput value={q} onChange={setQ} placeholder="Search assets" className="w-full sm:w-64" />
        <TimeframeSelector items={["1H", "24H", "7D"]} value={tf} onChange={setTf} />
        <SelectDropdown options={PERFORMANCE} value={perf} onChange={setPerf} prefix="Performance:" />
        <div className="ml-auto text-[13px] text-muted">{rows.length} assets</div>
      </FilterBar>
      {showCategories && !compactMode && (
        <div className="border-b border-line px-5 pb-3.5">
          <Tabs variant="pill" ariaLabel="Categories" items={COIN_CATEGORIES.map((c) => ({ id: c, label: c }))} value={cat} onChange={setCat} />
        </div>
      )}
      <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} pageSize={pageSize} minWidth={compactMode ? 980 : 1180} initialSort={initialSort} emptyTitle="No assets match your filters" emptyDescription="Clear the search or loosen the performance filter to see more assets." />
    </Card>
  );
}
