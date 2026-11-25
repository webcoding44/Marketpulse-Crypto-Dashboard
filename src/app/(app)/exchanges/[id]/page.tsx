import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExchangeDetailView } from "@/features/exchanges/exchange-views";
import { getExchange } from "@/lib/mock-data/exchanges";

export const metadata: Metadata = { title: "Exchange Details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getExchange(id);
  if (!item) notFound();
  return <ExchangeDetailView exchange={item} />;
}
