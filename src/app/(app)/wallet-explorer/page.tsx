import type { Metadata } from "next";
import { WalletOverviewView } from "@/features/wallet/wallet-views";

export const metadata: Metadata = { title: "Wallet Explorer" };

export default function Page() {
  return <WalletOverviewView />;
}
