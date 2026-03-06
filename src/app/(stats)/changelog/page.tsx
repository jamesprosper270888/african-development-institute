import type { Metadata } from "next";
import { ChangelogContent } from "./changelog-content";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest updates and improvements to ADI",
};

export default function ChangelogPage() {
  return <ChangelogContent />;
}
