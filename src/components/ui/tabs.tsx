"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "segmented" | "underline" | "pill";
  className?: string;
  ariaLabel?: string;
}

export function Tabs({ items, value, defaultValue, onChange, variant = "segmented", className, ariaLabel = "Tabs" }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? internal;
  const select = (id: string) => {
    setInternal(id);
    onChange?.(id);
  };

  const wrap = {
    segmented: "gap-0.5 rounded-xl bg-soft p-1 border border-line",
    underline: "gap-5 border-b border-line",
    pill: "gap-1.5",
  }[variant];

  return (
    <div role="tablist" aria-label={ariaLabel} className={cn("no-scrollbar inline-flex max-w-full items-center overflow-x-auto", wrap, className)}>
      {items.map((it) => {
        const on = it.id === active;
        const btn = {
          segmented: on ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink",
          underline: on ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink",
          pill: on ? "bg-primary text-white" : "bg-card border border-line text-muted hover:text-ink",
        }[variant];
        const shape = { segmented: "rounded-lg px-3 py-1.5", underline: "-mb-px border-b-2 pb-3", pill: "rounded-full px-3.5 py-1.5" }[variant];
        return (
          <button
            key={it.id}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => select(it.id)}
            className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] font-medium transition-colors", shape, btn)}
          >
            {it.label}
            {it.count !== undefined && (
              <span className={cn("rounded-md px-1.5 text-[11px] tabular-nums", on && variant === "pill" ? "bg-white/20" : "bg-soft text-muted")}>
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
