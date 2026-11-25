import type { Metadata } from "next";
import { WatchlistView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "My Watchlist" };

export default function Page() {
  return <WatchlistView />;
}
