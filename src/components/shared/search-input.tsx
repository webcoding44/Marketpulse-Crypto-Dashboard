"use client";

import { Search, X } from "lucide-react";
import type { Ref } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  shortcut?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  inputRef?: Ref<HTMLInputElement>;
  onEnter?: () => void;
  ariaLabel?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search…", shortcut, className, size = "md", inputRef, onEnter, ariaLabel }: Props) {
  const h = { sm: "h-8 text-[13px]", md: "h-9 text-[13px]", lg: "h-12 text-[15px]" }[size];
  return (
    <div className={cn("group relative flex items-center", className)}>
      <Search className={cn("pointer-events-none absolute left-3 text-muted", size === "lg" ? "size-5" : "size-4")} aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={value}
        aria-label={ariaLabel ?? placeholder}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        className={cn(
          "w-full rounded-xl border border-line bg-card pl-9 pr-9 text-ink outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden",
          size === "lg" && "pl-11",
          h,
        )}
      />
      {value ? (
        <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-2.5 rounded-md p-0.5 text-muted hover:text-ink">
          <X className="size-3.5" />
        </button>
      ) : (
        shortcut && <kbd className="pointer-events-none absolute right-2.5 hidden rounded-md border border-line bg-soft px-1.5 py-0.5 text-[11px] font-medium text-muted sm:block">{shortcut}</kbd>
      )}
    </div>
  );
}
