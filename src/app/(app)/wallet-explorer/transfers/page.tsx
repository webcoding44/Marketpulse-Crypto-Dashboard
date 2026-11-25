import type { Metadata } from "next";
import { WalletTransfersView } from "@/features/wallet/wallet-views";

export const metadata: Metadata = { title: "Token Transfers" };

export default function Page() {
  return <WalletTransfersView />;
}
