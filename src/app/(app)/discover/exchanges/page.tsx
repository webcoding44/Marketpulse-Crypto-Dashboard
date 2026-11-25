import type { Metadata } from "next";
import { DiscoverExchangesView } from "@/features/discover/discover-views";

export const metadata: Metadata = { title: "Discover Exchanges" };

export default function Page() {
  return <DiscoverExchangesView />;
}
