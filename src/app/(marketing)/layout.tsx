import { LandingHeader, LandingFooter } from "@/components/landing";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingHeader />
      <main id="main-content">{children}</main>
      <LandingFooter />
    </>
  );
}
