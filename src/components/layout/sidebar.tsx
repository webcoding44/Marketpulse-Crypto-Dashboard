"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, CircleHelp, Settings, X, ChevronsUpDown } from "lucide-react";
import { NAV_GROUPS, NAV_TOP, findGroup, isLeafActive } from "@/lib/navigation/nav";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggleRow } from "./theme-toggle";
import { StatusBadge } from "@/components/ui/status-badge";

function SectionLabel({ children }: { children: string }) {
  return <div className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted/80">{children}</div>;
}

const linkBase = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors";

export function Sidebar({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const activeGroup = findGroup(pathname);
  // Manual overrides keyed by group id; the active group is open by default.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => overrides[id] ?? activeGroup?.id === id;

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Logo />
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-2 text-muted hover:bg-soft lg:hidden">
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 pb-4">
        <SectionLabel>Main Menu</SectionLabel>
        <ul className="space-y-1">
          {NAV_TOP.map((item) => {
            const on = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={on ? "page" : undefined}
                  className={cn(linkBase, on ? "bg-primary text-white shadow-[0_4px_12px_rgba(49,92,245,0.28)]" : "text-muted hover:bg-soft hover:text-ink")}
                >
                  <item.icon className="size-[18px]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <SectionLabel>Explore</SectionLabel>
        <ul className="space-y-1">
          {NAV_GROUPS.map((g) => {
            const open = isOpen(g.id);
            const current = activeGroup?.id === g.id;
            return (
              <li key={g.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`nav-${g.id}`}
                  onClick={() => setOverrides((o) => ({ ...o, [g.id]: !open }))}
                  className={cn(linkBase, "w-full", current ? "text-ink" : "text-muted hover:bg-soft hover:text-ink", current && !open && "bg-primary-soft text-primary")}
                >
                  <g.icon className={cn("size-[18px]", current && "text-primary")} />
                  <span className="flex-1 text-left">{g.label}</span>
                  <ChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} />
                </button>
                {open && (
                  <ul id={`nav-${g.id}`} className="ml-[21px] mt-1 space-y-0.5 border-l border-line pl-3">
                    {g.children.map((c) => {
                      const on = isLeafActive(c, pathname);
                      return (
                        <li key={c.label}>
                          <Link
                            href={c.href}
                            onClick={onNavigate}
                            aria-current={on ? "page" : undefined}
                            className={cn(
                              "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors",
                              on ? "bg-primary-soft font-semibold text-primary" : "text-muted hover:bg-soft hover:text-ink",
                            )}
                          >
                            <span className="truncate">{c.label}</span>
                            {c.badge && <StatusBadge tone="success">{c.badge}</StatusBadge>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <SectionLabel>General</SectionLabel>
        <ul className="space-y-1">
          <li>
            <Link href="/help" onClick={onNavigate} className={cn(linkBase, pathname === "/help" ? "bg-primary-soft text-primary" : "text-muted hover:bg-soft hover:text-ink")}>
              <CircleHelp className="size-[18px]" /> Help Center
            </Link>
          </li>
          <li>
            <Link href="/portfolio/account" onClick={onNavigate} className={cn(linkBase, "text-muted hover:bg-soft hover:text-ink")}>
              <Settings className="size-[18px]" /> Settings
            </Link>
          </li>
          <li>
            <ThemeToggleRow />
          </li>
        </ul>
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <Link href="/portfolio/profile" onClick={onNavigate} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-soft">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[13px] font-semibold text-white">AM</span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-semibold text-ink">Alex Morgan</span>
            <span className="block truncate text-xs text-muted">Pro plan · alex@cryptoverse.io</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted" />
        </Link>
      </div>
    </div>
  );
}
