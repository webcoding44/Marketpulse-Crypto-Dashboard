import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreasuryDetailView } from "@/features/treasury/treasury-views";
import { getTreasury } from "@/lib/mock-data/treasury";

export const metadata: Metadata = { title: "Treasury Details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getTreasury(id);
  if (!item) notFound();
  return <TreasuryDetailView id={id} />;
}
