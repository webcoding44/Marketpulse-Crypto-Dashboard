import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PoolDetailView } from "@/features/defi/defi-views";
import { getPool } from "@/lib/mock-data/defi";

export const metadata: Metadata = { title: "Pool Details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getPool(id);
  if (!item) notFound();
  return <PoolDetailView pool={item} />;
}
