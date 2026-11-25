import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { PriceChangeIndicator } from "./price-change-indicator";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  hint?: string;
  sparkSeed?: string;
  className?: string;
}

export function MetricCard({ label, value, change, changeLabel = "24h", icon, hint, sparkSeed, className }: Props) {
  return (
    <Card className={cn("flex flex-col justify-between gap-3 p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        {icon && <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary [&_svg]:size-4">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[22px] font-semibold leading-none tracking-tight text-ink tabular-nums">{value}</div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
            {change !== undefined && <PriceChangeIndicator value={change} />}
            {(changeLabel || hint) && <span>{hint ?? changeLabel}</span>}
          </div>
        </div>
        {sparkSeed && <SparklinePlaceholder seed={sparkSeed} positive={(change ?? 1) >= 0} width={72} height={36} className="shrink-0" />}
      </div>
    </Card>
  );
}
