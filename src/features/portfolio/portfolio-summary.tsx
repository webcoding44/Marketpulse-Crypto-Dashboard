import { ArrowDownToLine, ArrowUpFromLine, Eye, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparklinePlaceholder } from "@/components/charts/sparkline-placeholder";
import { cn, formatUsd } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "card" | "wide";
}

/** Brand-blue portfolio value card (dashboard hero + portfolio page). */
export function PortfolioSummary({ className, variant = "card" }: Props) {
  return (
    <section
      aria-label="Portfolio summary"
      className={cn("relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-[0_12px_32px_rgba(49,92,245,0.32)]", className)}
      style={{ background: "linear-gradient(150deg,#3b66ff 0%,#2449d8 100%)" }}
    >
      <svg className="pointer-events-none absolute -right-10 -top-10 size-48 opacity-[0.12]" viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1" />
        <circle cx="50" cy="50" r="34" stroke="white" strokeWidth="1" />
        <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="1" />
      </svg>
      <div className="relative">
        <div className="text-[13px] font-medium text-white/80">My Balance</div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[28px] font-semibold leading-none tracking-tight tabular-nums">{formatUsd(408275.34, 2)}</span>
          <Eye className="size-4 text-white/70" aria-hidden />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-1.5 py-0.5 font-semibold text-white"><TrendingUp className="size-3" /> +$6,842 (1.7%)</span>
          <span className="inline-flex items-center gap-1"><RefreshCw className="size-3" /> 14:32 UTC</span>
        </div>
      </div>
      {variant === "wide" && <SparklinePlaceholder seed="portfolio-hero" positive width="100%" height={56} className="relative mt-4 opacity-80 [&_path]:!stroke-white" fill={false} />}
      <div className="relative mt-5 grid grid-cols-2 gap-2.5">
        <Button variant="onPrimary" size="md" href="/portfolio/transactions" icon={<ArrowDownToLine className="size-4" />}>Add</Button>
        <Button size="md" href="/portfolio" className="!border-white/40 !bg-white/10 !text-white hover:!bg-white/20" icon={<ArrowUpFromLine className="size-4" />}>Portfolio</Button>
      </div>
    </section>
  );
}
