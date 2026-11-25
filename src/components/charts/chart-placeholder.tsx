import { useId } from "react";
import { cn, rng, hashStr, series } from "@/lib/utils";

export type ChartVariant = "candles" | "area" | "line" | "bars";

interface Props {
  variant?: ChartVariant;
  height?: number;
  seed?: string;
  trend?: number;
  yLabels?: string[];
  xLabels?: string[];
  className?: string;
  /** Overlay label shown in the corner – handy to mark where TradingView will mount. */
  badge?: string;
}

const W = 800;
const H = 300;
const Y_DEFAULT = ["$70K", "$60K", "$50K", "$40K", "$30K"];
const X_DEFAULT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Static, deterministic SVG chart. Drop-in mount point for a TradingView widget:
 * swap this component (and keep ChartContainer around it).
 */
export function ChartPlaceholder({ variant = "area", height = 320, seed = "btc", trend = 18, yLabels = Y_DEFAULT, xLabels = X_DEFAULT, className, badge }: Props) {
  const gid = useId().replace(/:/g, "");
  const n = variant === "candles" ? 52 : variant === "bars" ? 36 : 90;
  const data = series(seed, n + 1, trend, variant === "candles" ? 1.5 : 0.9);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const plotH = variant === "candles" ? H * 0.78 : H * 0.94;
  const y = (v: number) => 12 + (1 - (v - min) / range) * (plotH - 24);
  const step = W / n;
  const r = rng(hashStr(seed + variant));

  const pts = data.map((v, i) => [i * (W / (data.length - 1)), y(v)] as const);
  const line = "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");

  return (
    <div className={cn("relative w-full select-none", className)} style={{ height }}>
      {/* y axis */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 flex-col justify-between pb-7 text-[11px] tabular-nums text-muted">
        {yLabels.map((l) => (
          <span key={l} className="-translate-y-1.5 first:translate-y-0 last:translate-y-0">{l}</span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-11 right-0 pb-7">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="0" x2={W} y1={(i / 4) * (H - 1) + 0.5} y2={(i / 4) * (H - 1) + 0.5} strokeDasharray="3 5" className="stroke-line" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}

          {(variant === "area" || variant === "line") && (
            <>
              {variant === "area" && <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={`url(#${gid})`} />}
              <path d={line} fill="none" className="stroke-primary" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </>
          )}

          {variant === "candles" &&
            data.slice(0, n).map((o, i) => {
              const c = data[i + 1];
              const hi = Math.max(o, c) + r() * range * 0.06;
              const lo = Math.min(o, c) - r() * range * 0.06;
              const up = c >= o;
              const x = i * step + step / 2;
              const cls = up ? "success" : "danger";
              const top = y(Math.max(o, c));
              const bh = Math.max(Math.abs(y(o) - y(c)), 2);
              const vol = 8 + r() * 36;
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={y(hi)} y2={y(lo)} className={up ? "stroke-success" : "stroke-danger"} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                  <rect x={x - step * 0.3} y={top} width={step * 0.6} height={bh} rx="1.5" className={up ? "fill-success" : "fill-danger"} />
                  <rect x={x - step * 0.3} y={H - vol} width={step * 0.6} height={vol} rx="1.5" className={up ? "fill-success" : "fill-danger"} opacity="0.22" data-t={cls} />
                </g>
              );
            })}

          {variant === "bars" &&
            data.slice(0, n).map((v, i) => (
              <rect key={i} x={i * step + step * 0.18} y={y(v)} width={step * 0.64} height={H - y(v)} rx="3" className={i === n - 1 ? "fill-primary" : "fill-primary"} opacity={i === n - 1 ? 1 : 0.28 + (i / n) * 0.3} />
            ))}
        </svg>
        {/* last price marker */}
        {(variant === "area" || variant === "line" || variant === "candles") && (
          <span className="absolute right-0 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ top: `${(y(data[data.length - 1]) / H) * 100}%` }}>
            now
          </span>
        )}
      </div>
      {/* x axis */}
      <div className="pointer-events-none absolute bottom-0 left-11 right-0 flex justify-between text-[11px] text-muted">
        {xLabels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      {badge && (
        <span className="absolute left-14 top-2 rounded-md border border-dashed border-line bg-card/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
          {badge}
        </span>
      )}
    </div>
  );
}
