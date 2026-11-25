import type { Metadata } from "next";
import { CoinListView } from "@/features/markets/coin-list-view";

export const metadata: Metadata = { title: "Trending Coins" };

export default function Page() {
  return <CoinListView variant="trending" />;
}
