"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findGroup, isLeafActive } from "@/lib/navigation/nav";
import { cn } from "@/lib/utils";

/** Sub-navigation for the current section – derived from the nav config so every page stays reachable. */
export function SectionTabs() {
  const pathname = usePathname();
  const group = findGroup(pathname);
  if (!group || group.children.length < 2) return null;
  return (
    <nav aria-label={`${group.label} sections`} className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max items-center gap-1 rounded-xl border border-line bg-card p-1 shadow-card">
        {group.children.map((c) => {
          const on = isLeafActive(c, pathname);
          return (
            <li key={c.label}>
              <Link
                href={c.href}
                aria-current={on ? "page" : undefined}
                className={cn("block whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors", on ? "bg-primary text-white" : "text-muted hover:bg-soft hover:text-ink")}
              >
                {c.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
