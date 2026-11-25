import type { Metadata } from "next";
import { WalletHoldingsView } from "@/features/wallet/wallet-views";

export const metadata: Metadata = { title: "Wallet Holdings" };

export default function Page() {
  return <WalletHoldingsView />;
}
