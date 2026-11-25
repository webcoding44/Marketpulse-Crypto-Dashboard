import type { Metadata } from "next";
import { PoolsListView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "Trending Pools" };

export default function Page() {
  return <PoolsListView variant="trending" />;
}
