import type { Metadata } from "next";
import { DiscoverCoinsView } from "@/features/discover/discover-views";

export const metadata: Metadata = { title: "Discover Coins" };

export default function Page() {
  return <DiscoverCoinsView />;
}
