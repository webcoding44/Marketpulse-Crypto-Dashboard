import type { Metadata } from "next";
import { ExchangesListView } from "@/features/exchanges/exchange-views";

export const metadata: Metadata = { title: "All Exchanges" };

export default function Page() {
  return <ExchangesListView />;
}
