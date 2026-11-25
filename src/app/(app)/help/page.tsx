import type { Metadata } from "next";
import { HelpView } from "@/features/help/help-view";

export const metadata: Metadata = { title: "Help Center" };

export default function Page() {
  return <HelpView />;
}
