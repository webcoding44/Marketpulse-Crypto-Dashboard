"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { COINS } from "@/lib/mock-data/coins";
import { Card, CardHeader } from "@/components/ui/card";
import { TimeframeSelector } from "@/components/shared/timeframe-selector";
import { cn, formatPct } from "@/lib/utils";

const SPANS = [
  "col-span-2 row-span-2 sm:col-span-3",
  "sm:col-span-2 sm:row-span-2",
  "sm:row-span-2",
];

/** Market Performance Overview – tile heatmap, intensity driven by % change. */
export function PerformanceHeatmap() {
  const [tf, setTf] = useState("24H");
  const coins = COINS.filter((c) => !c.stable).slice(0, 15);
  const val = (c: (typeof COINS)[number]) => (tf === "1H" ? c.c1h * 4 : tf === "7D" ? c.c7d : c.c24h);

  return (
    <Card className="h-full">
      <CardHeader title="Market Performance Overview" subtitle="Sized by market cap · colored by change" icon={<LayoutGrid />} action={<TimeframeSelector items={["1H", "24H", "7D"]} value={tf} onChange={setTf} />} />
      <div className="grid auto-rows-[68px] grid-flow-dense grid-cols-3 gap-1.5 p-5 sm:auto-rows-[74px] sm:grid-cols-6">
        {coins.map((c, i) => {
          const v = val(c);
          const strength = Math.min(Math.abs(v) / 8, 1);
          const pct = 14 + strength * 62;
          const bg = `color-mix(in srgb, var(${v >= 0 ? "--success" : "--danger"}) ${pct}%, var(--card))`;
          const strong = pct > 45;
          return (
            <Link
              key={c.id}
              href={`/coins/${c.id}`}
              style={{ background: bg }}
              className={cn("flex flex-col justify-between rounded-xl p-2.5 transition-transform hover:scale-[0.985]", SPANS[i], strong ? "text-white" : "text-ink")}
            >
              <span className={cn("font-semibold", i < 3 ? "text-base" : "text-[13px]")}>{c.symbol}</span>
              <span className={cn("text-xs font-medium tabular-nums", strong ? "text-white/90" : v >= 0 ? "text-success" : "text-danger")}>{formatPct(v)}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
