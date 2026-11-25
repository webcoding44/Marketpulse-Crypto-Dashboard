import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CryptoVerse — Crypto Market Intelligence & Web3 Analytics", template: "%s · CryptoVerse" },
  description: "Premium cryptocurrency analytics: markets, exchanges, derivatives, DeFi, NFTs, RWA, wallets and portfolios.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

const themeScript = `try{if(localStorage.getItem('cv-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-app text-ink antialiased">{children}</body>
    </html>
  );
}
