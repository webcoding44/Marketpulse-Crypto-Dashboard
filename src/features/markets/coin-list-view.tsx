import Link from "next/link";
import { Bookmark, Flame, Rocket, ShieldCheck, TrendingDown, TrendingUp, Download, Bell } from "lucide-react";
import { COINS } from "@/lib/mock-data/coins";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AssetCard } from "@/components/shared/asset-card";
import { MetricCard } from "@/components/shared/metric-card";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { CryptoTable } from "./crypto-table";
import { formatPrice, usdCompact } from "@/lib/utils";

export type CoinListVariant = "all" | "trending" | "gainers" | "losers" | "new" | "stablecoins";

const META: Record<CoinListVariant, { title: string; description: string }> = {
  all: { title: "All Cryptocurrencies", description: "Explore prices, volume and market capitalization for every tracked digital asset." },
  trending: { title: "Trending Coins", description: "Assets attracting the most attention right now, ranked by volume momentum and search interest." },
  gainers: { title: "Top Gainers", description: "The best performing cryptocurrencies across your selected timeframe." },
  losers: { title: "Top Losers", description: "Assets with the steepest declines — useful for spotting oversold opportunities." },
  new: { title: "New Listings", description: "Freshly listed tokens and the early market data that comes with them." },
  stablecoins: { title: "Stablecoins", description: "Fiat-pegged and synthetic dollar assets, their supply, volume and peg stability." },
};

export function CoinListView({ variant }: { variant: CoinListVariant }) {
  const meta = META[variant];
  const nonStable = COINS.filter((c) => !c.stable);
  let coins = COINS;
  let sort: { key: string; dir: "asc" | "desc" } = { key: "rank", dir: "asc" };

  if (variant === "trending") {
    coins = [...nonStable].sort((a, b) => b.volume / b.marketCap - a.volume / a.marketCap).slice(0, 24);
    sort = { key: "volume", dir: "desc" };
  } else if (variant === "gainers") {
    coins = nonStable.filter((c) => c.c24h > 0);
    sort = { key: "c24h", dir: "desc" };
  } else if (variant === "losers") {
    coins = nonStable.filter((c) => c.c24h < 0);
    sort = { key: "c24h", dir: "asc" };
  } else if (variant === "new") {
    coins = COINS.filter((c) => c.isNew);
  } else if (variant === "stablecoins") {
    coins = COINS.filter((c) => c.stable);
    sort = { key: "mcap", dir: "desc" };
  }

  const top = [...coins].sort((a, b) => (variant === "losers" ? a.c24h - b.c24h : variant === "trending" ? b.volume / b.marketCap - a.volume / a.marketCap : b.c24h - a.c24h)).slice(0, 4);
  const stableTotal = COINS.filter((c) => c.stable).reduce((s, c) => s + c.marketCap, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={meta.title}
        description={meta.description}
        badge={variant === "trending" ? <StatusBadge tone="warning" dot>Live ranking</StatusBadge> : undefined}
        actions={
          <>
            <Button icon={<Bell className="size-4" />}>Create alert</Button>
            <Button variant="primary" icon={<Download className="size-4" />}>Export CSV</Button>
          </>
        }
      />

      {(variant === "trending" || variant === "gainers" || variant === "losers") && (
        <section aria-label="Highlights" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            {variant === "trending" ? <Flame className="size-4 text-warning" /> : variant === "gainers" ? <TrendingUp className="size-4 text-success" /> : <TrendingDown className="size-4 text-danger" />}
            {variant === "trending" ? "Hottest right now" : variant === "gainers" ? "Leaders of the day" : "Biggest drops"}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {top.map((c) => (
              <AssetCard key={c.id} coin={c} />
            ))}
          </div>
        </section>
      )}

      {variant === "new" && (
        <section aria-label="Latest listings" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coins.slice(0, 6).map((c) => (
            <Link key={c.id} href={`/coins/${c.id}`} className="group">
              <Card className="p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-pop">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={c.symbol} color={c.color} size={40} />
                    <div className="leading-tight">
                      <div className="font-semibold text-ink">{c.name}</div>
                      <div className="text-xs text-muted">{c.symbol} · Listed {c.listed}</div>
                    </div>
                  </div>
                  <StatusBadge tone="success" dot>New</StatusBadge>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="text-xl font-semibold tabular-nums text-ink">{formatPrice(c.price)}</div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted"><PriceChangeIndicator value={c.c24h} /> Vol {usdCompact(c.volume)}</div>
                  </div>
                  <SparklinePlaceholder data={c.spark} positive={c.c7d >= 0} width={96} height={40} />
                </div>
              </Card>
            </Link>
          ))}
        </section>
      )}

      {variant === "stablecoins" && (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-2">
            <MetricCard label="Stablecoin Market Cap" value={usdCompact(stableTotal * 1.45)} change={0.32} icon={<ShieldCheck />} sparkSeed="stable-cap" />
            <MetricCard label="24h Volume" value="$62.4B" change={-1.8} icon={<TrendingUp />} sparkSeed="stable-vol" />
            <MetricCard label="USDT Dominance" value="66.7%" change={0.12} hint="of stablecoin supply" icon={<Bookmark />} />
            <MetricCard label="Avg. Peg Deviation" value="0.018%" change={-4.2} hint="vs. $1.00 · 24h" icon={<Rocket />} />
          </div>
          <Card>
            <CardHeader title="Supply Share" subtitle="By issuer" />
            <div className="flex items-center gap-6 p-5">
              <DonutChart
                size={132}
                thickness={14}
                segments={[
                  { label: "USDT", value: 66.7, color: "#26A17B" },
                  { label: "USDC", value: 20.4, color: "#2775CA" },
                  { label: "USDe", value: 2.0, color: "#4B5563" },
                  { label: "DAI", value: 3.2, color: "#F5AC37" },
                  { label: "Others", value: 7.7, color: "#B8C2D8" },
                ]}
              >
                <span className="text-lg font-semibold text-ink">$168B</span>
                <span className="text-[11px] text-muted">Total</span>
              </DonutChart>
              <Legend
                segments={[
                  { label: "USDT", value: 66.7, color: "#26A17B" },
                  { label: "USDC", value: 20.4, color: "#2775CA" },
                  { label: "USDe", value: 2.0, color: "#4B5563" },
                  { label: "DAI", value: 3.2, color: "#F5AC37" },
                  { label: "Others", value: 7.7, color: "#B8C2D8" },
                ]}
              />
            </div>
          </Card>
        </section>
      )}

      <CryptoTable coins={coins} initialSort={sort} showListed={variant === "new"} showCategories={variant === "all" || variant === "trending"} compactMode={false} pageSize={variant === "all" ? 12 : 10} />
    </div>
  );
}
