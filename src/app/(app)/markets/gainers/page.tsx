import type { Metadata } from "next";
import { CoinListView } from "@/features/markets/coin-list-view";

export const metadata: Metadata = { title: "Top Gainers" };

export default function Page() {
  return <CoinListView variant="gainers" />;
}
