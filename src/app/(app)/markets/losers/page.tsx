import type { Metadata } from "next";
import { CoinListView } from "@/features/markets/coin-list-view";

export const metadata: Metadata = { title: "Top Losers" };

export default function Page() {
  return <CoinListView variant="losers" />;
}
