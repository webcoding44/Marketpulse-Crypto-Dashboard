import type { Metadata } from "next";
import { AlertsView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "Price Alerts" };

export default function Page() {
  return <AlertsView />;
}
