import type { Metadata } from "next";
import { CollectionsView } from "@/features/nfts/nft-views";

export const metadata: Metadata = { title: "Top NFT Collections" };

export default function Page() {
  return <CollectionsView mode="top" />;
}
