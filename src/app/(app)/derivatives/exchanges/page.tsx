import type { Metadata } from "next";
import { DerivExchangesListView } from "@/features/derivatives/derivatives-views";

export const metadata: Metadata = { title: "Derivatives Exchanges" };

export default function Page() {
  return <DerivExchangesListView />;
}
