import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TokenHoldersView } from "@/features/defi/defi-views";
import { getOnchainToken } from "@/lib/mock-data/defi";

export const metadata: Metadata = { title: "Token Holders" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getOnchainToken(id);
  if (!item) notFound();
  return <TokenHoldersView token={item} />;
}
