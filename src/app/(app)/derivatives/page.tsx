import type { Metadata } from "next";
import { DerivativesOverviewView } from "@/features/derivatives/derivatives-views";

export const metadata: Metadata = { title: "Derivatives Overview" };

export default function Page() {
  return <DerivativesOverviewView />;
}
