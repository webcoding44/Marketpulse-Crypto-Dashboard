"use client";

import { useState } from "react";
import { BarChart3, CandlestickChart, Crosshair, LineChart, Maximize2, Ruler, Settings2, Pencil } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ChartType = "candles" | "line" | "area";

interface Props {
  type?: ChartType;
  onTypeChange?: (t: ChartType) => void;
  showTools?: boolean;
  className?: string;
}

const btn = "inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-soft hover:text-ink [&_svg]:size-4";

/** Chart toolbar shell. All buttons are UI placeholders until a charting widget is wired in. */
export function ChartToolbar({ type, onTypeChange, showTools = false, className }: Props) {
  const [internal, setInternal] = useState<ChartType>("candles");
  const active = type ?? internal;
  const set = (t: ChartType) => {
    setInternal(t);
    onTypeChange?.(t);
  };
  const types: { id: ChartType; icon: typeof LineChart; label: string }[] = [
    { id: "candles", icon: CandlestickChart, label: "Candlesticks" },
    { id: "line", icon: LineChart, label: "Line" },
    { id: "area", icon: BarChart3, label: "Area" },
  ];
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5 rounded-xl border border-line bg-soft p-0.5">
        {types.map((t) => (
          <Tooltip key={t.id} content={t.label} side="bottom">
            <button type="button" aria-label={t.label} aria-pressed={active === t.id} onClick={() => set(t.id)} className={cn(btn, active === t.id && "bg-card text-primary shadow-sm hover:text-primary")}>
              <t.icon />
            </button>
          </Tooltip>
        ))}
      </div>
      {showTools && (
        <div className="ml-1 hidden items-center sm:flex">
          {[
            { i: Crosshair, l: "Crosshair" },
            { i: Pencil, l: "Draw" },
            { i: Ruler, l: "Measure" },
          ].map((t) => (
            <Tooltip key={t.l} content={t.l} side="bottom">
              <button type="button" aria-label={t.l} className={btn}>
                <t.i />
              </button>
            </Tooltip>
          ))}
        </div>
      )}
      <Tooltip content="Chart settings" side="bottom">
        <button type="button" aria-label="Chart settings" className={btn}>
          <Settings2 />
        </button>
      </Tooltip>
      <Tooltip content="Fullscreen" side="bottom">
        <button type="button" aria-label="Fullscreen" className={btn}>
          <Maximize2 />
        </button>
      </Tooltip>
    </div>
  );
}
