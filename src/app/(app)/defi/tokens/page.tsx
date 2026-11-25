import type { Metadata } from "next";
import { TokenExplorerView } from "@/features/defi/defi-views";

export const metadata: Metadata = { title: "Token Explorer" };

export default function Page() {
  return <TokenExplorerView />;
}
