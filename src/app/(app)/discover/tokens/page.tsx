import type { Metadata } from "next";
import { DiscoverTokensView } from "@/features/discover/discover-views";

export const metadata: Metadata = { title: "Discover Tokens" };

export default function Page() {
  return <DiscoverTokensView />;
}
