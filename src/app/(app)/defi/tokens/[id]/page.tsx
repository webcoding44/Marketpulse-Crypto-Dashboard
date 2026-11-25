import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TokenDetailView } from "@/features/defi/defi-views";
import { getOnchainToken } from "@/lib/mock-data/defi";

export const metadata: Metadata = { title: "Token Details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getOnchainToken(id);
  if (!item) notFound();
  return <TokenDetailView token={item} />;
}
