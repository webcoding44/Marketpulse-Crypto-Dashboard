import Link from "next/link";
import type { ReactNode } from "react";
import { Anchor, Landmark, Rocket, Sparkles, TrendingUp, Zap, Star, Activity, Tag } from "lucide-react";
import type { Coin, Tone } from "@/types";
import { ACTIVITY, MARKET_CATEGORIES } from "@/lib/mock-data/coins";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoinLogo } from "@/components/shared/coin-logo";
import { PriceChangeIndicator } from "@/components/shared/price-change-indicator";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { cn, formatPrice, usdCompact } from "@/lib/utils";

export function MoversCard({ title, subtitle, icon, coins, rank }: { title: string; subtitle: string; icon: ReactNode; coins: Coin[]; rank?: boolean }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title={title} subtitle={subtitle} icon={icon} action={<Button size="xs" variant="ghost" href="/markets/coins">See all</Button>} />
      <ul className="flex-1 space-y-0.5 p-3 pt-4">
        {coins.map((c, i) => (
          <li key={c.id}>
            <Link href={`/coins/${c.id}`} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-soft">
              {rank && <span className="w-4 text-center text-xs font-semibold text-muted tabular-nums">{i + 1}</span>}
              <CoinLogo symbol={c.symbol} color={c.color} size={32} />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[13px] font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-muted">{c.symbol}</span>
              </span>
              <span className="text-right leading-tight">
                <span className="block text-[13px] font-semibold tabular-nums text-ink">{formatPrice(c.price)}</span>
                <PriceChangeIndicator value={c.c24h} variant="text" className="!text-xs" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const ICONS: Record<string, typeof Anchor> = { whale: Anchor, listing: Rocket, surge: TrendingUp, liquidation: Zap, etf: Landmark, upgrade: Sparkles };
const TONE_CLS: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-soft text-muted",
};

export function ActivityFeed({ className }: { className?: string }) {
  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader title="Recent Market Activity" subtitle="Whales, listings & signals" icon={<Activity />} />
      <ul className="flex-1 p-5 pt-4">
        {ACTIVITY.map((a, i) => {
          const I = ICONS[a.type] ?? Zap;
          return (
            <li key={a.title} className="relative flex gap-3 pb-4 last:pb-0">
              {i < ACTIVITY.length - 1 && <span className="absolute left-[15px] top-9 h-[calc(100%-28px)] w-px bg-line" aria-hidden />}
              <span className={cn("z-[1] flex size-8 shrink-0 items-center justify-center rounded-full", TONE_CLS[a.tone])}>
                <I className="size-4" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-[13px] font-semibold text-ink">{a.title}</div>
                <div className="mt-0.5 truncate text-xs text-muted">{a.meta}</div>
              </div>
              <span className="shrink-0 text-xs text-muted">{a.time}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function PopularCategories() {
  return (
    <Card className="h-full">
      <CardHeader title="Popular Market Categories" subtitle="Sector momentum, 24h" icon={<Tag />} action={<Button size="xs" variant="ghost" href="/markets/categories">All categories</Button>} />
      <div className="grid grid-cols-1 gap-2.5 p-5 pt-4 sm:grid-cols-2">
        {MARKET_CATEGORIES.slice(0, 6).map((c) => (
          <Link key={c.name} href="/markets/categories" className="group flex items-center justify-between gap-3 rounded-xl border border-line p-3.5 transition-colors hover:border-primary/30 hover:bg-primary-soft/40">
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[13px] font-semibold text-ink">{c.name}</div>
              <div className="mt-1 text-xs text-muted">{usdCompact(c.marketCap)} · {c.coins} coins</div>
            </div>
            <PriceChangeIndicator value={c.change} />
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function WatchlistPreview({ coins }: { coins: Coin[] }) {
  return (
    <Card className="h-full">
      <CardHeader title="Watchlist" subtitle={`${coins.length} assets tracked`} icon={<Star />} action={<Button size="xs" variant="ghost" href="/portfolio/watchlist">Manage</Button>} />
      <ul className="space-y-0.5 p-3 pt-4">
        {coins.map((c) => (
          <li key={c.id}>
            <Link href={`/coins/${c.id}`} className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-soft">
              <CoinLogo symbol={c.symbol} color={c.color} size={30} />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[13px] font-semibold text-ink">{c.symbol}</span>
                <span className="text-xs text-muted">{c.name}</span>
              </span>
              <SparklinePlaceholder data={c.spark} positive={c.c7d >= 0} width={64} height={26} fill={false} />
              <span className="w-24 text-right leading-tight">
                <span className="block text-[13px] font-semibold tabular-nums text-ink">{formatPrice(c.price)}</span>
                <PriceChangeIndicator value={c.c24h} variant="text" className="!text-xs" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
