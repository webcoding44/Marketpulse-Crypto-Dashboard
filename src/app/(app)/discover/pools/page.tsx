import type { Metadata } from "next";
import { DiscoverPoolsView } from "@/features/discover/discover-views";

export const metadata: Metadata = { title: "Discover Pools" };

export default function Page() {
  return <DiscoverPoolsView />;
}
