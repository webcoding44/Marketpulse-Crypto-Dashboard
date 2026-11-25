import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}

/** Label/value list used on detail pages. */
export function KeyStats({ items, columns = 1, className }: { items: StatItem[]; columns?: 1 | 2 | 3 | 4; className?: string }) {
  const grid = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <dl className={cn("grid grid-cols-1 gap-x-8", grid, className)}>
      {items.map((it) => (
        <div key={it.label} className="flex items-start justify-between gap-4 border-b border-line/70 py-3 last:border-b-0">
          <dt className="text-[13px] text-muted">{it.label}</dt>
          <dd className="text-right text-[13px] font-medium tabular-nums text-ink">
            {it.value}
            {it.sub && <div className="mt-0.5 text-[11px] font-normal text-muted">{it.sub}</div>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ProgressBar({ value, color = "var(--primary)", className, height = 6 }: { value: number; color?: string; className?: string; height?: number }) {
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-soft", className)} style={{ height }} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, background: color }} />
    </div>
  );
}

/** Small label + big number block used inside cards. */
export function Stat({ label, value, sub, className }: { label: string; value: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-ink">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}
