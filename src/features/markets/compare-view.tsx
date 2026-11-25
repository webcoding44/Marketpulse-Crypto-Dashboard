"use client";

import { useState } from "react";
import { GitCompare, Plus, X } from "lucide-react";
import { COINS, getCoin } from "@/lib/mock-data/coins";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { ChartContainer } from "@/components/charts/chart-container";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { cn, compact, formatPrice, usdCompact } from "@/lib/utils";

const PALETTE = ["#315CF5", "#F7931A", "#16A879", "#8B5CF6"];

export function CompareView() {
  const [ids, setIds] = useState(["bitcoin", "ethereum", "solana"]);
  const picked = ids.map((i) => getCoin(i)!).filter(Boolean);

  const rows: { label: string; render: (c: (typeof COINS)[number]) => React.ReactNode }[] = [
    { label: "Price", render: (c) => <b className="text-ink">{formatPrice(c.price)}</b> },
    { label: "24h Change", render: (c) => <PriceChangeIndicator value={c.c24h} /> },
    { label: "7d Change", render: (c) => <PriceChangeIndicator value={c.c7d} /> },
    { label: "Market Cap", render: (c) => usdCompact(c.marketCap) },
    { label: "Fully Diluted Valuation", render: (c) => usdCompact(c.fdv) },
    { label: "24h Volume", render: (c) => usdCompact(c.volume) },
    { label: "Volume / Market Cap", render: (c) => `${((c.volume / c.marketCap) * 100).toFixed(2)}%` },
    { label: "Circulating Supply", render: (c) => `${compact(c.supply, 1)} ${c.symbol}` },
    { label: "Max Supply", render: (c) => (c.maxSupply ? `${compact(c.maxSupply, 1)}` : "∞") },
    { label: "All-Time High", render: (c) => formatPrice(c.ath) },
    { label: "Category", render: (c) => c.categories[0] },
    { label: "7-Day Trend", render: (c) => <SparklinePlaceholder data={c.spark} positive={c.c7d >= 0} width={110} height={34} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Coin Comparison" description="Compare up to four assets side-by-side across price, valuation, supply and momentum." actions={<Button icon={<GitCompare className="size-4" />}>Share comparison</Button>} />

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          {picked.map((c, i) => (
            <span key={c.id} className="flex items-center gap-2.5 rounded-xl border border-line bg-soft py-1.5 pl-2 pr-1.5">
              <span className="size-2 rounded-full" style={{ background: PALETTE[i] }} />
              <CoinLogo symbol={c.symbol} color={c.color} size={24} />
              <span className="text-[13px] font-semibold text-ink">{c.name}</span>
              <button type="button" aria-label={`Remove ${c.name}`} onClick={() => setIds(ids.filter((x) => x !== c.id))} className="rounded-md p-1 text-muted hover:bg-card hover:text-ink">
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          {picked.length < 4 && (
            <Dropdown align="left" width="w-60" triggerClassName="inline-flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-line px-3.5 text-[13px] font-medium text-primary hover:bg-primary-soft" trigger={<><Plus className="size-4" /> Add asset</>}>
              <div className="max-h-64 overflow-y-auto">
                {COINS.filter((c) => !ids.includes(c.id)).slice(0, 20).map((c) => (
                  <DropdownItem key={c.id} icon={<CoinLogo symbol={c.symbol} color={c.color} size={20} />} onClick={() => setIds([...ids, c.id])}>
                    {c.name} <span className="text-muted">{c.symbol}</span>
                  </DropdownItem>
                ))}
              </div>
            </Dropdown>
          )}
        </div>
      </Card>

      <ChartContainer title="Relative Performance" subtitle="Rebased to 100 · static preview" hideToolbar defaultTimeframe="1M">
        <ChartPlaceholder variant="line" height={300} seed={ids.join("")} trend={22} yLabels={["+40%", "+20%", "0%", "−20%", "−40%"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} badge="Chart area" />
      </ChartContainer>

      <Card className="overflow-hidden">
        <CardHeader title="Side-by-side Metrics" subtitle={`${picked.length} assets selected`} icon={<GitCompare />} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="bg-soft/70">
                <th className="border-y border-line px-5 py-3 text-left text-xs font-medium text-muted">Metric</th>
                {picked.map((c, i) => (
                  <th key={c.id} className="border-y border-line px-4 py-3 text-left">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: PALETTE[i] }} />
                      <span className="font-semibold text-ink">{c.symbol}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line/70 last:border-0 hover:bg-primary-soft/40">
                  <td className="px-5 py-3.5 text-muted">{r.label}</td>
                  {picked.map((c) => (
                    <td key={c.id} className={cn("px-4 py-3.5 tabular-nums text-ink")}>{r.render(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
