"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, CircleHelp, CreditCard, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { SearchInput } from "@/components/shared/search-input";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { StatusBadge } from "@/components/ui/status-badge";

const NOTIFICATIONS = [
  { title: "BTC crossed $62,500", meta: "Price alert · 2 min ago", tone: "bg-success" },
  { title: "ETH 24h volume spike", meta: "Market signal · 18 min ago", tone: "bg-primary" },
  { title: "Wallet 0x71C…976F received 12.4 ETH", meta: "Wallet tracker · 1 h ago", tone: "bg-accent" },
];

export function Header({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = () => q.trim() && router.push(`/discover?q=${encodeURIComponent(q.trim())}`);
  const iconBtn = "relative inline-flex size-9 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:bg-soft hover:text-ink";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-app/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button type="button" onClick={onMenu} aria-label="Open navigation" className={`${iconBtn} lg:hidden`}>
        <Menu className="size-[18px]" />
      </button>
      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <SearchInput inputRef={ref} value={q} onChange={setQ} onEnter={go} placeholder="Search coins, pools, wallets…" ariaLabel="Global search" shortcut="⌘ K" className="hidden w-[300px] md:flex xl:w-[360px]" />
      <Link href="/discover" aria-label="Search" className={`${iconBtn} md:hidden`}>
        <Search className="size-[18px]" />
      </Link>

      <Dropdown
        label="Notifications"
        width="w-80"
        triggerClassName={iconBtn}
        trigger={
          <>
            <Bell className="size-[18px]" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-card bg-danger" />
          </>
        }
      >
        <div className="flex items-center justify-between px-2.5 py-2">
          <span className="text-[13px] font-semibold text-ink">Notifications</span>
          <StatusBadge tone="primary">3 new</StatusBadge>
        </div>
        {NOTIFICATIONS.map((n) => (
          <div key={n.title} className="flex gap-3 rounded-lg px-2.5 py-2.5 hover:bg-soft">
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${n.tone}`} />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-ink">{n.title}</div>
              <div className="text-xs text-muted">{n.meta}</div>
            </div>
          </div>
        ))}
        <DropdownSeparator />
        <DropdownItem href="/portfolio/alerts">Manage price alerts</DropdownItem>
      </Dropdown>

      <Link href="/help" aria-label="Help center" className={`${iconBtn} max-sm:hidden`}>
        <CircleHelp className="size-[18px]" />
      </Link>

      <Dropdown
        label="Account menu"
        width="w-60"
        triggerClassName="flex items-center gap-2 rounded-xl border border-line bg-card py-1 pl-1 pr-3 transition-colors hover:bg-soft"
        trigger={
          <>
            <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-semibold text-white">AM</span>
            <span className="hidden text-[13px] font-medium text-ink sm:block">Alex Morgan</span>
          </>
        }
      >
        <div className="px-2.5 py-2">
          <div className="text-[13px] font-semibold text-ink">Alex Morgan</div>
          <div className="text-xs text-muted">alex@cryptoverse.io</div>
        </div>
        <DropdownSeparator />
        <DropdownItem href="/portfolio/profile" icon={<User />}>Profile settings</DropdownItem>
        <DropdownItem href="/portfolio/account" icon={<Settings />}>Account settings</DropdownItem>
        <DropdownItem href="/portfolio/account" icon={<CreditCard />}>Billing & plan</DropdownItem>
        <DropdownSeparator />
        <DropdownItem danger icon={<LogOut />}>Sign out</DropdownItem>
      </Dropdown>
    </header>
  );
}
