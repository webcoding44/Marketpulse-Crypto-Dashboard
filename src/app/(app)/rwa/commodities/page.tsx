import type { Metadata } from "next";
import { RwaCategoryView } from "@/features/rwa/rwa-views";

export const metadata: Metadata = { title: "Tokenized Commodities" };

export default function Page() {
  return <RwaCategoryView category="commodities" />;
}
