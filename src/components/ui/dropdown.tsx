"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
  triggerClassName?: string;
  label?: string;
}

export function Dropdown({ trigger, children, align = "right", width = "w-56", triggerClassName, label }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "cv-pop absolute top-full z-50 mt-2 rounded-xl border border-line bg-card p-1.5 shadow-pop",
            width,
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface ItemProps {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  danger?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export function DropdownItem({ children, icon, href, danger, active, onClick }: ItemProps) {
  const cls = cn(
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-soft [&_svg]:size-4 [&_svg]:shrink-0",
    danger ? "text-danger" : "text-ink",
    active && "bg-primary-soft text-primary",
  );
  if (href)
    return (
      <Link role="menuitem" href={href} className={cls}>
        {icon}
        <span className="flex-1">{children}</span>
      </Link>
    );
  return (
    <button role="menuitem" type="button" onClick={onClick} className={cls}>
      {icon}
      <span className="flex-1">{children}</span>
      {active && <Check />}
    </button>
  );
}

export const DropdownSeparator = () => <div className="my-1 h-px bg-line" />;

/** Compact select-style dropdown used by filter bars */
export function SelectDropdown({
  options,
  value,
  onChange,
  prefix,
  align = "left",
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  align?: "left" | "right";
}) {
  return (
    <Dropdown
      align={align}
      width="w-48"
      label={prefix}
      triggerClassName="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-card px-3 text-[13px] font-medium text-ink transition-colors hover:bg-soft"
      trigger={
        <>
          {prefix && <span className="text-muted">{prefix}</span>}
          <span>{value}</span>
          <ChevronDown className="size-3.5 text-muted" />
        </>
      }
    >
      {options.map((o) => (
        <DropdownItem key={o} active={o === value} onClick={() => onChange(o)}>
          {o}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
