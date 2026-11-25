import { cn } from "@/lib/utils";

const GLYPHS: Record<string, string> = { BTC: "₿", ETH: "Ξ", SOL: "◎", LTC: "Ł", DOGE: "Ð", XRP: "✕", ADA: "₳", DAI: "◈" };

interface Props {
  symbol: string;
  color: string;
  size?: number;
  rounded?: "full" | "xl";
  className?: string;
}

/** Brand-tinted asset mark. Swap for real logo images when API data lands. */
export function CoinLogo({ symbol, color, size = 36, rounded = "full", className }: Props) {
  const glyph = GLYPHS[symbol] ?? symbol.slice(0, symbol.length > 3 ? 2 : 1);
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 select-none items-center justify-center font-bold text-white", rounded === "full" ? "rounded-full" : "rounded-xl", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * (glyph.length > 1 ? 0.34 : 0.46),
        background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 72%, #000))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
    >
      {glyph}
    </span>
  );
}
