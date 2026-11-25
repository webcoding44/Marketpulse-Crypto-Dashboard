import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn, formatPct } from "@/lib/utils";

interface Props {
  value: number;
  variant?: "pill" | "text";
  className?: string;
  dp?: number;
}

export function PriceChangeIndicator({ value, variant = "pill", className, dp = 2 }: Props) {
  const flat = Math.abs(value) < 0.005;
  const up = value > 0;
  const tone = flat ? "text-muted" : up ? "text-success" : "text-danger";
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  if (variant === "text")
    return (
      <span className={cn("inline-flex items-center gap-0.5 text-[13px] font-medium tabular-nums", tone, className)}>
        {!flat && <Icon className="size-3.5" aria-hidden />}
        {Math.abs(value).toFixed(dp)}%
        <span className="sr-only">{up ? "up" : "down"}</span>
      </span>
    );
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        flat ? "bg-soft text-muted" : up ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
        className,
      )}
    >
      {!flat && <Icon className="size-3" aria-hidden />}
      {flat ? "0.00%" : `${Math.abs(value).toFixed(dp)}%`}
      <span className="sr-only">{flat ? "unchanged" : up ? "up" : "down"}</span>
    </span>
  );
}

export const signedClass = (v: number) => (v > 0 ? "text-success" : v < 0 ? "text-danger" : "text-muted");
export { formatPct };
