import type { Metadata } from "next";
import { TransactionsView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "On-chain Transactions" };

export default function Page() {
  return <TransactionsView />;
}
