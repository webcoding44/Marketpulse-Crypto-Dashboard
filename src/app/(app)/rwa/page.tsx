import type { Metadata } from "next";
import { RwaOverviewView } from "@/features/rwa/rwa-views";

export const metadata: Metadata = { title: "Real World Assets" };

export default function Page() {
  return <RwaOverviewView />;
}
