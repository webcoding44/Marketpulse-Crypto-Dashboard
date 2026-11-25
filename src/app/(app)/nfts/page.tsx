import type { Metadata } from "next";
import { NftOverviewView } from "@/features/nfts/nft-views";

export const metadata: Metadata = { title: "NFT Overview" };

export default function Page() {
  return <NftOverviewView />;
}
