import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Coin } from "@/types";
import { Card } from "@/components/ui/card";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { CoinLogo } from "./coin-logo";
import { PriceChangeIndicator } from "./price-change-indicator";
import { formatPrice } from "@/lib/utils";

export function AssetCard({ coin }: { coin: Coin }) {
  return (
    <Link href={`/coins/${coin.id}`} className="group block">
      <Card className="p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-pop">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <CoinLogo symbol={coin.symbol} color={coin.color} size={32} />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-ink">{coin.name}</div>
              <div className="text-[11px] text-muted">{coin.symbol}/USDT</div>
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-primary" aria-hidden />
        </div>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <div className="text-[11px] text-muted">Price</div>
            <div className="text-lg font-semibold tabular-nums tracking-tight text-ink">{formatPrice(coin.price)}</div>
          </div>
          <SparklinePlaceholder data={coin.spark} positive={coin.c24h >= 0} width={64} height={30} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted">
          <span>24h Change</span>
          <PriceChangeIndicator value={coin.c24h} />
        </div>
      </Card>
    </Link>
  );
}
