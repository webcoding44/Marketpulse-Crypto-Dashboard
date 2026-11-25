import type { Metadata } from "next";
import { AccountSettingsView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "Account Settings" };

export default function Page() {
  return <AccountSettingsView />;
}
