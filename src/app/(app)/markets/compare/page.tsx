import type { Metadata } from "next";
import { CompareView } from "@/features/markets/compare-view";

export const metadata: Metadata = { title: "Coin Comparison" };

export default function Page() {
  return <CompareView />;
}
