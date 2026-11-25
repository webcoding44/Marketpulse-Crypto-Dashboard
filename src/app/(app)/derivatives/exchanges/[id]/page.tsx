import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DerivExchangeDetailView } from "@/features/derivatives/derivatives-views";
import { getDerivExchange } from "@/lib/mock-data/exchanges";

export const metadata: Metadata = { title: "Derivatives Exchange" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getDerivExchange(id);
  if (!item) notFound();
  return <DerivExchangeDetailView exchange={item} />;
}
