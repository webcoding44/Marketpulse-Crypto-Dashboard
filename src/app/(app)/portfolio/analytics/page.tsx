import type { Metadata } from "next";
import { AnalyticsView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "Portfolio Analytics" };

export default function Page() {
  return <AnalyticsView />;
}
