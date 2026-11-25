import { cn } from "@/lib/utils";
import { Card } from "./card";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("cv-skeleton rounded-lg", className)} />;
}

/** Page-level loading skeleton used by route `loading.tsx` files. */
export function LoadingSkeleton({ variant = "page" }: { variant?: "page" | "table" | "cards" }) {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      {variant !== "table" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-16" />
            </Card>
          ))}
        </div>
      )}
      <Card className="space-y-3 p-5">
        {Array.from({ length: variant === "cards" ? 3 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </Card>
    </div>
  );
}
