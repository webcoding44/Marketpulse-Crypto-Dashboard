import type { Metadata } from "next";
import { RwaCategoryView } from "@/features/rwa/rwa-views";

export const metadata: Metadata = { title: "Tokenized ETFs" };

export default function Page() {
  return <RwaCategoryView category="etfs" />;
}
