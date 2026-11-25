"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { TimeframeSelector } from "@/components/shared/timeframe-selector";
import { ChartToolbar } from "./chart-toolbar";
import { cn } from "@/lib/utils";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Asset logo / icon node shown before the title */
  icon?: ReactNode;
  /** Large headline (price, change…) rendered beneath the header */
  headline?: ReactNode;
  /** Right-aligned stats row beside the headline */
  stats?: ReactNode;
  timeframes?: string[];
  defaultTimeframe?: string;
  hideTimeframes?: boolean;
  hideToolbar?: boolean;
  showTools?: boolean;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** The chart surface – ChartPlaceholder today, TradingView widget later. */
  children: ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  icon,
  headline,
  stats,
  timeframes,
  defaultTimeframe,
  hideTimeframes,
  hideToolbar,
  showTools,
  actions,
  footer,
  className,
  children,
}: Props) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          {icon}
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-ink">{title}</h2>
            {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {!hideTimeframes && <TimeframeSelector items={timeframes} defaultValue={defaultTimeframe} />}
          {!hideToolbar && <ChartToolbar showTools={showTools} />}
        </div>
      </div>
      {(headline || stats) && (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-5 pt-4">
          <div>{headline}</div>
          {stats && <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">{stats}</div>}
        </div>
      )}
      <div className="flex-1 px-5 pb-5 pt-5">{children}</div>
      {footer && <div className="border-t border-line px-5 py-3">{footer}</div>}
    </Card>
  );
}
