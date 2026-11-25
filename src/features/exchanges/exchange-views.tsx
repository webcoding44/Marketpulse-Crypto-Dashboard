import Link from "next/link";
import { ArrowLeftRight, BadgeCheck, Building2, Download, ExternalLink, Globe, Landmark, ShieldCheck, Trophy, Users } from "lucide-react";
import { EXCHANGES } from "@/lib/mock-data/exchanges";
import { COINS } from "@/lib/mock-data/coins";
import type { Exchange } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { TrustScore } from "@/components/shared/trust-score";
import { KeyStats, Stat } from "@/components/shared/key-stats";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { DonutChart, Legend } from "@/components/charts/donut-chart";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { CoinLogo } from "@/components/shared/coin-logo";
import { ExchangeLogo, ExchangeTable } from "./exchange-table";
import { MarketPairsTable } from "@/features/markets/market-pairs-table";
import { formatNumber, usdCompact } from "@/lib/utils";

export function ExchangesListView({ top }: { top?: boolean }) {
  const list = top ? EXCHANGES.slice(0, 10) : EXCHANGES;
  const totalVol = EXCHANGES.reduce((s, e) => s + e.volume24h, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title={top ? "Top Exchanges" : "All Exchanges"}
        description={top ? "The highest-ranked venues by trust score, liquidity and verified trading volume." : "Browse centralized exchanges ranked by trust score and 24-hour trading volume."}
        actions={<Button icon={<Download className="size-4" />}>Export</Button>}
      />
      {top ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {EXCHANGES.slice(0, 3).map((e, i) => (
            <Link key={e.id} href={`/exchanges/${e.id}`} className="group">
              <Card className="relative overflow-hidden p-5 transition-all group-hover:-translate-y-0.5 group-hover:shadow-pop">
                <div className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-warning-soft text-[13px] font-bold text-warning">#{i + 1}</div>
                <ExchangeLogo name={e.name} color={e.color} size={48} />
                <div className="mt-4 text-lg font-semibold text-ink">{e.name}</div>
                <div className="mt-1"><TrustScore score={e.trust} /></div>
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                  <Stat label="24h Volume" value={usdCompact(e.volume24h)} />
                  <Stat label="Trading pairs" value={formatNumber(e.pairs)} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Tracked Exchanges" value="237" change={0.8} icon={<Building2 />} />
          <MetricCard label="24h Spot Volume" value={usdCompact(totalVol)} change={2.6} icon={<ArrowLeftRight />} sparkSeed="ex-vol" />
          <MetricCard label="Total Reserves" value={usdCompact(EXCHANGES.reduce((s, e) => s + e.reserves, 0))} change={1.1} icon={<Landmark />} />
          <MetricCard label="Avg. Trust Score" value="8.6 / 10" change={0.2} icon={<ShieldCheck />} />
        </div>
      )}
      <ExchangeTable exchanges={list} pageSize={top ? 10 : 8} />
    </div>
  );
}

export function ExchangeDetailView({ exchange: e }: { exchange: Exchange }) {
  const assets = COINS.slice(0, 14);
  return (
    <div className="space-y-6">
      <PageHeader
        leading={<ExchangeLogo name={e.name} color={e.color} size={56} />}
        title={e.name}
        badge={
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusBadge tone="primary">Rank #{e.rank}</StatusBadge>
            <StatusBadge tone="success"><BadgeCheck className="size-3" /> Verified</StatusBadge>
            <StatusBadge>{e.type}</StatusBadge>
          </span>
        }
        description={`${e.country} · Founded ${e.founded} · ${e.visits} monthly visits`}
        actions={
          <>
            <Button href={`/exchanges/${e.id}/pairs`} icon={<ArrowLeftRight className="size-4" />}>Trading pairs</Button>
            <Button variant="primary" iconRight={<ExternalLink className="size-4" />}>Visit exchange</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="24h Trading Volume" value={usdCompact(e.volume24h)} change={e.volumeChange} icon={<ArrowLeftRight />} sparkSeed={e.id} />
        <MetricCard label="Proof of Reserves" value={usdCompact(e.reserves)} change={0.9} icon={<Landmark />} hint="verified · 3d ago" />
        <MetricCard label="Listed Assets" value={formatNumber(e.coins)} icon={<Globe />} hint={`${formatNumber(e.pairs)} trading pairs`} changeLabel="" />
        <Card className="flex flex-col justify-between p-5">
          <span className="text-[13px] font-medium text-muted">Trust Score</span>
          <div>
            <div className="text-[22px] font-semibold text-ink">{e.trust >= 9 ? "Excellent" : e.trust >= 8 ? "Strong" : "Moderate"}</div>
            <div className="mt-2.5"><TrustScore score={e.trust} /></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartContainer className="xl:col-span-2" title="Trading Volume" subtitle="Aggregated spot volume (USD)" headline={<div className="flex items-center gap-3"><span className="text-[28px] font-semibold tabular-nums tracking-tight text-ink">{usdCompact(e.volume24h)}</span><PriceChangeIndicator value={e.volumeChange} /></div>} hideToolbar>
          <ChartPlaceholder variant="bars" height={300} seed={e.id} yLabels={["$20B", "$15B", "$10B", "$5B", "0"]} xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
        </ChartContainer>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Volume by Quote" subtitle="Share of 24h volume" />
            <div className="flex items-center gap-5 p-5">
              <DonutChart size={124} thickness={13} segments={[{ label: "USDT", value: 54, color: "#26A17B" }, { label: "USD", value: 21, color: "#315CF5" }, { label: "BTC", value: 14, color: "#F7931A" }, { label: "Other", value: 11, color: "#B8C2D8" }]} />
              <Legend segments={[{ label: "USDT", value: 54, color: "#26A17B" }, { label: "USD", value: 21, color: "#315CF5" }, { label: "BTC", value: 14, color: "#F7931A" }, { label: "Other", value: 11, color: "#B8C2D8" }]} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Profile" />
            <div className="px-5 pb-3 pt-1">
              <KeyStats items={[{ label: "Country", value: e.country }, { label: "Founded", value: e.founded }, { label: "Monthly visits", value: e.visits }, { label: "Maker / Taker fee", value: "0.10% / 0.10%" }, { label: "KYC required", value: "Yes" }, { label: "Derivatives", value: "Supported" }]} />
            </div>
          </Card>
        </div>
      </div>

      <MarketPairsTable base="BTC" price={62840.5} volume={e.volume24h * 0.2} title={`Top Markets on ${e.name}`} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title={`About ${e.name}`} icon={<Users />} />
          <p className="p-5 text-sm leading-relaxed text-muted">{e.name} is a {e.type === "CEX" ? "centralized" : "decentralized"} cryptocurrency exchange headquartered in {e.country}. It offers spot trading, margin, staking and institutional services across {formatNumber(e.coins)} listed assets. This copy is placeholder content for the design prototype and will be supplied by exchange profile data later.</p>
        </Card>
        <Card>
          <CardHeader title="Top Listed Assets" icon={<Trophy />} />
          <div className="flex flex-wrap gap-2 p-5">
            {assets.map((c) => (
              <Link key={c.id} href={`/coins/${c.id}`} className="flex items-center gap-1.5 rounded-full border border-line bg-soft py-1 pl-1 pr-2.5 text-xs font-medium text-ink hover:border-primary/40">
                <CoinLogo symbol={c.symbol} color={c.color} size={20} /> {c.symbol}
              </Link>
            ))}
          </div>
          <div className="px-5 pb-5"><SparklinePlaceholder seed={e.id + "x"} width="100%" height={48} /></div>
        </Card>
      </div>
    </div>
  );
}

export function ExchangePairsView({ exchange: e }: { exchange: Exchange }) {
  return (
    <div className="space-y-6">
      <PageHeader
        leading={<ExchangeLogo name={e.name} color={e.color} size={48} />}
        title={`${e.name} Trading Pairs`}
        description={`All active spot markets listed on ${e.name} with liquidity depth and spread.`}
        actions={<Button href={`/exchanges/${e.id}`}>Back to profile</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Active Pairs" value={formatNumber(e.pairs)} icon={<ArrowLeftRight />} changeLabel="" hint="across 4 quote assets" />
        <MetricCard label="24h Volume" value={usdCompact(e.volume24h)} change={e.volumeChange} icon={<Landmark />} sparkSeed={e.id} />
        <MetricCard label="Avg. Spread" value="0.042%" change={-3.1} icon={<ShieldCheck />} hint="tighter is better" />
      </div>
      <div className="space-y-6">
        {["BTC", "ETH", "SOL"].map((b) => {
          const c = COINS.find((x) => x.symbol === b)!;
          return <MarketPairsTable key={b} base={b} price={c.price} volume={c.volume} title={`${b} markets`} filters={b === "BTC"} pageSize={5} />;
        })}
      </div>
    </div>
  );
}
