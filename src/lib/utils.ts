export function cn(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}

const nf = (min: number, max: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: min, maximumFractionDigits: max });

const nf0 = nf(0, 0);
const nf2 = nf(2, 2);
const nf4 = nf(4, 4);
const nf6 = nf(6, 6);
const nf8 = nf(8, 8);

/** Compact number: 1.24T, 28.4B, 3.2M, 12.5K */
export function compact(n: number, dp = 2): string {
  const a = Math.abs(n);
  if (a >= 1e12) return `${(n / 1e12).toFixed(dp)}T`;
  if (a >= 1e9) return `${(n / 1e9).toFixed(dp)}B`;
  if (a >= 1e6) return `${(n / 1e6).toFixed(dp)}M`;
  if (a >= 1e3) return `${(n / 1e3).toFixed(dp)}K`;
  return n.toFixed(dp);
}

export const usdCompact = (n: number, dp = 2) => `$${compact(n, dp)}`;

export function formatPrice(n: number): string {
  if (n >= 1) return `$${nf2.format(n)}`;
  if (n >= 0.01) return `$${nf4.format(n)}`;
  if (n >= 0.0001) return `$${nf6.format(n)}`;
  return `$${nf8.format(n)}`;
}

export const formatUsd = (n: number, dp = 0) => `$${nf(dp, dp).format(n)}`;
export const formatNumber = (n: number) => nf0.format(n);
export const formatPct = (n: number, dp = 2) => `${n > 0 ? "+" : ""}${n.toFixed(dp)}%`;

export function shortAddress(a: string, head = 6, tail = 4): string {
  return a.length <= head + tail + 2 ? a : `${a.slice(0, head)}…${a.slice(-tail)}`;
}

export function titleCase(s: string): string {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ───────── deterministic pseudo-random helpers (SSR-safe) ───────── */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic random-walk series. `trend` in percent drift across the series. */
export function series(seed: string | number, n = 28, trend = 0, volatility = 1): number[] {
  const r = rng(typeof seed === "number" ? seed : hashStr(seed));
  const out: number[] = [];
  let v = 100;
  for (let i = 0; i < n; i++) {
    v += (r() - 0.5) * 5 * volatility + trend / n;
    out.push(Math.max(v, 1));
  }
  return out;
}
