import type { Metadata } from "next";
import { CategoriesView } from "@/features/markets/categories-view";

export const metadata: Metadata = { title: "Categories" };

export default function Page() {
  return <CategoriesView />;
}
