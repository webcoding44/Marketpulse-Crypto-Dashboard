import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "danger" | "onPrimary";
type Size = "xs" | "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_2px_rgba(49,92,245,0.4)]",
  secondary: "bg-card text-ink border border-line hover:bg-soft",
  ghost: "text-muted hover:bg-soft hover:text-ink",
  soft: "bg-primary-soft text-primary hover:brightness-95",
  danger: "bg-danger-soft text-danger hover:brightness-95",
  onPrimary: "bg-white text-primary hover:bg-white/90",
};
const SIZES: Record<Size, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-lg",
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-[10px]",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-sm gap-2 rounded-xl",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
}

export function Button({ variant = "secondary", size = "md", href, icon, iconRight, block, className, children, ...rest }: Props) {
  const cls = cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className,
  );
  const content = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}

export function IconButton({
  label,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-muted transition-colors hover:bg-soft hover:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
