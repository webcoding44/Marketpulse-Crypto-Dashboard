import { Bell, Bookmark, Share2, ExternalLink, Globe, FileText, Code2 } from "lucide-react";
import { COINS } from "@/lib/mock-data/coins";
import type { Coin } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { KeyStats, ProgressBar } from "@/components/shared/key-stats";
import { AssetCard } from "@/components/shared/asset-card";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { MarketPairsTable } from "./market-pairs-table";
import { compact, formatPrice, usdCompact } from "@/lib/utils";

export function CoinDetailView({ coin }: { coin: Coin }) {
  const high = coin.price * 1.018;
  const low = coin.price * 0.972;
  const rangePct = ((coin.price - low) / (high - low)) * 100;
  const related = COINS.filter((c) => c.id !== coin.id && c.categories.some((x) => coin.categories.includes(x))).slice(0, 4);
  const athDrop = ((coin.price - coin.ath) / coin.ath) * 100;
  const atlGain = ((coin.price - coin.atl) / coin.atl) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        leading={<CoinLogo symbol={coin.symbol} color={coin.color} size={52} />}
        title={
          <span className="flex items-center gap-2.5">
            {coin.name} <span className="text-base font-medium text-muted">{coin.symbol}</span>
          </span>
        }
        description={undefined}
        badge={
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusBadge tone="primary">Rank #{coin.rank}</StatusBadge>
            {coin.categories.map((c) => (
              <StatusBadge key={c}>{c}</StatusBadge>
            ))}
          </span>
        }
        actions={
          <>
            <Button icon={<Share2 className="size-4" />}>Share</Button>
            <Button icon={<Bell className="size-4" />}>Set alert</Button>
            <Button variant="primary" icon={<Bookmark className="size-4" />}>Add to watchlist</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ChartContainer
            title={`${coin.name} Price Chart`}
            subtitle={`${coin.symbol}/USD · Aggregated`}
            showTools
            headline={
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[32px] font-semibold leading-none tracking-tight tabular-nums text-ink">{formatPrice(coin.price)}</span>
                  <PriceChangeIndicator value={coin.c24h} className="!text-sm" />
                </div>
                <div className="mt-2 text-xs text-muted">vs. last 24 hours · {formatPrice(coin.price * (1 - coin.c24h / 100))} yesterday</div>
              </div>
            }
            stats={
              <>
                <span>High (24h): <b className="text-success">{formatPrice(high)}</b></span>
                <span>Low (24h): <b className="text-danger">{formatPrice(low)}</b></span>
                <span>Volume: <b className="text-warning">{usdCompact(coin.volume)}</b></span>
              </>
            }
          >
            <ChartPlaceholder variant="candles" height={360} seed={coin.id} trend={coin.c7d * 2} yLabels={[formatPrice(coin.price * 1.3), formatPrice(coin.price * 1.15), formatPrice(coin.price), formatPrice(coin.price * 0.85), formatPrice(coin.price * 0.7)]} badge="TradingView mount point" />
          </ChartContainer>

          <Card>
            <CardHeader title="Price Performance" subtitle="Change over time" />
            <div className="grid grid-cols-2 gap-px p-5 pt-4 sm:grid-cols-5">
              {[
                ["1h", coin.c1h],
                ["24h", coin.c24h],
                ["7d", coin.c7d],
                ["30d", coin.c7d * 2.4 - 1.2],
                ["1y", coin.c7d * 9.1 + 12],
              ].map(([l, v]) => (
                <div key={l as string} className="rounded-xl p-3 text-center sm:border-r sm:border-line sm:last:border-0">
                  <div className="text-xs text-muted">{l}</div>
                  <div className="mt-1.5 flex justify-center"><PriceChangeIndicator value={v as number} /></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Market Statistics" subtitle="Live valuation & supply" />
            <div className="px-5 pb-3 pt-2">
              <KeyStats
                items={[
                  { label: "Market Cap", value: usdCompact(coin.marketCap), sub: <PriceChangeIndicator value={coin.c24h} variant="text" /> },
                  { label: "Fully Diluted Valuation", value: usdCompact(coin.fdv) },
                  { label: "24h Trading Volume", value: usdCompact(coin.volume) },
                  { label: "Volume / Market Cap", value: `${((coin.volume / coin.marketCap) * 100).toFixed(2)}%` },
                  { label: "Circulating Supply", value: `${compact(coin.supply, 2)} ${coin.symbol}` },
                  { label: "Total Supply", value: `${compact(coin.maxSupply ?? coin.supply * 1.02, 2)} ${coin.symbol}` },
                  { label: "Max Supply", value: coin.maxSupply ? `${compact(coin.maxSupply, 2)} ${coin.symbol}` : "∞ Unlimited" },
                ]}
              />
              {coin.maxSupply && (
                <div className="mb-3 mt-1">
                  <div className="mb-1.5 flex justify-between text-[11px] text-muted">
                    <span>Circulating</span>
                    <span>{((coin.supply / coin.maxSupply) * 100).toFixed(1)}% of max</span>
                  </div>
                  <ProgressBar value={(coin.supply / coin.maxSupply) * 100} />
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="All-Time Range" />
            <div className="space-y-5 p-5">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted">All-Time High · {coin.athDate}</div>
                    <div className="mt-1 text-base font-semibold tabular-nums text-ink">{formatPrice(coin.ath)}</div>
                  </div>
                  <PriceChangeIndicator value={athDrop} />
                </div>
                <ProgressBar className="mt-3" value={100 + athDrop} color="var(--danger)" />
              </div>
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted">All-Time Low · {coin.atlDate}</div>
                    <div className="mt-1 text-base font-semibold tabular-nums text-ink">{formatPrice(coin.atl)}</div>
                  </div>
                  <PriceChangeIndicator value={atlGain} />
                </div>
                <ProgressBar className="mt-3" value={Math.min(atlGain / 10, 100)} color="var(--success)" />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-muted">
                  <span>24h Low {formatPrice(low)}</span>
                  <span>High {formatPrice(high)}</span>
                </div>
                <ProgressBar value={rangePct} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title={`About ${coin.name}`} icon={<FileText />} />
          <div className="space-y-4 p-5 text-sm leading-relaxed text-muted">
            <p>{coin.description}</p>
            <p>Developers and institutions use {coin.name} for settlement, programmable applications and treasury exposure. Network activity, validator participation and ecosystem funding continue to grow quarter over quarter in this mock dataset.</p>
          </div>
        </Card>
        <Card>
          <CardHeader title="Resources" />
          <div className="space-y-2 p-5">
            {[
              [Globe, "Official website", `${coin.id}.org`],
              [FileText, "Whitepaper", "PDF · 18 pages"],
              [Code2, "Source code", `github.com/${coin.id}`],
            ].map(([Icon, l, s]) => {
              const I = Icon as typeof Globe;
              return (
                <a key={l as string} href="#" className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-soft">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><I className="size-4" /></span>
                  <span className="flex-1 leading-tight"><span className="block text-[13px] font-medium text-ink">{l as string}</span><span className="text-xs text-muted">{s as string}</span></span>
                  <ExternalLink className="size-3.5 text-muted" />
                </a>
              );
            })}
          </div>
        </Card>
      </div>

      <MarketPairsTable base={coin.symbol} price={coin.price} volume={coin.volume} />

      <section aria-label="Related cryptocurrencies" className="space-y-3">
        <h2 className="text-[15px] font-semibold text-ink">Related Cryptocurrencies</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((c) => (
            <AssetCard key={c.id} coin={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
