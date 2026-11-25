import type { Metadata } from "next";
import { DiscoverCategoriesView } from "@/features/discover/discover-views";

export const metadata: Metadata = { title: "Discover Categories" };

export default function Page() {
  return <DiscoverCategoriesView />;
}
