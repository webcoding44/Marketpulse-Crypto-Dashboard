import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExchangePairsView } from "@/features/exchanges/exchange-views";
import { getExchange } from "@/lib/mock-data/exchanges";

export const metadata: Metadata = { title: "Exchange Trading Pairs" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getExchange(id);
  if (!item) notFound();
  return <ExchangePairsView exchange={item} />;
}
