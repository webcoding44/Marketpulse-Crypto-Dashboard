import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionDetailView } from "@/features/nfts/nft-views";
import { getCollection } from "@/lib/mock-data/nfts";

export const metadata: Metadata = { title: "NFT Collection" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCollection(id);
  if (!item) notFound();
  return <CollectionDetailView id={id} />;
}
