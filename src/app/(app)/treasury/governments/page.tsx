import type { Metadata } from "next";
import { TreasuryListView } from "@/features/treasury/treasury-views";

export const metadata: Metadata = { title: "Government Holdings" };

export default function Page() {
  return <TreasuryListView kind="governments" />;
}
