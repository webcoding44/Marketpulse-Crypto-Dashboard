import { cn } from "@/lib/utils";

interface Props {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  /** Colour bars by sign (green/red) instead of a single colour */
  signed?: boolean;
  className?: string;
}

/** Simple HTML bar chart used for volume / activity / performance placeholders. */
export function BarChartPlaceholder({ data, labels, height = 160, color = "var(--primary)", signed, className }: Props) {
  const max = Math.max(...data.map((d) => Math.abs(d))) || 1;
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const h = Math.max((Math.abs(d) / max) * 100, 4);
          const bg = signed ? (d >= 0 ? "var(--success)" : "var(--danger)") : color;
          const last = i === data.length - 1;
          return (
            <div key={i} className="flex h-full flex-1 items-end">
              <div className="w-full rounded-t-md transition-opacity hover:opacity-100" style={{ height: `${h}%`, background: bg, opacity: signed || last ? 1 : 0.35 + (i / data.length) * 0.4 }} />
            </div>
          );
        })}
      </div>
      {labels && (
        <div className="mt-2 flex gap-1.5 text-[11px] text-muted">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 truncate text-center">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
