import Link from "next/link";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl text-white shadow-[0_4px_12px_rgba(49,92,245,0.35)]"
      style={{ width: size, height: size, background: "linear-gradient(145deg,#4a74ff,#2449d8)" }}
      aria-hidden
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <path d="M4 5l8 15L20 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.2" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="CryptoVerse home">
      <LogoMark />
      <span className="text-[17px] font-bold tracking-tight text-ink">
        Crypto<span className="text-primary">Verse</span>
      </span>
    </Link>
  );
}
