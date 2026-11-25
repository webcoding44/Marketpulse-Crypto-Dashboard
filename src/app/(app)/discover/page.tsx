import type { Metadata } from "next";
import { GlobalSearchView } from "@/features/discover/discover-views";

export const metadata: Metadata = { title: "Global Search" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <GlobalSearchView initialQuery={q ?? ""} />;
}
