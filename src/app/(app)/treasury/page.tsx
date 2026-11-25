import type { Metadata } from "next";
import { TreasuryOverviewView } from "@/features/treasury/treasury-views";

export const metadata: Metadata = { title: "Treasury Overview" };

export default function Page() {
  return <TreasuryOverviewView />;
}
