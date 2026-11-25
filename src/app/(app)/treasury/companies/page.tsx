import type { Metadata } from "next";
import { TreasuryListView } from "@/features/treasury/treasury-views";

export const metadata: Metadata = { title: "Public Companies" };

export default function Page() {
  return <TreasuryListView kind="companies" />;
}
