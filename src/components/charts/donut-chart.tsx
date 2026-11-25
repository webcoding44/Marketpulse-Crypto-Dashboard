import type { ReactNode } from "react";

export interface Segment {
  label: string;
  value: number;
  color: string;
}

/** Static donut. Segment values are relative; they don't need to sum to 100. */
export function DonutChart({ segments, size = 168, thickness = 16, children }: { segments: Segment[]; size?: number; thickness?: number; children?: ReactNode }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} className="stroke-soft" />
        {segments.map((s) => {
          const len = (s.value / total) * C;
          const gap = segments.length > 1 ? 2.5 : 0;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(len - gap, 0)} ${C - Math.max(len - gap, 0)}`}
              strokeDashoffset={-acc}
              strokeLinecap="butt"
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      {children && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>}
    </div>
  );
}

export function Legend({ segments, showValue = true, suffix = "%" }: { segments: Segment[]; showValue?: boolean; suffix?: string }) {
  return (
    <ul className="min-w-0 flex-1 space-y-2.5">
      {segments.map((s) => (
        <li key={s.label} className="flex items-center justify-between gap-3 text-[13px]">
          <span className="flex min-w-0 items-center gap-2 text-ink">
            <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
            <span className="truncate">{s.label}</span>
          </span>
          {showValue && <span className="font-medium tabular-nums text-muted">{s.value.toFixed(1)}{suffix}</span>}
        </li>
      ))}
    </ul>
  );
}
