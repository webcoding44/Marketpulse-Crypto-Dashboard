import type { Metadata } from "next";
import { FuturesView } from "@/features/derivatives/derivatives-views";

export const metadata: Metadata = { title: "Futures & Perpetuals" };

export default function Page() {
  return <FuturesView />;
}
