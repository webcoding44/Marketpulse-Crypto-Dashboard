import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Responsive wrapper for search / filter / sort controls above tables. */
export function FilterBar({ children, className, bordered = true }: { children: ReactNode; className?: string; bordered?: boolean }) {
  return <div className={cn("flex flex-wrap items-center gap-2.5 px-5 py-4", bordered && "border-b border-line", className)}>{children}</div>;
}

export function FilterSpacer() {
  return <div className="hidden flex-1 lg:block" />;
}
