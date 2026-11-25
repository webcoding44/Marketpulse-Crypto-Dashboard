import type { Metadata } from "next";
import { ProfileSettingsView } from "@/features/portfolio/portfolio-views";

export const metadata: Metadata = { title: "Profile Settings" };

export default function Page() {
  return <ProfileSettingsView />;
}
