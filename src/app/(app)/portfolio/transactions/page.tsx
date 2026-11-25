import type { Metadata } from "next";
import { PortfolioTransactionsView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "Transaction History" };

export default function Page() {
  return <PortfolioTransactionsView />;
}
