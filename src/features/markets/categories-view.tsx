"use client";

import { useMemo, useState } from "react";
import { Layers, Search } from "lucide-react";
import { MARKET_CATEGORIES } from "@/lib/mock-data/coins";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { BarChartPlaceholder } from "@/components/charts/bar-chart-placeholder";
import { SelectDropdown } from "@/components/ui/dropdown";
import { CoinLogo } from "@/components/shared/coin-logo";
import { COINS } from "@/lib/mock-data/coins";
import { usdCompact } from "@/lib/utils";

type Cat = (typeof MARKET_CATEGORIES)[number];
const colorOf = (sym: string) => COINS.find((c) => c.symbol === sym)?.color ?? "#8B5CF6";

export function CategoriesView() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("Market cap");
  const list = useMemo(() => {
    const l = MARKET_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
    return [...l].sort((a, b) => (sort === "Market cap" ? b.marketCap - a.marketCap : sort === "24h change" ? b.change - a.change : b.volume - a.volume));
  }, [q, sort]);

  const columns: Column<Cat>[] = [
    { key: "name", header: "Category", sort: (c) => c.name, render: (c) => <span className="font-semibold text-ink">{c.name}</span> },
    {
      key: "top",
      header: "Top Coins",
      render: (c) => (
        <span className="flex -space-x-2">
          {c.top.map((s) => (
            <span key={s} className="rounded-full ring-2 ring-card"><CoinLogo symbol={s} color={colorOf(s)} size={26} /></span>
          ))}
        </span>
      ),
    },
    { key: "change", header: "24h", align: "right", sort: (c) => c.change, render: (c) => <PriceChangeIndicator value={c.change} /> },
    { key: "mcap", header: "Market Cap", align: "right", sort: (c) => c.marketCap, className: "tabular-nums", render: (c) => usdCompact(c.marketCap) },
    { key: "vol", header: "24h Volume", align: "right", sort: (c) => c.volume, className: "tabular-nums", render: (c) => usdCompact(c.volume) },
    { key: "coins", header: "Coins", align: "right", sort: (c) => c.coins, className: "tabular-nums", render: (c) => c.coins },
    { key: "chart", header: "Last 7 Days", align: "right", render: (c) => <SparklinePlaceholder seed={c.name} positive={c.change >= 0} width={104} height={34} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Sector-level market capitalization, momentum and leading assets." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {MARKET_CATEGORIES.slice(0, 5).map((c) => (
          <Card key={c.name} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">{c.name}</span>
              <PriceChangeIndicator value={c.change} />
            </div>
            <div className="mt-3 text-lg font-semibold tabular-nums text-ink">{usdCompact(c.marketCap)}</div>
            <div className="text-xs text-muted">{c.coins} coins</div>
            <SparklinePlaceholder seed={`cat-${c.name}`} positive={c.change >= 0} width="100%" height={36} className="mt-3" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader title="All Categories" subtitle={`${list.length} sectors`} icon={<Layers />} />
          <div className="flex flex-wrap gap-2.5 px-5 py-4">
            <SearchInput value={q} onChange={setQ} placeholder="Search categories" className="w-full sm:w-64" />
            <SelectDropdown options={["Market cap", "24h change", "Volume"]} value={sort} onChange={setSort} prefix="Sort by:" />
          </div>
          <DataTable columns={columns} rows={list} rowKey={(c) => c.name} minWidth={820} emptyTitle="No categories found" />
        </Card>
        <Card>
          <CardHeader title="Market Cap by Sector" subtitle="Top 8 categories" icon={<Search />} />
          <div className="p-5">
            <BarChartPlaceholder data={[...MARKET_CATEGORIES].sort((a, b) => b.marketCap - a.marketCap).slice(0, 8).map((c) => c.marketCap)} labels={["L1", "Stable", "DeFi", "Meme", "L2", "Pay", "AI", "L0"]} height={220} />
          </div>
        </Card>
      </div>
    </div>
  );
}
