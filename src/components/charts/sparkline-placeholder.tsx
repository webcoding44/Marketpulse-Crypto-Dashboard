import { useId } from "react";
import { series } from "@/lib/utils";

interface Props {
  data?: number[];
  seed?: string;
  positive?: boolean;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * Static SVG sparkline. Replace `data` with live price series later –
 * the component only depends on a plain number[].
 */
export function SparklinePlaceholder({ data, seed = "spark", positive, width = 96, height = 32, fill = true, strokeWidth = 1.6, className }: Props) {
  const gid = useId().replace(/:/g, "");
  const d = data ?? series(seed, 28, positive === false ? -14 : 14);
  const up = positive ?? d[d.length - 1] >= d[0];
  const min = Math.min(...d);
  const max = Math.max(...d);
  const range = max - min || 1;
  const pts = d.map((v, i) => [(i / (d.length - 1)) * 100, 92 - ((v - min) / range) * 84] as const);
  const line = "M" + pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" L");
  const area = `${line} L100 100 L0 100 Z`;
  const color = up ? "var(--success)" : "var(--danger)";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width, height }} className={className} aria-hidden>
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.22 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
