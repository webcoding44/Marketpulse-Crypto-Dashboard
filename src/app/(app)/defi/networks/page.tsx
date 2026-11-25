import type { Metadata } from "next";
import { NetworksView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "Blockchain Networks" };

export default function Page() {
  return <NetworksView />;
}
