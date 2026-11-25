import type { Metadata } from "next";
import { PortfolioView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "My Portfolio" };

export default function Page() {
  return <PortfolioView />;
}
