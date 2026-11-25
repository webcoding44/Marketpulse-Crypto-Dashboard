import type { Metadata } from "next";
import { WalletTransactionsView } from "@/features/wallet/wallet-views";

export const metadata: Metadata = { title: "Wallet Transactions" };

export default function Page() {
  return <WalletTransactionsView />;
}
