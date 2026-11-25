import type { Metadata } from "next";
import { ExchangesListView } from "@/features/exchanges/exchange-views";

export const metadata: Metadata = { title: "Top Exchanges" };

export default function Page() {
  return <ExchangesListView top />;
}
