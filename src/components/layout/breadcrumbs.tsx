"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CRUMB_LABELS } from "@/lib/navigation/nav";
import { shortAddress, titleCase } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segs = pathname.split("/").filter(Boolean);
  const crumbs = segs.map((seg, i) => {
    const known = CRUMB_LABELS[seg];
    const href = known?.href ?? `/${segs.slice(0, i + 1).join("/")}`;
    const label = known?.label ?? (seg.startsWith("0x") ? shortAddress(seg) : titleCase(seg));
    return { label, href };
  });
  // De-dupe consecutive identical labels (e.g. /markets/coins -> Markets / Coins)
  const lead = segs[0] === "coins" ? [{ label: "Markets", href: "/markets/coins" }] : [];
  const items = [{ label: "CryptoVerse", href: "/dashboard" }, ...lead, ...crumbs].filter((c, i, a) => i === 0 || c.label !== a[i - 1].label);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-[13px]">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.href}-${i}`} className={`flex items-center gap-1.5 ${last ? "min-w-0" : i === 0 ? "hidden sm:flex" : "hidden md:flex"}`}>
              {i > 0 && <ChevronRight className="hidden size-3.5 text-muted sm:block" aria-hidden />}
              {last ? (
                <span aria-current="page" className="truncate font-semibold text-ink">{c.label}</span>
              ) : (
                <Link href={c.href} className="text-muted transition-colors hover:text-ink">{c.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
