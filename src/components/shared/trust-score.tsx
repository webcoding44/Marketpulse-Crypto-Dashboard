import { cn } from "@/lib/utils";

/** 1–10 trust indicator with segmented bar. */
export function TrustScore({ score }: { score: number }) {
  const tone = score >= 9 ? "bg-success" : score >= 7 ? "bg-warning" : "bg-danger";
  return (
    <span className="inline-flex items-center gap-2" title={`Trust score ${score}/10`}>
      <span className="flex gap-[2px]" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={cn("h-3.5 w-[3px] rounded-full", i < score ? tone : "bg-line")} />
        ))}
      </span>
      <span className="text-[13px] font-semibold tabular-nums text-ink">{score}<span className="font-normal text-muted">/10</span></span>
    </span>
  );
}
