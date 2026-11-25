import { Activity, BarChart3, Bitcoin, Coins, Crown, Download, Flame, Globe2, PieChart, SlidersHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { COINS, DISTRIBUTION, GLOBAL_STATS as G } from "@/lib/mock-data/coins";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { AssetCard } from "@/components/shared/asset-card";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { PortfolioSummary } from "@/features/portfolio/portfolio-summary";
import { CryptoTable } from "@/features/markets/crypto-table";
import { ConverterCard } from "./converter-card";
import { PerformanceHeatmap } from "./performance-heatmap";
import { ActivityFeed, MoversCard, PopularCategories, WatchlistPreview } from "./dashboard-widgets";
import { formatNumber, usdCompact } from "@/lib/utils";

const get = (id: string) => COINS.find((c) => c.id === id)!;

export function DashboardView() {
  const btc = get("bitcoin");
  const nonStable = COINS.filter((c) => !c.stable);
  const gainers = [...nonStable].sort((a, b) => b.c24h - a.c24h).slice(0, 5);
  const losers = [...nonStable].sort((a, b) => a.c24h - b.c24h).slice(0, 5);
  const trending = [...nonStable].sort((a, b) => b.volume / b.marketCap - a.volume / a.marketCap).slice(0, 5);
  const watch = ["bitcoin", "ethereum", "solana", "chainlink", "injective"].map(get);
  const featured = ["bitcoin", "ethereum", "solana", "bnb"].map(get);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Alex"
        description="The crypto market is up 2.14% over the last 24 hours, led by Layer 1 and AI tokens. Bitcoin dominance is holding above 53%."
        badge={<StatusBadge tone="success" dot>Fear & Greed · {G.fearGreed} Greed</StatusBadge>}
        actions={
          <>
            <Button icon={<SlidersHorizontal className="size-4" />}>Customize</Button>
            <Button icon={<Download className="size-4" />} className="max-sm:hidden">Export report</Button>
            <Button variant="primary" href="/portfolio" icon={<PieChart className="size-4" />}>My portfolio</Button>
          </>
        }
      />

      {/* Market statistics */}
      <section aria-label="Market statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Total Market Cap" value={usdCompact(G.marketCap)} change={G.marketCapChange} icon={<Globe2 />} sparkSeed="mc" />
        <MetricCard label="24h Trading Volume" value={usdCompact(G.volume)} change={G.volumeChange} icon={<BarChart3 />} sparkSeed="vol-down" />
        <MetricCard label="BTC Dominance" value={`${G.btcDominance}%`} change={G.btcDominanceChange} icon={<Bitcoin />} sparkSeed="btcd" />
        <MetricCard label="ETH Dominance" value={`${G.ethDominance}%`} change={G.ethDominanceChange} icon={<Coins />} sparkSeed="ethd" />
        <MetricCard label="Cryptocurrencies" value={formatNumber(G.assets)} change={G.assetsChange} icon={<Activity />} hint="tracked assets" className="sm:col-span-2 lg:col-span-1" />
      </section>

      {/* Featured assets */}
      <section aria-label="Featured assets" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <PortfolioSummary className="sm:col-span-2 xl:col-span-1" />
        {featured.map((c) => (
          <AssetCard key={c.id} coin={c} />
        ))}
      </section>

      {/* Main analytics */}
      <section aria-label="Bitcoin analysis" className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer
          className="xl:col-span-2"
          title="Bitcoin (BTC)"
          subtitle="BTC/USD · Binance"
          icon={<CoinLogo symbol="BTC" color={btc.color} size={36} rounded="xl" />}
          timeframes={["1D", "7D", "1M", "3M", "1Y"]}
          defaultTimeframe="1Y"
          showTools
          headline={
            <div>
              <div className="text-[30px] font-semibold leading-none tracking-tight tabular-nums text-ink">$62,840.50</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                <PriceChangeIndicator value={3.12} variant="text" /> vs last 24 hours
              </div>
            </div>
          }
          stats={
            <>
              <span>High (24h): <b className="text-success">$63,420.00</b></span>
              <span>Low (24h): <b className="text-danger">$60,950.28</b></span>
              <span>Volume (24h): <b className="text-warning">$28.4B</b></span>
            </>
          }
        >
          <ChartPlaceholder variant="candles" height={340} seed="btc-year" trend={26} yLabels={["$70K", "$60K", "$50K", "$40K", "$30K"]} badge="TradingView mount point" />
        </ChartContainer>
        <ConverterCard />
      </section>

      {/* Global market overview + distribution */}
      <section aria-label="Global market" className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer
          className="xl:col-span-2"
          title="Global Market Overview"
          subtitle="Total crypto market capitalization"
          icon={<span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary"><Globe2 className="size-[18px]" /></span>}
          timeframes={["24H", "7D", "1M", "1Y"]}
          defaultTimeframe="1M"
          hideToolbar
          headline={
            <div className="flex items-center gap-3">
              <span className="text-[26px] font-semibold tracking-tight tabular-nums text-ink">{usdCompact(G.marketCap)}</span>
              <PriceChangeIndicator value={G.marketCapChange} />
            </div>
          }
        >
          <ChartPlaceholder variant="area" height={250} seed="global-mcap" trend={16} yLabels={["$2.4T", "$2.2T", "$2.0T", "$1.8T", "$1.6T"]} xLabels={["Wk 1", "Wk 2", "Wk 3", "Wk 4"]} />
        </ChartContainer>
        <Card>
          <CardHeader title="Market Distribution" subtitle="Share of total market cap" icon={<PieChart />} />
          <div className="flex flex-col items-center gap-6 p-5 pt-6 sm:flex-row xl:flex-col 2xl:flex-row">
            <DonutChart segments={DISTRIBUTION} size={156} thickness={16}>
              <span className="text-[11px] text-muted">Total</span>
              <span className="text-lg font-semibold text-ink">{usdCompact(G.marketCap)}</span>
            </DonutChart>
            <Legend segments={DISTRIBUTION} />
          </div>
        </Card>
      </section>

      {/* Movers */}
      <section aria-label="Market movers" className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <MoversCard title="Top Gainers" subtitle="Best 24h performance" icon={<TrendingUp />} coins={gainers} />
        <MoversCard title="Top Losers" subtitle="Weakest 24h performance" icon={<TrendingDown />} coins={losers} />
        <MoversCard title="Trending" subtitle="Highest volume momentum" icon={<Flame />} coins={trending} rank />
      </section>

      {/* Performance heatmap + activity */}
      <section aria-label="Performance" className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PerformanceHeatmap />
        </div>
        <ActivityFeed />
      </section>

      {/* Market table */}
      <CryptoTable coins={COINS} title="Crypto Market" subtitle="Top assets by market capitalization" compactMode pageSize={8} showCategories={false} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PopularCategories />
        <WatchlistPreview coins={watch} />
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary-soft to-accent-soft p-5">
        <div className="flex items-center gap-3">
          <Crown className="size-8 text-primary" />
          <div>
            <div className="text-sm font-semibold text-ink">Unlock institutional-grade analytics</div>
            <div className="text-[13px] text-muted">On-chain flows, derivatives positioning and wallet intelligence in one place.</div>
          </div>
        </div>
        <Button variant="primary" href="/defi">Explore DeFi analytics</Button>
      </Card>
    </div>
  );
}
