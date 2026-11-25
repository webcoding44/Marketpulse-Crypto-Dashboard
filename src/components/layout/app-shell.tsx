"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { SectionTabs } from "./section-tabs";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-line lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={cn("absolute inset-0 bg-[#0b1020]/50 transition-opacity", open ? "opacity-100" : "opacity-0")} />
        <aside className={cn("absolute inset-y-0 left-0 w-[284px] max-w-[85vw] shadow-pop transition-transform duration-200", open ? "translate-x-0" : "-translate-x-full")}>
          <Sidebar onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
        </aside>
      </div>

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[272px]">
        <Header onMenu={() => setOpen(true)} />
        <main className="mx-auto w-full min-w-0 max-w-[1520px] flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <SectionTabs />
          {children}
        </main>
        <footer className="px-4 pb-6 pt-2 text-center text-xs text-muted sm:px-6 lg:px-8">
          © 2026 CryptoVerse · Mock data for design prototype only. Not financial advice.
        </footer>
      </div>
    </div>
  );
}
