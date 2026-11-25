import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RwaDetailView } from "@/features/rwa/rwa-views";
import { getRwa } from "@/lib/mock-data/rwa";

export const metadata: Metadata = { title: "RWA Asset Details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getRwa(id);
  if (!item) notFound();
  return <RwaDetailView id={id} />;
}
