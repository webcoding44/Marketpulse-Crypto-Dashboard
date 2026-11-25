import type { Metadata } from "next";
import { DexMarketsView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "DEX Markets" };

export default function Page() {
  return <DexMarketsView />;
}
