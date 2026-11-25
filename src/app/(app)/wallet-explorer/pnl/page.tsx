import type { Metadata } from "next";
import { WalletPnlView } from "@/features/wallet/wallet-views";

export const metadata: Metadata = { title: "Wallet Profit & Loss" };

export default function Page() {
  return <WalletPnlView />;
}
