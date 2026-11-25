import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoinDetailView } from "@/features/markets/coin-detail-view";
import { getCoin } from "@/lib/mock-data/coins";

export const metadata: Metadata = { title: "Coin Details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCoin(id);
  if (!item) notFound();
  return <CoinDetailView coin={item} />;
}
