"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";

export interface Column<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  sort?: (row: T) => number | string;
  render: (row: T, index: number) => ReactNode;
  className?: string;
  sticky?: boolean;
  hideOnMobile?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  minWidth?: number;
  initialSort?: { key: string; dir: "asc" | "desc" };
  emptyTitle?: string;
  emptyDescription?: string;
  /** Rendered in a bordered strip below the table body when there is no pagination */
  footer?: ReactNode;
  dense?: boolean;
  bare?: boolean;
}

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" };

export function DataTable<T>({ columns, rows, rowKey, pageSize, minWidth = 900, initialSort, emptyTitle = "No results found", emptyDescription = "Try adjusting your search or filters.", footer, dense, bare }: Props<T>) {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sort) return rows;
    const f = col.sort;
    return [...rows].sort((a, b) => {
      const x = f(a);
      const y = f(b);
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.dir === "asc" ? r : -r;
    });
  }, [rows, sort, columns]);

  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(page, pages);
  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;
  const offset = pageSize ? (current - 1) * pageSize : 0;

  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? (s.dir === "desc" ? { key, dir: "asc" } : undefined) : { key, dir: "desc" }));

  return (
    <div className={cn(!bare && "overflow-hidden")}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]" style={{ minWidth }}>
          <thead>
            <tr className="bg-soft/70">
              {columns.map((c) => {
                const on = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={on ? (sort?.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn(
                      "whitespace-nowrap border-y border-line px-4 py-3 text-xs font-medium text-muted first:pl-5 last:pr-5",
                      ALIGN[c.align ?? "left"],
                      c.sticky && "sticky left-0 z-10 bg-soft",
                      c.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {c.sort ? (
                      <button type="button" onClick={() => toggle(c.key)} className={cn("inline-flex items-center gap-1 transition-colors hover:text-ink", on && "text-ink", c.align === "right" && "flex-row-reverse")}>
                        {c.header}
                        {on ? sort?.dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" /> : <ArrowUpDown className="size-3 opacity-60" />}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={rowKey(row)} className="group border-b border-line/70 transition-colors last:border-b-0 hover:bg-primary-soft/40">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 first:pl-5 last:pr-5",
                      dense ? "py-2.5" : "py-3.5",
                      ALIGN[c.align ?? "left"],
                      c.sticky && "sticky left-0 z-[1] bg-card group-hover:bg-[color-mix(in_srgb,var(--primary-soft)_40%,var(--card))]",
                      c.hideOnMobile && "hidden md:table-cell",
                      c.className,
                    )}
                  >
                    {c.render(row, offset + i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && <EmptyState icon={<SearchX />} title={emptyTitle} description={emptyDescription} />}
      {pageSize && sorted.length > pageSize && <Pagination page={current} pageSize={pageSize} total={sorted.length} onChange={setPage} />}
      {!pageSize && footer && <div className="border-t border-line px-5 py-3 text-[13px] text-muted">{footer}</div>}
    </div>
  );
}
