import type { Metadata } from "next";
import { DefiOverviewView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "DeFi Overview" };

export default function Page() {
  return <DefiOverviewView />;
}
