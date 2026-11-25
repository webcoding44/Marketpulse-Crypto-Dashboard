import type { Metadata } from "next";
import { PoolScreenerView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "Pool Screener" };

export default function Page() {
  return <PoolScreenerView />;
}
